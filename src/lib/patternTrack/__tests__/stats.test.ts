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

import { nextUp, weekLabel } from "../stats";
describe("nextUp / weekLabel", () => {
  it("returns the first unlogged problems in sheet order", () => {
    const p = PATTERN_BY_ID["arrays-hashing"];
    const logged = [log({ url: `https://leetcode.com/problems/${p.problems[0][2]}/` })];
    expect(nextUp(p, logged, 2).map((x) => x.slug)).toEqual([p.problems[1][2], p.problems[2][2]]);
    expect(nextUp(PATTERN_BY_ID["mixed-mocks"], [], 2)).toEqual([]);
    expect(nextUp(undefined, [], 2)).toEqual([]);
  });
  it("labels the week", () => {
    expect(weekLabel("2026-10-05", "2026-09-30")).toBe("Starts 5 Oct");
    expect(weekLabel("2026-10-05", "2026-10-19")).toBe("Wk 3 · Sliding Window");
    expect(weekLabel("2026-10-05", "2027-02-20")).toBe("Wk 20 · Mixed Mocks");
  });
});

import { questionOfTheDay, weekStartOf, weeklyActivity } from "../stats";
describe("weeklyActivity", () => {
  it("buckets logs and reviews by Monday-start week, oldest first", () => {
    expect(weekStartOf("2026-10-11")).toBe("2026-10-05"); // Sunday -> Monday
    expect(weekStartOf("2026-10-05")).toBe("2026-10-05");
    const w = weeklyActivity([
      log({ dateSolved: "2026-10-06", reviews: [{ date: "2026-10-07", result: "clean" }, { date: "2026-10-13", result: "forgot" }] }),
      log({ dateSolved: "2026-10-12", reviews: [{ date: "2026-10-13", result: "clean" }] }),
      log({ dateSolved: "2026-01-01" }),
    ], "2026-10-14", 3);
    expect(w.map((x) => x.weekStart)).toEqual(["2026-09-28", "2026-10-05", "2026-10-12"]);
    expect(w.map((x) => [x.logged, x.reviews, x.recallPct])).toEqual([[0, 0, null], [1, 1, 100], [1, 2, 50]]);
    expect(w[1].label).toBe("5 Oct");
  });
});

describe("questionOfTheDay", () => {
  it("is stable within a day, varies by seed, and skips logged + excluded problems", () => {
    const a = questionOfTheDay([], "2026-10-05", "2026-10-20", "u1");
    expect(questionOfTheDay([], "2026-10-05", "2026-10-20", "u1")).toEqual(a);
    const seeds = new Set(["a", "b", "c", "d", "e", "f"].map((s) => questionOfTheDay([], "2026-10-05", "2026-10-20", s)?.slug));
    expect(seeds.size).toBeGreaterThan(1);
    // Before the track starts, only week 1 is eligible.
    const early = questionOfTheDay([], "2026-10-05", "2026-10-01", "u1");
    expect(PATTERN_BY_ID["arrays-hashing"].problems.map((p) => p[2])).toContain(early?.slug);
    // Excluding every week-1 problem but one forces that one.
    const w1 = PATTERN_BY_ID["arrays-hashing"].problems.map((p) => p[2]);
    expect(questionOfTheDay([], "2026-10-05", "2026-10-01", "u1", () => true, w1.slice(1))?.slug).toBe(w1[0]);
  });
  it("prefers runnable problems and returns null when everything is logged", () => {
    const q = questionOfTheDay([], "2026-10-05", "2026-10-20", "u1", (s) => s === "3sum");
    expect(q?.slug).toBe("3sum");
    const all = PATTERN_BY_ID["arrays-hashing"].problems.map(([, , slug]) => log({ url: `https://leetcode.com/problems/${slug}/` }));
    expect(questionOfTheDay(all, "2026-10-05", "2026-10-01", "u1")).toBeNull();
  });
});

import { activityLevel, dailyActivity } from "../stats";
describe("profile data", () => {
  it("weeklyActivity tracks mediums solved solo per week", () => {
    const w = weeklyActivity([
      log({ dateSolved: "2026-10-06", difficulty: "M", solvedSolo: true }),
      log({ dateSolved: "2026-10-07", difficulty: "M", solvedSolo: false }),
      log({ dateSolved: "2026-10-08", difficulty: "E", solvedSolo: false }),
    ], "2026-10-08", 2);
    expect(w.map((x) => [x.mediums, x.mediumsSolo, x.mediumSoloPct])).toEqual([[0, 0, null], [2, 1, 50]]);
  });
  it("dailyActivity covers whole Monday-start weeks and counts logs and reviews", () => {
    const d = dailyActivity([
      log({ dateSolved: "2026-10-06", reviews: [{ date: "2026-10-07", result: "clean" }, { date: "2026-10-07", result: "shaky" }] }),
      log({ dateSolved: "2025-01-01" }),
    ], "2026-10-08", 2);
    expect(d).toHaveLength(14);
    expect(d[0].date).toBe("2026-09-28");
    expect(d.at(-1)?.date).toBe("2026-10-11");
    expect(d.find((x) => x.date === "2026-10-06")?.logged).toBe(1);
    expect(d.find((x) => x.date === "2026-10-07")?.reviews).toBe(2);
    expect(d.reduce((s, x) => s + x.logged, 0)).toBe(1);
  });
  it("buckets activity into 5 levels", () => {
    expect([0, 1, 2, 3, 4, 5, 6, 20].map(activityLevel)).toEqual([0, 1, 2, 2, 3, 3, 4, 4]);
  });
});
