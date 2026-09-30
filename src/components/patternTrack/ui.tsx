import React from "react";
import type { LogDifficulty } from "@/lib/patternTrack/stats";
import { MASTERED_STAGE } from "@/lib/patternTrack/srs";

const DIFF: Record<LogDifficulty, { label: string; cls: string }> = {
  E: { label: "Easy", cls: "text-dark-green-s bg-dark-green-s/10" },
  M: { label: "Medium", cls: "text-dark-yellow bg-dark-yellow/10" },
  H: { label: "Hard", cls: "text-dark-pink bg-dark-pink/10" },
};

export const DifficultyChip: React.FC<{ d: LogDifficulty }> = ({ d }) => (
  <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${DIFF[d].cls}`}>{DIFF[d].label}</span>
);

export const StageDots: React.FC<{ stage: number }> = ({ stage }) => (
  <span className="inline-flex gap-1" aria-label={`Review stage ${stage} of ${MASTERED_STAGE}`}>
    {Array.from({ length: MASTERED_STAGE }, (_, i) => (
      <span key={i} className={`h-2 w-2 rounded-full ${i < stage ? "bg-dark-green-s" : "bg-dark-fill-2"}`} />
    ))}
  </span>
);

export const Bar: React.FC<{ value: number; total: number }> = ({ value, total }) => (
  <div className="h-1.5 w-full overflow-hidden rounded-full bg-dark-fill-3">
    <div
      className="h-full rounded-full bg-dark-green-s transition-all"
      style={{ width: `${total ? Math.min(100, (100 * value) / total) : 0}%` }}
    />
  </div>
);

export const Panel: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`rounded-xl border border-gray-800 bg-gray-900/50 p-4 backdrop-blur-sm ${className}`}>{children}</div>
);

export const btn =
  "inline-flex items-center justify-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-blue-s disabled:opacity-50";
export const btnGhost = `${btn} bg-dark-fill-3 text-dark-label-2 hover:bg-dark-fill-2`;
export const btnPrimary = `${btn} bg-dark-green-s text-white hover:opacity-90`;
/** The old dashboard's gradient call-to-action. */
export const btnGradient = `${btn} bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700`;
export const inputCls =
  "w-full rounded-lg border border-gray-800 bg-black/40 px-3 py-2 text-sm text-dark-gray-8 placeholder:text-dark-gray-6 focus:outline-none focus:ring-2 focus:ring-dark-blue-s";

export const StatTile: React.FC<{ label: string; value: React.ReactNode; hint?: string }> = ({ label, value, hint }) => (
  <Panel>
    <div className="text-2xl font-semibold text-dark-gray-8">{value}</div>
    <div className="text-xs text-dark-gray-6">{label}</div>
    {hint && <div className="mt-1 text-[11px] text-dark-gray-6">{hint}</div>}
  </Panel>
);

export const PatternChip: React.FC<{ week: number; name: string; className?: string }> = ({ week, name, className = "" }) => (
  <span className={`inline-flex items-center gap-1 rounded bg-dark-fill-3 px-2 py-0.5 text-xs text-dark-label-2 ${className}`}>
    <span className="text-dark-gray-6">{week === 18 ? "Wk 18+" : `Wk ${week}`}</span>
    {name}
  </span>
);

export const EmptyState: React.FC<{ children: React.ReactNode; action?: React.ReactNode }> = ({ children, action }) => (
  <Panel>
    <p className="text-sm text-dark-label-2">{children}</p>
    {action && <div className="mt-3">{action}</div>}
  </Panel>
);

/** Section heading with a colored icon, as on the original dashboard. */
export const SectionTitle: React.FC<{ icon: React.ReactNode; children: React.ReactNode; action?: React.ReactNode }> = ({ icon, children, action }) => (
  <div className="mb-3 flex items-center justify-between gap-2">
    <h2 className="flex items-center gap-2 text-xl font-bold text-white">
      <span aria-hidden="true">{icon}</span>
      {children}
    </h2>
    {action}
  </div>
);

/** A load failure with a way out. */
export const ErrorState: React.FC<{ what?: string; onRetry?: () => void }> = ({ what = "your log", onRetry }) => (
  <Panel>
    <div role="alert" className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-dark-label-2">
        Couldn&apos;t load {what}. Check your connection{onRetry ? " and try again" : ", then refresh"}.
      </p>
      {onRetry && <button className={btnGhost} onClick={onRetry}>Try again</button>}
    </div>
  </Panel>
);
