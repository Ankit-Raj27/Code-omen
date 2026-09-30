import { describe, expect, it } from "vitest";
import { loggedMinutes, timeboxPhase } from "../session";

describe("timebox", () => {
  it("defaults to 25 minutes when the timer never ran, else rounds, min 1", () => {
    expect(loggedMinutes(0)).toBe(25);
    expect(loggedMinutes(20)).toBe(1);
    expect(loggedMinutes(29 * 60 + 40)).toBe(30);
  });
  it("walks idle -> on-track -> over -> extended -> read-solution", () => {
    expect(timeboxPhase(0, false, false)).toBe("idle");
    expect(timeboxPhase(0, true, false)).toBe("on-track");
    expect(timeboxPhase(24 * 60 + 59, true, false)).toBe("on-track");
    expect(timeboxPhase(25 * 60, true, false)).toBe("over");
    expect(timeboxPhase(40 * 60, true, false)).toBe("over");
    expect(timeboxPhase(30 * 60, true, true)).toBe("extended");
    expect(timeboxPhase(35 * 60, true, true)).toBe("read-solution");
    expect(timeboxPhase(10 * 60, false, false)).toBe("on-track"); // paused mid-attempt
  });
});
