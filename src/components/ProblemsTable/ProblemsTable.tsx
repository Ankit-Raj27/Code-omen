import { auth, firestore } from "@/Firebase/firebase";
import { DBProblem } from "@/utils/types/problems";
// import { problems } from "@/mockProblems/problems";
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
import { FaRegCheckCircle, FaYoutube } from "react-icons/fa";
import { IoClose, IoLogoYoutube, IoPlayBackCircle } from "react-icons/io5";
import YouTube from "react-youtube";

type ProblemsTableProps = {
  setLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProblemsTable: React.FC<ProblemsTableProps> = ({
  setLoadingProblems,
}) => {
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

  return (
    <>
      <tbody className="text-white">
        {problems.map((problems, idx) => {
          const difficultyColor =
            problems.difficulty === "Easy"
              ? "text-ark-green-s"
              : problems.difficulty === "Medium"
              ? "text-dark-yellow"
              : "text-dark-pink";
          return (
            <tr
              className={`${idx % 2 == 1 ? "bg-dark-layer-1" : ""}`}
              key={problems.id}
            >
              <th className="px-2 py-4 font-medium whitespace-nowrap text-dark-green-s">
                {solvedProblems.includes(problems.id) && <FaRegCheckCircle fontSize={"18"} width={"18"} />}
              </th>
              <td className="px-6 py-4">
                {problems.link ? (
                  <Link
                    href={problems.link}
                    className="hover:text-blue-600 cursor-pointer"
                    target="_blank"
                  ></Link>
                ) : (
                  <Link
                    className="hover:text-blue-600 cursor-pointer"
                    href={`/problems/${problems.id}`}
                  >
                    {" "}
                    {problems.title}
                  </Link>
                )}
              </td>
              <td className={`px-6 py-4 ${difficultyColor}`}>
                {problems.difficulty}
              </td>
              <td className={`px-6 py-4`}>{problems.category}</td>
              <td className={`px-6 py-4`}>
                {problems.videoId ? (
                  <IoLogoYoutube
                    fontSize={"28"}
                    className="cursor-pointer hover:text-red-600"
                    onClick={() => {
                      setYoutubePlayer({
                        isOpen: true,
                        videoId: problems.videoId as string,
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
export default ProblemsTable;

function useGetProblems(
  setLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>
) {
  const [problems, setProblems] = useState<DBProblem[]>([]);
  useEffect(() => {
    const getProblems = async () => {
      //fetching data logic
      setLoadingProblems(true);
      const q = query(
        collection(firestore, "problems"),
        orderBy("order", "asc")
      );
      const querySnapshot = await getDocs(q);
      const tmp: DBProblem[] = [];
      querySnapshot.forEach((doc) => {
        tmp.push({ id: doc.id, ...doc.data() } as DBProblem);
      });
      setProblems(tmp);
      setLoadingProblems(false);
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
      const userRef = doc(firestore, "users", user!.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        setSolvedProblems(userDoc.data().solvedProblems);
      }
    };
    if (user) {
      getSolvedProblems();
    }
  }, [user]);
  return solvedProblems;
}
