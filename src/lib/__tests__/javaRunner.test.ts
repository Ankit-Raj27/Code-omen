import { describe, expect, it } from "vitest";
import { buildJavaSource, hasJava, parseHarnessOutput } from "../javaRunner";

const N = "0123456789abcdef0123456789abcdef";

describe("buildJavaSource", () => {
  const src = buildJavaSource(
    "two-sum",
    "import java.util.HashMap;\npackage foo;\npublic class Solution { public int[] twoSum(int[] a, int t) { return a; } }\nclass Main {}",
    N,
  );
  it("hoists user imports above all classes and drops package lines", () => {
    expect(src.indexOf("import java.util.HashMap;")).toBeLessThan(src.indexOf("class Solution"));
    expect(src).not.toContain("package foo;");
  });
  it("keeps Main as the only public class and renames a user Main", () => {
    expect(src).toContain("\nclass Solution");
    expect(src).toContain("class UserMain");
    expect(src.match(/public class /g)).toHaveLength(1);
  });
  it("injects the server-side tests and nonce", () => {
    expect(src).toContain("s.twoSum(new int[]{2, 7, 11, 15}, 9)");
    expect(src).toContain(`"${N}"`);
  });
  it("rejects unknown problems and bad nonces", () => {
    expect(hasJava("valid-sudoku")).toBe(false);
    expect(() => buildJavaSource("valid-sudoku", "", N)).toThrow();
    expect(() => buildJavaSource("two-sum", "", "not-hex")).toThrow();
  });
});

describe("parseHarnessOutput", () => {
  it("trusts only the DONE line with this run's nonce", () => {
    const out = `DONE ${"f".repeat(32)} 9/9\nPASS 1\nFAIL 2 expected=1 got=2\n\nDONE ${N} 1/2\n`;
    expect(parseHarnessOutput(out, N)).toMatchObject({ done: true, passed: 1, total: 2 });
    expect(parseHarnessOutput("PASS 1\nPASS 2\n", N)).toMatchObject({ done: false, passed: 0 });
  });
});
