import { auth, firestore } from "@/Firebase/firebase";
import LogProblemButton from "@/components/patternTrack/LogProblemButton";
import { bankMeta, currentBankKey, patternIdForBank } from "@/lib/patternTrack/bank";
import Link from "next/link";
import { PATTERN_BY_ID } from "@/content/patterns";
import { usePatternTrack } from "@/context/PatternTrackContext";
import { patternProgress } from "@/lib/patternTrack/stats";
import { rowState, type ProblemRow } from "@/lib/problemList";
import { StageDots } from "@/components/patternTrack/ui";
import { useWorkspaceSession } from "../WorkspaceSession";
import { MyLogPanel, PatternPanel } from "./PatternPanels";
import CircleSkeleton from "@/components/skeletons/CircleSkeleton";
import RectangleSkeleton from "@/components/skeletons/RectangleSkeleton";
import { DBProblem, Problem } from "@/utils/types/problems";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  AiFillLike,
  AiFillDislike,
  AiOutlineLoading3Quarters,
  AiFillStar,
} from "react-icons/ai";
import { BsCheck2Circle } from "react-icons/bs";
import { TiStarOutline } from "react-icons/ti";
import { toast } from "react-toastify";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  runTransaction,
  updateDoc,
} from "firebase/firestore";


const TABS = [
  { id: "pattern", label: "Pattern" },
  { id: "description", label: "Description" },
  { id: "mylog", label: "My log" },
] as const;
type TabId = (typeof TABS)[number]["id"];

