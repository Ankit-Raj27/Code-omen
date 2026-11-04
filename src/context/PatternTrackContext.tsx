import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/Firebase/firebase";
import { DEFAULT_START_DATE } from "@/content/patterns";
import { todayLocal, type Ymd } from "@/lib/patternTrack/dates";
import { getSettings, subscribeLogs, type EditorLanguagePref } from "@/lib/patternTrack/firestore";
import { defaultStartDate, type LogEntry } from "@/lib/patternTrack/stats";

interface PatternTrackState {
  user: User | null | undefined;
  logs: LogEntry[];
  startDate: Ymd;
  setStartDateState: (d: Ymd) => void;
  /** Streak counts only activity after this day (null = never reset). */
  streakResetDate: Ymd | null;
  setStreakResetDateState: (d: Ymd | null) => void;
  today: Ymd;
  /** Saved default editor language (null = never set). */
  preferredLanguage: EditorLanguagePref | null;
  setPreferredLanguageState: (l: EditorLanguagePref) => void;
  /** True until Firebase Auth has resolved the session. */
  authLoading: boolean;
  loading: boolean;
  error: Error | null;
  /** Re-subscribe after an error. */
  retry: () => void;
}

const PatternTrackContext = createContext<PatternTrackState | null>(null);

/** Local "today", refreshed each minute and on focus so the queue rolls over at local midnight. */
function useTodayClock(): Ymd {
  const [today, setToday] = useState<Ymd>(() => todayLocal());
  useEffect(() => {
    const tick = () => setToday(todayLocal());
    const id = setInterval(tick, 60_000);
    window.addEventListener("focus", tick);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", tick);
    };
  }, []);
  return today;
}

/** One Firestore subscription to the signed-in user's log, shared by every page. */
export function PatternTrackProvider({ children }: { children: React.ReactNode }) {
  const [user, authLoading] = useAuthState(auth);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [startDate, setStartDateState] = useState<Ymd>(DEFAULT_START_DATE);
  const [streakResetDate, setStreakResetDateState] = useState<Ymd | null>(null);
  const [preferredLanguage, setPreferredLanguageState] = useState<EditorLanguagePref | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [attempt, setAttempt] = useState(0);
  const today = useTodayClock();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLogs([]);
      setStartDateState(DEFAULT_START_DATE);
      setStreakResetDateState(null);
      setPreferredLanguageState(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    // Until settings load (and when none is saved), each account starts on its creation day.
    const accountStart = defaultStartDate(user.metadata.creationTime);
    setStartDateState(accountStart);
    setStreakResetDateState(null);
    getSettings(user.uid, accountStart)
      .then((s) => {
        setStartDateState(s.startDate);
        setStreakResetDateState(s.streakResetDate);
        setPreferredLanguageState(s.preferredLanguage);
        // The editor reads its language from localStorage ("cd-language"); seed it from
        // the saved preference so it follows the user across devices.
        if (s.preferredLanguage) {
          try {
            window.localStorage.setItem("cd-language", JSON.stringify(s.preferredLanguage));
          } catch {
            /* storage unavailable */
          }
        }
      })
      .catch(() => {});
    return subscribeLogs(
      user.uid,
      (l) => {
        setLogs(l);
        setLoading(false);
      },
      (e) => {
        setError(e);
        setLoading(false);
      },
    );
  }, [user, authLoading, attempt]);

  const value = useMemo(
    () => ({
      user, logs, startDate, setStartDateState, streakResetDate, setStreakResetDateState,
      today, preferredLanguage, setPreferredLanguageState,
      authLoading, loading: authLoading || loading, error, retry: () => setAttempt((n) => n + 1),
    }),
    [user, logs, startDate, streakResetDate, today, preferredLanguage, authLoading, loading, error],
  );
  return <PatternTrackContext.Provider value={value}>{children}</PatternTrackContext.Provider>;
}

export function usePatternTrack(): PatternTrackState {
  const ctx = useContext(PatternTrackContext);
  if (!ctx) throw new Error("usePatternTrack must be used inside PatternTrackProvider");
  return ctx;
}

export function useToday(): Ymd {
  return usePatternTrack().today;
}
