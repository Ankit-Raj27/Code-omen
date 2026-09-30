import { describe, expect, it } from "vitest";
import { PATTERNS, PATTERN_BY_ID } from "@/content/patterns";
import {
  currentWeek, filterLogs, logsToCsv, patternForWeek, patternProgress,
  sortNewestFirst, streak, todayStats, urlMatchesSlug, type LogEntry,
} from "../stats";

const log = (over: Partial<LogEntry>): LogEntry => ({
  id: Math.random().toString(36).slice(2),
  name: "Two Sum", url: "https://leetcode.com/problems/two-sum/", patternId: "arrays-hashing",
  difficulty: "E", solvedSolo: true, minutes: 20, dateSolved: "2026-10-05", insight: "seen-set",
  stuckOn: "", complexity: "O(n)", stage: 0, nextDue: "2026-10-06", reviews: [], ...over,
});

describe("content", () => {
  it("has 18 patterns in weekly order with 4–6 problems (except mocks)", () => {
    expect(PATTERNS).toHaveLength(18);
    PATTERNS.forEach((p, i) => expect(p.week).toBe(i + 1));
    PATTERNS.slice(0, 17).forEach((p) => {
      expect(p.problems.length).toBeGreaterThanOrEqual(4);
      expect(p.problems.length).toBeLessThanOrEqual(6);
    });
    expect(PATTERN_BY_ID["mixed-mocks"].problems).toEqual([]);
    expect(new Set(PATTERNS.map((p) => p.id)).size).toBe(18);
  });
});

describe("currentWeek / patternForWeek", () => {
  it("counts from the start date", () => {
    expect(currentWeek("2026-10-05", "2026-10-04")).toBe(0);
    expect(currentWeek("2026-10-05", "2026-10-05")).toBe(1);
    expect(currentWeek("2026-10-05", "2026-10-11")).toBe(1);
    expect(currentWeek("2026-10-05", "2026-10-12")).toBe(2);
    expect(currentWeek("2026-10-05", "2027-12-01")).toBe(22);
  });
  it("maps weeks 18–22 to Mixed Mocks", () => {
    expect(patternForWeek(0)).toBeUndefined();
    expect(patternForWeek(3)?.id).toBe("sliding-window");
    expect(patternForWeek(18)?.id).toBe("mixed-mocks");
    expect(patternForWeek(22)?.id).toBe("mixed-mocks");
  });
});

describe("progress & slug matching", () => {
  it("matches only the exact slug", () => {
    expect(urlMatchesSlug("https://leetcode.com/problems/two-sum/description/", "two-sum")).toBe(true);
    expect(urlMatchesSlug("https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/", "two-sum")).toBe(false);
    expect(urlMatchesSlug("https://leetcode.com/problems/two-sum", "two-sum")).toBe(true);
  });
  it("computes logged / solo / mastered", () => {
    const p = PATTERN_BY_ID["arrays-hashing"];
    const pr = patternProgress(p, [
      log({}),
      log({ url: "https://leetcode.com/problems/group-anagrams/", solvedSolo: false, stage: 5 }),
    ]);
    expect(pr).toMatchObject({ logged: 2, total: p.problems.length, solo: 1, mastered: 1 });
    expect(pr.done.has("two-sum")).toBe(true);
  });
});

describe("todayStats / streak", () => {
  it("computes the four stats", () => {
    const s = todayStats([
      log({ difficulty: "M", solvedSolo: true, nextDue: "2026-10-06" }),
      log({ difficulty: "M", solvedSolo: false, nextDue: "2026-10-01" }),
      log({ difficulty: "M", solvedSolo: false, stage: 5, nextDue: "2026-10-01" }),
      log({ nextDue: "2026-10-09" }),
    ], "2026-10-06");
    expect(s).toEqual({ dueToday: 2, totalLogged: 4, mediumSoloPct: 33, mastered: 1 });
    expect(todayStats([log({})], "2026-10-06").mediumSoloPct).toBeNull();
  });
  it("streak counts consecutive active days and tolerates today being empty", () => {
    const logs = [
      log({ dateSolved: "2026-10-05" }),
      log({ dateSolved: "2026-10-03", reviews: [{ date: "2026-10-04", result: "clean" }] }),
      log({ dateSolved: "2026-09-30" }),
    ];
    expect(streak(logs, "2026-10-05")).toBe(3);
    expect(streak(logs, "2026-10-06")).toBe(3);
    expect(streak(logs, "2026-10-07")).toBe(0);
  });
});

describe("table helpers", () => {
  const logs = [
    log({ id: "a", dateSolved: "2026-10-05", createdAtMs: 1 }),
    log({ id: "b", dateSolved: "2026-10-06", name: "3Sum", patternId: "two-pointers", solvedSolo: false, insight: "sort then pointers" }),
    log({ id: "c", dateSolved: "2026-10-05", createdAtMs: 2 }),
  ];
  it("sorts newest first", () => {
    expect(sortNewestFirst(logs).map((l) => l.id)).toEqual(["b", "c", "a"]);
  });
  it("filters by pattern, solo and text over name + insight", () => {
    expect(filterLogs(logs, { patternId: "two-pointers" }).map((l) => l.id)).toEqual(["b"]);
    expect(filterLogs(logs, { solo: "help" }).map((l) => l.id)).toEqual(["b"]);
    expect(filterLogs(logs, { text: "POINTERS" }).map((l) => l.id)).toEqual(["b"]);
    expect(filterLogs(logs, { solo: "solo" })).toHaveLength(2);
  });
  it("exports escaped CSV and neutralizes formulas", () => {
    const csv = logsToCsv([log({ name: '=HYPERLINK("x")', insight: 'say "hi", ok', reviews: [{ date: "2026-10-06", result: "clean" }] })]);
    const [header, row] = csv.split("\r\n");
    expect(header.startsWith("name,url,patternId")).toBe(true);
    expect(row).toContain(`"'=HYPERLINK(""x"")"`);
    expect(row).toContain(`"say ""hi"", ok"`);
    expect(row).toContain(`"2026-10-06:clean"`);
  });
});

import { safeHttpUrl } from "../dates";
describe("safeHttpUrl", () => {
  it("allows http(s) only", () => {
    expect(safeHttpUrl(" https://leetcode.com/problems/x/ ")).toBe("https://leetcode.com/problems/x/");
    expect(safeHttpUrl("javascript:alert(1)")).toBe("");
    expect(safeHttpUrl("JavaScript:alert(1)")).toBe("");
    expect(safeHttpUrl(undefined)).toBe("");
  });
});
