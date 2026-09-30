// One declarative spec per problem → the JavaScript Problem (starter + test handler)
// and the Java harness are both generated from it, so the two languages can't drift.
// Statements are original wording; tests are data.

import type { Example, Problem } from "@/utils/types/problems";
import type { Difficulty } from "@/content/patterns";

export type JType =
  | "int" | "long" | "double" | "boolean" | "String" | "char"
  | "int[]" | "int[][]" | "String[]" | "char[][]"
  | "List<Integer>" | "List<List<Integer>>" | "List<String>" | "List<List<String>>";

/** How results are compared. anyOrder: outer list order ignored; anyOrderDeep: inner lists too. */
export type Compare = "exact" | "anyOrder" | "anyOrderDeep";

export interface Param { name: string; type: JType }

interface BaseSpec {
  slug: string; // LeetCode slug = bank key
  lc: number;
  title: string;
  difficulty: Difficulty;
  patternId: string;
  statement: string; // HTML, original wording
  examples: Omit<Example, "id">[];
  constraints: string[]; // HTML fragments, one per bullet
  insight: string; // hint 3
}

export interface FunctionSpec extends BaseSpec {
  kind: "function";
  fn: string; // method / function name
  params: Param[];
  returns: JType;
  compare?: Compare;
  tests: { args: unknown[]; expected: unknown }[];
}

export interface DesignSpec extends BaseSpec {
  kind: "design";
  className: string;
  ctor: Param[];
  methods: { name: string; params: Param[]; returns: JType | "void" }[];
  /** Each test: an operation sequence; ops[0] is the constructor (className). */
  tests: { ops: string[]; args: unknown[][]; expected: unknown[] }[];
}

export type ProblemSpec = FunctionSpec | DesignSpec;

// ---------------------------------------------------------------- JavaScript

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

function canon(v: unknown, compare: Compare): unknown {
  if (compare === "exact" || !Array.isArray(v)) return v;
  const inner = compare === "anyOrderDeep"
    ? v.map((x) => (Array.isArray(x) ? [...x].sort() : x))
    : v;
  return [...inner].map((x) => JSON.stringify(x)).sort();
}

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/** Error text the editor recognises as a failed test (vs a syntax error). */
function fail(i: number, expected: unknown, got: unknown): never {
  throw new Error(
    `AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal: case ${i + 1} expected ${JSON.stringify(expected)} got ${JSON.stringify(got)}`,
  );
}

function jsHandler(spec: ProblemSpec): (fn: any) => boolean {
  if (spec.kind === "function") {
    const compare = spec.compare ?? "exact";
    return (fn: any) => {
      spec.tests.forEach((t, i) => {
        const got = fn(...clone(t.args));
        if (!same(canon(got, compare), canon(t.expected, compare))) fail(i, t.expected, got);
      });
      return true;
    };
  }
  return (Cls: any) => {
    spec.tests.forEach((t, i) => {
      const obj = new Cls(...clone(t.args[0] ?? []));
      const out: unknown[] = [null];
      for (let k = 1; k < t.ops.length; k++) {
        const r = obj[t.ops[k]](...clone(t.args[k] ?? []));
        out.push(r === undefined ? null : r);
      }
      if (!same(out, t.expected)) fail(i, t.expected, out);
    });
    return true;
  };
}

function jsStarter(spec: ProblemSpec): string {
  if (spec.kind === "function") {
    return `function ${spec.fn}(${spec.params.map((p) => p.name).join(", ")}) {\n  // Write your code here\n};`;
  }
  const ctor = spec.ctor.map((p) => p.name).join(", ");
  const methods = spec.methods
    .map((m) => `  ${m.name}(${m.params.map((p) => p.name).join(", ")}) {\n    // Write your code here\n  }`)
    .join("\n\n");
  return `class ${spec.className} {\n  constructor(${ctor}) {\n    // Initialize your data structure\n  }\n\n${methods}\n}`;
}

/** The bank Problem for a spec (same shape as the hand-written problems). */
export function toProblem(spec: ProblemSpec, order: number): Problem {
  return {
    id: spec.slug,
    title: `${spec.lc}. ${spec.title}`,
    problemStatement: spec.statement,
    examples: spec.examples.map((e, i) => ({ id: i + 1, ...e })),
    constraints: spec.constraints.map((c) => `<li class='mt-2'>${c}</li>`).join(""),
    order,
    starterCode: jsStarter(spec),
    handlerFunction: jsHandler(spec),
    starterFunctionName: spec.kind === "function" ? `function ${spec.fn}(` : `class ${spec.className}`,
  };
}

// ---------------------------------------------------------------------- Java

const javaDefault: Record<JType | "void", string> = {
  int: "0", long: "0L", double: "0.0", boolean: "false", String: "\"\"", char: "' '",
  "int[]": "new int[0]", "int[][]": "new int[0][]", "String[]": "new String[0]", "char[][]": "new char[0][]",
  "List<Integer>": "new ArrayList<>()", "List<List<Integer>>": "new ArrayList<>()",
  "List<String>": "new ArrayList<>()", "List<List<String>>": "new ArrayList<>()", void: "",
};

