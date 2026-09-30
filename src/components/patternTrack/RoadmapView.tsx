import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LEETCODE_URL, PATTERNS, type Pattern } from "@/content/patterns";
import { bankKeyForLc } from "@/lib/patternTrack/bank";
import { patternProgress, type LogEntry } from "@/lib/patternTrack/stats";
import { Bar, DifficultyChip, Panel } from "./ui";

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-dark-gray-6">{title}</h4>
    <div className="text-sm text-dark-label-2">{children}</div>
  </div>
);

const List: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="list-disc space-y-1 pl-5">{items.map((i) => <li key={i}>{i}</li>)}</ul>
);

const PatternSheet: React.FC<{
  pattern: Pattern;
  logs: LogEntry[];
  open: boolean;
  current: boolean;
  onToggle: () => void;
}> = ({ pattern, logs, open, current, onToggle }) => {
  const pr = patternProgress(pattern, logs);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (current) ref.current?.scrollIntoView({ block: "nearest" });
  }, [current]);

  return (
    <div ref={ref} className={`rounded-lg border bg-dark-layer-1 ${current ? "border-dark-green-s/60" : "border-dark-divider-border-2"}`}>
      <button onClick={onToggle} aria-expanded={open}
        className="flex w-full items-center gap-4 px-4 py-3 text-left">
        <span className="w-14 shrink-0 text-xs text-dark-gray-6">
          {pattern.id === "mixed-mocks" ? "Wk 18–22" : `Week ${pattern.week}`}
        </span>
        <span className="flex-1 font-medium text-dark-gray-8">
          {pattern.name}
          {current && <span className="ml-2 rounded bg-dark-green-s/15 px-2 py-0.5 text-xs text-dark-green-s">this week</span>}
        </span>
        {pr.total > 0 && (
          <span className="hidden w-40 sm:block">
            <Bar value={pr.logged} total={pr.total} />
            <span className="text-[11px] text-dark-gray-6">{pr.logged}/{pr.total} logged · {pr.mastered} mastered</span>
          </span>
        )}
        <span className={`text-dark-gray-6 transition-transform ${open ? "rotate-90" : ""}`}>›</span>
      </button>

      {open && (
        <div className="grid gap-5 border-t border-dark-divider-border-2 px-4 py-4 md:grid-cols-2">
          <Section title="When to use">{pattern.signal}</Section>
          <Section title="Core idea">{pattern.coreIdea}</Section>
          <Section title="Memorize"><List items={pattern.memorize} /></Section>
          <Section title="Don't memorize"><List items={pattern.dontMemorize} /></Section>
          <Section title="Java kit"><code className="whitespace-pre-wrap text-[13px]">{pattern.javaKit}</code></Section>
          <Section title="Common mistakes">{pattern.commonMistakes}</Section>
          <Section title="Real world">{pattern.realWorld}</Section>
          <Section title="Progress">
            {pr.solo} solved solo · {pr.mastered} mastered
          </Section>
          {pattern.problems.length > 0 && (
            <div className="md:col-span-2">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-dark-gray-6">Problems</h4>
              <ul className="divide-y divide-dark-divider-border-2">
                {pattern.problems.map(([lc, title, slug, diff]) => {
                  const bank = bankKeyForLc(slug);
                  return (
                    <li key={slug} className="flex flex-wrap items-center gap-3 py-2 text-sm">
                      <span className={`w-5 ${pr.done.has(slug) ? "text-dark-green-s" : "text-dark-gray-6"}`}>
                        {pr.done.has(slug) ? "✓" : "·"}
                      </span>
                      <a href={LEETCODE_URL(slug)} target="_blank" rel="noreferrer" className="text-dark-gray-8 hover:underline">
                        {lc}. {title}
                      </a>
                      <DifficultyChip d={diff} />
                      {bank && (
                        <Link href={`/problems/${encodeURIComponent(bank)}`} className="text-xs text-dark-blue-s hover:underline">
                          Solve in CodeOmen
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const RoadmapView: React.FC<{ logs: LogEntry[]; currentWeek: number }> = ({ logs, currentWeek }) => {
  const currentId = PATTERNS.find((p) => p.week === Math.min(currentWeek, 18))?.id;
  const [open, setOpen] = useState<Set<string>>(() => new Set(currentId ? [currentId] : []));
  const toggle = (id: string) =>
    setOpen((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  return (
    <div className="space-y-2">
      {currentWeek === 0 && (
        <Panel className="text-sm text-dark-label-2">The track hasn&apos;t started yet. Set the start date on Today.</Panel>
      )}
      {PATTERNS.map((p) => (
        <PatternSheet key={p.id} pattern={p} logs={logs} open={open.has(p.id)} current={p.id === currentId}
          onToggle={() => toggle(p.id)} />
      ))}
    </div>
  );
};

export default RoadmapView;
