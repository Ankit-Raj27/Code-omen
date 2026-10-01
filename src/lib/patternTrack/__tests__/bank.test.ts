import { describe, expect, it } from "vitest";
import { allBankMeta, bankMeta } from "../bank";
import { problems } from "@/utils/problems";

describe("bank metadata (seeds Firestore problems/{slug})", () => {
  it("covers every bank problem with a unique order", () => {
    const all = allBankMeta();
    expect(all.length).toBe(Object.keys(problems).length);
    for (const m of all) expect(m.title.length, m.id).toBeGreaterThan(0);
  });
  it("derives difficulty and category from the pattern sheet", () => {
    expect(bankMeta("two-sum")).toMatchObject({ id: "two-sum", difficulty: "Easy", category: "Arrays & Hashing" });
    expect(bankMeta("minimum-window-substring")?.difficulty).toBe("Hard");
    expect(bankMeta("nope")).toBeUndefined();
  });
});

describe("problem bank ordering", () => {
  it("numbers problems 1..N in roadmap order, with LeetCode-numbered titles", () => {
    const list = Object.values(problems).sort((a, b) => a.order - b.order);
    expect(list.map((p) => p.order)).toEqual(list.map((_, i) => i + 1));
    expect(list[0].id).toBe("contains-duplicate");
    for (const p of list) expect(p.title, p.id).toMatch(/^\d+\. \S/);
  });
});
