// Builds a single-file Java program (Main.java) from user code + server-side harness,
// and parses the harness output. Pure: no network, no Firebase.
import { JAVA_PRELUDE, JAVA_PROBLEMS } from "@/utils/problems/java";

export const MAX_SOURCE_BYTES = 64 * 1024;

export function hasJava(problemId: string): boolean {
  return Object.prototype.hasOwnProperty.call(JAVA_PROBLEMS, problemId);
}

/**
 * Hand-written harnesses call \`s.method(...)\` on a shared Solution. Give every call its
 * own instance, as LeetCode does, so solutions that keep state in fields don't leak
 * between test cases. (Generated harnesses already build one per test.)
 */
export function freshPerTest(tests: string): string {
  return tests.replace(/\bs\.(\w+)\(/g, "new Solution().$1(");
}

export function buildJavaSource(problemId: string, userCode: string, nonce: string): string {
  if (!/^[a-f0-9]{16,64}$/.test(nonce)) throw new Error("Bad nonce");
  const p = JAVA_PROBLEMS[problemId];
  if (!p) throw new Error("No Java tests for this problem");
  // Imports must precede all type declarations: hoist them from the user's code.
  const imports: string[] = [];
  const body = userCode
    .split("\n")
    .filter((line) => {
      if (/^\s*import\s+[\w.*]+\s*;\s*$/.test(line)) {
        imports.push(line.trim());
        return false;
      }
      return !/^\s*package\s+[\w.]+\s*;\s*$/.test(line);
    })
    .join("\n")
    // Only Main may be public in Main.java.
    .replace(/\bpublic\s+(final\s+)?class\s+/g, "$1class ")
    // Main and ListNode are supplied by the harness.
    .replace(/\bclass\s+Main\b/g, "class UserMain");
  const std = ["import java.util.*;", "import java.util.function.*;"];
  const header = Array.from(new Set([...std, ...imports])).join("\n");
  return `${header}\n\n${body}\n${p.types ?? ""}${JAVA_PRELUDE.replace("/*__SETUP__*/", p.setup ?? "")
    .replace("/*__TESTS__*/", p.setup === undefined ? freshPerTest(p.tests) : p.tests)
    .replace("/*__NONCE__*/", nonce)}`;
}

export interface JavaRunResult {
  status: "accepted" | "wrong_answer" | "compile_error" | "runtime_error" | "time_limit" | "error";
  passed: number;
  total: number;
  lines: string[]; // per-test PASS/FAIL/ERROR lines
  message?: string; // compiler / runtime output
}

/** Only a DONE line carrying this run's nonce counts; user code can't forge it. */
export function parseHarnessOutput(
  stdout: string,
  nonce: string,
): Pick<JavaRunResult, "passed" | "total" | "lines"> & { done: boolean } {
  const lines = stdout.split("\n").map((l) => l.trimEnd()).filter(Boolean);
  const re = new RegExp(`^DONE ${nonce} (\\d+)\\/(\\d+)$`);
  const done = lines.map((l) => l.match(re)).filter(Boolean).pop();
  return {
    done: !!done,
    passed: done ? Number(done[1]) : 0,
    total: done ? Number(done[2]) : lines.filter((l) => /^(PASS|FAIL|ERROR) /.test(l)).length,
    lines: lines.filter((l) => /^(PASS|FAIL|ERROR) /.test(l)),
  };
}
