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
  <div className={`rounded-lg border border-dark-divider-border-2 bg-dark-layer-1 p-4 ${className}`}>{children}</div>
);

export const btn =
  "inline-flex items-center justify-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-blue-s disabled:opacity-50";
export const btnGhost = `${btn} bg-dark-fill-3 text-dark-label-2 hover:bg-dark-fill-2`;
export const btnPrimary = `${btn} bg-dark-green-s text-white hover:opacity-90`;
export const inputCls =
  "w-full rounded-lg border border-dark-divider-border-2 bg-dark-layer-2 px-3 py-2 text-sm text-dark-gray-8 placeholder:text-dark-gray-6 focus:outline-none focus:ring-2 focus:ring-dark-blue-s";
