import { GoogleAuthProvider, getRedirectResult, signInWithPopup, signInWithRedirect, type User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, firestore } from "@/Firebase/firebase";
import { shouldFallbackToRedirect } from "./googleAuthErrors";

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

/** Create users/{uid} on first Google sign-in (same shape as email sign-up). */
export async function ensureUserDoc(user: User) {
  const ref = doc(firestore, "users", user.uid);
  if ((await getDoc(ref)).exists()) return;
  await setDoc(ref, {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || "Anonymous",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    likedProblems: [],
    dislikedProblems: [],
    solvedProblems: [],
    starredProblems: [],
  });
}

/**
 * Google sign-in: popup first; if the browser blocks popups (blockers, in-app and
 * embedded browsers) fall back to a full-page redirect. Returns the user for the popup
 * path, or null when the page is redirecting (finishGoogleRedirect picks it up on return).
 * Throws the FirebaseError for anything else.
 */
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const { user } = await signInWithPopup(auth, provider);
    await ensureUserDoc(user);
    return user;
  } catch (e: any) {
    if (shouldFallbackToRedirect(e?.code)) {
      await signInWithRedirect(auth, provider);
      return null;
    }
    throw e;
  }
}

/** Call once on app load: completes a redirect sign-in, if one is pending. */
export async function finishGoogleRedirect(): Promise<User | null> {
  const result = await getRedirectResult(auth);
  if (!result) return null;
  await ensureUserDoc(result.user);
  return result.user;
}
