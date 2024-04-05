import { auth, firestore } from "@/Firebase/firebase";
import CircleSkeleton from "@/components/skeletons/CircleSkeleton";
import RectangleSkeleton from "@/components/skeletons/RectangleSkeleton";
import { DBProblem, Problem } from "@/utils/types/problems";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { BsCheck2Circle } from "react-icons/bs";
import { TiStarOutline } from "react-icons/ti";
import { toast } from "react-toastify";
import { doc, getDoc, runTransaction, updateDoc } from "firebase/firestore";

type ProblemDescriptionProps = {
  problem: Problem;
};

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problem }) => {
  const { currentProblem, loading, problemDifficultyClass, setCurrentProblem } =
    useGetCurrentProblem(problem.id);
  const { liked, disliked, setData } = useGetUserDataOnProblem(problem.id);
  const [user] = useAuthState(auth);

  const handleLike = async () => {
    if (!user) {
      toast.error("You must be logged in!", {
        position: "top-left",
        theme: "dark",
      });
      return;
    }

    const userRef = doc(firestore, "users", user.uid);
    const problemRef = doc(firestore, "problems", problem.id);

    try {
      const userDoc = await getDoc(userRef);
      const problemDoc = await getDoc(problemRef);

      if (userDoc.exists() && problemDoc.exists()) {
        const userLikedProblems = userDoc.data().likedProblems || [];
        const problemLikes = problemDoc.data().likes || 0;

        if (liked) {
          await Promise.all([
            updateDoc(userRef, {
              likedProblems: userLikedProblems.filter(
                (id: string) => id !== problem.id
              ),
            }),
            updateDoc(problemRef, { likes: problemLikes - 1 }),
          ]);
        } else if (disliked) {
          const userDislikedProblems = userDoc.data().dislikedProblems || [];
          const problemDislikes = problemDoc.data().dislikes || 0;

          await Promise.all([
            updateDoc(userRef, {
              likedProblems: [...userLikedProblems, problem.id],
              dislikedProblems: userDislikedProblems.filter(
                (id: string) => id !== problem.id
              ),
            }),
            updateDoc(problemRef, {
              likes: problemLikes + 1,
              dislikes: problemDislikes - 1,
            }),
          ]);
        } else {
          await Promise.all([
            updateDoc(userRef, {
              likedProblems: [...userLikedProblems, problem.id],
            }),
            updateDoc(problemRef, { likes: problemLikes + 1 }),
          ]);
        }
        setData((prev) => ({ ...prev, liked: !liked }));
      }
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  return (
    <div className="bg-dark-layer-1">
      {/* TAB */}
      <div className="flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden">
        <div className="bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer">
          Description
        </div>
      </div>

      <div className="flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto">
        <div className="px-5">
          {/* Problem heading */}
          <div className="w-full">
            <div className="flex space-x-4">
              <div className="flex-1 mr-2 text-lg text-white font-medium">
                {problem.title}
              </div>
            </div>
            {!loading && currentProblem && (
              <div className="flex items-center mt-3">
                <div
                  className={`${problemDifficultyClass} inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize`}
                >
                  {currentProblem.difficulty}
                </div>
                <div className="rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-s text-dark-green-s">
                  <BsCheck2Circle />
                </div>
                <div
                  className="flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-dark-gray-6"
                  onClick={handleLike}
                >
                  {liked ? (
                    <AiFillLike className="text-dark-blue-s" />
                  ) : (
                    <AiFillLike />
                  )}
                  <span className="text-xs">{currentProblem.likes}</span>
                </div>
                <div className="flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-s text-dark-gray-6">
                  <AiFillDislike />
                  <span className="text-xs">{currentProblem.dislikes}</span>
                </div>
                <div className="cursor-pointer hover:bg-dark-fill-3 rounded p-[3px] ml-4 text-xl transition-colors duration-200 text-green-s text-dark-gray-6">
                  <TiStarOutline />
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
            <div
              className="text-white text-sm"
              dangerouslySetInnerHTML={{ __html: problem.problemStatement }}
            />

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
                      <strong>Output:</strong> {example.outputText} <br />
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
              <ul
                className="text-white ml-5 list-disc"
                dangerouslySetInnerHTML={{ __html: problem.constraints }}
              />
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
  const [problemDifficultyClass, setProblemDifficultyClass] =
    useState<string>("");

  useEffect(() => {
    const getCurrentProblem = async () => {
      setLoading(true);
      const docRef = doc(firestore, "problems", problemId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { id, ...problem } = docSnap.data() as DBProblem;
        setCurrentProblem({ id, ...problem });
        setProblemDifficultyClass(
          problem.difficulty === "Easy"
            ? "bg-olive text-olive"
            : problem.difficulty === "Medium"
            ? "bg-dark-yellow text-dark-yellow"
            : "bg-dark-pink text-dark-pink"
        );
      }
      setLoading(false);
    };

    getCurrentProblem();
  }, [problemId]);

  return { currentProblem, loading, problemDifficultyClass, setCurrentProblem };
}

function useGetUserDataOnProblem(problemId: string) {
  const [data, setData] = useState({
    liked: false,
    disliked: false,
    starred: false,
    solved: false,
  });
  const [user] = useAuthState(auth);

  useEffect(() => {
    const getUserDataOnProblem = async () => {
      if (!user) return;

      const userRef = doc(firestore, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const {
          likedProblems = [],
          dislikedProblems = [],
          starredProblems = [],
          solvedProblems = [],
        } = userData || {};

        const liked = likedProblems.includes(problemId);
        const disliked = dislikedProblems.includes(problemId);
        const starred = starredProblems.includes(problemId);
        const solved = solvedProblems.includes(problemId);

        setData({ liked, disliked, starred, solved });
      }
    };

    getUserDataOnProblem();

    return () => {
      // Cleanup function
    };
  }, [problemId, user]);

  return { ...data, setData };
}
