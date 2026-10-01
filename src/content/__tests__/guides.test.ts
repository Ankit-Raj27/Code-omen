import { describe, expect, it } from "vitest";
import { GUIDES } from "../guides";
import { problems } from "@/utils/problems";

const words = (s: string) => s.trim().split(/\s+/).length;

describe("per-problem guides", () => {
  it("every problem page has a guide, and every guide is for a real problem", () => {
    for (const key of Object.keys(problems)) expect(GUIDES[key], key).toBeTruthy();
    for (const key of Object.keys(GUIDES)) expect(problems[key], key).toBeTruthy();
  });
  it("3–4 approach points and exactly 3 hints, all short and distinct", () => {
    for (const [key, g] of Object.entries(GUIDES)) {
      expect(g.approach.length, key).toBeGreaterThanOrEqual(3);
      expect(g.approach.length, key).toBeLessThanOrEqual(4);
      expect(g.hints.length, key).toBe(3);
      for (const t of [...g.approach, ...g.hints]) {
        expect(t.length, key).toBeGreaterThan(20);
        expect(words(t), `${key}: ${t}`).toBeLessThanOrEqual(60);
      }
      expect(new Set(g.hints).size, key).toBe(3);
    }
  });
});
