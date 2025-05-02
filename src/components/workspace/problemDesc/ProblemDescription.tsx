import { auth, firestore } from "@/Firebase/firebase";
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
        console.error("Error in handleDislike:", error);
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
        console.error("Error in handleStar:", error);
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
      {/* TAB */}
      <div className="flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden">
        <div
          className={
            "bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer"
          }
        >
          Description
        </div>
      </div>

      <div className="flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto">
        <div className="px-5">
          {/* Problem heading */}
          <div className="w-full">
            <div className="flex space-x-4">
              <div className="flex-1 mr-2 text-lg text-white font-medium">
                {problem?.title}
              </div>
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
                <div
                  className="flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-dark-gray-6"
                  onClick={handleLike}
                >
                  {liked && !updating && (
                    <AiFillLike className="text-dark-blue-s" />
                  )}
                  {!liked && !updating && <AiFillLike />}
                  {updating && (
                    <AiOutlineLoading3Quarters className="animate-spin" />
                  )}

                  <span className="text-xs">{currentProblem.likes}</span>
                </div>
                <div
                  className="flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-green-s text-dark-gray-6"
                  onClick={handleDislike}
                >
                  {disliked && !updating && (
                    <AiFillDislike className="text-dark-blue-s" />
                  )}
                  {!disliked && !updating && <AiFillDislike />}
                  {updating && (
                    <AiOutlineLoading3Quarters className="animate-spin" />
                  )}

                  <span className="text-xs">{currentProblem.dislikes}</span>
                </div>
                <div
                  className="cursor-pointer hover:bg-dark-fill-3  rounded p-[3px]  ml-4 text-xl transition-colors duration-200 text-green-s text-dark-gray-6 "
                  onClick={handleStar}
                >
                  {starred && !updating && (
                    <AiFillStar className="text-dark-yellow" />
                  )}
                  {!starred && !updating && <TiStarOutline />}
                  {updating && <AiOutlineLoading3Quarters />}
                </div>
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
    const getCurrentProblem = async () => {
      setLoading(true);
      
      // First try to get the problem from "problems" collection (for backward compatibility)
      const problemsDocRef = doc(firestore, "problems", problemId);
      let problemDoc = await getDoc(problemsDocRef);
      
      // If problem not found in "problems" collection, search in the three collections
      if (!problemDoc.exists()) {
        const collections = ["striver150", "neetcode150", "gfg150"];
        for (const collection of collections) {
          const collectionDocRef = doc(firestore, collection, problemId);
          const collectionDocSnap = await getDoc(collectionDocRef);
          if (collectionDocSnap.exists()) {
            problemDoc = collectionDocSnap;
            break;
          }
        }
      }
      
      if (problemDoc.exists()) {
        const problem = problemDoc.data();
        setCurrentProblem({ id: problemDoc.id, ...problem } as DBProblem);
        // easy, medium, hard
        setProblemDifficultyClass(
          problem.difficulty === "Easy"
            ? "bg-olive text-olive"
            : problem.difficulty === "Medium"
            ? "bg-dark-yellow text-dark-yellow"
            : " bg-dark-pink text-dark-pink"
        );
      }
      setLoading(false);
    };
    
    getCurrentProblem();
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