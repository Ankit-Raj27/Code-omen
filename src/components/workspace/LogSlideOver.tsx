import React, { useEffect } from "react";
import LogForm from "@/components/patternTrack/LogForm";
import { usePatternTrack } from "@/context/PatternTrackContext";
import { prefillForBank } from "@/lib/patternTrack/bank";
import { loggedMinutes, useWorkspaceSession } from "./WorkspaceSession";

/** Slide-over log form shown after an Accepted run, prefilled from the session. */
const LogSlideOver: React.FC = () => {
  const session = useWorkspaceSession();
  const { user, today } = usePatternTrack();

  useEffect(() => {
    if (!session?.logOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && session.closeLog();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [session]);

  if (!session?.logOpen || !user) return null;
  const prefill = prefillForBank(session.bankKey);
  if (!prefill) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={session.closeLog}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Log this problem"
        onClick={(e) => e.stopPropagation()}
        className="h-full w-full max-w-lg overflow-y-auto border-l border-gray-800 bg-gray-950 p-6 shadow-2xl"
      >
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Accepted — log it</h2>
          <button onClick={session.closeLog} aria-label="Close" className="text-dark-gray-6 hover:text-white">✕</button>
        </div>
        <p className="mb-5 text-sm text-gray-400">
          Write the one line you&apos;d want to recall in 3 weeks. The first review is tomorrow.
        </p>
        <LogForm
          uid={user.uid}
          today={today}
          prefill={prefill}
          initial={{ minutes: loggedMinutes(session.elapsed), solvedSolo: session.hintsUsed === 0 }}
          extra={{ hintsUsed: session.hintsUsed, language: session.acceptedLanguage === "java" ? "java" : "js" }}
          onSaved={session.closeLog}
        />
      </aside>
    </div>
  );
};

export default LogSlideOver;
