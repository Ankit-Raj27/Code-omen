import React from "react";
import { FiRefreshCcw } from "react-icons/fi";
import {
  EXTENSION_MIN, TIMEBOX_MIN, timeboxPhase, useWorkspaceSession,
} from "@/components/workspace/WorkspaceSession";

const formatTime = (s: number): string => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
};

const PHASE_STYLE = {
  "on-track": "bg-dark-fill-3 text-dark-label-2",
  extended: "bg-dark-yellow/15 text-dark-yellow",
  over: "bg-dark-yellow/15 text-dark-yellow",
  "read-solution": "bg-dark-pink/15 text-dark-pink",
  idle: "",
} as const;

/** Problem timer with the Method's timebox: 25 min, then an optional +10, then read the solution. */
const Timer: React.FC = () => {
  const session = useWorkspaceSession();
  if (!session) return null;
  const { elapsed, running, extended, startTimer, resetTimer, extendTimer } = session;
  const phase = timeboxPhase(elapsed, running, extended);

  if (phase === "idle") {
    return (
      <button
        className="flex h-8 items-center gap-1.5 rounded p-1 text-sm hover:bg-dark-fill-3"
        onClick={startTimer}
        title={`Start a ${TIMEBOX_MIN}-minute timebox`}
        aria-label="Start timer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 4a9 9 0 110 18 9 9 0 010-18zm0 2a7 7 0 100 14 7 7 0 000-14zm0 1.634a1 1 0 01.993.883l.007.117-.001 3.774 2.111 1.162a1 1 0 01.445 1.253l-.05.105a1 1 0 01-1.254.445l-.105-.05-2.628-1.447a1 1 0 01-.51-.756L11 13V8.634a1 1 0 011-1zM16.235 2.4a1 1 0 011.296-.269l.105.07 4 3 .095.08a1 1 0 01-1.19 1.588l-.105-.069-4-3-.096-.081a1 1 0 01-.105-1.319zM7.8 2.4a1 1 0 01-.104 1.319L7.6 3.8l-4 3a1 1 0 01-1.296-1.518L2.4 5.2l4-3a1 1 0 011.4.2z" />
        </svg>
      </button>
    );
  }

  const note =
    phase === "over" ? "Timebox up: take a hint, then +10 min"
      : phase === "extended" ? `+${EXTENSION_MIN} min`
      : phase === "read-solution" ? "Read the solution, then rewrite it from memory"
      : null;

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center gap-2 rounded p-1.5 text-sm ${PHASE_STYLE[phase]}`} aria-live="polite">
        <span className="tabular-nums">{formatTime(elapsed)}</span>
        {note && <span className="hidden text-xs lg:inline">{note}</span>}
        <button onClick={resetTimer} aria-label="Reset timer" className="hover:text-white">
          <FiRefreshCcw />
        </button>
      </div>
      {phase === "over" && (
        <button onClick={extendTimer} className="rounded bg-dark-fill-3 px-2 py-1 text-xs hover:bg-dark-fill-2">
          +{EXTENSION_MIN} min
        </button>
      )}
    </div>
  );
};

export default Timer;
