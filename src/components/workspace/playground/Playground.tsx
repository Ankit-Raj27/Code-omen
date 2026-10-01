import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Split from "react-split";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import { toast } from "react-toastify";
import { arrayUnion, doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "@/Firebase/firebase";
import { authModalState } from "@/atoms/authModalAtom";
import useLocalStorage from "@/components/hooks/useLocalStorage";
import { problems } from "@/utils/problems";
import { JAVA_PROBLEMS } from "@/utils/problems/java";
import { Problem } from "@/utils/types/problems";
import { nextInPattern } from "@/lib/problemList";
import { fromJavaRun, fromLegacyRun, summarizeCases, type RunSummary } from "@/lib/runResults";
import { useWorkspaceSession } from "../WorkspaceSession";
import PreferenceNav from "./PreferenceNav";
import EditorFooter from "./EditorFooter";
import ResultPanel from "./ResultPanel";

const CodeEditor = dynamic(() => import("./CodeEditor"), {
  ssr: false,
  loading: () => <div className="h-40 animate-pulse bg-[#1e1e1e] motion-reduce:animate-none" aria-label="Loading editor" />,
});

export type EditorLanguage = "javascript" | "java";

type PlaygroundProps = {
  problem: Problem;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setSolved: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface ISettings {
  fontSize: string;
  settingModalIsOpen: boolean;
  dropDownIsOpen: boolean;
}

type BottomTab = "cases" | "result";

const Playground: React.FC<PlaygroundProps> = ({ problem, setSuccess, setSolved }) => {
  const router = useRouter();
  const { query: { pid, fresh } } = router;
  const [user] = useAuthState(auth);
  const setAuthModal = useSetRecoilState(authModalState);
  const session = useWorkspaceSession();

  const [fontSize] = useLocalStorage("cd-fontSize", "16px");
  const [setting, setSetting] = useState<ISettings>({ fontSize, settingModalIsOpen: false, dropDownIsOpen: false });

  // Java tests are keyed by the bank key (= LeetCode slug), i.e. the route param.
  const javaProblem = JAVA_PROBLEMS[pid as string];
  const [langPref, setLangPref] = useLocalStorage("cd-language", "javascript");
  const language: EditorLanguage = langPref === "java" && javaProblem ? "java" : "javascript";
  const starterFor = useCallback((lang: EditorLanguage) => (lang === "java" && javaProblem ? javaProblem.starter : problem.starterCode), [javaProblem, problem.starterCode]);
  const storageKey = (lang: EditorLanguage) => (lang === "java" ? `code-java-${pid}` : `code-${pid}`);

  const [userCode, setUserCode] = useState<string>(problem.starterCode);
  const [tab, setTab] = useState<BottomTab>("cases");
  const [activeCase, setActiveCase] = useState(0);
  const [summary, setSummary] = useState<RunSummary | null>(null);
  const [mode, setMode] = useState<"run" | "submit">("run");
  const [running, setRunning] = useState(false);

  const markSolved = async () => {
    if (!user) return;
    session?.onAccepted(language);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
    // problem.id is the Firestore document id the lists check against.
    await setDoc(doc(firestore, "users", user.uid), { solvedProblems: arrayUnion(problem.id) }, { merge: true });
    setSolved(true);
  };

  const runJs = (): RunSummary => {
    const t0 = performance.now();
    let fn: unknown;
    try {
      const src = userCode.slice(Math.max(0, userCode.indexOf(problem.starterFunctionName)));
      fn = new Function(`return ${src}`)();
    } catch (e) {
      return { verdict: "syntax_error", passed: 0, total: 0, cases: [], language: "javascript", message: (e as Error).message };
    }
    const bank = problems[pid as string];
    if (bank?.runCases) return summarizeCases(bank.runCases(fn), "javascript", performance.now() - t0);
    try {
      (bank.handlerFunction as (f: unknown) => boolean)(fn);
      return fromLegacyRun(null, "javascript", performance.now() - t0);
    } catch (e) {
      return fromLegacyRun(e, "javascript", performance.now() - t0);
    }
  };

  const runJava = async (): Promise<RunSummary> => {
    const t0 = performance.now();
    const token = await user!.getIdToken();
    const r = await fetch("/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ problemId: pid, code: userCode }),
    });
    const data = await r.json();
    if (!r.ok) return { verdict: "error", passed: 0, total: 0, cases: [], language: "java", message: data.error || "The code runner didn't answer." };
    return fromJavaRun(data, performance.now() - t0);
  };

  const execute = async (m: "run" | "submit") => {
    if (running) return;
    // Java runs on the server and submitting records progress: both need an account.
    if (!user && (m === "submit" || language === "java")) {
      toast.info(m === "submit" ? "Sign in to submit and track your progress." : "Sign in to run Java.", { theme: "dark", position: "top-center" });
      setAuthModal((s) => ({ ...s, isOpen: true, type: "login" }));
      return;
    }
    setMode(m);
    setTab("result");
    setRunning(true);
    setSummary(null);
    try {
      // Let the "Running" state paint before a synchronous JS run.
      const result = language === "java" ? await runJava() : await new Promise<RunSummary>((res) => setTimeout(() => res(runJs()), 0));
      setSummary(result);
      if (m === "submit" && result.verdict === "accepted") await markSolved();
    } catch (e) {
      console.error(e);
      setSummary({ verdict: "error", passed: 0, total: 0, cases: [], language, message: "Couldn't reach the code runner. Check your connection and try again." });
    } finally {
      setRunning(false);
    }
  };

  // Ctrl/Cmd+Enter runs, adding Shift submits. Captured before the editor sees it.
  const executeRef = useRef(execute);
  executeRef.current = execute;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || !(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      e.stopPropagation();
      executeRef.current(e.shiftKey ? "submit" : "run");
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, []);

  useEffect(() => {
    // Pattern Track "Re-solve": start from a blank editor, discarding saved code.
    if (fresh === "1") {
      localStorage.removeItem(storageKey("javascript"));
      localStorage.removeItem(storageKey("java"));
      setUserCode(starterFor(language));
      const { fresh: _f, ...rest } = router.query;
      router.replace({ pathname: router.pathname, query: rest }, undefined, { shallow: true });
      return;
    }
    const code = localStorage.getItem(storageKey(language));
    setUserCode(user && code ? JSON.parse(code) : starterFor(language));
    setSummary(null);
    setTab("cases");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pid, user, problem.starterCode, fresh, language]);

  const onChange = (value: string) => {
    setUserCode(value);
    localStorage.setItem(storageKey(language), JSON.stringify(value));
  };

  const reset = () => {
    const previous = userCode;
    onChange(starterFor(language));
    toast(
      ({ closeToast }) => (
        <span className="flex items-center gap-3">
          Code reset to the starter.
          <button type="button" className="rounded bg-white/15 px-2 py-1 text-xs" onClick={() => { onChange(previous); closeToast?.(); }}>
            Undo
          </button>
        </span>
      ),
      { theme: "dark", position: "bottom-right", autoClose: 6000 },
    );
  };

  const tabs: { id: BottomTab; label: string }[] = [{ id: "cases", label: "Test cases" }, { id: "result", label: "Result" }];
  const onTabKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const next = tab === "cases" ? "result" : "cases";
    setTab(next);
    document.getElementById(`bt-${next}`)?.focus();
  };
  const example = problem.examples[activeCase] ?? problem.examples[0];
  const canLog = !!user && !!session && !session.alreadyLogged;

  return (
    <div className="flex h-[calc(100dvh-106px)] flex-col bg-dark-layer-1 md:h-[calc(100vh-50px)]">
      <PreferenceNav setting={setting} setSetting={setSetting} language={language} javaAvailable={!!javaProblem}
        onLanguageChange={(l) => setLangPref(l)} onReset={reset} />

      <Split className="min-h-0 flex-1" direction="vertical" sizes={[58, 42]} minSize={80} gutterSize={8}>
        <div className="w-full overflow-hidden bg-[#1e1e1e]">
          <CodeEditor value={userCode} language={language} fontSize={setting.fontSize} onChange={onChange} />
        </div>

        <div className="flex w-full flex-col overflow-hidden">
          <div role="tablist" aria-label="Tests" onKeyDown={onTabKey} className="flex h-10 shrink-0 items-end gap-4 border-b border-white/[0.06] px-4">
            {tabs.map((t) => (
              <button key={t.id} id={`bt-${t.id}`} role="tab" type="button" aria-selected={tab === t.id} aria-controls={`bp-${t.id}`}
                tabIndex={tab === t.id ? 0 : -1} onClick={() => setTab(t.id)}
                className={`-mb-px border-b-2 pb-2 text-sm font-medium transition-colors ${
                  tab === t.id ? "border-white text-white" : "border-transparent text-dark-gray-6 hover:text-white"
                }`}>
                {t.label}
                {t.id === "result" && summary && (
                  <span className={`ml-2 inline-block h-2 w-2 rounded-full ${summary.verdict === "accepted" ? "bg-[#2cbb5d]" : "bg-dark-pink"}`} aria-hidden="true" />
                )}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-auto px-4">
            {tab === "cases" ? (
              <div id="bp-cases" role="tabpanel" aria-labelledby="bt-cases" className="space-y-4 py-3">
                <div role="group" aria-label="Examples" className="flex flex-wrap gap-1.5">
                  {problem.examples.map((ex, i) => (
                    <button key={ex.id} type="button" aria-pressed={activeCase === i} onClick={() => setActiveCase(i)}
                      className={`min-h-[32px] rounded-lg px-3 text-sm ${activeCase === i ? "bg-white/10 text-white" : "bg-white/[0.04] text-dark-gray-6 hover:text-white"}`}>
                      Case {i + 1}
                    </button>
                  ))}
                </div>
                {example && (
                  <>
                    <div>
                      <p className="mb-1 text-xs text-dark-gray-6">Input</p>
                      <pre className="whitespace-pre-wrap break-all rounded-lg bg-white/[0.05] px-3 py-2 font-mono text-[13px] text-dark-gray-8">{example.inputText}</pre>
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-dark-gray-6">Expected</p>
                      <pre className="whitespace-pre-wrap break-all rounded-lg bg-white/[0.05] px-3 py-2 font-mono text-[13px] text-dark-gray-8">{example.outputText}</pre>
                    </div>
                    <p className="text-xs text-dark-gray-6">Run checks every hidden test too, not just these examples.</p>
                  </>
                )}
              </div>
            ) : (
              <div id="bp-result" role="tabpanel" aria-labelledby="bt-result">
                <ResultPanel summary={summary} running={running} mode={mode}
                  next={summary?.verdict === "accepted" && mode === "submit" ? nextInPattern(String(pid)) : undefined}
                  canLog={canLog} onLog={() => session?.openLog()} />
              </div>
            )}
          </div>
        </div>
      </Split>

      <EditorFooter onRun={() => execute("run")} onSubmit={() => execute("submit")} running={running} />
    </div>
  );
};
export default Playground;
