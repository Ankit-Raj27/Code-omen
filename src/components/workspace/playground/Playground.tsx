import React, { useEffect, useState } from "react";
import PreferenceNav from "./PreferenceNav";
import Split from "react-split";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import {java} from "@codemirror/lang-java";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import EditorFooter from "./EditorFooter";
import { Problem } from "@/utils/types/problems";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import { problems } from "@/utils/problems";
import { auth, firestore } from "@/Firebase/firebase";
import { useRouter } from "next/router";
import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";
import useLocalStorage from "@/components/hooks/useLocalStorage";
import { JAVA_PROBLEMS } from "@/utils/problems/java";
import type { JavaRunResult } from "@/lib/javaRunner";

export type EditorLanguage = "javascript" | "java";

type PlaygroundProps = {
  problem: Problem;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setSolved: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface ISettings{
  fontSize : string;
  settingModalIsOpen : boolean;
  dropDownIsOpen : boolean;
}
const Playground: React.FC<PlaygroundProps> = ({
  problem,
  setSuccess,
  setSolved,
}) => {
  const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
  let [userCode, setUserCode] = useState<string>(problem.starterCode);
  const [fontSize,setFontSize] = useLocalStorage("cd-fontSize", "16px");

  const [setting,setSetting] = useState<ISettings>({
    fontSize:fontSize,
    settingModalIsOpen : false,
    dropDownIsOpen: false
  })
  const [user] = useAuthState(auth);

  const router = useRouter();
  const {
    query: { pid, fresh },
  } = router;

  const javaProblem = JAVA_PROBLEMS[problem.id];
  const [langPref, setLangPref] = useLocalStorage("cd-language", "javascript");
  const language: EditorLanguage = langPref === "java" && javaProblem ? "java" : "javascript";
  const starterFor = (lang: EditorLanguage) => (lang === "java" && javaProblem ? javaProblem.starter : problem.starterCode);
  const storageKey = (lang: EditorLanguage) => (lang === "java" ? `code-java-${pid}` : `code-${pid}`);
  const [javaResult, setJavaResult] = useState<JavaRunResult | null>(null);
  const [running, setRunning] = useState(false);

  const markSolved = async () => {
    if (!user) return;
    toast.success("Congrats! All tests passed!", { position: "top-center", autoClose: 3000, theme: "dark" });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
    await setDoc(doc(firestore, "users", user.uid), { solvedProblems: arrayUnion(pid) }, { merge: true });
    setSolved(true);
  };

  const runJava = async () => {
    if (!user) return;
    setRunning(true);
    setJavaResult(null);
    try {
      const token = await user.getIdToken();
      const r = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ problemId: problem.id, code: userCode }),
      });
      const data = await r.json();
      if (!r.ok) {
        toast.error(data.error || "Run failed", { position: "top-center", theme: "dark" });
        return;
      }
      setJavaResult(data as JavaRunResult);
      if (data.status === "accepted") await markSolved();
      else if (data.status === "wrong_answer")
        toast.error(`${data.passed}/${data.total} tests passed`, { position: "top-right", autoClose: 2000, theme: "dark" });
      else toast.error(data.status === "compile_error" ? "Compilation error" : "Run failed", { position: "top-right", theme: "dark" });
    } catch (e) {
      console.error(e);
      toast.error("Couldn't reach the code runner", { position: "top-center", theme: "dark" });
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (user && language === "java") return runJava();
    if (!user) {
      toast.error("Please login to submit!", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }
    try {
      userCode = userCode.slice(userCode.indexOf(problem.starterFunctionName));
      const cb = new Function(`return ${userCode}`)();
      const handler = problems[pid as string].handlerFunction;
      if (typeof handler === "function") {
        const success = handler(cb);
        if (success) await markSolved();
      }
    } catch (error: any) {
      console.error(error.message);
      if (
        error.message.startsWith(
          "AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:"
        )
      ) {
        toast.error("Oops! One or more test cases failed!", {
          position: "top-right",
          autoClose: 2000,
          theme: "dark",
        });
      } else {
        toast.error("Synrax error!");
      }
    }
  };
  

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
    if (user) {
      setUserCode(code ? JSON.parse(code) : starterFor(language));
    } else {
      setUserCode(starterFor(language));
    }
    setJavaResult(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pid, user, problem.starterCode, fresh, language]);
  const onChange = (value: string) => {
    setUserCode(value);
    localStorage.setItem(storageKey(language), JSON.stringify(value));
  };

  return (
    <div className="flex flex-col bg-dark-layer-1 relative overflow-x-hidden">
      <PreferenceNav setting={setting} setSetting ={setSetting}
        language={language} javaAvailable={!!javaProblem} onLanguageChange={(l) => setLangPref(l)} />

      <Split
        className=" h-[calc(100vh-94px)]"
        direction="vertical"
        sizes={[60, 40]}
        minSize={60}
      >
        <div className="w-full overflow-auto">
          <CodeMirror
            value={userCode}
            theme={vscodeDark}
            extensions={[language === "java" ? java() : javascript()]}
            style={{ fontSize: setting.fontSize }}
            onChange={onChange}
          />
        </div>
        {/* Test Case Heading */}
        <div className="w-full px-5 overflow-auto">
          <div className="flex h-10 items-center space-x-6">
            <div className="relative flex h-full flex-col justify-center cursor-pointer">
              <div className="text-sm font-medium leading-5 text-white">
                TestCases
              </div>
              <hr className="absolute bottom-0 h-0.5 rounded-full w-full border-none bg-white" />
            </div>
          </div>
          {/* TestCase Body */}
          <div>
            <div className="flex">
              {problem.examples.map((example, index) => (
                <div
                  className="mr-2 item-start mt-2"
                  key={example.id}
                  onClick={() => setActiveTestCaseId(index)}
                >
                  <div className="flex flex-wrap items-center gap-y-4">
                    <div
                      className={`font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3
                     hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
                     ${
                       activeTestCaseId === index
                         ? "text-white"
                         : "text-gray-500"
                     }
                     `}
                    >
                      Case {index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="font-semibold my-4">
            <p className="text-sm font-medium mt-4 text-white">Input : </p>
            <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2">
              {problem.examples[activeTestCaseId].inputText}
            </div>
            <p className="text-sm font-medium mt-4 text-white">Output : </p>
            <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2">
              {problem.examples[activeTestCaseId].outputText}
            </div>
          </div>
        </div>
      </Split>
      {language === "java" && (running || javaResult) && (
        <div className="absolute bottom-14 left-0 right-0 z-10 mx-5 max-h-48 overflow-auto rounded-lg bg-dark-layer-2 p-3 text-xs text-dark-label-2 shadow-lg">
          {running && <p>Running on Java 13…</p>}
          {javaResult && (
            <>
              <p className={javaResult.status === "accepted" ? "text-dark-green-s" : "text-dark-pink"}>
                {javaResult.status.replace("_", " ")} · {javaResult.passed}/{javaResult.total} passed
              </p>
              {javaResult.lines.filter((l) => !l.startsWith("PASS")).map((l) => <p key={l} className="mt-1 font-mono">{l}</p>)}
              {javaResult.message && <pre className="mt-2 whitespace-pre-wrap font-mono">{javaResult.message}</pre>}
            </>
          )}
        </div>
      )}
      <EditorFooter handleSubmit={handleSubmit} />
    </div>
  );
};
export default Playground;