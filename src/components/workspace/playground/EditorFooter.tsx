import React from "react";
import { Play, Send } from "lucide-react";

type EditorFooterProps = {
  onRun: () => void;
  onSubmit: () => void;
  running: boolean;
};

/** Run checks your code against the tests; Submit also records the solve. */
const EditorFooter: React.FC<EditorFooterProps> = ({ onRun, onSubmit, running }) => (
  <div className="flex h-14 shrink-0 items-center gap-3 border-t border-white/[0.06] bg-dark-layer-2 px-4">
    <p className="hidden text-xs text-dark-gray-6 lg:block">
      <kbd className="rounded bg-white/10 px-1">Ctrl</kbd>+<kbd className="rounded bg-white/10 px-1">Enter</kbd> run
      <span className="mx-2 text-white/20">|</span>
      <kbd className="rounded bg-white/10 px-1">Ctrl</kbd>+<kbd className="rounded bg-white/10 px-1">Shift</kbd>+<kbd className="rounded bg-white/10 px-1">Enter</kbd> submit
    </p>
    <div className="ml-auto flex items-center gap-2">
      <button type="button" onClick={onRun} disabled={running}
        className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-white/10 px-4 text-sm font-medium text-white hover:bg-white/15 disabled:opacity-50">
        <Play size={15} aria-hidden="true" /> Run
      </button>
      <button type="button" onClick={onSubmit} disabled={running}
        className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-green-700 px-4 text-sm font-medium text-white hover:bg-green-600 disabled:opacity-50">
        <Send size={15} aria-hidden="true" /> Submit
      </button>
    </div>
  </div>
);
export default EditorFooter;
