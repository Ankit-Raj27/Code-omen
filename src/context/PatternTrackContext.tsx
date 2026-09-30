import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/Firebase/firebase";
import { DEFAULT_START_DATE } from "@/content/patterns";
import { todayLocal, type Ymd } from "@/lib/patternTrack/dates";
import { getStartDate, subscribeLogs } from "@/lib/patternTrack/firestore";
import type { LogEntry } from "@/lib/patternTrack/stats";

interface PatternTrackState {
  user: User | null | undefined;
  logs: LogEntry[];
  startDate: Ymd;
  setStartDateState: (d: Ymd) => void;
  today: Ymd;
  /** True until Firebase Auth has resolved the session. */
  authLoading: boolean;
  loading: boolean;
  error: Error | null;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const today = useTodayClock();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLogs([]);
      setStartDateState(DEFAULT_START_DATE);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    getStartDate(user.uid).then(setStartDateState).catch(() => {});
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
  }, [user, authLoading]);

  const value = useMemo(
    () => ({ user, logs, startDate, setStartDateState, today, authLoading, loading: authLoading || loading, error }),
    [user, logs, startDate, today, authLoading, loading, error],
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
