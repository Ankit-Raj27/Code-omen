import React from "react";
import Link from "next/link";
import { KEY_INSIGHTS } from "@/content/insights";
import { PATTERN_BY_ID } from "@/content/patterns";
import { usePatternTrack } from "@/context/PatternTrackContext";
import { currentBankKey, patternIdForBank } from "@/lib/patternTrack/bank";
import { isMastered } from "@/lib/patternTrack/srs";
import { sortNewestFirst, urlMatchesSlug } from "@/lib/patternTrack/stats";
import { DifficultyChip, StageDots } from "@/components/patternTrack/ui";
import { useWorkspaceSession } from "../WorkspaceSession";

const HINTS = [
  { n: 1, title: "Which pattern?", help: "The recognition signal. Try naming the approach before opening the next hint." },
  { n: 2, title: "The template", help: "The pattern's core template and its invariant." },
  { n: 3, title: "Key insight", help: "The one idea that cracks this problem." },
];

/** Pattern tab: what pattern this is, and a 3-step hint ladder (hints mark the attempt as 'needed help'). */
export const PatternPanel: React.FC<{ bankKey: string }> = ({ bankKey }) => {
  const session = useWorkspaceSession();
  const key = currentBankKey(bankKey);
  const pattern = PATTERN_BY_ID[patternIdForBank(key) ?? ""];
  const used = session?.hintsUsed ?? 0;
  const content = [pattern?.signal, pattern?.memorize[0], KEY_INSIGHTS[key]];

  return (
    <div className="space-y-5 px-5 text-sm text-dark-label-2">
      <div>
        <p className="text-xs uppercase tracking-wide text-dark-gray-6">Before you code</p>
        <p className="mt-1">
          Spend 5 minutes on paper: restate the problem, write 2 edge cases, and the brute force with its Big-O. Then open hints only if you&apos;re stuck.
        </p>
      </div>

      <ol className="space-y-3">
        {HINTS.map((h) => {
          const open = used >= h.n;
          const locked = h.n > used + 1;
          const body = content[h.n - 1];
          return (
            <li key={h.n} className={`rounded-lg border p-3 ${open ? "border-gray-700 bg-gray-900/60" : "border-gray-800"}`}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium text-white">Hint {h.n} · {h.title}</div>
                  {!open && <div className="text-xs text-dark-gray-6">{h.help}</div>}
                </div>
                {!open && (
                  <button
                    disabled={locked || !body || !session}
                    onClick={() => session?.revealHint(h.n)}
                    className="shrink-0 rounded-lg bg-dark-fill-3 px-3 py-1.5 text-xs font-medium text-dark-label-2 hover:bg-dark-fill-2 disabled:opacity-40"
                    title={locked ? "Open the previous hint first" : undefined}
                  >
                    Show
                  </button>
                )}
              </div>
              {open && (
                <p className="mt-2 leading-relaxed text-dark-gray-8">
                  {h.n === 1 && pattern && <span className="mr-1 font-medium text-dark-green-s">{pattern.name}.</span>}
                  {body}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      {used > 0 && (
        <p className="text-xs text-dark-yellow">Hints used: {used}. This attempt will be logged as &ldquo;needed help&rdquo;.</p>
      )}
      {pattern && (
        <Link href={`/patterns/${pattern.id}`} className="inline-flex min-h-[32px] items-center text-xs text-dark-blue-s hover:underline">
          Open the full {pattern.name} sheet →
        </Link>
      )}
    </div>
  );
};

/** My log tab: your log entries for this problem (insight stays hidden: recall it first). */
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
        </li>
      ))}
    </ul>
  );
};
