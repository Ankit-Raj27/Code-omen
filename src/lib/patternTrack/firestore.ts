// Firebase-aware layer for Pattern Track. All scheduling logic lives in srs.ts.
import {
  addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query,
  serverTimestamp, setDoc, updateDoc, type Timestamp,
} from "firebase/firestore";
import { firestore } from "@/Firebase/firebase";
import { DEFAULT_START_DATE } from "@/content/patterns";
import { isYmd, safeHttpUrl, type Ymd } from "./dates";
import { initialSchedule, scheduleNext, type ReviewResult } from "./srs";
import type { LogEntry } from "./stats";

export type NewLog = Omit<LogEntry, "id" | "stage" | "nextDue" | "reviews" | "createdAtMs">;

const logsCol = (uid: string) => collection(firestore, "users", uid, "logs");

export function subscribeLogs(
  uid: string,
  onData: (logs: LogEntry[]) => void,
  onError: (e: Error) => void,
): () => void {
  return onSnapshot(
    query(logsCol(uid), orderBy("createdAt", "desc")),
    (snap) =>
      onData(
        snap.docs.map((d) => {
          const data = d.data();
          const ts = data.createdAt as Timestamp | null;
          return { ...(data as Omit<LogEntry, "id">), id: d.id, createdAtMs: ts?.toMillis?.() ?? Date.now() };
        }),
      ),
    onError,
  );
}

export async function addLog(uid: string, input: NewLog): Promise<void> {
  if (!isYmd(input.dateSolved)) throw new Error("Invalid date");
  const data: Record<string, unknown> = {
    name: input.name.trim(),
    url: safeHttpUrl(input.url),
    patternId: input.patternId,
    difficulty: input.difficulty,
    solvedSolo: input.solvedSolo,
    minutes: Math.max(0, Math.round(input.minutes)),
    dateSolved: input.dateSolved,
    insight: input.insight.trim(),
    stuckOn: input.stuckOn.trim(),
    complexity: input.complexity.trim(),
    ...initialSchedule(input.dateSolved),
    createdAt: serverTimestamp(),
  };
  if (input.bankSlug) data.bankSlug = input.bankSlug;
  if (typeof input.hintsUsed === "number") data.hintsUsed = Math.max(0, Math.min(3, Math.round(input.hintsUsed)));
  if (input.language === "js" || input.language === "java") data.language = input.language;
  await addDoc(logsCol(uid), data);
}

export async function gradeLog(uid: string, entry: LogEntry, result: ReviewResult, today: Ymd): Promise<void> {
  const next = scheduleNext(entry, result, today);
  await updateDoc(doc(firestore, "users", uid, "logs", entry.id), { ...next });
}

export async function deleteLog(uid: string, id: string): Promise<void> {
  await deleteDoc(doc(firestore, "users", uid, "logs", id));
}

export type EditorLanguagePref = "javascript" | "java";

export interface TrackSettings {
  startDate: Ymd;
  preferredLanguage: EditorLanguagePref | null;
}

/** Pattern Track settings from users/{uid}.patternTrack (defaults when missing). */
export async function getSettings(uid: string): Promise<TrackSettings> {
  const snap = await getDoc(doc(firestore, "users", uid));
  const pt = snap.data()?.patternTrack ?? {};
  return {
    startDate: typeof pt.startDate === "string" && isYmd(pt.startDate) ? pt.startDate : DEFAULT_START_DATE,
    preferredLanguage: pt.preferredLanguage === "java" || pt.preferredLanguage === "javascript" ? pt.preferredLanguage : null,
  };
}

export async function getStartDate(uid: string): Promise<Ymd> {
  return (await getSettings(uid)).startDate;
}

export async function setStartDate(uid: string, startDate: Ymd): Promise<void> {
  if (!isYmd(startDate)) throw new Error("Invalid date");
  await setDoc(doc(firestore, "users", uid), { patternTrack: { startDate } }, { merge: true });
}

export async function setPreferredLanguage(uid: string, preferredLanguage: EditorLanguagePref): Promise<void> {
  await setDoc(doc(firestore, "users", uid), { patternTrack: { preferredLanguage } }, { merge: true });
}
