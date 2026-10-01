import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { usePatternTrack } from "@/context/PatternTrackContext";
import { currentBankKey, prefillForBank } from "@/lib/patternTrack/bank";
import { urlMatchesSlug } from "@/lib/patternTrack/stats";
export { TIMEBOX_MIN, EXTENSION_MIN, loggedMinutes, timeboxPhase, type TimeboxPhase } from "@/lib/patternTrack/session";


export type EditorLang = "javascript" | "java";

interface SessionState {
  bankKey: string;
  /** Highest hint opened so far (0 = none, max 3). */
  hintsUsed: number;
  revealHint: (n: number) => void;
  /** Timer: seconds elapsed while running. */
  elapsed: number;
  running: boolean;
  extended: boolean;
  startTimer: () => void;
  resetTimer: () => void;
  extendTimer: () => void;
  /** Called by the editor when all tests pass. */
  onAccepted: (language: EditorLang) => void;
  /** Log slide-over state (opened on Accepted). */
  logOpen: boolean;
  acceptedLanguage: EditorLang | null;
  closeLog: () => void;
  /** Reopen the log form (e.g. from the result panel after closing it). */
  openLog: () => void;
  alreadyLogged: boolean;
}

const Ctx = createContext<SessionState | null>(null);

/** Per-problem solving session: hint ladder, timebox and log-on-accept. */
export function WorkspaceSessionProvider({ bankKey, children }: { bankKey: string; children: React.ReactNode }) {
  const { user, logs } = usePatternTrack();
  const [hintsUsed, setHintsUsed] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [extended, setExtended] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [acceptedLanguage, setAcceptedLanguage] = useState<EditorLang | null>(null);

  // New problem → fresh session.
  useEffect(() => {
    setHintsUsed(0);
    setElapsed(0);
    setRunning(false);
    setExtended(false);
    setLogOpen(false);
    setAcceptedLanguage(null);
  }, [bankKey]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const key = currentBankKey(bankKey);
  const alreadyLogged = useMemo(
    () => logs.some((l) => l.bankSlug === key || currentBankKey(l.bankSlug ?? "") === key || urlMatchesSlug(l.url, key)),
    [logs, key],
  );

  const onAccepted = useCallback(
    (language: EditorLang) => {
      setRunning(false);
      setAcceptedLanguage(language);
      if (!user || !prefillForBank(key)) return;
      if (alreadyLogged) {
        toast.info("Already in your log — its reviews continue on Today.", { theme: "dark", position: "top-center", autoClose: 3000 });
        return;
      }
      setLogOpen(true);
    },
    [user, key, alreadyLogged],
  );

  const value: SessionState = {
    bankKey: key,
    hintsUsed,
    revealHint: (n) => setHintsUsed((h) => Math.max(h, Math.min(3, n))),
    elapsed,
    running,
    extended,
    startTimer: () => setRunning(true),
    resetTimer: () => {
      setRunning(false);
      setElapsed(0);
      setExtended(false);
    },
    extendTimer: () => setExtended(true),
    onAccepted,
    logOpen,
    acceptedLanguage,
    closeLog: () => setLogOpen(false),
    openLog: () => setLogOpen(true),
    alreadyLogged,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** Null outside a problem page, so shared components can opt in. */
export function useWorkspaceSession(): SessionState | null {
  return useContext(Ctx);
}

