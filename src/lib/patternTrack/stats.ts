// Pure derived stats for Pattern Track. No Firebase imports.
import { PATTERNS, TOTAL_WEEKS, type Pattern } from "@/content/patterns";
import { addDays, compareYmd, daysBetween, type Ymd } from "./dates";
import { MASTERED_STAGE, isDue, isMastered, type Review } from "./srs";

export type LogDifficulty = "E" | "M" | "H";

export interface LogEntry {
  id: string;
  name: string;
  url: string;
  patternId: string;
  difficulty: LogDifficulty;
  solvedSolo: boolean;
  minutes: number;
  dateSolved: Ymd;
  insight: string;
  stuckOn: string;
  complexity: string;
  stage: number;
  nextDue: Ymd;
  reviews: Review[];
  bankSlug?: string;
  /** Workspace hints opened before solving (0–3). */
  hintsUsed?: number;
  /** Editor language used when solved in CodeOmen. */
  language?: "js" | "java";
  createdAtMs?: number;
}

/** 1-based week number for `today`; 0 if before start; capped at TOTAL_WEEKS. */
export function currentWeek(startDate: Ymd, today: Ymd): number {
  const d = daysBetween(startDate, today);
  if (d < 0) return 0;
  return Math.min(Math.floor(d / 7) + 1, TOTAL_WEEKS);
}

/** Pattern for a week number; weeks 18–22 all map to Mixed Mocks. */
export function patternForWeek(week: number): Pattern | undefined {
  if (week < 1) return undefined;
  const last = PATTERNS[PATTERNS.length - 1];
  return PATTERNS.find((p) => p.week === week) ?? (week >= last.week ? last : undefined);
}

export function urlMatchesSlug(url: string, slug: string): boolean {
  if (!url) return false;
  const u = url.toLowerCase();
  return u.includes(`/problems/${slug}/`) || u.endsWith(`/problems/${slug}`) || u.includes(`/problems/${slug}?`);
}

export interface PatternProgress {
  logged: number; // sheet problems with a matching log
  total: number;
  solo: number; // logs for this pattern solved solo
  mastered: number; // logs for this pattern mastered
  done: Set<string>; // sheet slugs with ✓
}

export function patternProgress(pattern: Pattern, logs: LogEntry[]): PatternProgress {
  const mine = logs.filter((l) => l.patternId === pattern.id);
  const done = new Set<string>();
  for (const [, , slug] of pattern.problems) {
    if (logs.some((l) => urlMatchesSlug(l.url, slug) || l.bankSlug === slug)) done.add(slug);
  }
  return {
    logged: done.size,
    total: pattern.problems.length,
    solo: mine.filter((l) => l.solvedSolo).length,
    mastered: mine.filter((l) => isMastered(l)).length,
    done,
  };
}

export interface TodayStats {
  dueToday: number;
  totalLogged: number;
  mediumSoloPct: number | null; // null when no mediums
  mastered: number;
}

export function todayStats(logs: LogEntry[], today: Ymd): TodayStats {
  const mediums = logs.filter((l) => l.difficulty === "M");
  return {
    dueToday: logs.filter((l) => isDue(l, today)).length,
    totalLogged: logs.length,
    mediumSoloPct: mediums.length ? Math.round((100 * mediums.filter((l) => l.solvedSolo).length) / mediums.length) : null,
    mastered: logs.filter((l) => l.stage >= MASTERED_STAGE).length,
  };
}

/** Consecutive active days (new log or review) ending today, or yesterday if today has none yet. */
export function streak(logs: LogEntry[], today: Ymd): number {
  const active = new Set<Ymd>();
  for (const l of logs) {
    active.add(l.dateSolved);
    for (const r of l.reviews ?? []) active.add(r.date);
  }
  let day = active.has(today) ? today : addDays(today, -1);
  let n = 0;
  while (active.has(day)) {
    n++;
    day = addDays(day, -1);
  }
  return n;
}

/** Newest first: by dateSolved desc, then createdAt desc. */
export function sortNewestFirst(logs: LogEntry[]): LogEntry[] {
  return [...logs].sort(
    (a, b) => compareYmd(b.dateSolved, a.dateSolved) || (b.createdAtMs ?? 0) - (a.createdAtMs ?? 0),
  );
}

export interface LogFilter {
  patternId?: string; // "" = all
  solo?: "all" | "solo" | "help";
  text?: string;
}

export function filterLogs(logs: LogEntry[], f: LogFilter): LogEntry[] {
  const q = (f.text ?? "").trim().toLowerCase();
  return logs.filter(
    (l) =>
      (!f.patternId || l.patternId === f.patternId) &&
      (!f.solo || f.solo === "all" || (f.solo === "solo") === l.solvedSolo) &&
      (!q || l.name.toLowerCase().includes(q) || l.insight.toLowerCase().includes(q)),
  );
}

