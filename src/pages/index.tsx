"use client"
import BlurFade from "@/components/ui/blur-fade"
import { Carousel } from "@/components/ui/miniCarousel"
import { NeonGradientCard } from "@/components/ui/neon-gradient-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Code,
  LineChart,
  Star,
} from "lucide-react"
import { useEffect, useState } from "react"
import TopBar from "@/components/TopBar/TopBar"
import { auth, firestore } from "@/Firebase/firebase"
import { getUserData } from "@/Firebase/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { useRouter } from "next/navigation"
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore"
import UserActivityComponent from "@/components/features/UserActivityComponent"
import Loading from "@/components/features/loading"


const Dashboard = () => {
  const [user, loading, error] = useAuthState(auth);
  const [pageLoading, setPageLoading] = useState(true);

  interface Problem {
    id: string;
    name: string;
    difficulty: string;
    category: string;
    source: string;
  }
  
  interface UserData {
    totalSolved: number;
    totalProblems: number;
    easySolved: number;
    totalEasy: number;
    mediumSolved: number;
    totalMedium: number;
    hardSolved: number;
    totalHard: number;
    collections: {
      neetcode150: { solved: number; total: number };
      striver150: { solved: number; total: number };
      gfg150: { solved: number; total: number };
      problems: { solved: number; total: number };
    };

  }

  const [userData, setUserData] = useState<UserData | null>(null);
  const [recommendedProblems, setRecommendedProblems] = useState<Problem[]>([]);
  const router = useRouter();


  useEffect(() => {
    if (!user) {
      setPageLoading(true);
      router.push("/auth");
      return;
    }
    
    if (!loading && user) {
      setPageLoading(false);
      fetchUserData();
    }
  }, [user, router, loading]);

  const fetchUserData = async () => {
    try {
      if (!user) {
        console.error("User is not available.");
        return;
      }
      const data = await getUserData(user.uid);
      setUserData(data);
      
      // Fetch recent activity from user's solved problems
      const recentActivityData = data.recentActivity.map(item => ({
        problem: item.problemName,
        problemId: item.problemId,
        difficulty: "Easy", // Default value, will be updated below
        time: item.timestamp,
        completed: true,
        source: item.source
      }));
      
      // For each problem in recent activity, fetch its difficulty
      for (let i = 0; i < recentActivityData.length; i++) {
        try {
          // Try to get problem details from its source collection
          const source = recentActivityData[i].source || "problems";
          const problemsRef = collection(firestore, source);
          const q = query(problemsRef, where("id", "==", recentActivityData[i].problemId));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const problemData = querySnapshot.docs[0].data();
            recentActivityData[i].difficulty = problemData.difficulty || "Easy";
          }
        } catch (err) {
          console.warn("Error fetching problem details:", err);
        }
      }

      await fetchRecommendedProblems();
      
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchRecommendedProblems = async () => {
    try {
      const collections = ["neetcode150", "striver150", "gfg150"];
      interface Problem {
        id: string;
        name: string;
        difficulty: string;
        category: string;
        source: string;
      }

      let allProblems: Problem[] = [];
      const solvedIds = new Set();
      
      if (user) {
        const solvedProblemsRef = collection(firestore, "users", user.uid, "solvedProblems");
        const solvedProblemsSnap = await getDocs(solvedProblemsRef);
        solvedProblemsSnap.docs.forEach(doc => solvedIds.add(doc.id));
      }
      
      // Get problems from all collections
      for (const collectionName of collections) {
        const problemsRef = collection(firestore, collectionName);
        const problemsSnap = await getDocs(query(problemsRef, limit(20)));
        
        problemsSnap.docs.forEach(doc => {
          const problem = doc.data();
          // Only add if not already solved
          if (!solvedIds.has(doc.id)) {
            allProblems.push({
              id: doc.id,
              name: problem.title,
              difficulty: problem.difficulty || "Medium",
              category: problem.category || "Algorithm",
              source: collectionName
            });
          }
        });
      }
      
      // Shuffle and select a few problems
      allProblems.sort(() => 0.5 - Math.random());
      setRecommendedProblems(allProblems.slice(0, 3));
    } catch (error) {
      console.error("Error fetching recommended problems:", error);
    }
  };

  const slideData = [
    {
      id: "1",
      title: "NeetCode 150",
      button: "Code here!",
      src: "/neetcode150.jpg",
      redirectPath: "problems/neetcode150",
    },
    {
      id: "2",
      title: "Striver 150",
      button: "Code here!",
      src: "/striver150.png",
      redirectPath: "problems/striver150",
    },
    {
      id: "3",
      title: "GFG 100",
      button: "Code here!",
      src: "/gfg150.png",
      redirectPath: "problems/gfg150",
    },
  ]

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  if (pageLoading || loading) {
    return (
      <Loading />
    );
  }

  return (
    <>
      <TopBar />
      <main className="bg-black min-h-screen text-white pb-20">
        {/* Welcome Section */}
        <section className="pt-24 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Welcome back, {user?.displayName || 'Coder'}!
                </h1>
                <p className="text-gray-400">Continue your coding journey where you left off</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Dashboard Grid */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Problem Sets & Progress */}
            <motion.div
              className="lg:col-span-2 space-y-8"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {/* Problem Sets Carousel */}
              <motion.div variants={fadeInUp}>
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <BookOpen className="mr-2 text-purple-400" size={24} />
                  Problem Collections
                </h2>
                <BlurFade delay={0.25 * 2}>
                  <NeonGradientCard
                    className="w-full h-fit"
                    borderSize={1}
                    neonColors={{
                      firstColor: "yellow, orange",
                      secondColor: "blue, green",
                    }}
                  >
                    <Carousel slides={slideData} />
                  </NeonGradientCard>
                </BlurFade>
              </motion.div>

              {/* Progress Tracking */}
              <motion.div variants={fadeInUp}>
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <LineChart className="mr-2 text-blue-400" size={24} />
                  Your Progress
                </h2>
                <Card className="bg-gray-900/50 border-gray-800 p-6">
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-white">NeetCode 150</span>
                        <span className="text-gray-400">
                          {userData?.collections?.neetcode150?.solved || 0}/
                          {userData?.collections?.neetcode150?.total || 150} completed
                        </span>
                      </div>
                      <Progress 
                        value={userData?.collections?.neetcode150?.solved || 0} 
                        max={userData?.collections?.neetcode150?.total || 150} 
                        className="h-2 bg-gray-800"
                      >
                        <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                      </Progress>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-white">Striver 150</span>
                        <span className="text-gray-400">
                          {userData?.collections?.striver150?.solved || 0}/
                          {userData?.collections?.striver150?.total || 150} completed
                        </span>
                      </div>
                      <Progress 
                        value={userData?.collections?.striver150?.solved || 0} 
                        max={userData?.collections?.striver150?.total || 150} 
                        className="h-2 bg-gray-800"
                      >
                        <div className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full"></div>
                      </Progress>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-white">GFG 100</span>
                        <span className="text-gray-400">
                          {userData?.collections?.gfg150?.solved || 0}/
                          {userData?.collections?.gfg150?.total || 100} completed
                        </span>
                      </div>
                      <Progress 
                        value={userData?.collections?.gfg150?.solved || 0} 
                        max={userData?.collections?.gfg150?.total || 100} 
                        className="h-2 bg-gray-800"
                      >
                        <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
                      </Progress>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between items-center">
                    <div className="text-sm text-gray-400">
                      <span className="text-lg font-semibold text-white">{userData?.totalSolved || 0}</span>
                      out of
                      <span className="text-lg font-semibold text-white">{userData?.totalProblems || 0}</span>
                      total problems solved
                    </div>
                    <Button 
                      variant="outline" 
                      className="border-gray-700 hover:border-gray-500"
                      onClick={() => router.push('/progress')}
                    >
                      View Detailed Progress <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </div>
                </Card>
              </motion.div>

              {/* Recent Activity */}
              <motion.div variants={fadeInUp}>
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Clock className="mr-2 text-green-400" size={24} />
                  Recent Activity
                </h2>
                <UserActivityComponent />
              </motion.div>
            </motion.div>

            {/* Right Column - Recommendations */}
            <motion.div className="space-y-8" initial="hidden" animate="visible" variants={staggerContainer}>
              {/* Recommended Problems */}
              <motion.div variants={fadeInUp}>
                <h2 className="text-2xl text-white font-bold mb-4 flex items-center">
                  <Star className="mr-2 text-yellow-400" size={24} />
                  Recommended For You
                </h2>
                <Card className="bg-gray-900/50 text-white border-gray-800 overflow-hidden">
                  <div className="divide-y divide-gray-800">
                    {recommendedProblems.length > 0 ? (
                      recommendedProblems.map((problem, index) => (
                        <motion.div
                          key={index}
                          className="p-4 hover:bg-gray-800/30 transition-colors cursor-pointer"
                          whileHover={{ x: 5 }}
                          onClick={() => router.push(`/problem/${problem.source}/${problem.id}`)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-medium">{problem.name}</p>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                problem.difficulty.toLowerCase() === "easy"
                                  ? "bg-green-500/20 text-green-400"
                                  : problem.difficulty.toLowerCase() === "medium"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {problem.difficulty}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-400">Category: {problem.category}</p>
                            <p className="text-xs text-gray-500">{problem.source}</p>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-gray-400">
                        Loading recommendations...
                      </div>
                    )}
                  </div>
                  <div className="p-4 border-t border-gray-800">
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      onClick={() => router.push('/problems/all')}
                    >
                      Start Solving
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Dashboard