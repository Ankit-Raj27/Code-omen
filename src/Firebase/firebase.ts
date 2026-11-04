import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager, type Firestore } from "firebase/firestore";

/**
 * Redirect sign-in only survives when Firebase's auth handler is on our own origin:
 * browsers drop the cross-site state from *.firebaseapp.com, so the user lands back
 * signed out. On these hosts the handler is served via the /__/auth rewrite in
 * next.config.mjs (its /__/auth/handler URL must be an authorized redirect URI on the
 * Google OAuth client).
 */
const SAME_ORIGIN_AUTH_HOSTS = ["codeomen.vercel.app"];
const authDomain =
  typeof window !== "undefined" && SAME_ORIGIN_AUTH_HOSTS.includes(window.location.host)
    ? window.location.host
    : process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize 
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

/**
 * In the browser, keep an IndexedDB cache shared across tabs: pages render from it
 * instantly, and reviews graded offline are applied locally and sync later.
 * The server render (and a second init during hot reload) uses the default instance.
 */
function makeFirestore(): Firestore {
  if (typeof window === "undefined") return getFirestore(app);
  try {
    return initializeFirestore(app, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) });
  } catch {
    return getFirestore(app);
  }
}
const firestore = makeFirestore();

export { app, auth, firestore };
