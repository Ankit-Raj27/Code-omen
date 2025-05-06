import { auth, firestore } from "@/Firebase/firebase";
import { DBProblem } from "@/utils/types/problems";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaRegCheckCircle } from "react-icons/fa";
import { IoClose, IoLogoYoutube } from "react-icons/io5";
import YouTube from "react-youtube";

type ProblemsTableProps = {
  setLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>;
  statusFilter: "all" | "solved" | "unsolved";
  difficultyFilter: "all" | "Easy" | "Medium" | "Hard";
  categoryFilter: string;
  setCategoryFilter: React.Dispatch<React.SetStateAction<string>>;
};

const Striver150Table: React.FC<ProblemsTableProps> = ({
  setLoadingProblems,
  statusFilter,
  difficultyFilter,
  categoryFilter,
  setCategoryFilter,
}) => {
  const [youtubePlayer, setYoutubePlayer] = useState({
    isOpen: false,
    videoId: "",
  });

  const problems = useGetProblems(setLoadingProblems);
  const solvedProblems = useGetSolvedProblems();

  const categories = Array.from(new Set(problems.map(p => p.category))).sort();

  const filteredProblems = problems.filter((problem) => {
    const isSolved = solvedProblems.includes(problem.id);
    const matchStatus =
      statusFilter === "solved" ? isSolved :
      statusFilter === "unsolved" ? !isSolved :
      true;

    const matchDifficulty =
      difficultyFilter === "all" ? true : problem.difficulty === difficultyFilter;

    const matchCategory =
      categoryFilter === "all" ? true : problem.category === categoryFilter;

    return matchStatus && matchDifficulty && matchCategory;
  });

  return (
    <>
      <div className="mb-6 text-white ">
        <label className="mr-2">Category:</label>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-dark-layer-1 px-4 py-2 rounded-lg text-white"
        >
          <option value="all">All</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div className="relative overflow-x-auto mx-auto px-6 pb-10 w-full max-w-[1200px]">
        <table className="text-sm text-left text-gray-500 dark:text-gray-400 w-full">
          <thead className="text-xs text-gray-700 uppercase dark:text-gray-400 border-b">
            <tr>
              <th className="px-1 py-3 w-0 font-medium">Status</th>
              <th className="px-6 py-3 w-0 font-medium">Title</th>
              <th className="px-6 py-3 w-0 font-medium">Difficulty</th>
              <th className="px-6 py-3 w-0 font-medium">Category</th>
              <th className="px-6 py-3 w-0 font-medium">Solution</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {filteredProblems.map((problem, idx) => {
              const difficultyColor =
                problem.difficulty === "Easy"
                  ? "text-green"
                  : problem.difficulty === "Medium"
                  ? "text-dark-yellow"
                  : "text-dark-pink"
              return (
                <tr key={problem.id} className={`${idx % 2 === 1 ? "bg-dark-layer-1" : ""}`}>
                  <th className="px-2 py-4 font-medium text-dark-green-s">
                    {solvedProblems.includes(problem.id) && (
                      <FaRegCheckCircle fontSize={"18"} /> 
                    )}
                  </th>
                  <td className="px-6 py-4">
                    <Link
                      href={problem.link || `/problems/${problem.id}`}
                      target={problem.link ? "_blank" : "_self"}
                      className="hover:text-blue-600"
                    >
                      {problem.title}
                    </Link>
                  </td>
                  <td className={`px-6 py-4 ${difficultyColor}`}>{problem.difficulty}</td>
                  <td className="px-6 py-4">{problem.category}</td>
                  <td className="px-6 py-4">
                    {problem.videoId ? (
                      <IoLogoYoutube
                        fontSize={"28"}
                        className="cursor-pointer hover:text-red-600"
                        onClick={() =>
                          setYoutubePlayer({ isOpen: true, videoId: problem.videoId! })
                        }
                      />
                    ) : (
                      <p className="text-gray-400">Coming Soon</p>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {youtubePlayer.isOpen && (
        <tfoot
          className="fixed top-0 left-0 h-screen w-screen flex items-center justify-center"
          onClick={() => setYoutubePlayer({ isOpen: false, videoId: "" })}
        >
          <div className="bg-black z-10 opacity-70 top-0 left-0 w-screen h-screen absolute" />
          <div className="w-full z-50 h-full px-6 relative max-w-4xl">
            <div className="w-full h-full flex items-center justify-center relative">
              <div className="w-full relative">
                <IoClose
                  fontSize={"35"}
                  className="cursor-pointer absolute -top-16 right-0"
                  onClick={ ()=>setYoutubePlayer({isOpen:false,videoId:""}) }
                />
                <YouTube
                  videoId={youtubePlayer.videoId}
                  loading="lazy"
                  iframeClassName="w-full min-h-[500px]"
                />
              </div>
            </div>
          </div>
        </tfoot>
      )}
    </>
  );
};


export default Striver150Table;
function useGetProblems(
  setLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>
) {
  const [problems, setProblems] = useState<DBProblem[]>([]);
  useEffect(() => {
    const getProblems = async () => {
      setLoadingProblems(true);
      try {
        const q = query(collection(firestore, "striver150"), orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);
        const tmp: DBProblem[] = [];
        querySnapshot.forEach((doc) =>
          tmp.push({ id: doc.id, ...doc.data() } as DBProblem)
        );
        setProblems(tmp);
      } catch (error) {
        console.error("Error fetching problems: ", error);
      } finally {
        setLoadingProblems(false);
      }
    };
    getProblems();
  }, [setLoadingProblems]);
  return problems;
}

function useGetSolvedProblems() {
  const [solvedProblems, setSolvedProblems] = useState<string[]>([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const getSolvedProblems = async () => {
      if (!user) {return};
      try {
        const userRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setSolvedProblems(userDoc.data().solvedProblems || []);
        } else {
          setSolvedProblems([]);
        }
      } catch (error) {
        console.error("Error fetching solved problems: ", error);
        setSolvedProblems([]);
      }
    };
    getSolvedProblems();
  }, [user]);
  return solvedProblems;
}