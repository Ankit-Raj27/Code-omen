import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import { auth } from "@/Firebase/firebase";
import { prefillForBank } from "@/lib/patternTrack/bank";
import { todayLocal } from "@/lib/patternTrack/dates";
import LogForm from "./LogForm";
import { btnGhost } from "./ui";

/** "Log to Pattern Track" button for a code-omen bank problem page. */
const LogProblemButton: React.FC<{ bankKey: string }> = ({ bankKey }) => {
  const [user] = useAuthState(auth);
  const [open, setOpen] = useState(false);
  const prefill = prefillForBank(bankKey);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!prefill) return null;

  const onClick = () => {
    if (!user) {
      toast.error("Log in to use Pattern Track", { position: "top-left", theme: "dark" });
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <button className={`${btnGhost} shrink-0 text-xs`} onClick={onClick}>+ Log to Pattern Track</button>
      {open && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setOpen(false)}>
          <div role="dialog" aria-modal="true" aria-label="Log problem"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-gray-800 bg-gray-900 p-5"
            onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-medium text-dark-gray-8">Log to Pattern Track</h2>
              <button className="text-dark-gray-6 hover:text-dark-gray-8" onClick={() => setOpen(false)} aria-label="Close">✕</button>
            </div>
            <LogForm uid={user.uid} today={todayLocal()} prefill={prefill} onSaved={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default LogProblemButton;
