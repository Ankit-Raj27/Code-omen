import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { LEETCODE_URL, PATTERN_BY_ID } from "@/content/patterns";
import { gradeLog } from "@/lib/patternTrack/firestore";
import { dueQueue, isOverdue, type ReviewResult } from "@/lib/patternTrack/srs";
import { bankKeyForLc, resolveUrl } from "@/lib/patternTrack/bank";
import { currentWeek, patternForWeek, patternProgress, streak, todayStats, type LogEntry } from "@/lib/patternTrack/stats";
import { daysBetween, safeHttpUrl, type Ymd } from "@/lib/patternTrack/dates";
import { Bar, DifficultyChip, Panel, StageDots, btnGhost, inputCls } from "./ui";

type Props = {
  uid: string;
  logs: LogEntry[];
  today: Ymd;
  startDate: Ymd;
  onStartDateChange: (d: Ymd) => void;
  goTo: (tab: "roadmap" | "log") => void;
};

const GRADES: { result: ReviewResult; label: string; cls: string }[] = [
  { result: "clean", label: "Clean", cls: "bg-dark-green-s/15 text-dark-green-s hover:bg-dark-green-s/25" },
  { result: "shaky", label: "Shaky", cls: "bg-dark-yellow/15 text-dark-yellow hover:bg-dark-yellow/25" },
  { result: "forgot", label: "Forgot", cls: "bg-dark-pink/15 text-dark-pink hover:bg-dark-pink/25" },
];

