"use client"

import { useState, useEffect } from "react"
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  type DocumentData,
  type QueryConstraint,
  orderBy,
  limit,
} from "firebase/firestore"
import { firestore } from "@/Firebase/firebase"

interface UseFirestoreOptions {
  collectionName: string
  constraints?: QueryConstraint[]
  enabled?: boolean
}

export function useFirestoreCollection<T = DocumentData>({
  collectionName,
  constraints = [],
  enabled = true,
}: UseFirestoreOptions) {
  const [data, setData] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const collectionRef = collection(firestore, collectionName)
        const q = query(collectionRef, ...constraints)
        const querySnapshot = await getDocs(q)

        const results = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[]

        setData(results)
        setError(null)
      } catch (err) {
        console.error("Error fetching collection:", err)
        setError(err instanceof Error ? err : new Error("Unknown error occurred"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [collectionName, constraints, enabled])

  return { data, isLoading, error }
}

export function useFirestoreDocument<T = DocumentData>(
  collectionName: string,
  documentId: string | undefined,
  enabled = true,
) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!documentId || !enabled) {
      setIsLoading(false)
      return
    }

    const fetchDocument = async () => {
      try {
        setIsLoading(true)
        const docRef = doc(firestore, collectionName, documentId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() } as T)
        } else {
          setData(null)
        }
        setError(null)
      } catch (err) {
        console.error("Error fetching document:", err)
        setError(err instanceof Error ? err : new Error("Unknown error occurred"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocument()
  }, [collectionName, documentId, enabled])

  return { data, isLoading, error }
}

// Helper function to get user-specific data
export function useUserData(userId: string | undefined, enabled = true) {
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useFirestoreDocument<any>("users", userId, enabled)

  const {
    data: progressData,
    isLoading: progressLoading,
    error: progressError,
  } = useFirestoreCollection<any>({
    collectionName: "progress",
    constraints: userId ? [where("userId", "==", userId)] : [],
    enabled: !!userId && enabled,
  })

  const {
    data: recentActivity,
    isLoading: activityLoading,
    error: activityError,
  } = useFirestoreCollection<any>({
    collectionName: "activity",
    constraints: userId ? [where("userId", "==", userId), orderBy("timestamp", "desc"), limit(5)] : [],
    enabled: !!userId && enabled,
  })

  const {
    data: recommendedProblems,
    isLoading: recommendedLoading,
    error: recommendedError,
  } = useFirestoreCollection<any>({
    collectionName: "problems",
    constraints: [where("recommended", "==", true), limit(3)],
    enabled,
  })

  const isLoading = userLoading || progressLoading || activityLoading || recommendedLoading
  const error = userError || progressError || activityError || recommendedError

  return {
    userData,
    progressData,
    recentActivity,
    recommendedProblems,
    isLoading,
    error,
  }
}

// Helper function to get problem collections
export function useProblemCollections(enabled = true) {
  return useFirestoreCollection<any>({
    collectionName: "problemCollections",
    constraints: [orderBy("order", "asc")],
    enabled,
  })
}
