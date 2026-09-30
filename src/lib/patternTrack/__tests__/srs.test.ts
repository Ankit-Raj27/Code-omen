import { describe, expect, it } from "vitest";
import {
  INTERVALS,
  dueQueue,
  initialSchedule,
  isDue,
  isMastered,
  isOverdue,
  scheduleNext,
  type SrsFields,
} from "../srs";
import { addDays, daysBetween, todayLocal } from "../dates";

const TODAY = "2026-10-10";
const entry = (stage: number, nextDue = TODAY, reviews: SrsFields["reviews"] = []): SrsFields => ({
  stage,
  nextDue,
  reviews,
});

describe("initialSchedule", () => {
  it("starts at stage 0, due the day after solving", () => {
    expect(initialSchedule("2026-10-05")).toEqual({ stage: 0, nextDue: "2026-10-06", reviews: [] });
  });
});

describe("scheduleNext", () => {
  it.each([0, 1, 2, 3])("clean from stage %i advances one stage", (s) => {
    const r = scheduleNext(entry(s), "clean", TODAY);
    expect(r.stage).toBe(s + 1);
    expect(r.nextDue).toBe(addDays(TODAY, INTERVALS[s + 1]));
  });

  it.each([0, 1, 2, 3, 4])("shaky at stage %i keeps stage and repeats interval", (s) => {
    const r = scheduleNext(entry(s), "shaky", TODAY);
    expect(r.stage).toBe(s);
    expect(daysBetween(TODAY, r.nextDue)).toBe(INTERVALS[s]);
  });

  it.each([0, 2, 4])("forgot at stage %i resets to 0, due tomorrow", (s) => {
    const r = scheduleNext(entry(s), "forgot", TODAY);
    expect(r).toMatchObject({ stage: 0, nextDue: "2026-10-11" });
  });

  it("clean at stage 4 masters the entry and removes it from the queue", () => {
    const r = scheduleNext(entry(4), "clean", TODAY);
    expect(r.stage).toBe(5);
    expect(isMastered(r)).toBe(true);
    expect(isDue({ ...r, nextDue: "2000-01-01" }, TODAY)).toBe(false);
    expect(dueQueue([r], "2099-01-01")).toEqual([]);
  });

  it("clean on an already-mastered entry stays at 5", () => {
    expect(scheduleNext(entry(5), "clean", TODAY).stage).toBe(5);
  });

  it("appends a review without mutating the input", () => {
    const e = entry(1, TODAY, [{ date: "2026-10-07", result: "clean" }]);
    const r = scheduleNext(e, "shaky", TODAY);
    expect(r.reviews).toEqual([
      { date: "2026-10-07", result: "clean" },
      { date: TODAY, result: "shaky" },
    ]);
    expect(e.reviews).toHaveLength(1);
  });

  it("schedules from the grading day, not the old due date (overdue item)", () => {
    const r = scheduleNext(entry(2, "2026-09-01"), "clean", TODAY);
    expect(r.nextDue).toBe(addDays(TODAY, 21));
  });

  it("clamps corrupt stages", () => {
    expect(scheduleNext(entry(-3), "clean", TODAY).stage).toBe(1);
    expect(scheduleNext(entry(NaN), "shaky", TODAY).stage).toBe(0);
  });
});

describe("due / overdue queue", () => {
  const items = [
    { id: "a", ...entry(1, "2026-10-10") },
    { id: "b", ...entry(0, "2026-10-02") },
    { id: "c", ...entry(2, "2026-10-11") },
    { id: "d", ...entry(5, "2026-10-01") },
    { id: "e", ...entry(3, "2026-10-08") },
  ];

  it("includes due and overdue, excludes future and mastered, oldest first", () => {
    expect(dueQueue(items, TODAY).map((i) => i.id)).toEqual(["b", "e", "a"]);
  });

  it("flags only strictly-past items as overdue", () => {
    expect(isOverdue(items[0], TODAY)).toBe(false);
    expect(isOverdue(items[1], TODAY)).toBe(true);
    expect(isOverdue(items[3], TODAY)).toBe(false); // mastered
  });
});

describe("dates / timezone edges", () => {
  it("addDays crosses month, year and leap day", () => {
    expect(addDays("2026-10-31", 1)).toBe("2026-11-01");
    expect(addDays("2026-12-25", 7)).toBe("2027-01-01");
    expect(addDays("2028-02-28", 1)).toBe("2028-02-29");
    expect(addDays("2026-11-20", 45)).toBe("2027-01-04");
  });

  it("IST day starts at 18:30 UTC", () => {
    expect(todayLocal(new Date("2026-10-05T18:29:59Z"), "Asia/Kolkata")).toBe("2026-10-05");
    expect(todayLocal(new Date("2026-10-05T18:30:00Z"), "Asia/Kolkata")).toBe("2026-10-06");
    // The UTC date lags IST just after local midnight.
    expect(todayLocal(new Date("2026-10-05T18:31:00Z"), "UTC")).toBe("2026-10-05");
  });

  it("an item due tomorrow becomes due at IST midnight, not UTC midnight", () => {
    const e = entry(0, "2026-10-06");
    const at0001Ist = todayLocal(new Date("2026-10-05T18:31:00Z"), "Asia/Kolkata");
    const at2359Ist = todayLocal(new Date("2026-10-05T18:29:00Z"), "Asia/Kolkata");
    expect(isDue(e, at0001Ist)).toBe(true);
    expect(isDue(e, at2359Ist)).toBe(false);
  });

  it("addDays is DST-safe in DST zones", () => {
    // US DST ends 2026-11-01; pure string math must not drift.
    expect(addDays("2026-10-31", 3)).toBe("2026-11-03");
    expect(addDays("2027-03-13", 1)).toBe("2027-03-14");
  });

  it("rejects malformed dates", () => {
    expect(() => addDays("2026-1-5", 1)).toThrow();
  });
});
