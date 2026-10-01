// Pure model behind every problem list page (All problems and the three sheets).
// Rows come from the roadmap + CodeOmen's bank, or from a sheet's Firestore docs;
// status comes from the Pattern Track log. No Firebase or React here.
import { LEETCODE_URL, PATTERNS, PATTERN_BY_ID } from "@/content/patterns";
import { JAVA_PROBLEMS } from "@/utils/problems/java";
import { problems } from "@/utils/problems";
import { bankMeta, currentBankKey } from "@/lib/patternTrack/bank";
import { compareYmd, type Ymd } from "@/lib/patternTrack/dates";
import { listProblemSlug, patternForListProblem } from "@/lib/patternTrack/lists";
import { isMastered } from "@/lib/patternTrack/srs";
import { urlMatchesSlug, type LogEntry } from "@/lib/patternTrack/stats";

export type Difficulty = "Easy" | "Medium" | "Hard";
export type RowStatus = "todo" | "solved" | "review" | "due" | "mastered";

export interface ProblemRow {
  key: string; // LeetCode slug (or sheet doc id when there's no LeetCode link)
  number?: number; // LeetCode number when known
  title: string;
  difficulty: Difficulty;
  patternId?: string;
  week?: number;
  stretch?: boolean;
  /** Runs in CodeOmen's editor (with tests). */
  runsHere: boolean;
  languages: ("JS" | "Java")[];
  /** Internal workspace link, or the external problem page. */
  href: string;
  external: boolean;
  category?: string;
  videoId?: string;
  /** Position within its source, for the default order. */
  order: number;
}

export interface RowState {
  status: RowStatus;
  stage?: number;
  nextDue?: Ymd;
}

const WORD: Record<string, Difficulty> = { E: "Easy", M: "Medium", H: "Hard", Easy: "Easy", Medium: "Medium", Hard: "Hard" };
const DIFF_RANK: Record<Difficulty, number> = { Easy: 0, Medium: 1, Hard: 2 };

function runnable(slug: string): Pick<ProblemRow, "runsHere" | "languages"> {
  const runsHere = !!problems[slug];
  return { runsHere, languages: runsHere ? (JAVA_PROBLEMS[slug] ? ["JS", "Java"] : ["JS"]) : [] };
}

const workspaceHref = (slug: string) => `/problems/${encodeURIComponent(slug)}`;

/** Every roadmap problem (core then stretch, pattern by pattern), plus bank problems off the roadmap. */
export function allProblemRows(): ProblemRow[] {
  const rows: ProblemRow[] = [];
  const seen = new Set<string>();
  for (const p of PATTERNS) {
    const lists: [typeof p.problems, boolean][] = [[p.problems, false], [p.stretch ?? [], true]];
    for (const [list, stretch] of lists) {
      for (const [lc, title, slug, diff] of list) {
        if (seen.has(slug)) continue;
        seen.add(slug);
        const r = runnable(slug);
        rows.push({
          key: slug, number: lc, title, difficulty: WORD[diff], patternId: p.id, week: p.week, stretch, ...r,
          href: r.runsHere ? workspaceHref(slug) : LEETCODE_URL(slug), external: !r.runsHere, order: rows.length,
        });
      }
    }
  }
  for (const [slug, prob] of Object.entries(problems)) {
    if (seen.has(slug)) continue;
    const m = prob.title.match(/^(\d+)\.\s*(.*)$/);
    const pattern = patternForListProblem({ id: slug });
    rows.push({
      key: slug, number: m ? Number(m[1]) : undefined, title: m ? m[2] : prob.title, difficulty: bankMeta(slug)?.difficulty ?? "Medium",
      patternId: pattern?.id, week: pattern?.week, ...runnable(slug), href: workspaceHref(slug), external: false, order: rows.length,
    });
  }
  return rows;
}

/** A sheet document from Firestore (NeetCode / Striver / GFG collections). */
export interface SheetDoc {
  id: string;
  title: string;
  difficulty: string;
  category?: string;
  link?: string;
  videoId?: string;
  order?: number;
}

export function sheetRows(docs: SheetDoc[]): ProblemRow[] {
  return docs.map((d, i) => {
    const slug = listProblemSlug(d);
    const bankKey = problems[slug] ? slug : problems[d.id] ? d.id : undefined;
    const pattern = patternForListProblem(d);
    const r = bankKey ? runnable(bankKey) : { runsHere: false, languages: [] as ProblemRow["languages"] };
    const m = d.title.match(/^(\d+)\.\s*(.*)$/);
    return {
      key: slug, number: m ? Number(m[1]) : undefined, title: m ? m[2] : d.title,
      difficulty: WORD[d.difficulty] ?? "Medium", patternId: pattern?.id, week: pattern?.week, ...r,
      href: bankKey ? workspaceHref(bankKey) : d.link || LEETCODE_URL(slug), external: !bankKey,
      category: d.category, videoId: d.videoId || undefined, order: d.order ?? i,
    };
  });
}

