import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { PatternFilterSelect } from "@/components/ProblemsTable/PatternCells";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/Firebase/firebase"; // Firebase auth import
import Image from "next/image";
import useHasMounted from "@/components/hooks/useHasMounted";
import TopBar from "@/components/TopBar/TopBar";
import PageLoader from "@/components/layout/PageLoader";
import Gfg150Table from "@/components/ProblemsTable/GfgTable";

export default function Home() {
  const [loadingProblems, setLoadingProblems] = useState(true);
  const [patternFilter, setPatternFilter] = useState("all");
  const hasMounted = useHasMounted();
  const router = useRouter();
  
  // Use Firebase hook to check authentication status
  const [user, loading, error] = useAuthState(auth); 

  // Redirect to the authentication page if user is not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth"); // Redirect if not authenticated
    }
  }, [user, loading, router]);

  if (!hasMounted || loading) {
    return <PageLoader />;
  }

  const LoadingSkeleton = () => {
    return (
      <div className="flex items-center space-x-12 mt-4 px-6">
        <div className="w-6 h-6 shrink-0 rounded-full bg-dark-layer-1"></div>
        <div className="h-4 sm:w-52  w-32  rounded-full bg-dark-layer-1"></div>
        <div className="h-4 sm:w-52  w-32 rounded-full bg-dark-layer-1"></div>
        <div className="h-4 sm:w-52 w-32 rounded-full bg-dark-layer-1"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  };

  return (
    <>
      <main className="bg-dark-layer-2 min-h-screen">
        <TopBar />
        <h1 className="text-2xl text-center text-gray-700 dark:text-gray-400 font-medium uppercase mt-10 mb-5">
          CodeOmen
        </h1>

        <div className="relative overflow-x-auto mx-auto px-6 pb-10">
          {loadingProblems && (
            <div className="animate-pulse max-w-[1200px] mx-auto my-auto sm:w-7/12 w-full">
              {[...Array(10)].map((_, idx) => (
                <LoadingSkeleton key={idx} />
              ))}
            </div>
          )}
          <div className="mx-auto mb-4 flex w-full max-w-[1200px] justify-end sm:w-7/12">
            <PatternFilterSelect value={patternFilter} onChange={setPatternFilter} />
          </div>
          <table className="text-sm text-left text-gray-500 dark:text-gray-400 sm:w-7/12 w-full max-w-[1200px] mx-auto">
            {!loadingProblems && (
              <thead className="text-xs text-gray-700 uppercase dark:text-gray-400 border-b ">
                <tr>
                  <th scope="col" className="px-1 py-3 w-0 font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 w-0 font-medium">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 w-0 font-medium">
                    Difficulty
                  </th>

                  <th scope="col" className="px-6 py-3 w-0 font-medium">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 w-0 font-medium">
                    Pattern
                  </th>
                  <th scope="col" className="px-6 py-3 w-0 font-medium">
                    Solution
                  </th>
                </tr>
              </thead>
            )}
            <Gfg150Table setLoadingProblems={setLoadingProblems} patternFilter={patternFilter} />
          </table>
        </div>
      </main>
    </>
  );
}