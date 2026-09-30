import { execFileSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { describe, expect, it } from "vitest";
import { PATTERNS, PATTERN_BY_ID } from "@/content/patterns";
import { buildJavaSource, parseHarnessOutput } from "@/lib/javaRunner";
import { problems } from "@/utils/problems";
import { JAVA_PROBLEMS } from "@/utils/problems/java";
import { SPECS } from "..";
import { JS_REFS } from "./refs.js";
import { JAVA_REFS } from "./refs.java";

/** Run code the way the editor does: slice from the starter name, evaluate, hand to the handler. */
function runJs(slug: string, code: string): boolean {
  const p = problems[slug];
  const src = code.slice(code.indexOf(p.starterFunctionName));
  const cb = new Function(`return ${src}`)();
  return (p.handlerFunction as (fn: unknown) => boolean)(cb);
}

describe("spec registry", () => {
  it("has unique slugs, known patterns, enough tests and examples", () => {
    expect(new Set(SPECS.map((s) => s.slug)).size).toBe(SPECS.length);
    for (const s of SPECS) {
      expect(PATTERN_BY_ID[s.patternId], s.slug).toBeTruthy();
      expect(s.tests.length, s.slug).toBeGreaterThanOrEqual(s.kind === "design" ? 3 : 3);
      expect(s.examples.length, s.slug).toBeGreaterThanOrEqual(1);
      expect(s.insight.length, s.slug).toBeGreaterThan(20);
    }
  });
  it("every spec is on its pattern sheet (core or stretch) and in the bank", () => {
    for (const s of SPECS) {
      const pat = PATTERN_BY_ID[s.patternId];
      const listed = [...pat.problems, ...(pat.stretch ?? [])].find(([, , slug]) => slug === s.slug);
      expect(listed, s.slug).toBeTruthy();
      expect(listed?.[0]).toBe(s.lc);
      expect(listed?.[3]).toBe(s.difficulty);
      expect(problems[s.slug], s.slug).toBeTruthy();
      expect(JAVA_PROBLEMS[s.slug], s.slug).toBeTruthy();
    }
  });
  it("weeks 1–10: every core and stretch problem now runs in CodeOmen", () => {
    for (const p of PATTERNS.filter((x) => x.week <= 10)) {
      for (const [, , slug] of [...p.problems, ...(p.stretch ?? [])]) expect(problems[slug], `${p.id}: ${slug}`).toBeTruthy();
      expect(p.stretch?.length, p.id).toBe(3);
    }
  });
});

describe("JavaScript tests", () => {
  for (const s of SPECS) {
    it(`${s.slug}: reference passes, starter fails`, () => {
      expect(JS_REFS[s.slug], "missing JS reference").toBeTruthy();
      expect(runJs(s.slug, JS_REFS[s.slug])).toBe(true);
      expect(() => runJs(s.slug, problems[s.slug].starterCode)).toThrow(/AssertionError|not a function|undefined|null/);
    });
  }
});

const hasJavac = (() => {
  try {
    execFileSync("javac", ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
})();

describe.skipIf(!hasJavac)("Java harnesses (javac --release 13)", () => {
  const nonce = "0123456789abcdef0123456789abcdef";
  const run = (slug: string, code: string) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "co-java-"));
    try {
      fs.writeFileSync(path.join(dir, "Main.java"), buildJavaSource(slug, code, nonce));
      try {
        execFileSync("javac", ["--release", "13", "-nowarn", "Main.java"], { cwd: dir, stdio: "pipe" });
      } catch (e) {
        return { compileError: String((e as { stderr?: Buffer }).stderr ?? e) };
      }
      const out = execFileSync("java", ["-cp", ".", "Main"], { cwd: dir, env: { ...process.env, JAVA_TOOL_OPTIONS: "" }, timeout: 20000 }).toString();
      return parseHarnessOutput(out, nonce);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  };
  for (const s of SPECS) {
    it(`${s.slug}: reference passes, starter compiles and fails`, () => {
      expect(JAVA_REFS[s.slug], "missing Java reference").toBeTruthy();
      const ok = run(s.slug, JAVA_REFS[s.slug]) as { compileError?: string; done?: boolean; passed?: number; total?: number };
      expect(ok.compileError).toBeUndefined();
      expect(ok.done && ok.passed === ok.total && (ok.total ?? 0) > 0, JSON.stringify(ok)).toBe(true);
      const st = run(s.slug, JAVA_PROBLEMS[s.slug].starter) as { compileError?: string; passed?: number; total?: number };
      expect(st.compileError, "starter must compile").toBeUndefined();
      expect((st.passed ?? 0) < (st.total ?? 1), "starter must fail").toBe(true);
    }, 60000);
  }
});
