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
  Calendar,
  CheckCircle2,
  Clock,
  Code,
  FlameIcon as Fire,
  LineChart,
  Star,
  Trophy,
  User,
} from "lucide-react"
import { useEffect, useState } from "react"
import TopBar from "@/components/TopBar/TopBar"
import { auth } from "@/Firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth"
import { useRouter } from "next/navigation"

const Dashboard = () => {
  const [user, loading, error] = useAuthState(auth);
  const [pageLoading, setPageLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      setPageLoading(true);
      router.push("/auth");
    }
    if (!loading && !user) {
      setPageLoading(false);
    }
  }, [user, router, loading]);
  const [progress] = useState({
    neetcode: 35,
    striver: 22,
    gfg: 15,
  })

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

  const recentActivity = [
    { problem: "Two Sum", difficulty: "Easy", time: "2 hours ago", completed: true },
    { problem: "Valid Parentheses", difficulty: "Medium", time: "Yesterday", completed: true },
    { problem: "Merge K Sorted Lists", difficulty: "Hard", time: "2 days ago", completed: false },
    { problem: "LRU Cache", difficulty: "Medium", time: "3 days ago", completed: true },
  ]

  const recommendedProblems = [
    { name: "Longest Substring Without Repeating Characters", difficulty: "Medium", category: "String" },
    { name: "Maximum Subarray", difficulty: "Easy", category: "Array" },
    { name: "Merge Intervals", difficulty: "Medium", category: "Array" },
  ]

  const userStats = {
    streak: 7,
    totalSolved: 87,
    ranking: 1250,
    badges: 12,
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
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, Coder!</h1>
                <p className="text-gray-400">Continue your coding journey where you left off</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-amber-500/10 px-4 py-2 rounded-lg border border-amber-500/30">
                  <Fire className="text-amber-500" size={20} />
                  <span className="text-amber-400 font-medium">{userStats.streak} day streak</span>
                </div>
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
                <h2 className="text-2xl  font-bold mb-4 flex items-center">
                  <LineChart className="mr-2 text-blue-400" size={24} />
                  Your Progress
                </h2>
                <Card className="bg-gray-900/50 border-gray-800 p-6">
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-white ">NeetCode 150</span>
                        <span className="text-gray-400">{progress.neetcode}/150 completed</span>
                      </div>
                      <Progress value={progress.neetcode} max={150} className="h-2 bg-gray-800">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                      </Progress>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-white">Striver 150</span>
                        <span className="text-gray-400">{progress.striver}/150 completed</span>
                      </div>
                      <Progress value={progress.striver} max={150} className="h-2 bg-gray-800">
                        <div className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full"></div>
                      </Progress>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-white">GFG 100</span>
                        <span className="text-gray-400">{progress.gfg}/100 completed</span>
                      </div>
                      <Progress value={progress.gfg} max={100} className="h-2 bg-gray-800">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
                      </Progress>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button variant="outline" className="border-gray-700 hover:border-gray-500">
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
                <Card className="bg-gray-900/50 text-white border-gray-800 overflow-hidden">
                  <div className="divide-y divide-gray-800">
                    {recentActivity.map((activity, index) => (
                      <motion.div
                        key={index}
                        className="p-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex items-center gap-3">
                          {activity.completed ? (
                            <CheckCircle2 className="text-green-500" size={20} />
                          ) : (
                            <Code className="text-blue-400" size={20} />
                          )}
                          <div>
                            <p className="font-medium">{activity.problem}</p>
                            <p className="text-sm text-gray-400">{activity.time}</p>
                          </div>
                        </div>
                        <div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${activity.difficulty === "Easy"
                              ? "bg-green-500/20 text-green-400"
                              : activity.difficulty === "Medium"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                              }`}
                          >
                            {activity.difficulty}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-gray-800 flex justify-center">
                    <Button variant="ghost" className="text-gray-400 hover:text-white">
                      View All Activity <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </motion.div>

            {/* Right Column - Stats & Recommendations */}
            <motion.div className="space-y-8" initial="hidden" animate="visible" variants={staggerContainer}>
              {/* Calendar */}
              <motion.div variants={fadeInUp}>
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Calendar className="mr-2 text-blue-400" size={24} />
                  Coding Calendar
                </h2>
                <Card className="bg-gray-900/50 border-gray-800 p-6">
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 28 }).map((_, i) => {
                      // Random activity level: 0 = none, 1-3 = low to high
                      const activityLevel = Math.floor(Math.random() * 4)
                      return (
                        <div
                          key={i}
                          className={`aspect-square rounded-sm ${activityLevel === 0
                            ? "bg-gray-800"
                            : activityLevel === 1
                              ? "bg-green-900"
                              : activityLevel === 2
                                ? "bg-green-700"
                                : "bg-green-500"
                            }`}
                          title={`${activityLevel} problems solved`}
                        />
                      )
                    })}
                  </div>
                  <p className="text-xs text-gray-400 mt-4 text-center">Your coding activity over the last 28 days</p>
                </Card>
              </motion.div>

              {/* Recommended Problems */}
              <motion.div variants={fadeInUp}>
                <h2 className="text-2xl text-white font-bold mb-4 flex items-center">
                  <Star className="mr-2 text-yellow-400" size={24} />
                  Recommended For You
                </h2>
                <Card className="bg-gray-900/50 text-white border-gray-800 overflow-hidden">
                  <div className="divide-y divide-gray-800">
                    {recommendedProblems.map((problem, index) => (
                      <motion.div
                        key={index}
                        className="p-4 hover:bg-gray-800/30 transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium">{problem.name}</p>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${problem.difficulty === "Easy"
                              ? "bg-green-500/20 text-green-400"
                              : problem.difficulty === "Medium"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                              }`}
                          >
                            {problem.difficulty}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">Category: {problem.category}</p>
                      </motion.div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-gray-800">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
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
