import { describe, expect, it } from "vitest";
import { problems } from "@/utils/problems";
import { fromJavaRun, fromLegacyRun, summarizeCases } from "../runResults";
import { JS_REFS } from "@/content/problems/__tests__/refs.js";

const evalCode = (slug: string, code: string) => new Function(`return ${code.slice(code.indexOf(problems[slug].starterFunctionName))}`)();

describe("per-case JavaScript results", () => {
  it("reports every case, with input, expected and got", () => {
    const cases = problems["binary-search"].runCases!(evalCode("binary-search", "function search(nums, target) { return nums.indexOf(target) > 2 ? 0 : nums.indexOf(target); }"));
    expect(cases.length).toBeGreaterThan(2);
    const fail = cases.find((c) => c.status === "fail")!;
    expect(fail.input).toMatch(/^nums = \[.*\], target = /);
    expect(fail.expected).toBeDefined();
    expect(fail.got).toBe("0");
    expect(summarizeCases(cases, "javascript").verdict).toBe("wrong_answer");
  });
  it("accepts a reference and shows order-insensitive answers as returned", () => {
    const cases = problems["subsets"].runCases!(evalCode("subsets", JS_REFS["subsets"]));
    expect(summarizeCases(cases, "javascript")).toMatchObject({ verdict: "accepted", passed: cases.length });
  });
  it("catches a crash per case instead of stopping", () => {
    const cases = problems["koko-eating-bananas"].runCases!(evalCode("koko-eating-bananas", "function minEatingSpeed(piles, h) { return piles.x.y; }"));
    expect(cases.every((c) => c.status === "error" && /undefined/.test(c.message ?? ""))).toBe(true);
    expect(summarizeCases(cases, "javascript").verdict).toBe("runtime_error");
  });
  it("design problems describe the operations", () => {
    const cases = problems["min-stack"].runCases!(evalCode("min-stack", JS_REFS["min-stack"]));
    expect(cases[0].input).toMatch(/^push\(4\), push\(1\), getMin\(\)/);
  });
});

describe("Java and legacy results", () => {
  it("parses harness lines", () => {
    const s = fromJavaRun({ status: "wrong_answer", passed: 1, total: 3, lines: ["PASS 1", "FAIL 2 expected=[1, 2] got=[2, 1]", "ERROR 3 java.lang.NullPointerException"] });
    expect(s.verdict).toBe("wrong_answer");
    expect(s.cases[1]).toMatchObject({ index: 2, status: "fail", expected: "[1, 2]", got: "[2, 1]" });
    expect(s.cases[2]).toMatchObject({ status: "error", message: "java.lang.NullPointerException" });
    expect(fromJavaRun({ status: "compile_error", passed: 0, total: 0, lines: [], message: "x" }).verdict).toBe("compile_error");
  });
  it("hand-written problems: pass, assertion, crash", () => {
    expect(fromLegacyRun(null, "javascript").verdict).toBe("accepted");
    expect(fromLegacyRun(new Error("AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal"), "javascript").verdict).toBe("wrong_answer");
    expect(fromLegacyRun(new TypeError("x is not a function"), "javascript")).toMatchObject({ verdict: "runtime_error", message: "x is not a function" });
  });
});
