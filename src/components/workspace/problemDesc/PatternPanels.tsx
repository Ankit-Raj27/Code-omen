import React, { useState } from "react";
import Link from "next/link";
import { KEY_INSIGHTS } from "@/content/insights";
import { GUIDES } from "@/content/guides";
import { LEETCODE_URL, PATTERN_BY_ID } from "@/content/patterns";
import { usePatternTrack } from "@/context/PatternTrackContext";
import { currentBankKey, patternIdForBank } from "@/lib/patternTrack/bank";
import { isMastered } from "@/lib/patternTrack/srs";
import { sortNewestFirst, urlMatchesSlug } from "@/lib/patternTrack/stats";
import { DifficultyChip, StageDots } from "@/components/patternTrack/ui";
import { useWorkspaceSession } from "../WorkspaceSession";

const HINTS = [
  { n: 1, title: "Nudge", help: "A question to ask yourself about this problem." },
  { n: 2, title: "Direction", help: "The approach and what it needs to track here." },
  { n: 3, title: "Key idea", help: "The idea that cracks it, with the rule to maintain." },
];

/**
 * Pattern tab: how to think about this specific question, then a 3-step hint ladder
 * written for it. Anything past the open framing marks the attempt as "needed help".
 */
export const PatternPanel: React.FC<{ bankKey: string }> = ({ bankKey }) => {
  const session = useWorkspaceSession();
  const key = currentBankKey(bankKey);
  const pattern = PATTERN_BY_ID[patternIdForBank(key) ?? ""];
  const guide = GUIDES[key];
  const used = session?.hintsUsed ?? 0;
  // Problems without a written guide fall back to the pattern's signal and template.
  const content = guide?.hints ?? [pattern?.signal, pattern?.memorize[0], KEY_INSIGHTS[key]];
  const framing = guide?.approach.slice(0, 2) ?? [];
  const unlock = guide?.approach.slice(2) ?? [];
  const [showUnlock, setShowUnlock] = useState(false);
  const unlockOpen = showUnlock || used >= 2;

  return (
    <div className="space-y-6 px-5 text-sm text-dark-label-2">
      <section aria-labelledby="think-heading">
        <h2 id="think-heading" className="text-base font-semibold text-white">How to think about it</h2>
        <p className="mt-1 text-dark-gray-6">
          Spend 5 minutes on paper first: restate it, write two edge cases, and the brute force with its cost.
        </p>
        {framing.length > 0 && (
          <ul className="mt-3 space-y-2 leading-relaxed text-dark-gray-8">
            {framing.map((t) => <li key={t} className="border-l-2 border-white/10 pl-3">{t}</li>)}
          </ul>
        )}
        {unlock.length > 0 && (
          unlockOpen ? (
            <ul className="mt-2 space-y-2 leading-relaxed text-dark-gray-8">
              {unlock.map((t) => <li key={t} className="border-l-2 border-purple-500/50 pl-3">{t}</li>)}
            </ul>
          ) : (
            <button type="button" disabled={!session}
              onClick={() => { setShowUnlock(true); session?.revealHint(2); }}
              className="mt-3 inline-flex min-h-[36px] items-center rounded-lg bg-dark-fill-3 px-3 text-xs font-medium text-dark-label-2 hover:bg-dark-fill-2 disabled:opacity-40">
              Show the key observation (counts as 2 hints)
            </button>
          )
        )}
      </section>

      <section aria-labelledby="hints-heading">
        <h2 id="hints-heading" className="text-base font-semibold text-white">Hints</h2>
        <ol className="mt-3 space-y-3">
          {HINTS.map((h) => {
            const open = used >= h.n;
            const locked = h.n > used + 1;
            const body = content[h.n - 1];
            return (
              <li key={h.n} className={`rounded-lg border p-3 ${open ? "border-gray-700 bg-gray-900/60" : "border-gray-800"}`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium text-white">Hint {h.n}: {h.title}</div>
                    {!open && <div className="text-xs text-dark-gray-6">{h.help}</div>}
                  </div>
                  {!open && (
                    <button
                      type="button"
                      disabled={locked || !body || !session}
                      onClick={() => session?.revealHint(h.n)}
                      className="min-h-[32px] shrink-0 rounded-lg bg-dark-fill-3 px-3 text-xs font-medium text-dark-label-2 hover:bg-dark-fill-2 disabled:opacity-40"
                      title={locked ? "Open the previous hint first" : undefined}
                    >
                      Show
                    </button>
                  )}
                </div>
                {open && <p className="mt-2 leading-relaxed text-dark-gray-8">{body}</p>}
              </li>
            );
          })}
        </ol>
      </section>

      {used > 0 && (
        <p className="text-xs text-dark-yellow">Hints used: {used}. This attempt will be logged as &ldquo;needed help&rdquo;.</p>
      )}
      <div className="flex flex-wrap items-center gap-x-4">
        {pattern && (
          <Link href={`/patterns/${pattern.id}`} className="inline-flex min-h-[32px] items-center text-xs text-dark-blue-s hover:underline">
            Review the {pattern.name} pattern sheet
          </Link>
        )}
        <a href={LEETCODE_URL(key)} target="_blank" rel="noopener noreferrer"
          className="inline-flex min-h-[32px] items-center text-xs text-dark-blue-s hover:underline">
          Open on LeetCode ↗
        </a>
      </div>
    </div>
  );
};

/** My log tab: your log entries for this problem. Notes start folded so you try to recall the insight first. */
export const MyLogPanel: React.FC<{ bankKey: string }> = ({ bankKey }) => {
  const { user, logs } = usePatternTrack();
  const key = currentBankKey(bankKey);
  if (!user) return <p className="px-5 text-sm text-dark-gray-6">Sign in to see your log for this problem.</p>;
  const mine = sortNewestFirst(logs.filter((l) => currentBankKey(l.bankSlug ?? "") === key || urlMatchesSlug(l.url, key)));
  if (mine.length === 0) {
    return <p className="px-5 text-sm text-dark-gray-6">Not in your log yet. Solve it and you&apos;ll be asked to log it.</p>;
  }
  return (
    <ul className="space-y-2 px-5">
      {mine.map((l) => (
        <li key={l.id} className="rounded-lg border border-gray-800 bg-gray-900/50 p-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-dark-gray-8">{l.dateSolved}</span>
            <DifficultyChip d={l.difficulty} />
            <span className="ml-auto"><StageDots stage={l.stage} /></span>
          </div>
          <div className="mt-1 text-xs text-dark-gray-6">
            {l.minutes} min · {l.solvedSolo ? "solo" : "needed help"}
            {typeof l.hintsUsed === "number" && ` · ${l.hintsUsed} hint${l.hintsUsed === 1 ? "" : "s"}`}
            {l.language && ` · ${l.language === "java" ? "Java" : "JavaScript"}`}
            {" · "}{isMastered(l) ? "mastered" : `next review ${l.nextDue}`}
          </div>
          <details className="group mt-2">
            <summary className="inline-flex min-h-[32px] cursor-pointer list-none items-center rounded px-1 text-xs font-medium text-dark-blue-s hover:underline [&::-webkit-details-marker]:hidden">
              <span className="group-open:hidden">Show my notes</span>
              <span className="hidden group-open:inline">Hide my notes</span>
            </summary>
            <dl className="mt-1 space-y-1.5 text-sm">
              <div><dt className="text-xs text-dark-gray-6">Insight</dt><dd className="text-dark-gray-8">{l.insight}</dd></div>
              {l.stuckOn && <div><dt className="text-xs text-dark-gray-6">Stuck on</dt><dd className="text-dark-gray-7">{l.stuckOn}</dd></div>}
              {l.complexity && <div><dt className="text-xs text-dark-gray-6">Complexity</dt><dd className="text-dark-gray-7">{l.complexity}</dd></div>}
            </dl>
          </details>
        </li>
      ))}
    </ul>
  );
};
