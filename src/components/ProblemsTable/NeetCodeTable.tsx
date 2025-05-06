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
  filter: "all" | "solved" | "unsolved";
};

const Neetcode150Table: React.FC<ProblemsTableProps> = ({ setLoadingProblems,filter }) => {

  const [youtubePlayer, setYoutubePlayer] = useState({
    isOpen: false,
    videoId: "",
  });

  const problems = useGetProblems(setLoadingProblems);
  const solvedProblems = useGetSolvedProblems();

  const closeModal = () => {
    setYoutubePlayer({ isOpen: false, videoId: "" });
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const filteredProblems = problems.filter((problem) => {
    if (filter === "solved") {return solvedProblems.includes(problem.id)};
    if (filter === "unsolved") {return !solvedProblems.includes(problem.id)};
    return true; // 'all'
  });



  return (
    <>
    
      <tbody className="text-white">
        {filteredProblems.map((problem, idx) => {
          const difficultyColor =
            problem.difficulty === "Easy"
              ? "text-dark-green-s"
              : problem.difficulty === "Medium"
                ? "text-dark-yellow"
                : "text-dark-pink";
          return (
            <tr
              className={`${idx % 2 === 1 ? "bg-dark-layer-1" : ""}`}
              key={problem.id}
            >
              <th className="px-2 py-4 font-medium whitespace-nowrap text-dark-green-s">
                {solvedProblems.includes(problem.id) && (
                  <FaRegCheckCircle fontSize={"18"} width={"18"} />
                )}
              </th>
              <td className="px-6 py-4">
                {problem.link ? (
                  <Link
                    href={problem.link}
                    className="hover:text-blue-600 cursor-pointer"
                    target="_blank"
                  >
                    {problem.title}
                  </Link>
                ) : (
                  <Link
                    className="hover:text-blue-600 cursor-pointer"
                    href={`/problems/${problem.id}`}
                  >
                    {problem.title}
                  </Link>
                )}
              </td>
              <td className={`px-6 py-4 ${difficultyColor}`}>
                {problem.difficulty}
              </td>
              <td className={`px-6 py-4`}>{problem.category}</td>
              <td className={`px-6 py-4`}>
                {problem.videoId ? (
                  <IoLogoYoutube
                    fontSize={"28"}
                    className="cursor-pointer hover:text-red-600"
                    onClick={() => {
                      setYoutubePlayer({
                        isOpen: true,
                        videoId: problem.videoId as string,
                      });
                    }}
                  />
                ) : (
                  <p className="text-gray-400">Coming Soon</p>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
      {youtubePlayer.isOpen && (
        <tfoot
          className="fixed top-0 left-0 h-screen w-screen flex items-center justify-center "
          onClick={closeModal}
        >
          <div className="bg-black z-10 opacity-70 top-0 left-0 w-screen h-screen absolute"></div>
          <div className="w-full z-50 h-full px-6 relative max-w-4xl">
            <div className="w-full h-full flex items-center justify-center relative">
              <div className="w-full relative">
                <IoClose
                  fontSize={"35"}
                  className="cursor-pointer absolute -top-16 right-0"
                  onClick={closeModal}
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
export default Neetcode150Table;

// Custom Hooks
function useGetProblems(
  setLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>
) {
  const [problems, setProblems] = useState<DBProblem[]>([]);
  useEffect(() => {
    const getProblems = async () => {
      setLoadingProblems(true);
      try {
        const q = query(
          collection(firestore, "neetcode150"),
          orderBy("order", "asc")
        );
        const querySnapshot = await getDocs(q);
        const tmp: DBProblem[] = [];
        querySnapshot.forEach((doc) => {
          tmp.push({ id: doc.id, ...doc.data() } as DBProblem);
        });
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
      if (!user) return;
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
