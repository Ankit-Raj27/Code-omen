import { describe, expect, it } from "vitest";
import { isLoggedListProblem, listProblemSlug, patternForListProblem } from "../lists";
import type { LogEntry } from "../stats";

const log = (o: Partial<LogEntry>) => ({ id: "x", name: "", url: "", patternId: "", difficulty: "E", solvedSolo: true, minutes: 1,
  dateSolved: "2026-10-05", insight: "i", stuckOn: "", complexity: "", stage: 0, nextDue: "2026-10-06", reviews: [], ...o }) as LogEntry;

describe("list problems", () => {
  it("reads the slug from a LeetCode link, else the id", () => {
    expect(listProblemSlug({ id: "abc", link: "https://leetcode.com/problems/two-sum/description/" })).toBe("two-sum");
    expect(listProblemSlug({ id: "Group-Anagrams", link: "https://www.geeksforgeeks.org/x" })).toBe("group-anagrams");
  });
  it("maps to roadmap patterns and off-roadmap bank patterns", () => {
    expect(patternForListProblem({ id: "3sum" })?.id).toBe("two-pointers");
    expect(patternForListProblem({ id: "pascals-triangle" })?.id).toBe("dp-1d");
    expect(patternForListProblem({ id: "some-gfg-only-problem" })).toBeUndefined();
  });
  it("counts log entries by URL or bank key, including old keys", () => {
    expect(isLoggedListProblem({ id: "3sum" }, [log({ url: "https://leetcode.com/problems/3sum/" })])).toBe(true);
    expect(isLoggedListProblem({ id: "maximum-subarray" }, [log({ bankSlug: "kadane's algorithm" })])).toBe(true);
    expect(isLoggedListProblem({ id: "3sum" }, [log({ url: "https://leetcode.com/problems/3sum-closest/" })])).toBe(false);
  });
});
