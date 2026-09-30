import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, LineChart, RotateCcw, Star, Target } from "lucide-react";
import BlurFade from "@/components/ui/blur-fade";
import { Carousel } from "@/components/ui/miniCarousel";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";
import TrackCharts from "./TrackCharts";
import Link from "next/link";
import { toast } from "react-toastify";
import { LEETCODE_URL, PATTERN_BY_ID } from "@/content/patterns";
import { gradeLog } from "@/lib/patternTrack/firestore";
import { dueQueue, isOverdue, type ReviewResult } from "@/lib/patternTrack/srs";
import { bankKeyForLc, resolveUrl } from "@/lib/patternTrack/bank";
import {
  currentWeek, nextUp, patternForWeek, patternProgress, questionOfTheDay, streak, todayStats, weeklyActivity,
  type LogEntry, type PatternProblemRef,
} from "@/lib/patternTrack/stats";
import { daysBetween, safeHttpUrl, type Ymd } from "@/lib/patternTrack/dates";
import {
  Bar, DifficultyChip, EmptyState, Panel, PatternChip, SectionTitle, StageDots, StatTile, btnGhost, btnGradient, inputCls,
} from "./ui";

type Props = {
  uid: string;
  logs: LogEntry[];
  today: Ymd;
  startDate: Ymd;
  onStartDateChange: (d: Ymd) => void;
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
    <li className="rounded-lg border border-gray-800 bg-black/40 p-3">
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

/** Solve target for a roadmap problem: CodeOmen's workspace if it's in the bank, else LeetCode. */
function solveTarget(slug: string): { href: string; internal: boolean } {
  const bank = bankKeyForLc(slug);
  return bank ? { href: `/problems/${encodeURIComponent(bank)}`, internal: true } : { href: LEETCODE_URL(slug), internal: false };
}

const NextUp: React.FC<{ items: PatternProblemRef[] }> = ({ items }) => {
  if (items.length === 0) return null;
  return (
    <div className="mt-4 border-t border-gray-800 pt-3">
      <div className="mb-2 text-xs uppercase text-dark-gray-6">Next up</div>
      <ul className="space-y-2">
        {items.map((p) => {
          const t = solveTarget(p.slug);
          return (
            <li key={p.slug} className="flex flex-wrap items-center gap-2 text-sm">
              <span className="w-full text-dark-gray-8">{p.lc}. {p.title}</span>
              <DifficultyChip d={p.difficulty} />
              <span className="flex-1" />
              {t.internal ? (
                <Link href={t.href} className={btnGhost}>Solve</Link>
              ) : (
                <a href={t.href} target="_blank" rel="noreferrer" className={btnGhost}>Solve ↗</a>
              )}
              <Link href={`/log?slug=${encodeURIComponent(p.slug)}`} className={btnGhost}>Log</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const COLLECTIONS = [
  { id: "1", title: "NeetCode 150", button: "Code here!", src: "/neetcode150.jpg", redirectPath: "/problems/neetcode150" },
  { id: "2", title: "Striver 150", button: "Code here!", src: "/striver150.png", redirectPath: "/problems/striver150" },
  { id: "3", title: "GFG 100", button: "Code here!", src: "/gfg150.png", redirectPath: "/problems/gfg150" },
];

const QuestionOfTheDay: React.FC<{ q: PatternProblemRef | null }> = ({ q }) => {
  if (!q) {
    return <EmptyState>Every problem you&apos;ve reached so far is logged. Nice work.</EmptyState>;
  }
  const t = solveTarget(q.slug);
  const pattern = PATTERN_BY_ID[q.patternId];
  return (
    <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50">
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <p className="font-medium text-white">{q.lc}. {q.title}</p>
          <DifficultyChip d={q.difficulty} />
        </div>
        <div className="flex items-center justify-between text-sm text-gray-400">
          {pattern && <PatternChip week={pattern.week} name={pattern.name} />}
          <span className="text-xs">{t.internal ? "Runs in CodeOmen" : "On LeetCode"}</span>
        </div>
        {pattern && <p className="mt-3 text-xs leading-relaxed text-gray-400">Hint: {pattern.signal}</p>}
      </div>
      <div className="border-t border-gray-800 p-4">
        {t.internal ? (
          <Link href={t.href} className={`${btnGradient} w-full`}>Start solving</Link>
        ) : (
          <a href={t.href} target="_blank" rel="noreferrer" className={`${btnGradient} w-full`}>Start solving ↗</a>
        )}
      </div>
    </div>
  );
};

const TodayView: React.FC<Props> = ({ uid, logs, today, startDate, onStartDateChange }) => {
  const reduce = useReducedMotion();
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
  // Before the track starts, "next up" previews week 1.
  const upcoming = nextUp(pattern ?? patternForWeek(1), logs, 2);
  const firstProblem = patternForWeek(1)?.problems[0];
  const qotd = questionOfTheDay(logs, startDate, today, uid, (slug) => !!bankKeyForLc(slug), upcoming.map((u) => u.slug));
  const activity = weeklyActivity(logs, today, 8);

  const fadeInUp = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  const stagger = { hidden: {}, visible: { transition: { staggerChildren: reduce ? 0 : 0.12 } } };

  return (
    <div className="space-y-8">
      <motion.div className="grid grid-cols-2 gap-3 md:grid-cols-5" initial="hidden" animate="visible" variants={stagger}>
        {[
          <StatTile key="due" label="Due today" value={stats.dueToday} />,
          <StatTile key="total" label="Total logged" value={stats.totalLogged} />,
          <StatTile key="solo" label="Mediums solved solo" value={stats.mediumSoloPct === null ? "—" : `${stats.mediumSoloPct}%`}
            hint="goal 60% by week 10" />,
          <StatTile key="mastered" label="Mastered" value={stats.mastered} />,
          <StatTile key="streak" label="Streak" value={`${days} day${days === 1 ? "" : "s"}`} />,
        ].map((tile) => <motion.div key={tile.key} variants={fadeInUp}>{tile}</motion.div>)}
      </motion.div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <motion.div className="space-y-8 lg:col-span-2" initial="hidden" animate="visible" variants={stagger}>
          <motion.section variants={fadeInUp}>
            <SectionTitle icon={<RotateCcw size={22} className="text-pink-400" />}>Revise first</SectionTitle>
            {logs.length === 0 ? (
              <EmptyState
                action={firstProblem && (
                  <Link href={solveTarget(firstProblem[2]).href} className={btnGhost}>
                    Start with {firstProblem[1]}
                  </Link>
                )}>
                No problems logged yet. Solve one from week 1 and log it; reviews appear here from the next day.
              </EmptyState>
            ) : queue.length === 0 ? (
              <EmptyState>Nothing due. Learn 2 new problems from this week&apos;s pattern.</EmptyState>
            ) : (
              <ul className="space-y-2">
                {queue.map((l) => <ReviewCard key={l.id} uid={uid} log={l} today={today} onGraded={onGraded} />)}
              </ul>
            )}
            {reviewed.length > 0 && (
              <>
                <h3 className="mb-2 mt-6 text-sm font-medium text-gray-400">Just reviewed</h3>
                <ul className="space-y-2">
                  {reviewed.map((l) => (
                    <ReviewCard key={l.id} uid={uid} log={l} today={today} graded={graded[l.id]} onGraded={onGraded} />
                  ))}
                </ul>
              </>
            )}
          </motion.section>

          <motion.section variants={fadeInUp}>
            <SectionTitle icon={<LineChart size={22} className="text-blue-400" />}
              action={<Link href="/log" className="text-sm text-gray-400 hover:text-white">Open log →</Link>}>
              Your progress
            </SectionTitle>
            <TrackCharts weeks={activity} />
          </motion.section>

          <motion.section variants={fadeInUp}>
            <SectionTitle icon={<BookOpen size={22} className="text-purple-400" />}>Problem collections</SectionTitle>
            <BlurFade delay={reduce ? 0 : 0.5}>
              <NeonGradientCard className="h-fit w-full" borderSize={1}
                neonColors={{ firstColor: "yellow, orange", secondColor: "blue, green" }}>
                <Carousel slides={COLLECTIONS} />
              </NeonGradientCard>
            </BlurFade>
          </motion.section>
        </motion.div>

        <motion.div className="space-y-8" initial="hidden" animate="visible" variants={stagger}>
          <motion.section variants={fadeInUp}>
            <SectionTitle icon={<Target size={22} className="text-green-400" />}>This week</SectionTitle>
            <Panel>
              {week === 0 || !pattern ? (
                <p className="text-sm text-dark-label-2">
                  The track starts {startDate}. Week 1 is {patternForWeek(1)?.name}.
                </p>
              ) : (
                <>
                  <div className="text-xs uppercase text-gray-400">
                    Week {week}{pattern.id === "mixed-mocks" ? " of 18–22" : ""}
                  </div>
                  <div className="mt-1 text-lg font-medium text-white">{pattern.name}</div>
                  <p className="mt-2 text-sm text-dark-label-2">{pattern.signal}</p>
                  {progress && progress.total > 0 && (
                    <div className="mt-3 space-y-1">
                      <Bar value={progress.logged} total={progress.total} />
                      <div className="text-xs text-gray-400">
                        {progress.logged}/{progress.total} logged · {progress.mastered} mastered
                      </div>
                    </div>
                  )}
                  <Link href={`/patterns/${pattern.id}`} className={`${btnGhost} mt-3`}>Open pattern sheet</Link>
                </>
              )}
              <NextUp items={upcoming} />
              <label className="mt-4 block border-t border-gray-800 pt-3 text-xs text-gray-400">
                Track start date
                <input type="date" className={`${inputCls} mt-1`} value={startDate}
                  onChange={(e) => e.target.value && onStartDateChange(e.target.value)} />
              </label>
            </Panel>
          </motion.section>

          <motion.section variants={fadeInUp}>
            <SectionTitle icon={<Star size={22} className="text-yellow-400" />}>Question of the day</SectionTitle>
            <QuestionOfTheDay q={qotd} />
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
};

export default TodayView;