/** Status from the Pattern Track log (latest matching entry), else the editor's solved list. */
export function rowState(row: ProblemRow, logs: LogEntry[], solvedIds: string[], today: Ymd): RowState {
  const log = logs
    .filter((l) => currentBankKey(l.bankSlug ?? "") === row.key || urlMatchesSlug(l.url, row.key))
    .sort((a, b) => compareYmd(b.dateSolved, a.dateSolved))[0];
  if (log) {
    if (isMastered(log)) return { status: "mastered", stage: log.stage };
    return { status: compareYmd(log.nextDue, today) <= 0 ? "due" : "review", stage: log.stage, nextDue: log.nextDue };
  }
  return { status: solvedIds.includes(row.key) ? "solved" : "todo" };
}

export const isDone = (s: RowStatus) => s !== "todo";

export interface ListFilter {
  query: string;
  difficulty: Difficulty[]; // empty = all
  patternIds: string[]; // empty = all
  status: "all" | "todo" | "done" | "due" | "mastered";
  runsHereOnly: boolean;
}

export const EMPTY_FILTER: ListFilter = { query: "", difficulty: [], patternIds: [], status: "all", runsHereOnly: false };

export function matchesFilter(row: ProblemRow, state: RowState, f: ListFilter): boolean {
  const q = f.query.trim().toLowerCase();
  if (q && !row.title.toLowerCase().includes(q) && String(row.number ?? "") !== q.replace(/^#/, "") && !row.key.includes(q)) return false;
  if (f.difficulty.length && !f.difficulty.includes(row.difficulty)) return false;
  if (f.patternIds.length && !(row.patternId && f.patternIds.includes(row.patternId))) return false;
  if (f.runsHereOnly && !row.runsHere) return false;
  switch (f.status) {
    case "todo": return state.status === "todo";
    case "done": return isDone(state.status);
    case "due": return state.status === "due";
    case "mastered": return state.status === "mastered";
    default: return true;
  }
}

export type SortKey = "default" | "difficulty" | "title" | "due";

export function sortRows<T extends { row: ProblemRow; state: RowState }>(items: T[], key: SortKey): T[] {
  const byOrder = (a: T, b: T) => a.row.order - b.row.order;
  const cmp: Record<SortKey, (a: T, b: T) => number> = {
    default: byOrder,
    difficulty: (a, b) => DIFF_RANK[a.row.difficulty] - DIFF_RANK[b.row.difficulty] || byOrder(a, b),
    title: (a, b) => a.row.title.localeCompare(b.row.title),
    // Soonest review first; unscheduled rows after, in their usual order.
    due: (a, b) => {
      const x = a.state.nextDue, y = b.state.nextDue;
      if (x && y) return compareYmd(x, y) || byOrder(a, b);
      return x ? -1 : y ? 1 : byOrder(a, b);
    },
  };
  return [...items].sort(cmp[key]);
}

export interface RowGroup<T> {
  id: string;
  title: string;
  week?: number;
  items: T[];
  done: number;
}

/** Group by pattern in roadmap order; rows without a pattern go last under "Other". */
export function groupByPattern<T extends { row: ProblemRow; state: RowState }>(items: T[]): RowGroup<T>[] {
  const groups = new Map<string, T[]>();
  for (const it of items) {
    const id = it.row.patternId ?? "other";
    groups.set(id, [...(groups.get(id) ?? []), it]);
  }
  const ids = [...PATTERNS.map((p) => p.id).filter((id) => groups.has(id)), ...(groups.has("other") ? ["other"] : [])];
  return ids.map((id) => {
    const its = groups.get(id)!;
    const p = PATTERN_BY_ID[id];
    return { id, title: p?.name ?? "Other", week: p?.week, items: its, done: its.filter((i) => isDone(i.state.status)).length };
  });
}

export interface ListSummary {
  byDifficulty: Record<Difficulty, { done: number; total: number }>;
  done: number;
  total: number;
  due: number;
  mastered: number;
}

export function summarize(items: { row: ProblemRow; state: RowState }[]): ListSummary {
  const byDifficulty = { Easy: { done: 0, total: 0 }, Medium: { done: 0, total: 0 }, Hard: { done: 0, total: 0 } };
  let done = 0, due = 0, mastered = 0;
  for (const { row, state } of items) {
    byDifficulty[row.difficulty].total++;
    if (isDone(state.status)) { byDifficulty[row.difficulty].done++; done++; }
    if (state.status === "due") due++;
    if (state.status === "mastered") mastered++;
  }
  return { byDifficulty, done, total: items.length, due, mastered };
}

/** "Pick one for me": an unsolved problem, preferring this week's pattern and ones that run here. */
export function pickOne<T extends { row: ProblemRow; state: RowState }>(items: T[], weekPatternId: string | undefined, seed: number): T | undefined {
  const todo = items.filter((i) => i.state.status === "todo");
  const tiers = [
    todo.filter((i) => i.row.patternId === weekPatternId && i.row.runsHere),
    todo.filter((i) => i.row.patternId === weekPatternId),
    todo.filter((i) => i.row.runsHere),
    todo,
  ];
  const pool = tiers.find((t) => t.length > 0);
  if (!pool) return undefined;
  return pool[Math.abs(Math.floor(seed)) % pool.length];
}

/** The next problem after `key` in the same pattern that runs in CodeOmen (roadmap order). */
export function nextInPattern(key: string): ProblemRow | undefined {
  const rows = allProblemRows();
  const i = rows.findIndex((r) => r.key === key);
  if (i < 0) return undefined;
  return rows.slice(i + 1).find((r) => r.patternId === rows[i].patternId && r.runsHere);
}
