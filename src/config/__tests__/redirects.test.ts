import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { PROBLEM_KEY_RENAMES, redirects } from "../redirects.mjs";
import { problems } from "@/utils/problems";
import { JAVA_PROBLEMS } from "@/utils/problems/java";

type Redirect = { source: string; destination: string; has?: { value: string }[] };
const all = redirects as Redirect[];
const tabRules = all.filter((r) => r.source === "/pattern-track");
const problemRules = all.filter((r) => r.source.startsWith("/problems/"));

const pagesDir = path.resolve(__dirname, "../../pages");
const pageExists = (route: string) => {
  const rel = route === "/" ? "index" : route.replace(/^\//, "");
  return ["", "/index"].some((suffix) =>
    ["tsx", "ts"].some((ext) => fs.existsSync(path.join(pagesDir, `${rel}${suffix}.${ext}`))),
  );
};

describe("Pattern Track redirects", () => {
  it("covers every old tab plus the bare route, catch-all last", () => {
    const tabs = tabRules.flatMap((r) => r.has?.map((h) => h.value) ?? ["(none)"]);
    expect(tabs.sort()).toEqual(["(none)", "log", "method", "roadmap", "today"]);
    expect(tabRules.at(-1)?.has).toBeUndefined();
  });
  it("points only at pages that exist, and the old page is gone", () => {
    for (const r of tabRules) expect(pageExists(r.destination), r.destination).toBe(true);
    expect(pageExists("/pattern-track")).toBe(false);
  });
});

describe("problem key renames", () => {
  const renames = PROBLEM_KEY_RENAMES as Record<string, string>;
  it("every new key is a bank problem, every old key is gone", () => {
    for (const [oldKey, newKey] of Object.entries(renames)) {
      expect(problems[newKey], newKey).toBeTruthy();
      expect(problems[oldKey], oldKey).toBeUndefined();
    }
  });
  it("matches every encoding of old URLs, and only those", () => {
    const hit = (url: string) =>
      problemRules.find((r) => {
        const src = r.source.replace(/^\/problems\//, "");
        const re = src.startsWith(":old(") ? new RegExp(`^${src.slice(5, -1)}$`) : new RegExp(`^${src.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);
        return re.test(url);
      })?.destination;
    expect(hit("kadane's%20algorithm")).toBe("/problems/maximum-subarray"); // what browsers send
    expect(hit("kadane%27s%20algorithm")).toBe("/problems/maximum-subarray");
    expect(hit("pascal's-triangle")).toBe("/problems/pascals-triangle");
    expect(hit("stock-buy-and-sell")).toBe("/problems/best-time-to-buy-and-sell-stock");
    expect(hit("kadanesalgorithm")).toBeUndefined();
    for (const r of problemRules) expect(Object.values(renames)).toContain(r.destination.replace("/problems/", ""));
  });
  it("Java tests are keyed by current bank keys", () => {
    for (const key of Object.keys(JAVA_PROBLEMS)) expect(problems[key], key).toBeTruthy();
  });
});
