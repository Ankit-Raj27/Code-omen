import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/Firebase/firebase";
import { DEFAULT_START_DATE } from "@/content/patterns";
import { todayLocal, type Ymd } from "@/lib/patternTrack/dates";
import { getStartDate, subscribeLogs } from "@/lib/patternTrack/firestore";
import type { LogEntry } from "@/lib/patternTrack/stats";

/** Local "today", refreshed each minute so the queue rolls over at local midnight. */
export function useToday(): Ymd {
  const [today, setToday] = useState<Ymd>(() => todayLocal());
  useEffect(() => {
    const id = setInterval(() => setToday(todayLocal()), 60_000);
    const onFocus = () => setToday(todayLocal());
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, []);
  return today;
}

export function usePatternTrack() {
  const [user, authLoading] = useAuthState(auth);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [startDate, setStartDateState] = useState<Ymd>(DEFAULT_START_DATE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLogs([]);
      setLoading(false);
      return;
    }
    setLoading(true);
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

  return { user, logs, startDate, setStartDateState, loading: authLoading || loading, error };
}
