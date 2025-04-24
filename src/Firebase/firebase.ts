import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize 
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, auth, firestore };

export async function getProblemsByDifficulty(difficulty: string) {
  try {
    const problemsRef = collection(firestore, "problems");
    const q =
      difficulty === "all"
        ? query(problemsRef, orderBy("order", "asc"))
        : query(
            problemsRef,
            where("difficulty", "==", difficulty),
            orderBy("order", "asc")
          );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching problems:", error);
    throw error;
  }
}

export async function getUserSolvedProblems(userId: string) {
  try {
    const solvedRef = collection(firestore, "users", userId, "solvedProblems");
    const querySnapshot = await getDocs(solvedRef);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching solved problems:", error);
    throw error;
  }
}

/////////////////////////////////////////////////////
// Fetch user stats: totals and recent activity //
/////////////////////////////////////////////////////

export async function getUserData(userId: string) {
  try {
    // Fetch all problems
    const problemsSnap = await getDocs(collection(firestore, "problems"));
    const allProblems = problemsSnap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as { difficulty: "easy" | "medium" | "hard" }),
    }));

    const totalProblems = allProblems.length;
    const totalEasy = allProblems.filter((p) => p.difficulty === "easy").length;
    const totalMedium = allProblems.filter(
      (p) => p.difficulty === "medium"
    ).length;
    const totalHard = allProblems.filter((p) => p.difficulty === "hard").length;

    // Fetch user's solved problems
    const solvedSnap = await getDocs(
      collection(firestore, "users", userId, "solvedProblems")
    );

    const solvedProblems = solvedSnap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as {
        difficulty: "easy" | "medium" | "hard";
        solvedAt: string;
      }),
    }));

    const totalSolved = solvedProblems.length;
    const easySolved = solvedProblems.filter(
      (p) => p.difficulty === "easy"
    ).length;
    const mediumSolved = solvedProblems.filter(
      (p) => p.difficulty === "medium"
    ).length;
    const hardSolved = solvedProblems.filter(
      (p) => p.difficulty === "hard"
    ).length;

    // Recent activity
    const recent = solvedProblems
      .sort(
        (a, b) =>
          new Date(b.solvedAt).getTime() - new Date(a.solvedAt).getTime()
      )
      .slice(0, 5);

    const recentActivity = await Promise.all(
      recent.map(async (item) => {
        const problemDoc = await getDoc(doc(firestore, "problems", item.id));
        const problemName = problemDoc.exists()
          ? problemDoc.data()?.title
          : "Unknown";
        return {
          problemId: item.id,
          problemName,
          timestamp: formatDistanceToNow(new Date(item.solvedAt), {
            addSuffix: true,
          }),
        };
      })
    );

    return {
      totalSolved,
      totalProblems,
      easySolved,
      totalEasy,
      mediumSolved,
      totalMedium,
      hardSolved,
      totalHard,
      recentActivity,
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}
