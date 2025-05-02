import { useEffect, useState } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import ClientProfile from "./ClientProfile"
import TopBar from "@/components/TopBar/TopBar"

export default function ProfilePage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true) 

  useEffect(() => {
    const auth = getAuth()

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid) 
      } else {
        setUserId(null) 
      }
      setLoading(false) 
    })


    return () => unsubscribe()
  }, [])

  if (loading) {
    return <div>Loading...</div> 
  }

  if (!userId) {
    return <div>Please log in to view your profile.</div> 
  }

  return <>
  <TopBar/>
  <ClientProfile userId={userId} />
  </>
}