type ProblemDescriptionProps = {
  problem: Problem;
  _solved: boolean;
  
};
const ProblemDescription: React.FC<ProblemDescriptionProps> = ({
  problem,
  _solved,
}) => {
  const { currentProblem, loading, problemDifficultyClass, setCurrentProblem } =
    useGetCurrentProblem(problem.id);
  const { liked, disliked, setData, starred, solved } =
    useGetUsersDataOnProblem(problem.id);
  const [user] = useAuthState(auth);

  const [updating, setUpdating] = useState(false);
  const session = useWorkspaceSession();
  const bankKey = session?.bankKey ?? problem.id;
  const hasPattern = !!patternIdForBank(bankKey);
  const [tab, setTab] = useState<TabId>(hasPattern ? "pattern" : "description");
  const visibleTabs = TABS.filter((t) => t.id !== "pattern" || hasPattern);
  /** WAI-ARIA tabs: arrows move between tabs, Home/End jump to the ends. */
  const onTabKey = (e: React.KeyboardEvent) => {
    const i = visibleTabs.findIndex((t) => t.id === tab);
    const next =
      e.key === "ArrowRight" ? (i + 1) % visibleTabs.length
      : e.key === "ArrowLeft" ? (i - 1 + visibleTabs.length) % visibleTabs.length
      : e.key === "Home" ? 0 : e.key === "End" ? visibleTabs.length - 1 : -1;
    if (next < 0) return;
    e.preventDefault();
    setTab(visibleTabs[next].id);
    document.getElementById(`tab-${visibleTabs[next].id}`)?.focus();
  };

  const findProblemInCollection = async (problemId: string) => {
    // First, check if we have the selectedList 
    if (currentProblem?.selectedList) {
      const collectionName = currentProblem.selectedList;
      const problemRef = doc(firestore, collectionName, problemId);
      const problemDoc = await getDoc(problemRef);
      if (problemDoc.exists()) {
        return { problemDoc, collectionName };
      }
    }
    
    // search in all collections if we don't have selectedList or the problem isn't found
    const collections = ["striver150", "neetcode150", "gfg150"];
    for (const collectionName of collections) {
      const problemRef = doc(firestore, collectionName, problemId);
      const problemDoc = await getDoc(problemRef);
      if (problemDoc.exists()) {
        return { problemDoc, collectionName }; 
      }
    }
    return null; 
  };

  const returnUserAndProblemData = async (transaction: any, problemId: string) => {
    const userRef = doc(firestore, "users", user!.uid);
    const foundProblem = await findProblemInCollection(problemId);
    if (foundProblem) {
      const { problemDoc, collectionName } = foundProblem;
  
      const problemRef = doc(firestore, collectionName, problemId);
      const userDoc = await transaction.get(userRef);
      
      return { userDoc, problemDoc, problemRef, collectionName, userRef }; 
    } else {
      throw new Error("Problem not found in any collection");
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("You must be logged in to like a problem", {
        position: "top-left",
        theme: "dark",
      });
      return;
    }
    if (updating) {
      return;
    }
    setUpdating(true);
    await runTransaction(firestore, async (transaction) => {
      try {
        const { problemDoc, userDoc, problemRef, collectionName, userRef } = await returnUserAndProblemData(transaction, problem.id);
  
        if (userDoc.exists() && problemDoc.exists()) {
          if (liked) {
            // Remove problem from likedProblems 
            transaction.update(userRef, {
              likedProblems: userDoc.data().likedProblems.filter((id: string) => id !== problem.id),
            });
            transaction.update(problemRef, {
              likes: problemDoc.data().likes - 1,
            });
            setCurrentProblem((prev) => prev ? { ...prev, likes: prev.likes - 1 } : null);
            setData((prev) => ({ ...prev, liked: false }));
          } else {
            // Add to likedProblems 
            transaction.update(userRef, {
              likedProblems: [...userDoc.data().likedProblems, problem.id],
            });
            transaction.update(problemRef, {
              likes: problemDoc.data().likes + 1,
            });
            setCurrentProblem((prev) => prev ? { ...prev, likes: prev.likes + 1 } : null);
            setData((prev) => ({ ...prev, liked: true }));
          }
        }
      } catch (error) {
        console.error("Error handling like:", error);
        toast.error("Something went wrong, please try again later.", {
          position: "top-left",
          theme: "dark",
        });
      }
    });
    setUpdating(false);
  };
  
  const handleDislike = async () => {
    if (!user) {
      toast.error("You must be logged in to dislike a problem", {
        position: "top-left",
        theme: "dark",
      });
      return;
    }
  
    if (updating) {
      return;
    }
    setUpdating(true);
  
    await runTransaction(firestore, async (transaction) => {
      try {
        const { problemDoc, userDoc, userRef, problemRef, collectionName } =
          await returnUserAndProblemData(transaction, problem.id);
  
        if (userDoc.exists() && problemDoc.exists()) {
          if (disliked) {
            // Remove from dislikedProblems 
            transaction.update(userRef, {
              dislikedProblems: userDoc
                .data()
                .dislikedProblems.filter((id: string) => id !== problem.id),
            });
            transaction.update(problemRef, {
              dislikes: problemDoc.data().dislikes - 1,
            });
            setCurrentProblem((prev) =>
              prev ? { ...prev, dislikes: prev.dislikes - 1 } : null
            );
            setData((prev) => ({ ...prev, disliked: false }));
          } else if (liked) {
            // remove from likedProblems
            transaction.update(userRef, {
              dislikedProblems: [...userDoc.data().dislikedProblems, problem.id],
              likedProblems: userDoc
                .data()
                .likedProblems.filter((id: string) => id !== problem.id),
            });
            transaction.update(problemRef, {
              dislikes: problemDoc.data().dislikes + 1,
              likes: problemDoc.data().likes - 1,
            });
            setCurrentProblem((prev) =>
              prev ? { ...prev, dislikes: prev.dislikes + 1, likes: prev.likes - 1 } : null
            );
            setData((prev) => ({ ...prev, disliked: true, liked: false }));
          } else {
            // add to dislikedProblems 
            transaction.update(userRef, {
              dislikedProblems: [...userDoc.data().dislikedProblems, problem.id],
            });
            transaction.update(problemRef, {
              dislikes: problemDoc.data().dislikes + 1,
            });
            setCurrentProblem((prev) =>
              prev ? { ...prev, dislikes: prev.dislikes + 1 } : null
            );
            setData((prev) => ({ ...prev, disliked: true }));
          }
        }
      } catch (error) {
        toast.error("Something went wrong, please try again later.", {
          position: "top-left",
          theme: "dark",
        });
      }
    });
    setUpdating(false);
  };
  

  const handleStar = async () => {
    if (!user) {
      toast.error("Please log in to star a problem!", {
        position: "top-left",
        theme: "dark",
      });
      return;
    }
    if (updating) {
      return;
    }
    setUpdating(true);
  
    await runTransaction(firestore, async (transaction) => {
      try {
        const { problemDoc, userDoc, userRef, problemRef, collectionName } =
          await returnUserAndProblemData(transaction, problem.id);
  
        if (problemDoc.exists() && userDoc.exists()) {
          if (!starred) {
            // Add to starredProblem list
            transaction.update(userRef, {
              starredProblem: arrayUnion(problem.id),
            });
            setData((prev) => ({ ...prev, starred: true }));
          } else {
            // Remove from starredProblem list
            transaction.update(userRef, {
              starredProblem: arrayRemove(problem.id),
            });
            setData((prev) => ({ ...prev, starred: false }));
          }
        }
      } catch (error) {
        toast.error("Something went wrong, please try again later.", {
          position: "top-left",
          theme: "dark",
        });
      }
    });
    setUpdating(false);
  };
  
  const { logs, today } = usePatternTrack();
  const difficulty = (currentProblem?.difficulty ?? bankMeta(bankKey)?.difficulty) as "Easy" | "Medium" | "Hard" | undefined;
  const state = rowState({ key: currentBankKey(bankKey) } as ProblemRow, logs, solved || _solved ? [currentBankKey(bankKey)] : [], today);
  const pattern = PATTERN_BY_ID[patternIdForBank(bankKey) ?? ""];
  const progress = pattern ? patternProgress(pattern, logs) : undefined;
  const pct = progress?.total ? Math.round((100 * progress.logged) / progress.total) : 0;
  const DIFF: Record<string, string> = { Easy: "text-[#2cbb5d] bg-[#2cbb5d]/10", Medium: "text-dark-yellow bg-dark-yellow/10", Hard: "text-dark-pink bg-dark-pink/10" };
  const metaBtn = "inline-flex min-h-[32px] items-center gap-1.5 rounded-md px-2 text-sm text-dark-gray-6 hover:bg-white/10 hover:text-white disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-blue-s";
  const panel = "min-h-0 flex-1 overflow-y-auto";

  return (
    <div className="flex h-[calc(100dvh-106px)] flex-col bg-dark-layer-1 md:h-[calc(100vh-50px)]">
      {/* Header: where this problem sits on the track, then the problem itself. */}
      <header className="shrink-0 border-b border-white/[0.06] px-5 pb-3 pt-4">
        {pattern && (
          <Link href={`/patterns/${pattern.id}`} className="group mb-2 inline-flex items-center gap-2 rounded-md text-sm text-dark-gray-6 hover:text-white">
            <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-full"
              style={{ background: `conic-gradient(#2cbb5d ${pct}%, rgba(255,255,255,0.14) 0)` }}>
              <span className="grid h-[18px] w-[18px] place-items-center rounded-full bg-dark-layer-1 text-[10px] font-semibold text-white">
                {pattern.week >= 18 ? "18" : pattern.week}
              </span>
            </span>
            Week {pattern.week}, {pattern.name}
            {progress && progress.total > 0 && <span className="tabular-nums">({progress.logged}/{progress.total} logged)</span>}
          </Link>
        )}
        <div className="flex items-start gap-3">
          <h1 className="flex-1 text-xl font-semibold leading-snug text-white">{problem?.title}</h1>
          <LogProblemButton bankKey={bankKey} />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
          {difficulty && <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${DIFF[difficulty]}`}>{difficulty}</span>}
          {(state.status === "review" || state.status === "due") && (
            <span className="inline-flex items-center gap-2 px-1 text-sm">
              <StageDots stage={state.stage ?? 0} />
              <span className={state.status === "due" ? "text-dark-pink" : "text-dark-gray-6"}>
                {state.status === "due" ? "Review due" : `Next review ${state.nextDue}`}
              </span>
            </span>
          )}
          {state.status === "mastered" && <span className="px-1 text-sm text-[#2cbb5d]">Mastered</span>}
          {state.status === "solved" && (
            <span className="inline-flex items-center gap-1 px-1 text-sm text-[#2cbb5d]"><BsCheck2Circle aria-hidden="true" /> Solved</span>
          )}
          {!loading && currentProblem && (
            <span className="ml-auto flex items-center">
              <button type="button" aria-pressed={liked} aria-label={`Like (${currentProblem.likes})`} disabled={updating} onClick={handleLike} className={metaBtn}>
                {updating ? <AiOutlineLoading3Quarters className="animate-spin" aria-hidden="true" /> : <AiFillLike className={liked ? "text-dark-blue-s" : ""} aria-hidden="true" />}
                <span className="tabular-nums">{currentProblem.likes}</span>
              </button>
              <button type="button" aria-pressed={disliked} aria-label={`Dislike (${currentProblem.dislikes})`} disabled={updating} onClick={handleDislike} className={metaBtn}>
                {updating ? <AiOutlineLoading3Quarters className="animate-spin" aria-hidden="true" /> : <AiFillDislike className={disliked ? "text-dark-blue-s" : ""} aria-hidden="true" />}
                <span className="tabular-nums">{currentProblem.dislikes}</span>
              </button>
              <button type="button" aria-pressed={starred} aria-label="Star" disabled={updating} onClick={handleStar} className={metaBtn}>
                {starred ? <AiFillStar className="text-dark-yellow" aria-hidden="true" /> : <TiStarOutline aria-hidden="true" />}
              </button>
            </span>
          )}
          {loading && <span className="ml-auto flex gap-2"><RectangleSkeleton /><CircleSkeleton /></span>}
        </div>
      </header>

      {/* Tabs: Pattern first, so you name the pattern before reading details. */}
      <div role="tablist" aria-label="Problem panels" onKeyDown={onTabKey}
        className="flex h-10 shrink-0 items-end gap-5 border-b border-white/[0.06] px-5">
        {visibleTabs.map((t) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            tabIndex={tab === t.id ? 0 : -1}
            onClick={() => setTab(t.id)}
            className={`-mb-px border-b-2 pb-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-blue-s ${
              tab === t.id ? "border-white text-white" : "border-transparent text-dark-gray-6 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "pattern" && (
        <div id="panel-pattern" role="tabpanel" aria-labelledby="tab-pattern" tabIndex={0} className={`${panel} py-4`}>
          <PatternPanel bankKey={bankKey} />
        </div>
      )}
      {tab === "mylog" && (
        <div id="panel-mylog" role="tabpanel" aria-labelledby="tab-mylog" tabIndex={0} className={`${panel} py-4`}>
          <MyLogPanel bankKey={bankKey} />
        </div>
      )}

      {/* Kept mounted (hidden) so the statement is in the server render for fast first paint. */}
      <div id="panel-description" role="tabpanel" aria-labelledby="tab-description" tabIndex={0} hidden={tab !== "description"} className={panel}>
        <article className="mx-auto max-w-[68ch] px-5 py-5">
          <div className="problem-statement text-[15px] leading-7 text-dark-gray-8" dangerouslySetInnerHTML={{ __html: problem.problemStatement }} />

          <div className="mt-6 space-y-3">
            {problem.examples.map((example, index) => (
              <section key={example.id} aria-labelledby={`ex-${index}`} className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
                <h2 id={`ex-${index}`} className="mb-3 text-sm font-medium text-white">Example {index + 1}</h2>
                {example.img && <Image src={example.img} alt="" className="mb-3" width={100} height={100} />}
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                  <dt className="text-dark-gray-6">Input</dt>
                  <dd className="break-all font-mono text-[13px] text-dark-gray-8">{example.inputText}</dd>
                  <dt className="text-dark-gray-6">Output</dt>
                  <dd className="break-all font-mono text-[13px] text-dark-gray-8">{example.outputText}</dd>
                  {example.explanation && (
                    <>
                      <dt className="text-dark-gray-6">Why</dt>
                      <dd className="text-dark-gray-7">{example.explanation}</dd>
                    </>
                  )}
                </dl>
              </section>
            ))}
          </div>

          <section aria-labelledby="constraints" className="mt-6 pb-8">
            <h2 id="constraints" className="mb-2 text-sm font-medium text-white">Constraints</h2>
            <ul className="problem-constraints ml-5 list-disc space-y-1 text-sm text-dark-gray-7" dangerouslySetInnerHTML={{ __html: problem.constraints }} />
          </section>
        </article>
      </div>
    </div>
  );
};
export default ProblemDescription;

