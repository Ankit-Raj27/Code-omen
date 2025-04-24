"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle2, Clock, Filter, Search } from "lucide-react"
import { getAuth, onAuthStateChanged } from "firebase/auth"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserStats } from "@/components/features/UserStats"
import { ProblemList } from "@/components/features/ProblemList"

interface ClientProfileProps {
    userId: string
}
interface StatsData {
    totalSolved: number;
    totalEasy: number;
    totalMedium: number;
    totalHard: number;
    totalProblems?: number;
    recentActivity?: any[];
    chartData?: any[];
}

export default function ClientProfile({ userId }: ClientProfileProps) {
    const [statsData, setStatsData] = useState<StatsData>({
        totalSolved: 0,
        totalEasy: 0,
        totalMedium: 0,
        totalHard: 0,
        totalProblems: 0,
        recentActivity: []
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [authUser, setAuthUser] = useState<any | null>(null)
    const [selectedFilter, setSelectedFilter] = useState<string>("all")
    const [searchQuery, setSearchQuery] = useState<string>("")

    useEffect(() => {
        const auth = getAuth()
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user)
                setLoading(false)
            } else {
                setError("Not signed in.")
                setLoading(false)
            }
        })

        return () => unsubscribe()
    }, [])

    // Handler function to receive data from UserStats
    const handleStatsCalculated = (data: StatsData) => {
        console.log("Stats data received:", data)
        setStatsData(data)
        setLoading(false)
    }

    // Handle filter change
    const handleFilterChange = (value: string) => {
        setSelectedFilter(value)
    }

    // Handle search input
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }

    if (loading && !authUser) return <div>Loading...</div>
    if (error) return <div className="text-red-500">{error}</div>

    // Calculate progress percentages for each difficulty level
    const easyProgress = statsData.totalEasy > 0 ?
        (statsData.totalEasy / (statsData.totalProblems || 100)) * 100 : 0

    const mediumProgress = statsData.totalMedium > 0 ?
        (statsData.totalMedium / (statsData.totalProblems || 100)) * 100 : 0

    const hardProgress = statsData.totalHard > 0 ?
        (statsData.totalHard / (statsData.totalProblems || 100)) * 100 : 0

    return (
        <div className="flex min-h-screen w-full flex-col">
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Total Solved Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Problems Solved</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statsData.totalSolved}</div>
                            <p className="text-xs text-muted-foreground">out of {statsData.totalProblems || 0} problems</p>
                        </CardContent>
                    </Card>

                    {/* Difficulty Cards */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Easy Problems</CardTitle>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Easy
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statsData.totalEasy}</div>
                            <Progress value={easyProgress} className="h-2 mt-2 bg-green-100" />
                            <p className="text-xs text-muted-foreground mt-1">{statsData.totalEasy} solved</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Medium Problems</CardTitle>
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                Medium
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statsData.totalMedium}</div>
                            <Progress value={mediumProgress} className="h-2 mt-2 bg-yellow-100" />
                            <p className="text-xs text-muted-foreground mt-1">{statsData.totalMedium} solved</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Hard Problems</CardTitle>
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                Hard
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statsData.totalHard}</div>
                            <Progress value={hardProgress} className="h-2 mt-2 bg-red-100" />
                            <p className="text-xs text-muted-foreground mt-1">{statsData.totalHard} solved</p>
                        </CardContent>
                    </Card>
                </div>

                {/* User Stats and Activity */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Solved Problems</CardTitle>
                            <CardDescription>Track your progress across all difficulty levels</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Pass the callback to receive stats data */}
                            <UserStats onStatsCalculated={handleStatsCalculated} />
                        </CardContent>
                    </Card>
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Your recent problem-solving activity</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {statsData.recentActivity && statsData.recentActivity.length > 0 ? (
                                    statsData.recentActivity.slice(0, 10).map((activity, index) => (
                                        <div key={index} className="flex items-center">
                                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    Solved{" "}
                                                    <Link href={`/problems/${activity.problemId}`} className="text-blue-600 hover:underline">
                                                        {activity.problemName}
                                                    </Link>
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(activity.timestamp).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No recent activity</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filterable Problems List */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Problems</CardTitle>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filter
                                </Button>
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search problems..."
                                        className="w-[200px] pl-8 md:w-[300px]"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="all" onValueChange={handleFilterChange}>
                            <TabsList>
                                <TabsTrigger value="all">All Problems</TabsTrigger>
                                <TabsTrigger value="easy">Easy</TabsTrigger>
                                <TabsTrigger value="medium">Medium</TabsTrigger>
                                <TabsTrigger value="hard">Hard</TabsTrigger>
                            </TabsList>
                            <TabsContent value="all" className="mt-4">
                                <ProblemList filter="all" searchQuery={searchQuery} />
                            </TabsContent>
                            <TabsContent value="easy" className="mt-4">
                                <ProblemList filter="easy" searchQuery={searchQuery} />
                            </TabsContent>
                            <TabsContent value="medium" className="mt-4">
                                <ProblemList filter="medium" searchQuery={searchQuery} />
                            </TabsContent>
                            <TabsContent value="hard" className="mt-4">
                                <ProblemList filter="hard" searchQuery={searchQuery} />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}