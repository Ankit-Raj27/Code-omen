"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { collection as firestoreCollection, doc, getDoc, getDocs, query, where } from "firebase/firestore"
import { firestore, auth } from "@/Firebase/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

interface ProblemListProps {
  filter: 'all' | 'easy' | 'medium' | 'hard'
  searchQuery?: string
  collection?: string  // Added collection prop
}

interface Problem {
  id: string
  title: string
  difficulty: string
  tags?: string[]
  isSolved?: boolean
}

export function ProblemList({ filter, searchQuery = "", collection = "problems" }: ProblemListProps) {
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
  const [user] = useAuthState(auth)
  const [solvedProblems, setSolvedProblems] = useState<string[]>([])

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true)
      
      try {
        // Get user's solved problems if user is logged in
        let userSolvedProblems: string[] = []
        if (user) {
          const userDocRef = doc(firestore, "users", user.uid)
          const userDoc = await getDoc(userDocRef)
          if (userDoc.exists()) {
            userSolvedProblems = userDoc.data()?.solvedProblems || []
            setSolvedProblems(userSolvedProblems)
          }
        }

        // Create query for problems based on the filter and collection
        const problemsCollectionRef = firestoreCollection(firestore, collection)
        let problemsQuery: any = problemsCollectionRef

        if (filter !== "all") {
          const formattedFilter = filter.charAt(0).toUpperCase() + filter.slice(1).toLowerCase()
          problemsQuery = query(problemsCollectionRef, where("difficulty", "==", formattedFilter))
        }

        const problemsSnapshot = await getDocs(problemsQuery)

        let problemsList = problemsSnapshot.docs.map(doc => {
          const data = doc.data() as { title?: string; difficulty?: string; tags?: string[] }
          return {
            id: doc.id,
            title: data.title || `Problem ${doc.id}`,
            difficulty: data.difficulty || "Unknown",
            tags: data.tags || [],
            isSolved: userSolvedProblems.includes(doc.id)
          }
        })

        // Apply search filter if provided
        if (searchQuery.trim() !== "") {
          const queryLower = searchQuery.toLowerCase()
          problemsList = problemsList.filter((problem: Problem) => 
            problem.title.toLowerCase().includes(queryLower) || 
            problem.tags?.some((tag: string) => tag.toLowerCase().includes(queryLower))
          )
        }

        setProblems(problemsList)
      } catch (error) {
        console.error("Error fetching problems:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProblems()
  }, [filter, searchQuery, user, collection])

  if (loading) {
    return <div className="flex justify-center p-4">Loading problems...</div>
  }

  if (problems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-muted-foreground">No problems found with current filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-4">
        {problems.map((problem) => (
          <div 
            key={problem.id} 
            className="flex items-center justify-between border p-4 rounded-md hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              {problem.isSolved && (
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              )}
              <div>
                <Link href={`/problems/${problem.id}`} className="font-medium hover:underline">
                  {problem.title}
                </Link>
                <div className="flex items-center mt-1 space-x-2">
                  <Badge
                    variant="outline"
                    className={`${
                      problem.difficulty === "Easy" 
                        ? "bg-green-50 text-green-700 border-green-200" 
                        : problem.difficulty === "Medium"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {problem.difficulty}
                  </Badge>
                  {problem.tags?.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <Link href={`/problems/${problem.id}`}>
              <Button variant="outline" size="sm">
                {problem.isSolved ? "Review" : "Solve"}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
