// Per-test-case results for the editor's result panel, from either language.
// Pure: no React, no Firebase.

export type CaseStatus = "pass" | "fail" | "error";

export interface CaseResult {
  index: number; // 1-based
  status: CaseStatus;
  input?: string;
  expected?: string;
  got?: string;
  message?: string;
}

export type Verdict =
  | "accepted" | "wrong_answer" | "runtime_error" | "compile_error" | "syntax_error" | "time_limit" | "error";

export interface RunSummary {
  verdict: Verdict;
  passed: number;
  total: number;
  cases: CaseResult[];
  /** Compiler output, an error message, or why per-case detail is missing. */
  message?: string;
  language: "javascript" | "java";
  ms?: number;
}

const show = (v: unknown) => (v === undefined ? "undefined" : JSON.stringify(v));
export { show as showValue };

/** Summary from a full list of case results. */
export function summarizeCases(cases: CaseResult[], language: RunSummary["language"], ms?: number): RunSummary {
  const passed = cases.filter((c) => c.status === "pass").length;
  const verdict: Verdict = passed === cases.length ? "accepted" : cases.some((c) => c.status === "error") && !cases.some((c) => c.status === "fail") ? "runtime_error" : "wrong_answer";
  return { verdict, passed, total: cases.length, cases, language, ms };
}

/** Result for a hand-written problem, whose checker only says pass or throw. */
export function fromLegacyRun(error: unknown, language: RunSummary["language"], ms?: number): RunSummary {
  if (!error) return { verdict: "accepted", passed: 1, total: 1, cases: [], language, ms, message: "All tests passed." };
  const msg = error instanceof Error ? error.message : String(error);
  const assertion = /AssertionError|Expected values to be strictly deep-equal/.test(msg);
  return {
    verdict: assertion ? "wrong_answer" : "runtime_error", passed: 0, total: 1, cases: [], language, ms,
    message: assertion ? "One or more test cases failed. This problem doesn't report which yet." : msg,
  };
}

/** Parse the Java harness lines: "PASS 3", "FAIL 2 expected=[1, 2] got=[2, 1]", "ERROR 4 java.lang...". */
export function fromJavaRun(
  r: { status: string; passed: number; total: number; lines: string[]; message?: string },
  ms?: number,
): RunSummary {
  const cases: CaseResult[] = r.lines.map((line) => {
    const m = line.match(/^(PASS|FAIL|ERROR) (\d+)(?: (.*))?$/);
    if (!m) return { index: 0, status: "error", message: line };
    const index = Number(m[2]);
    if (m[1] === "PASS") return { index, status: "pass" };
    if (m[1] === "ERROR") return { index, status: "error", message: m[3] };
    const f = (m[3] ?? "").match(/^expected=(.*) got=(.*)$/);
    return { index, status: "fail", expected: f?.[1], got: f?.[2], message: f ? undefined : m[3] };
  });
  const verdict: Verdict =
    r.status === "accepted" ? "accepted"
    : r.status === "compile_error" ? "compile_error"
    : r.status === "time_limit" ? "time_limit"
    : r.status === "runtime_error" ? "runtime_error"
    : r.status === "wrong_answer" ? "wrong_answer" : "error";
  return { verdict, passed: r.passed, total: r.total || cases.length, cases, message: r.message, language: "java", ms };
}

export const VERDICT_LABEL: Record<Verdict, string> = {
  accepted: "Accepted",
  wrong_answer: "Wrong answer",
  runtime_error: "Runtime error",
  compile_error: "Compilation error",
  syntax_error: "Syntax error",
  time_limit: "Time limit exceeded",
  error: "Run failed",
};