const jStr = (s: string) => JSON.stringify(s); // Java string literals share JSON escaping for our data

/** Java source literal for a JSON value of the given type. */
export function javaLiteral(v: unknown, t: JType): string {
  switch (t) {
    case "int": return String(v);
    case "long": return `${v}L`;
    case "double": return Number(v).toString().includes(".") ? String(v) : `${v}.0`;
    case "boolean": return String(v);
    case "String": return jStr(String(v));
    case "char": return `'${v}'`;
    case "int[]": return `new int[]{${(v as number[]).join(", ")}}`;
    case "int[][]": return `new int[][]{${(v as number[][]).map((r) => `{${r.join(", ")}}`).join(", ")}}`;
    case "String[]": return `new String[]{${(v as string[]).map(jStr).join(", ")}}`;
    case "char[][]": return `new char[][]{${(v as string[][]).map((r) => `{${r.map((c) => `'${c}'`).join(", ")}}`).join(", ")}}`;
    case "List<Integer>": return `Arrays.asList(${(v as number[]).join(", ")})`;
    case "List<String>": return `Arrays.asList(${(v as string[]).map(jStr).join(", ")})`;
    case "List<List<Integer>>": return `Arrays.asList(${(v as number[][]).map((r) => javaLiteral(r, "List<Integer>")).join(", ")})`;
    case "List<List<String>>": return `Arrays.asList(${(v as string[][]).map((r) => javaLiteral(r, "List<String>")).join(", ")})`;
  }
}

/** Java's List.toString rendering of expected values (used for design problems). */
function javaShow(v: unknown): string {
  if (v === null) return "null";
  if (Array.isArray(v)) return `[${v.map(javaShow).join(", ")}]`;
  return String(v);
}

const sig = (params: Param[]) => params.map((p) => `${p.type} ${p.name}`).join(", ");

function javaStarter(spec: ProblemSpec): string {
  if (spec.kind === "function") {
    return `class Solution {\n    public ${spec.returns} ${spec.fn}(${sig(spec.params)}) {\n        // Write your code here\n        return ${javaDefault[spec.returns]};\n    }\n}\n`;
  }
  const methods = spec.methods
    .map((m) => `    public ${m.returns} ${m.name}(${sig(m.params)}) {\n        // Write your code here${m.returns === "void" ? "" : `\n        return ${javaDefault[m.returns]};`}\n    }`)
    .join("\n\n");
  return `class ${spec.className} {\n    public ${spec.className}(${sig(spec.ctor)}) {\n        // Initialize your data structure\n    }\n\n${methods}\n}\n`;
}

function javaTests(spec: ProblemSpec): string {
  if (spec.kind === "function") {
    const compare = spec.compare ?? "exact";
    return spec.tests
      .map((t, i) => {
        const call = `s.${spec.fn}(${t.args.map((a, k) => javaLiteral(a, spec.params[k].type)).join(", ")})`;
        const isList = spec.returns.startsWith("List");
        const isIntArr = spec.returns === "int[]";
        if (compare !== "exact" && isList) {
          const deep = compare === "anyOrderDeep";
          return `      t(${i + 1}, canonAny(${javaLiteral(t.expected, spec.returns)}, ${deep}), () -> canonAny(${call}, ${deep}));`;
        }
        if (compare !== "exact" && isIntArr) {
          return `      t(${i + 1}, sortInts(${javaLiteral(t.expected, "int[]")}), () -> sortInts(${call}));`;
        }
        return `      t(${i + 1}, ${javaLiteral(t.expected, spec.returns)}, () -> ${call});`;
      })
      .join("\n");
  }
  return spec.tests
    .map((t, i) => {
      const lines = [`${spec.className} o = new ${spec.className}(${(t.args[0] ?? []).map((a, k) => javaLiteral(a, spec.ctor[k].type)).join(", ")});`, "List<Object> out = new ArrayList<>();", "out.add(null);"];
      for (let k = 1; k < t.ops.length; k++) {
        const m = spec.methods.find((x) => x.name === t.ops[k]);
        if (!m) throw new Error(`${spec.slug}: unknown op ${t.ops[k]}`);
        const call = `o.${m.name}(${(t.args[k] ?? []).map((a, j) => javaLiteral(a, m.params[j].type)).join(", ")})`;
        lines.push(m.returns === "void" ? `${call}; out.add(null);` : `out.add(${call});`);
      }
      lines.push("return String.valueOf(out);");
      return `      t(${i + 1}, ${jStr(javaShow(t.expected))}, () -> { ${lines.join(" ")} });`;
    })
    .join("\n");
}

export interface GeneratedJava { starter: string; tests: string; setup?: string }

export function toJava(spec: ProblemSpec): GeneratedJava {
  return {
    starter: javaStarter(spec),
    tests: javaTests(spec),
    // Design problems build their own object per test; no Solution instance.
    setup: spec.kind === "design" ? "" : undefined,
  };
}