/** URL to re-solve from a blank editor: code-omen compiler if in the bank, else LeetCode. */
function resolveTarget(log: LogEntry): { href: string; internal: boolean } | null {
  const lcSlug = log.url.match(/leetcode\.com\/problems\/([^/?#]+)/i)?.[1];
  const bank = log.bankSlug ?? (lcSlug ? bankKeyForLc(lcSlug) : undefined);
  if (bank) return { href: resolveUrl(bank), internal: true };
  if (lcSlug) return { href: LEETCODE_URL(lcSlug), internal: false };
  const url = safeHttpUrl(log.url);
  return url ? { href: url, internal: false } : null;
}

const ReviewCard: React.FC<{
  uid: string;
  log: LogEntry;
  today: Ymd;
  graded?: ReviewResult;
  onGraded: (id: string, r: ReviewResult) => void;
}> = ({ uid, log, today, graded, onGraded }) => {
  const [busy, setBusy] = useState(false);
  const overdue = !graded && isOverdue(log, today);
  const target = resolveTarget(log);

  const grade = async (r: ReviewResult) => {
    setBusy(true);
    try {
      await gradeLog(uid, log, r, today);
      onGraded(log.id, r);
    } catch (e) {
      console.error(e);
      toast.error("Couldn't save the review. Try again.", { theme: "dark", position: "top-center" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <li className="rounded-lg border border-dark-divider-border-2 bg-dark-layer-2 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium text-dark-gray-8">{log.name}</span>
        <DifficultyChip d={log.difficulty} />
        <span className="text-xs text-dark-gray-6">{PATTERN_BY_ID[log.patternId]?.name ?? log.patternId}</span>
        {overdue && (
          <span className="rounded bg-dark-pink/15 px-2 py-0.5 text-xs text-dark-pink">
            overdue {daysBetween(log.nextDue, today)}d
          </span>
        )}
        <span className="ml-auto"><StageDots stage={log.stage} /></span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {target &&
          (target.internal ? (
            <Link href={target.href} className={btnGhost}>Re-solve</Link>
          ) : (
            <a href={target.href} target="_blank" rel="noreferrer" className={btnGhost}>Re-solve ↗</a>
          ))}
        {!graded &&
          GRADES.map((g) => (
            <button key={g.result} disabled={busy} onClick={() => grade(g.result)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium disabled:opacity-50 ${g.cls}`}>
              {g.label}
            </button>
          ))}
      </div>

      {/* Insight is shown only AFTER grading, to force recall instead of rereading. */}
      {graded && (
        <div className="mt-3 rounded-md bg-dark-fill-3 p-2 text-sm text-dark-label-2" aria-live="polite">
          <span className="text-xs uppercase text-dark-gray-6">Graded {graded} · insight</span>
          <p className="mt-1 text-dark-gray-8">{log.insight}</p>
          {log.stuckOn && <p className="mt-1 text-xs text-dark-gray-6">Stuck on: {log.stuckOn}</p>}
        </div>
      )}
    </li>
  );
};

const TodayView: React.FC<Props> = ({ uid, logs, today, startDate, onStartDateChange, goTo }) => {
  // Graded this session → shown in "Just reviewed" with the insight revealed.
  const [graded, setGraded] = useState<Record<string, ReviewResult>>({});
  const onGraded = (id: string, r: ReviewResult) => setGraded((g) => ({ ...g, [id]: r }));
  const queue = dueQueue(logs, today).filter((l) => !graded[l.id]);
  const reviewed = logs.filter((l) => graded[l.id]);

  const stats = todayStats(logs, today);
  const week = currentWeek(startDate, today);
  const pattern = patternForWeek(week);
  const progress = pattern ? patternProgress(pattern, logs) : null;
  const days = streak(logs, today);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {[
          ["Due today", stats.dueToday],
          ["Total logged", stats.totalLogged],
          ["Mediums solved solo", stats.mediumSoloPct === null ? "—" : `${stats.mediumSoloPct}%`, "goal 60% by week 10"],
          ["Mastered", stats.mastered],
          ["Streak", `${days} day${days === 1 ? "" : "s"}`],
        ].map(([label, value, hint]) => (
          <Panel key={label as string}>
            <div className="text-2xl font-semibold text-dark-gray-8">{value}</div>
            <div className="text-xs text-dark-gray-6">{label}</div>
            {hint && <div className="mt-1 text-[11px] text-dark-gray-6">{hint}</div>}
          </Panel>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section>
          <h2 className="mb-3 text-lg font-medium text-dark-gray-8">Revisions</h2>
          {logs.length === 0 ? (
            <Panel>
              <p className="text-sm text-dark-label-2">No problems logged yet.</p>
              <button className={`${btnGhost} mt-3`} onClick={() => goTo("log")}>Go to Problem log</button>
            </Panel>
          ) : queue.length === 0 ? (
            <Panel>
              <p className="text-sm text-dark-label-2">Nothing due. Learn 2 new problems from this week&apos;s pattern.</p>
            </Panel>
          ) : (
            <ul className="space-y-2">
              {queue.map((l) => <ReviewCard key={l.id} uid={uid} log={l} today={today} onGraded={onGraded} />)}
            </ul>
          )}
          {reviewed.length > 0 && (
            <>
              <h3 className="mb-2 mt-6 text-sm font-medium text-dark-gray-6">Just reviewed</h3>
              <ul className="space-y-2">
                {reviewed.map((l) => (
                  <ReviewCard key={l.id} uid={uid} log={l} today={today} graded={graded[l.id]} onGraded={onGraded} />
                ))}
              </ul>
            </>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-lg font-medium text-dark-gray-8">This week</h2>
          <Panel>
            {week === 0 || !pattern ? (
              <p className="text-sm text-dark-label-2">
                Starts {startDate}. Week 1 is {patternForWeek(1)?.name}.
              </p>
            ) : (
              <>
                <div className="text-xs uppercase text-dark-gray-6">
                  Week {week}{pattern.id === "mixed-mocks" ? " of 18–22" : ""}
                </div>
                <div className="mt-1 text-lg font-medium text-dark-gray-8">{pattern.name}</div>
                <p className="mt-2 text-sm text-dark-label-2">{pattern.signal}</p>
                {progress && progress.total > 0 && (
                  <div className="mt-3 space-y-1">
                    <Bar value={progress.logged} total={progress.total} />
                    <div className="text-xs text-dark-gray-6">
                      {progress.logged}/{progress.total} logged · {progress.mastered} mastered
                    </div>
                  </div>
                )}
                <button className={`${btnGhost} mt-3`} onClick={() => goTo("roadmap")}>Open pattern sheet</button>
              </>
            )}
            <label className="mt-4 block text-xs text-dark-gray-6">
              Track start date
              <input type="date" className={`${inputCls} mt-1`} value={startDate}
                onChange={(e) => e.target.value && onStartDateChange(e.target.value)} />
            </label>
          </Panel>
        </section>
      </div>
    </div>
  );
};

export default TodayView;
