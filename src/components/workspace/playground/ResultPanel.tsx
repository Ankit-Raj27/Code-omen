import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Check, CircleAlert, X } from "lucide-react";
import { VERDICT_LABEL, type CaseResult, type RunSummary } from "@/lib/runResults";
import type { ProblemRow } from "@/lib/problemList";

const MARK: Record<CaseResult["status"], { icon: React.ReactNode; cls: string; word: string }> = {
  pass: { icon: <Check size={14} aria-hidden="true" />, cls: "text-[#2cbb5d] border-[#2cbb5d]/40", word: "passed" },
  fail: { icon: <X size={14} aria-hidden="true" />, cls: "text-dark-pink border-dark-pink/40", word: "failed" },
  error: { icon: <CircleAlert size={14} aria-hidden="true" />, cls: "text-dark-yellow border-dark-yellow/40", word: "crashed" },
};

const Field: React.FC<{ label: string; value?: string; tone?: string }> = ({ label, value, tone = "text-dark-gray-8" }) =>
  value === undefined ? null : (
    <div>
      <p className="mb-1 text-xs text-dark-gray-6">{label}</p>
      <pre className={`max-h-40 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-white/[0.05] px-3 py-2 font-mono text-[13px] ${tone}`}>{value}</pre>
    </div>
  );

type Props = {
  summary: RunSummary | null;
  running: boolean;
  mode: "run" | "submit";
  /** Shown after an accepted submit. */
  next?: ProblemRow;
  canLog: boolean;
  onLog: () => void;
};

/** Verdict and per-case detail for the last run. */
const ResultPanel: React.FC<Props> = ({ summary, running, mode, next, canLog, onLog }) => {
  const [selected, setSelected] = useState(0);
  // Open the first case that didn't pass.
  useEffect(() => {
    const i = summary?.cases.findIndex((c) => c.status !== "pass") ?? -1;
    setSelected(i < 0 ? 0 : i);
  }, [summary]);

  if (running) {
    return (
      <p className="flex items-center gap-2 py-4 text-sm text-dark-gray-7" role="status">
        <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/20 border-t-white motion-reduce:animate-none" aria-hidden="true" />
        Running your code…
      </p>
    );
  }
  if (!summary) {
    return (
      <p className="py-4 text-sm text-dark-gray-6">
        Run your code to see each test case here. <kbd className="rounded bg-white/10 px-1">Ctrl</kbd>+<kbd className="rounded bg-white/10 px-1">Enter</kbd> runs,
        adding <kbd className="rounded bg-white/10 px-1">Shift</kbd> submits.
      </p>
    );
  }

  const accepted = summary.verdict === "accepted";
  const c = summary.cases[selected];
  return (
    <div className="space-y-4 py-3" role="status" aria-live="polite">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <h3 className={`text-xl font-semibold ${accepted ? "text-[#2cbb5d]" : "text-dark-pink"}`}>{VERDICT_LABEL[summary.verdict]}</h3>
        {summary.total > 0 && summary.cases.length > 0 && (
          <span className="text-sm tabular-nums text-dark-gray-7">{summary.passed} of {summary.total} cases passed</span>
        )}
        {summary.ms !== undefined && <span className="text-sm tabular-nums text-dark-gray-6">{Math.round(summary.ms)} ms</span>}
        <span className="text-sm text-dark-gray-6">{summary.language === "java" ? "Java 13" : "JavaScript"}</span>
      </div>

      {accepted && mode === "run" && <p className="text-sm text-dark-gray-7">All tests pass. Submit to record the solve.</p>}
      {accepted && mode === "submit" && (canLog || next) && (
        <div className="flex flex-wrap gap-2">
          {canLog && (
            <button type="button" onClick={onLog} className="min-h-[36px] rounded-lg bg-green-700 px-4 text-sm font-medium text-white hover:bg-green-600">
              Log it to Pattern Track
            </button>
          )}
          {next && (
            <Link href={next.href} className="inline-flex min-h-[36px] items-center rounded-lg bg-white/10 px-4 text-sm text-white hover:bg-white/20">
              Next in this pattern: {next.title}
            </Link>
          )}
        </div>
      )}

      {summary.cases.length > 0 && (
        <div role="group" aria-label="Test cases" className="flex flex-wrap gap-1.5">
          {summary.cases.map((k, i) => (
            <button key={k.index} type="button" aria-pressed={i === selected} onClick={() => setSelected(i)}
              aria-label={`Case ${k.index} ${MARK[k.status].word}`}
              className={`inline-flex min-h-[32px] items-center gap-1 rounded-lg border px-2.5 text-sm ${MARK[k.status].cls} ${
                i === selected ? "bg-white/10" : "border-transparent bg-white/[0.04]"
              }`}>
              {MARK[k.status].icon} {k.index}
            </button>
          ))}
        </div>
      )}

      {c && (
        <div className="space-y-3">
          <Field label="Input" value={c.input} />
          {c.status === "fail" && <Field label="Your output" value={c.got} tone="text-dark-pink" />}
          {c.status !== "error" && <Field label="Expected" value={c.expected} tone="text-[#2cbb5d]" />}
          {c.status === "error" && <Field label="Error" value={c.message} tone="text-dark-yellow" />}
        </div>
      )}

      {summary.message && <Field label={summary.verdict === "compile_error" ? "Compiler output" : "Details"} value={summary.message} />}
    </div>
  );
};

export default ResultPanel;