function useGetCurrentProblem(problemId: string) {
  const [currentProblem, setCurrentProblem] = useState<DBProblem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [problemDifficultyClass, setProblemDifficultyClass] = useState<string>("");

  useEffect(() => {
    // Get problem from DB
    let cancelled = false;
    const show = (problem: Record<string, any>) => {
      if (cancelled) return;
      setCurrentProblem({ id: problemId, ...problem } as DBProblem);
      setProblemDifficultyClass(
        problem.difficulty === "Easy"
          ? "bg-olive text-green"
          : problem.difficulty === "Medium"
          ? "bg-dark-yellow text-dark-yellow"
          : " bg-dark-pink text-dark-pink"
      );
    };
    const getCurrentProblem = async () => {
      setLoading(true);
      // Show what the code knows at once; Firestore only adds likes and older list fields.
      const meta = bankMeta(problemId);
      if (meta) {
        show({ ...meta, likes: 0, dislikes: 0, selectedList: "problems" });
        setLoading(false);
      }
      try {
        let problemDoc = await getDoc(doc(firestore, "problems", problemId));
        if (!problemDoc.exists()) {
          for (const collection of ["striver150", "neetcode150", "gfg150"]) {
            const snap = await getDoc(doc(firestore, collection, problemId));
            if (snap.exists()) {
              problemDoc = snap;
              break;
            }
          }
        }
        if (problemDoc.exists()) show(problemDoc.data());
      } catch (e) {
        // Offline or unreachable: keep the code metadata.
        console.warn("Problem metadata unavailable:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    getCurrentProblem();
    return () => {
      cancelled = true;
    };
  }, [problemId]);

  return { currentProblem, loading, problemDifficultyClass, setCurrentProblem };
}

function useGetUsersDataOnProblem(problemId: string) {
  const [data, setData] = useState({
    liked: false,
    disliked: false,
    starred: false,
    solved: false,
  });
  const [user] = useAuthState(auth);

  useEffect(() => {
    const getUsersDataOnProblem = async () => {
      const userRef = doc(firestore, "users", user!.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        const {
          likedProblems = [],
          dislikedProblems = [],
          starredProblem = [], 
          solvedProblems = [],
        } = data;
        
        setData({
          liked: likedProblems.includes(problemId),
          disliked: dislikedProblems.includes(problemId),
          starred: starredProblem.includes(problemId), 
          solved: solvedProblems.includes(problemId),
        });
      }
    };

    if (user) getUsersDataOnProblem();
    return () =>
      setData({ liked: false, disliked: false, starred: false, solved: false });
  }, [problemId, user]);

  return { ...data, setData };
}