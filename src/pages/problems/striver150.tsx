import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/Firebase/firebase";
import Striver150Table from "@/components/ProblemsTable/StriverTable";
import useHasMounted from "@/components/hooks/useHasMounted";
import TopBar from "@/components/TopBar/TopBar";
import { SparklesCore } from "@/components/features/SparkleCore";

export default function Home() {
  const [loadingProblems, setLoadingProblems] = useState(true);
  const hasMounted = useHasMounted();
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  const [statusFilter, setStatusFilter] = useState<"all" | "solved" | "unsolved">("all");
  const [difficultyFilter, setDifficultyFilter] = useState<"all" | "Easy" | "Medium" | "Hard">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  if (!hasMounted || loading) return <SparklesCore />;

  const LoadingSkeleton = () => (
    <div className="flex items-center space-x-12 mt-4 px-6">
      <div className="w-6 h-6 shrink-0 rounded-full bg-dark-layer-1"></div>
      <div className="h-4 sm:w-52  w-32 rounded-full bg-dark-layer-1"></div>
      <div className="h-4 sm:w-52  w-32 rounded-full bg-dark-layer-1"></div>
      <div className="h-4 sm:w-52  w-32 rounded-full bg-dark-layer-1"></div>
    </div>
  );

  return (
    <main className="bg-dark-layer-2 min-h-screen">
      <TopBar />
      <h1 className="text-2xl text-center text-gray-700 dark:text-gray-400 font-medium uppercase mt-10 mb-5">
        CodeOmen
      </h1>

      <div className="flex flex-wrap justify-center gap-4 mb-6 px-4">
        {["all", "solved", "unsolved"].map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f as "all" | "solved" | "unsolved")}
            className={`px-4 py-2 rounded-full font-medium ${statusFilter === f
                ? "bg-blue-600 text-white"
                : "bg-dark-layer-1 text-gray-400 hover:bg-dark-layer-1/50"
              }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}

        {/* Difficulty Filter */}
        {["all", "Easy", "Medium", "Hard"].map((d) => (
          <button
            key={d}
            onClick={() => setDifficultyFilter(d as "all" | "Easy" | "Medium" | "Hard")}
            className={`px-4 py-2 rounded-full font-medium ${difficultyFilter === d
                ? "bg-green-600 text-white"
                : "bg-dark-layer-1 text-gray-400 hover:bg-dark-layer-1/50"
              }`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="flex justify-center mb-6">
        <Striver150Table
          setLoadingProblems={setLoadingProblems}
          statusFilter={statusFilter}
          difficultyFilter={difficultyFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
        />
      </div>
    </main>
  );
}
