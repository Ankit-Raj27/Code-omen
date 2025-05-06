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

export async function getProblemsByDifficulty(difficulty: string, collectionName: string = "neetcode150") {
  try {
    const problemsRef = collectionName === "problems" 
      ? collection(firestore, "problems")
      : collection(firestore, collectionName);
      
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
      source: collection,
      ...doc.data(),
    }));
  } catch (error) {
    console.error(`Error fetching problems from ${collection}:`, error);
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

/**
 * Get all available problem collections
 */
export async function getAllProblemCollections() {
  return ["neetcode150", "striver150", "gfg150"];
}

/**
 * Enhanced user data function that categorizes problems by collection source
 */
export async function getUserData(userId: string) {
  try {
    const collections = ["neetcode150", "striver150", "gfg150", "problems"];
    type Problem = {
      id: string;
      source: string;
      difficulty: "easy" | "medium" | "hard";
      selectedList?: string;
    };
    let allProblems: Problem[] = []
    
    // Fetch problems from all collections
    for (const collectionName of collections) {
      try {
        const problemsSnap = await getDocs(collection(firestore, collectionName));
        const problems = problemsSnap.docs.map((doc) => ({
          id: doc.id,
          source: collectionName,
          ...(doc.data() as { 
            difficulty: "easy" | "medium" | "hard",
            selectedList?: string 
          }),
        }));
        allProblems = [...allProblems, ...problems];
      } catch (err) {
        console.warn(`Collection ${collectionName} might not exist:`, err);
      }
    }

    // Calculate totals by difficulty
    const totalProblems = allProblems.length;
    const totalEasy = allProblems.filter((p) => p.difficulty === "easy").length;
    const totalMedium = allProblems.filter((p) => p.difficulty === "medium").length;
    const totalHard = allProblems.filter((p) => p.difficulty === "hard").length;

    // Calculate totals by collection
    const totalByCollection = {
      neetcode150: allProblems.filter(p => p.source === "neetcode150").length,
      striver150: allProblems.filter(p => p.source === "striver150").length,
      gfg150: allProblems.filter(p => p.source === "gfg150").length,
      problems: allProblems.filter(p => p.source === "problems").length,
    };

    // Fetch user's solved problems
    const solvedSnap = await getDocs(
      collection(firestore, "users", userId, "solvedProblems")
    );

    const solvedProblems = solvedSnap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as {
        difficulty: "easy" | "medium" | "hard";
        solvedAt: string;
        source?: string;
      }),
    }));

    // For each solved problem, find its source collection if not already specified
    for (let i = 0; i < solvedProblems.length; i++) {
      if (!solvedProblems[i].source) {
        // Find which collection this problem belongs to
        for (const collectionName of collections) {
          try {
            const problemDoc = await getDoc(doc(firestore, collectionName, solvedProblems[i].id));
            if (problemDoc.exists()) {
              solvedProblems[i].source = collectionName;
              break;
            }
          } catch (err) {
            // Skip if error
          }
        }
        
        // Default to "problems" if not found
        if (!solvedProblems[i].source) {
          solvedProblems[i].source = "problems";
        }
      }
    }

    // Calculate solved totals by difficulty
    const totalSolved = solvedProblems.length;
    const easySolved = solvedProblems.filter((p) => p.difficulty === "easy").length;
    const mediumSolved = solvedProblems.filter((p) => p.difficulty === "medium").length;
    const hardSolved = solvedProblems.filter((p) => p.difficulty === "hard").length;

    // Calculate solved totals by collection
    const solvedByCollection = {
      neetcode150: solvedProblems.filter(p => p.source === "neetcode150").length,
      striver150: solvedProblems.filter(p => p.source === "striver150").length,
      gfg150: solvedProblems.filter(p => p.source === "gfg150").length,
      problems: solvedProblems.filter(p => p.source === "problems").length,
    };

    // Calculate completion percentages
    const completionPercentage = {
      overall: totalProblems > 0 ? (totalSolved / totalProblems) * 100 : 0,
      neetcode150: totalByCollection.neetcode150 > 0 ? 
        (solvedByCollection.neetcode150 / totalByCollection.neetcode150) * 100 : 0,
      striver150: totalByCollection.striver150 > 0 ? 
        (solvedByCollection.striver150 / totalByCollection.striver150) * 100 : 0,
      gfg150: totalByCollection.gfg150 > 0 ? 
        (solvedByCollection.gfg150 / totalByCollection.gfg150) * 100 : 0,
    };

    // Recent activity
    const recent = solvedProblems
      .sort(
        (a, b) =>
          new Date(b.solvedAt).getTime() - new Date(a.solvedAt).getTime()
      )
      .slice(0, 5);

    const recentActivity = await Promise.all(
      recent.map(async (item) => {
        // Try to find problem details from its source collection
        let problemName = "Unknown";
        let source = item.source || "problems";
        
        try {
          const problemDoc = await getDoc(doc(firestore, source, item.id));
          if (problemDoc.exists()) {
            problemName = problemDoc.data()?.title || "Unknown";
          }
        } catch (err) {
          console.warn(`Error fetching problem details from ${source}:`, err);
        }
        
        return {
          problemId: item.id,
          problemName,
          source,
          timestamp: formatDistanceToNow(new Date(item.solvedAt), {
            addSuffix: true,
          }),
        };
      })
    );

    return {
      // Overall stats
      totalSolved,
      totalProblems,
      easySolved,
      totalEasy,
      mediumSolved, 
      totalMedium,
      hardSolved,
      totalHard,
      
      // Collection-specific stats
      collections: {
        neetcode150: {
          total: totalByCollection.neetcode150,
          solved: solvedByCollection.neetcode150,
          completion: completionPercentage.neetcode150.toFixed(1),
        },
        striver150: {
          total: totalByCollection.striver150,
          solved: solvedByCollection.striver150,
          completion: completionPercentage.striver150.toFixed(1),
        },
        gfg150: {
          total: totalByCollection.gfg150,
          solved: solvedByCollection.gfg150,
          completion: completionPercentage.gfg150.toFixed(1),
        },
        problems: {
          total: totalByCollection.problems,
          solved: solvedByCollection.problems,
          completion: totalByCollection.problems > 0 ? 
            ((solvedByCollection.problems / totalByCollection.problems) * 100).toFixed(1) : "0.0",
        }
      },
      
      // Recent activity with source information
      recentActivity,
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

/**
 * Get a user's progress for a specific collection
 */
export async function getUserCollectionProgress(userId: string, collectionName: string) {
  try {
    // Get all problems in the collection
    const problemsSnap = await getDocs(collection(firestore, collectionName));
    const problems = problemsSnap.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as { difficulty: "easy" | "medium" | "hard" }),
    }));
    
    // Get user's solved problems
    const solvedSnap = await getDocs(collection(firestore, "users", userId, "solvedProblems"));
    const solvedIds = solvedSnap.docs.map(doc => doc.id);
    
    // Mark problems as solved/unsolved
    const progressData = problems.map(problem => ({
      ...problem,
      solved: solvedIds.includes(problem.id),
    }));
    
    // Calculate statistics
    const totalProblems = problems.length;
    const solvedCount = progressData.filter(p => p.solved).length;
    
    return {
      problems: progressData,
      stats: {
        total: totalProblems,
        solved: solvedCount,
        completion: totalProblems > 0 ? (solvedCount / totalProblems * 100).toFixed(1) : "0.0"
      }
    };
  } catch (error) {
    console.error(`Error fetching user progress for ${collectionName}:`, error);
    throw error;
  }
}