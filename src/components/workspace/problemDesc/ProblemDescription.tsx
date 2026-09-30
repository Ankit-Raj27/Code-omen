import { auth, firestore } from "@/Firebase/firebase";
import LogProblemButton from "@/components/patternTrack/LogProblemButton";
import { bankMeta, patternIdForBank } from "@/lib/patternTrack/bank";
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
  
  return (
    <div className="bg-dark-layer-1">
      {/* TABS: Pattern first, so you name the pattern before reading details. */}
      <div role="tablist" aria-label="Problem panels" onKeyDown={onTabKey}
        className="flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden">
        {visibleTabs.map((t) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            role="tab"
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            tabIndex={tab === t.id ? 0 : -1}
            onClick={() => setTab(t.id)}
            className={`rounded-t-[5px] px-5 py-[10px] text-xs ${
              tab === t.id ? "bg-dark-layer-1 text-white" : "text-dark-gray-6 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "pattern" && (
        <div id="panel-pattern" role="tabpanel" aria-labelledby="tab-pattern" tabIndex={0} className="h-[calc(100vh-94px)] overflow-y-auto py-4">
          <p className="mb-4 px-5 text-lg font-medium text-white">{problem?.title}</p>
          <PatternPanel bankKey={bankKey} />
        </div>
      )}
      {tab === "mylog" && (
        <div id="panel-mylog" role="tabpanel" aria-labelledby="tab-mylog" tabIndex={0} className="h-[calc(100vh-94px)] overflow-y-auto py-4">
          <MyLogPanel bankKey={bankKey} />
        </div>
      )}

      <div id="panel-description" role="tabpanel" aria-labelledby="tab-description" tabIndex={0}
        className={tab === "description" ? "flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto" : "hidden"}>
        <div className="px-5">
          {/* Problem heading */}
          <div className="w-full">
            <div className="flex space-x-4">
              <div className="flex-1 mr-2 text-lg text-white font-medium">
                {problem?.title}
              </div>
              <LogProblemButton bankKey={bankKey} />
            </div>
            {!loading && currentProblem && (
              <div className="flex items-center mt-3">
                <div
                  className={`${problemDifficultyClass} inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize `}
                >
                  {currentProblem.difficulty}
                </div>
                {(solved || _solved) && (
                  <div className="rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-s text-dark-green-s">
                    <BsCheck2Circle />
                  </div>
                )}
                <button
                  type="button"
                  aria-pressed={liked}
                  aria-label={`Like (${currentProblem.likes})`}
                  disabled={updating}
                  className="ml-4 flex min-h-[32px] items-center space-x-1 rounded p-[3px] text-lg text-dark-gray-6 transition-colors duration-200 hover:bg-dark-fill-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-blue-s"
                  onClick={handleLike}
                >
                  {updating ? <AiOutlineLoading3Quarters className="animate-spin" aria-hidden="true" /> : <AiFillLike className={liked ? "text-dark-blue-s" : ""} aria-hidden="true" />}
                  <span className="text-xs">{currentProblem.likes}</span>
                </button>
                <button
                  type="button"
                  aria-pressed={disliked}
                  aria-label={`Dislike (${currentProblem.dislikes})`}
                  disabled={updating}
                  className="ml-4 flex min-h-[32px] items-center space-x-1 rounded p-[3px] text-lg text-dark-gray-6 transition-colors duration-200 hover:bg-dark-fill-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-blue-s"
                  onClick={handleDislike}
                >
                  {updating ? <AiOutlineLoading3Quarters className="animate-spin" aria-hidden="true" /> : <AiFillDislike className={disliked ? "text-dark-blue-s" : ""} aria-hidden="true" />}
                  <span className="text-xs">{currentProblem.dislikes}</span>
                </button>
                <button
                  type="button"
                  aria-pressed={starred}
                  aria-label="Star"
                  disabled={updating}
                  className="ml-4 flex min-h-[32px] items-center rounded p-[3px] text-xl text-dark-gray-6 transition-colors duration-200 hover:bg-dark-fill-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-blue-s"
                  onClick={handleStar}
                >
                  {updating ? <AiOutlineLoading3Quarters aria-hidden="true" /> : starred ? <AiFillStar className="text-dark-yellow" aria-hidden="true" /> : <TiStarOutline aria-hidden="true" />}
                </button>
              </div>
            )}

            {loading && (
              <div className="mt-3 flex space-x-2">
                <RectangleSkeleton />
                <CircleSkeleton />
                <RectangleSkeleton />
                <RectangleSkeleton />
                <CircleSkeleton />
              </div>
            )}

            {/* Problem Statement(paragraphs) */}
            <div className="text-white text-sm">
              <div
                dangerouslySetInnerHTML={{ __html: problem.problemStatement }}
              />
            </div>

            {/* Examples */}
            <div className="mt-4">
              {problem.examples.map((example, index) => (
                <div key={example.id}>
                  <p className="font-medium text-white ">
                    Example {index + 1}:{" "}
                  </p>
                  {example.img && (
                    <Image
                      src={example.img}
                      alt=""
                      className="mt-3"
                      width={100}
                      height={100}
                    />
                  )}
                  <div className="example-card">
                    <pre>
                      <strong className="text-white">Input: </strong>{" "}
                      {example.inputText}
                      <br />
                      <strong>Output:</strong>
                      {example.outputText} <br />
                      {example.explanation && (
                        <>
                          <strong>Explanation:</strong> {example.explanation}
                        </>
                      )}
                    </pre>
                  </div>
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div className="my-8 pb-4">
              <div className="text-white text-sm font-medium">Constraints:</div>
              <ul className="text-white ml-5 list-disc ">
                <div
                  dangerouslySetInnerHTML={{ __html: problem.constraints }}
                />
              </ul>
            </div>
          </div>
        </div>
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