const CSV_COLUMNS: (keyof LogEntry)[] = [
  "name", "url", "patternId", "difficulty", "solvedSolo", "minutes", "dateSolved",
  "insight", "stuckOn", "complexity", "stage", "nextDue", "reviews",
];

function csvCell(v: unknown): string {
  const s = Array.isArray(v) ? v.map((r: Review) => `${r.date}:${r.result}`).join(" ") : String(v ?? "");
  // Neutralize spreadsheet formula injection, then quote.
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function logsToCsv(logs: LogEntry[]): string {
  const rows = sortNewestFirst(logs).map((l) => CSV_COLUMNS.map((c) => csvCell(l[c])).join(","));
  return [CSV_COLUMNS.join(","), ...rows].join("\r\n");
}

/** The first `n` problems of a pattern with no matching log entry, in sheet order. */
export function nextUp(pattern: Pattern | undefined, logs: LogEntry[], n = 2): PatternProblemRef[] {
  if (!pattern) return [];
  const { done } = patternProgress(pattern, logs);
  return pattern.problems
    .filter(([, , slug]) => !done.has(slug))
    .slice(0, n)
    .map(([lc, title, slug, difficulty]) => ({ lc, title, slug, difficulty, patternId: pattern.id }));
}

export interface PatternProblemRef {
  lc: number;
  title: string;
  slug: string;
  difficulty: LogDifficulty;
  patternId: string;
}

/** Short label for the nav chip, e.g. "Wk 3 · Sliding Window"; "Starts 5 Oct" before week 1. */
export function weekLabel(startDate: Ymd, today: Ymd): string {
  const week = currentWeek(startDate, today);
  if (week === 0) {
    const [, m, d] = startDate.split("-").map(Number);
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m - 1];
    return `Starts ${d} ${month}`;
  }
  return `Wk ${week} · ${patternForWeek(week)?.name ?? ""}`;
}

export interface WeekActivity {
  weekStart: Ymd; // Monday
  label: string; // e.g. "5 Oct"
  logged: number; // new problems logged that week
  reviews: number; // reviews graded that week
  clean: number; // of which "clean"
  recallPct: number | null; // clean / reviews, null when no reviews
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Monday of the week containing `ymd` (ISO weeks). */
export function weekStartOf(ymd: Ymd): Ymd {
  const [y, m, d] = ymd.split("-").map(Number);
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0 = Sun
  return addDays(ymd, -((dow + 6) % 7));
}

/** Per-week counts for the last `weeks` weeks ending with the current one, oldest first. */
export function weeklyActivity(logs: LogEntry[], today: Ymd, weeks = 8): WeekActivity[] {
  const last = weekStartOf(today);
  const out: WeekActivity[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const ws = addDays(last, -7 * i);
    const [, m, d] = ws.split("-").map(Number);
    out.push({ weekStart: ws, label: `${d} ${MONTHS[m - 1]}`, logged: 0, reviews: 0, clean: 0, recallPct: null });
  }
  const idx = new Map(out.map((w, i) => [w.weekStart, i]));
  for (const l of logs) {
    const i = idx.get(weekStartOf(l.dateSolved));
    if (i !== undefined) out[i].logged++;
    for (const r of l.reviews ?? []) {
      const j = idx.get(weekStartOf(r.date));
      if (j === undefined) continue;
      out[j].reviews++;
      if (r.result === "clean") out[j].clean++;
    }
  }
  for (const w of out) w.recallPct = w.reviews ? Math.round((100 * w.clean) / w.reviews) : null;
  return out;
}

/** Small stable string hash (FNV-1a) for deterministic daily picks. */
function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Question of the day: one unlogged roadmap problem from the patterns you've reached
 * (week 1 before the track starts), stable for the whole day. Prefers problems runnable
 * in CodeOmen (`isRunnable`) and skips `exclude` (e.g. Next up) when there's a choice.
 */
export function questionOfTheDay(
  logs: LogEntry[],
  startDate: Ymd,
  today: Ymd,
  seed: string,
  isRunnable: (slug: string) => boolean = () => true,
  exclude: string[] = [],
): PatternProblemRef | null {
  const reached = Math.max(1, Math.min(currentWeek(startDate, today), 17));
  const pool = PATTERNS.filter((p) => p.week <= reached).flatMap((p) => {
    const { done } = patternProgress(p, logs);
    return p.problems
      .filter(([, , slug]) => !done.has(slug))
      .map(([lc, title, slug, difficulty]) => ({ lc, title, slug, difficulty, patternId: p.id }));
  });
  const tiers = [
    pool.filter((q) => isRunnable(q.slug) && !exclude.includes(q.slug)),
    pool.filter((q) => !exclude.includes(q.slug)),
    pool,
  ];
  const choice = tiers.find((t) => t.length > 0);
  if (!choice) return null;
  return choice[hash(`${today}|${seed}`) % choice.length];
}
