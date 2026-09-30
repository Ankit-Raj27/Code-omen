import React from "react";
import Link from "next/link";
import { LEETCODE_URL, PATTERNS, type Pattern } from "@/content/patterns";
import { bankKeyForLc } from "@/lib/patternTrack/bank";
import { isMastered } from "@/lib/patternTrack/srs";
import { patternProgress, sortNewestFirst, urlMatchesSlug, type LogEntry } from "@/lib/patternTrack/stats";
import { Bar, DifficultyChip, EmptyState, Panel, StageDots } from "./ui";

const weekText = (p: Pattern) => (p.id === "mixed-mocks" ? "Wk 18–22" : `Week ${p.week}`);

/** /patterns: the 18-week roadmap, one row per pattern. */
export const PatternList: React.FC<{ logs: LogEntry[]; currentWeek: number }> = ({ logs, currentWeek }) => {
  const currentId = PATTERNS.find((p) => p.week === Math.min(currentWeek, 18))?.id;
  return (
    <ol className="space-y-2">
      {PATTERNS.map((p) => {
        const pr = patternProgress(p, logs);
        const current = p.id === currentId;
        const behind = currentWeek > p.week && pr.total > 0 && pr.logged === 0;
        return (
          <li key={p.id}>
            <Link href={`/patterns/${p.id}`}
              className={`flex items-center gap-4 rounded-lg border bg-gray-900/50 px-4 py-3 transition-colors hover:bg-dark-fill-3 ${
                current ? "border-dark-green-s/60" : "border-gray-800"
              }`}>
              <span className="w-16 shrink-0 text-xs text-dark-gray-6">{weekText(p)}</span>
              <span className="flex-1 font-medium text-dark-gray-8">
                {p.name}
                {current && <span className="ml-2 rounded bg-dark-green-s/15 px-2 py-0.5 text-xs text-dark-green-s">this week</span>}
                {behind && <span className="ml-2 rounded bg-dark-fill-3 px-2 py-0.5 text-xs text-dark-gray-6">catch up</span>}
              </span>
              {pr.total > 0 && (
                <span className="hidden w-44 sm:block">
                  <Bar value={pr.logged} total={pr.total} />
                  <span className="text-[11px] text-dark-gray-6">{pr.logged}/{pr.total} logged · {pr.mastered} mastered</span>
                </span>
              )}
              <span className="text-dark-gray-6" aria-hidden="true">›</span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section>
    <h2 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-dark-gray-6">{title}</h2>
    <div className="text-sm leading-relaxed text-dark-label-2">{children}</div>
  </section>
);

const List: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="list-disc space-y-1 pl-5">{items.map((i) => <li key={i}>{i}</li>)}</ul>
);

/** /patterns/[id]: the sheet on the left; problem set and your log for it on the right. */
export const PatternDetail: React.FC<{ pattern: Pattern; logs: LogEntry[]; signedIn: boolean }> = ({ pattern, logs, signedIn }) => {
  const pr = patternProgress(pattern, logs);
  const mine = sortNewestFirst(logs.filter((l) => l.patternId === pattern.id));

  return (
    <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
      <Panel className="space-y-5">
        <Section title="When to use">{pattern.signal}</Section>
        <Section title="Core idea">{pattern.coreIdea}</Section>
        <Section title="Memorize"><List items={pattern.memorize} /></Section>
        <Section title="Don't memorize"><List items={pattern.dontMemorize} /></Section>
        <Section title="Java kit"><code className="whitespace-pre-wrap text-[13px]">{pattern.javaKit}</code></Section>
        <Section title="Common mistakes">{pattern.commonMistakes}</Section>
        <Section title="Real world">{pattern.realWorld}</Section>
      </Panel>

      <div className="space-y-6">
        <Panel>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-medium text-dark-gray-8">Problems</h2>
            {pr.total > 0 && <span className="text-xs text-dark-gray-6">{pr.logged}/{pr.total} logged · {pr.solo} solo · {pr.mastered} mastered</span>}
          </div>
          {pr.total > 0 && <Bar value={pr.logged} total={pr.total} />}
          {pattern.problems.length === 0 ? (
            <p className="mt-3 text-sm text-dark-label-2">
              No fixed set: pick 2 unseen mediums from any pattern, 60 minutes, and name the pattern before you code.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-gray-800">
              {pattern.problems.map(([lc, title, slug, diff]) => {
                const bank = bankKeyForLc(slug);
                const done = pr.done.has(slug);
                return (
                  <li key={slug} className="flex flex-wrap items-center gap-2 py-2 text-sm">
                    <span className={`w-4 ${done ? "text-dark-green-s" : "text-dark-gray-6"}`} aria-label={done ? "Logged" : "Not logged"}>
                      {done ? "✓" : "·"}
                    </span>
                    <span className="flex-1 text-dark-gray-8">{lc}. {title}</span>
                    <DifficultyChip d={diff} />
                    {bank ? (
                      <Link href={`/problems/${encodeURIComponent(bank)}`} className="text-xs text-dark-blue-s hover:underline">Solve</Link>
                    ) : null}
                    <a href={LEETCODE_URL(slug)} target="_blank" rel="noreferrer" className="text-xs text-dark-gray-6 hover:underline">LeetCode ↗</a>
                    {signedIn && !done && (
                      <Link href={`/log?slug=${encodeURIComponent(slug)}`} className="text-xs text-dark-gray-6 hover:underline">Log</Link>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        {pattern.stretch && pattern.stretch.length > 0 && (
          <Panel>
            <div className="mb-1 flex items-baseline justify-between">
              <h2 className="font-medium text-dark-gray-8">Stretch</h2>
              <span className="text-xs text-dark-gray-6">extra practice · not counted in progress</span>
            </div>
            <ul className="mt-2 divide-y divide-gray-800">
              {pattern.stretch.map(([lc, title, slug, diff]) => {
                const bank = bankKeyForLc(slug);
                const done = logs.some((l) => urlMatchesSlug(l.url, slug) || l.bankSlug === slug);
                return (
                  <li key={slug} className="flex flex-wrap items-center gap-2 py-2 text-sm">
                    <span className={`w-4 ${done ? "text-dark-green-s" : "text-dark-gray-6"}`} aria-label={done ? "Logged" : "Not logged"}>
                      {done ? "✓" : "·"}
                    </span>
                    <span className="flex-1 text-dark-gray-8">{lc}. {title}</span>
                    <DifficultyChip d={diff} />
                    {bank && <Link href={`/problems/${encodeURIComponent(bank)}`} className="text-xs text-dark-blue-s hover:underline">Solve</Link>}
                    <a href={LEETCODE_URL(slug)} target="_blank" rel="noreferrer" className="text-xs text-dark-gray-6 hover:underline">LeetCode ↗</a>
                  </li>
                );
              })}
            </ul>
          </Panel>
        )}

        {signedIn && (
          <section>
            <h2 className="mb-2 font-medium text-dark-gray-8">Your log for this pattern</h2>
            {mine.length === 0 ? (
              <EmptyState>Nothing logged for {pattern.name} yet.</EmptyState>
            ) : (
              <ul className="space-y-2">
                {mine.map((l) => (
                  <li key={l.id} className="rounded-lg border border-gray-800 bg-gray-900/50 p-3 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-dark-gray-8">{l.name}</span>
                      <DifficultyChip d={l.difficulty} />
                      <span className="ml-auto"><StageDots stage={l.stage} /></span>
                    </div>
                    <div className="mt-1 text-xs text-dark-gray-6">
                      {l.dateSolved} · {l.solvedSolo ? "solo" : "needed help"} · {isMastered(l) ? "mastered" : `next ${l.nextDue}`}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </div>
  );
};
