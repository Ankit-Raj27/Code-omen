import { describe, expect, it } from "vitest";
import { PATTERNS } from "@/content/patterns";
import type { LogEntry } from "@/lib/patternTrack/stats";
import {
  EMPTY_FILTER, allProblemRows, groupByPattern, matchesFilter, pickOne, rowState, sheetRows, sortRows, summarize,
} from "../problemList";

const log = (o: Partial<LogEntry>): LogEntry => ({
  id: "x", name: "", url: "", patternId: "arrays-hashing", difficulty: "E", solvedSolo: true, minutes: 10, dateSolved: "2026-10-01",
  insight: "i", stuckOn: "", complexity: "", stage: 1, nextDue: "2026-10-04", reviews: [], ...o,
});
const today = "2026-10-05";

describe("problem rows", () => {
  const rows = allProblemRows();
  it("has every roadmap problem once, in roadmap order, and the off-roadmap bank", () => {
    const roadmap = PATTERNS.flatMap((p) => [...p.problems, ...(p.stretch ?? [])].map(([, , s]) => s));
    expect(new Set(rows.map((r) => r.key)).size).toBe(rows.length);
    for (const s of roadmap) expect(rows.some((r) => r.key === s), s).toBe(true);
    expect(rows[0]).toMatchObject({ key: "contains-duplicate", runsHere: true, external: false, week: 1 });
    expect(rows.find((r) => r.key === "climbing-stairs")).toMatchObject({ runsHere: false, external: true });
    expect(rows.find((r) => r.key === "two-sum")?.languages).toEqual(["JS", "Java"]);
  });
  it("maps sheet docs, linking to the workspace when the problem runs here", () => {
    const [a, b] = sheetRows([
      { id: "x1", title: "Two Sum", difficulty: "Easy", link: "https://leetcode.com/problems/two-sum/" },
      { id: "x2", title: "Climbing Stairs", difficulty: "Easy", link: "https://leetcode.com/problems/climbing-stairs/", videoId: "v" },
    ]);
    expect(a).toMatchObject({ key: "two-sum", href: "/problems/two-sum", runsHere: true, patternId: "arrays-hashing" });
    expect(b).toMatchObject({ external: true, href: "https://leetcode.com/problems/climbing-stairs/", videoId: "v", patternId: "dp-1d" });
  });
});

describe("status, filters, sort, groups", () => {
  const rows = allProblemRows();
  const row = (k: string) => rows.find((r) => r.key === k)!;
  it("status comes from the latest log, then the solved list", () => {
    expect(rowState(row("two-sum"), [log({ bankSlug: "two-sum" })], [], today)).toMatchObject({ status: "due", stage: 1 });
    expect(rowState(row("two-sum"), [log({ url: "https://leetcode.com/problems/two-sum/", nextDue: "2026-10-09" })], [], today).status).toBe("review");
    expect(rowState(row("two-sum"), [log({ bankSlug: "two-sum", stage: 5 })], [], today).status).toBe("mastered");
    expect(rowState(row("two-sum"), [], ["two-sum"], today).status).toBe("solved");
    expect(rowState(row("two-sum"), [], [], today).status).toBe("todo");
  });
  it("filters by text, number, difficulty, pattern, status and 'runs here'", () => {
    const todo = { status: "todo" as const };
    expect(matchesFilter(row("two-sum"), todo, { ...EMPTY_FILTER, query: "two s" })).toBe(true);
    expect(matchesFilter(row("two-sum"), todo, { ...EMPTY_FILTER, query: "#1" })).toBe(true);
    expect(matchesFilter(row("two-sum"), todo, { ...EMPTY_FILTER, difficulty: ["Hard"] })).toBe(false);
    expect(matchesFilter(row("two-sum"), todo, { ...EMPTY_FILTER, patternIds: ["heap"] })).toBe(false);
    expect(matchesFilter(row("two-sum"), todo, { ...EMPTY_FILTER, status: "done" })).toBe(false);
    expect(matchesFilter(row("climbing-stairs"), todo, { ...EMPTY_FILTER, runsHereOnly: true })).toBe(false);
  });
  it("sorts by due date with unscheduled rows last, and groups in roadmap order", () => {
    const items = ["two-sum", "3sum", "valid-anagram"].map((k, i) => ({ row: row(k), state: i === 1 ? { status: "review" as const, nextDue: "2026-10-06" } : { status: "todo" as const } }));
    expect(sortRows(items, "due").map((i) => i.row.key)[0]).toBe("3sum");
    const groups = groupByPattern(items);
    expect(groups.map((g) => g.id)).toEqual(["arrays-hashing", "two-pointers"]);
    expect(groups[1].done).toBe(1);
    expect(summarize(items)).toMatchObject({ done: 1, total: 3 });
  });
  it("picks an unsolved problem from this week's pattern first", () => {
    const items = rows.map((r) => ({ row: r, state: { status: "todo" as const } }));
    for (let seed = 0; seed < 5; seed++) expect(pickOne(items, "heap", seed)?.row.patternId).toBe("heap");
    expect(pickOne(items.map((i) => ({ ...i, state: { status: "solved" as const } })), "heap", 1)).toBeUndefined();
  });
});
