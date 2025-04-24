"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, firestore } from "@/Firebase/firebase"
import { doc, getDoc, collection, getDocs, addDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { format, subMonths, parse, isValid } from "date-fns"

type ChartData = {
    name: string
    easy: number
    medium: number
    hard: number
}

interface UserStatsProps {
    onStatsCalculated?: (data: any) => void;
}

export function UserStats({ onStatsCalculated }: UserStatsProps) {
    const [data, setData] = useState<ChartData[]>([])
    const [user] = useAuthState(auth)
    const [totalData, setTotalData] = useState({
        totalSolved: 0,
        totalEasy: 0,
        totalMedium: 0,
        totalHard: 0,
        totalProblems: 0,
    })
    const [recentActivity, setRecentActivity] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                setLoading(false)
                return
            }

            try {
                // Fetch user data
                const userRef = doc(firestore, "users", user.uid)
                const userDoc = await getDoc(userRef)

                if (!userDoc.exists()) {
                    setLoading(false)
                    return
                }

                const userData = userDoc.data()

                // Get the array of solved problem IDs from the user document
                const solvedProblemIds: string[] = userData.solvedProblems || []
                // Get recent activity if it exists, otherwise create an empty array
                let activity = userData.recentActivity || []

                // Get total problems count from the problems collection
                const problemsCollection = collection(firestore, "problems")
                const problemsSnapshot = await getDocs(problemsCollection)
                const totalProblems = problemsSnapshot.size

                if (solvedProblemIds.length === 0) {
                    const emptyData = {
                        totalSolved: 0,
                        totalEasy: 0,
                        totalMedium: 0,
                        totalHard: 0,
                        totalProblems,
                        recentActivity: [],
                        chartData: []
                    }

                    setTotalData({
                        ...emptyData,
                        totalProblems
                    })

                    if (onStatsCalculated) {
                        onStatsCalculated(emptyData)
                    }

                    setLoading(false)
                    return
                }

                // Fetch problem details for each solved problem ID
                const problemRefs = solvedProblemIds.map(id => doc(firestore, "problems", id))
                const problemDocs = await Promise.all(problemRefs.map(ref => getDoc(ref)))

                const solvedProblems = problemDocs
                    .filter(doc => doc.exists() && doc.data()?.difficulty)
                    .map(doc => ({
                        id: doc.id,
                        difficulty: doc.data()!.difficulty as "Easy" | "Medium" | "Hard",
                        title: doc.data()!.title || `Problem ${doc.id}`
                    }))

                // Generate recent activity data if it doesn't exist
                if (activity.length === 0 && solvedProblems.length > 0) {
                    // Create mock activity data based on solved problems
                    const mockActivity = solvedProblems.map((problem, index) => {
                        // Create timestamps with slight variations so they're distributed over time
                        // Newer problems (with higher indices) will have more recent timestamps
                        const mockDate = new Date();
                        mockDate.setDate(mockDate.getDate() - (solvedProblems.length - index));

                        return {
                            problemId: problem.id,
                            problemName: problem.title,
                            timestamp: mockDate.toISOString(),
                            difficulty: problem.difficulty
                        };
                    });

                    // Sort most recent first
                    mockActivity.sort((a, b) =>
                        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                    );

                    activity = mockActivity;

                    // Store this activity in Firestore for future use
                    try {
                        await updateDoc(userRef, {
                            recentActivity: activity
                        });
                        console.log("Created and stored activity data");
                    } catch (err) {
                        console.error("Error storing activity data:", err);
                    }
                }

                // Generate data for the past 3 months for the chart
                const currentMonth = new Date();
                const monthlyData: Record<string, ChartData> = {};

                // Initialize with the past 3 months
                for (let i = 0; i < 3; i++) {
                    const monthDate = subMonths(currentMonth, i);
                    const monthName = format(monthDate, "MMM");
                    monthlyData[monthName] = { name: monthName, easy: 0, medium: 0, hard: 0 };
                }

                // Count solved problems by difficulty and month
                if (activity.length > 0) {
                    activity.forEach((item: { timestamp: string; difficulty?: string; problemId: string }) => {
                        if (item.timestamp) {
                            const date = new Date(item.timestamp);
                            if (isValid(date)) {
                                const monthName = format(date, "MMM");
                                const difficulty = item.difficulty?.toLowerCase() ||
                                    solvedProblems.find((p: { id: string; difficulty: string }) => p.id === item.problemId)?.difficulty?.toLowerCase();

                                if (monthlyData[monthName] && difficulty) {
                                    if (difficulty === "easy") { monthlyData[monthName].easy += 1; }
                                    if (difficulty === "medium") { monthlyData[monthName].medium += 1; }
                                    if (difficulty === "hard") { monthlyData[monthName].hard += 1; }
                                }
                            }
                        }
                    });
                } else {
                    // Fallback: distribute problems across recent months
                    const monthsArr = Object.keys(monthlyData);
                    solvedProblems.forEach((problem, idx) => {
                        const monthName = monthsArr[idx % monthsArr.length];
                        const difficulty = problem.difficulty.toLowerCase();

                        if (difficulty === "easy") { monthlyData[monthName].easy += 1; }
                        if (difficulty === "medium") { monthlyData[monthName].medium += 1; }
                        if (difficulty === "hard") { monthlyData[monthName].hard += 1; }
                    });
                }

                // Convert to array and sort by month
                const chartData = Object.values(monthlyData).sort((a, b) => {
                    const aMonth = parse(a.name, "MMM", new Date());
                    const bMonth = parse(b.name, "MMM", new Date());
                    return aMonth.getMonth() - bMonth.getMonth();
                });

                // Calculate total stats for solved problems by difficulty
                const totalSolved = solvedProblems.length;
                const totalEasy = solvedProblems.filter((p) => p.difficulty === "Easy").length;
                const totalMedium = solvedProblems.filter((p) => p.difficulty === "Medium").length;
                const totalHard = solvedProblems.filter((p) => p.difficulty === "Hard").length;

                // Update the state
                const newTotalData = {
                    totalSolved,
                    totalEasy,
                    totalMedium,
                    totalHard,
                    totalProblems
                };

                // Create complete stats object for parent component
                const completeStatsData = {
                    ...newTotalData,
                    recentActivity: activity,
                    chartData
                };

                console.log("Setting data:", { chartData, totals: newTotalData, activity });

                // Set all state at once
                setData(chartData);
                setTotalData(newTotalData);
                setRecentActivity(activity);

                // Pass calculated data to parent component
                if (onStatsCalculated) {
                    onStatsCalculated(completeStatsData);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching user stats:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, [user, onStatsCalculated]);

    // Update user's recent activity when they solve a problem
    const recordProblemSolved = async (problemId: string, problemName: string, difficulty: string) => {
        if (!user) { return };

        try {
            const userRef = doc(firestore, "users", user.uid);

            // Create activity object
            const activityItem = {
                problemId,
                problemName,
                difficulty,
                timestamp: new Date().toISOString()
            };

            // Update user document with new activity
            await updateDoc(userRef, {
                recentActivity: arrayUnion(activityItem),
                solvedProblems: arrayUnion(problemId)
            });

            console.log("Problem solving activity recorded");

            // Refresh data
            setRecentActivity(prev => [activityItem, ...prev]);

        } catch (error) {
            console.error("Error recording problem solving activity:", error);
        }
    };

    if (loading) {
        return <div>Loading stats...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="h-[300px] w-full">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="easy" stackId="a" fill="#4ade80" name="Easy" />
                            <Bar dataKey="medium" stackId="a" fill="#facc15" name="Medium" />
                            <Bar dataKey="hard" stackId="a" fill="#f87171" name="Hard" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex h-full items-center justify-center">No problem solving data available</div>
                )}
            </div>
        </div>
    );
}