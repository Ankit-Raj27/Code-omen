import { useCallback, useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import type { User } from "firebase/auth";
import { firestore } from "@/Firebase/firebase";
import type { SheetDoc } from "@/lib/problemList";

/** Problems solved in CodeOmen's editor (users/{uid}.solvedProblems). */
export function useSolvedIds(user: User | null | undefined): string[] {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    if (!user) { setIds([]); return; }
    let live = true;
    getDoc(doc(firestore, "users", user.uid))
      .then((s) => live && setIds((s.data()?.solvedProblems as string[]) ?? []))
      .catch(() => live && setIds([]));
    return () => { live = false; };
  }, [user]);
  return ids;
}

/** A sheet's problems from its Firestore collection, with loading, error and retry. */
export function useSheetDocs(collectionName: string) {
  const [docs, setDocs] = useState<SheetDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  useEffect(() => {
    let live = true;
    setLoading(true);
    setError(null);
    getDocs(query(collection(firestore, collectionName), orderBy("order", "asc")))
      .then((snap) => {
        if (!live) return;
        // An empty answer from the offline cache means we never reached Firestore.
        if (snap.empty && snap.metadata.fromCache) throw new Error("offline");
        setDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as SheetDoc));
      })
      .catch((e: Error) => live && setError(e))
      .finally(() => live && setLoading(false));
    return () => { live = false; };
  }, [collectionName, attempt]);

  return { docs, loading, error, retry };
}
