import { useEffect, useState } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import ClientProfile from "./ClientProfile"
import { Metadata } from "next"
import TopBar from "@/components/TopBar/TopBar"

export const metadata: Metadata = {
  title: "Profile Dashboard",
  description: "View your coding progress and solved problems",
}

export default function ProfilePage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true) // Loading state to handle async fetch

  useEffect(() => {
    const auth = getAuth()

    // Subscribe to the auth state change
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid) // Set the user ID when authenticated
      } else {
        setUserId(null) // If not authenticated, reset userId
      }
      setLoading(false) // Set loading to false once the auth state is determined
    })

    // Clean up the subscription on component unmount
    return () => unsubscribe()
  }, [])

  if (loading) {
    return <div>Loading...</div> // Display loading state until the user is authenticated
  }

  if (!userId) {
    return <div>Please log in to view your profile.</div> // Show a message if the user is not authenticated
  }

  return <>
  <TopBar/>
  <ClientProfile userId={userId} />
  </>
}
