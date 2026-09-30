// One declarative spec per problem → the JavaScript Problem (starter + test handler)
// and the Java harness are both generated from it, so the two languages can't drift.
// Statements are original wording; tests are data.

import type { Example, Problem } from "@/utils/types/problems";
import type { Difficulty } from "@/content/patterns";

export type JType =
  | "int" | "long" | "double" | "boolean" | "String" | "char"
  | "int[]" | "int[][]" | "String[]" | "char[]" | "char[][]"
  | "List<Integer>" | "List<List<Integer>>" | "List<String>" | "List<List<String>>"
  // Linked structures. Test data: a ListNode is its values; a TreeNode is its level order
  // with nulls (LeetCode's format); ListNode[] is an array of those.
  | "ListNode" | "TreeNode" | "ListNode[]"
  // [values, pos]: a list whose tail links back to node `pos` (-1 = no cycle).
  | "CycleList"
  // A value; the argument is the node holding it in the first TreeNode argument.
  | "TreeRef";

/**
 * How results are compared. anyOrder: outer list order ignored; anyOrderDeep: inner lists too;
 * nodeVal: a returned node is compared by its value; inorder: a returned tree by its in-order values.
 */
export type Compare = "exact" | "anyOrder" | "anyOrderDeep" | "nodeVal" | "inorder";

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
  /** "void" + `mutates`: the answer is the argument at that index after the call (in-place problems). */
  returns: JType | "void";
  mutates?: number;
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

// Node classes user code can construct (LeetCode's shapes). Installed as globals before
// each run, because the editor evaluates the user's function on its own.
class JsListNode {
  val: number; next: JsListNode | null;
  constructor(val = 0, next: JsListNode | null = null) { this.val = val; this.next = next; }
}
class JsTreeNode {
  val: number; left: JsTreeNode | null; right: JsTreeNode | null;
  constructor(val = 0, left: JsTreeNode | null = null, right: JsTreeNode | null = null) { this.val = val; this.left = left; this.right = right; }
}
type JsNode = { val: number; next?: JsNode | null; left?: JsNode | null; right?: JsNode | null };

function installNodeClasses() {
  const g = globalThis as Record<string, unknown>;
  if (typeof g.ListNode !== "function") g.ListNode = JsListNode;
  if (typeof g.TreeNode !== "function") g.TreeNode = JsTreeNode;
}

export function buildList(vals: number[]): JsListNode | null {
  const head = new JsListNode();
  let c = head;
  for (const v of vals) c = c.next = new JsListNode(v);
  return head.next;
}

export function listValues(h: JsNode | null | undefined): number[] {
  const out: number[] = [];
  for (let guard = 0; h && guard < 10000; guard++, h = h.next) out.push(h.val);
  return out;
}

export function buildTree(level: (number | null)[]): JsTreeNode | null {
  if (!level.length || level[0] === null) return null;
  const root = new JsTreeNode(level[0]);
  const q = [root];
  for (let i = 1, h = 0; i < level.length; h++) {
    const n = q[h];
    for (const side of ["left", "right"] as const) {
      const v = level[i++];
      if (v !== null && v !== undefined) q.push((n[side] = new JsTreeNode(v)));
    }
  }
  return root;
}

/** Level order with nulls for missing children, trailing nulls trimmed. */
export function treeLevel(root: JsNode | null | undefined): (number | null)[] {
  const out: (number | null)[] = [];
  const q: (JsNode | null | undefined)[] = [root];
  for (let h = 0; h < q.length && h < 20000; h++) {
    const n = q[h];
    if (!n) { out.push(null); continue; }
    out.push(n.val);
    q.push(n.left ?? null, n.right ?? null);
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}

function treeInorder(root: JsNode | null | undefined): number[] {
  const out: number[] = [];
  const go = (n: JsNode | null | undefined, depth: number) => {
    if (!n || depth > 10000) return;
    go(n.left, depth + 1); out.push(n.val); go(n.right, depth + 1);
  };
  go(root, 0);
  return out;
}

function findNode(root: JsNode | null | undefined, val: number): JsNode | null {
  if (!root) return null;
  if (root.val === val) return root;
  return findNode(root.left, val) ?? findNode(root.right, val);
}

/** Test-data value → the argument the user's function receives. */
function toJsArg(v: unknown, t: JType, built: unknown[], params: Param[]): unknown {
  switch (t) {
    case "ListNode": return buildList(v as number[]);
    case "TreeNode": return buildTree(v as (number | null)[]);
    case "ListNode[]": return (v as number[][]).map(buildList);
    case "CycleList": {
      const [vals, pos] = v as [number[], number];
      const head = buildList(vals);
      if (pos >= 0 && head) {
        let tail = head, target: JsListNode | null = null;
        for (let i = 0; ; i++) { if (i === pos) target = tail; if (!tail.next) break; tail = tail.next; }
        tail.next = target;
      }
      return head;
    }
    case "TreeRef": {
      const k = params.findIndex((p) => p.type === "TreeNode");
      return findNode(built[k] as JsNode, v as number);
    }
    default: return v;
  }
}

/** The user's answer → comparable test data. */
function fromJs(v: unknown, t: JType | "void", compare: Compare): unknown {
  if (t === "ListNode") return listValues(v as JsNode);
  if (t === "TreeNode") {
    if (compare === "nodeVal") return (v as JsNode | null)?.val ?? null;
    if (compare === "inorder") return treeInorder(v as JsNode);
    return treeLevel(v as JsNode);
  }
  return v;
}

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
      installNodeClasses();
      spec.tests.forEach((t, i) => {
        const args = clone(t.args);
        const built: unknown[] = [];
        spec.params.forEach((p, k) => built.push(toJsArg(args[k], p.type, built, spec.params)));
        const ret = fn(...built);
        const got = spec.returns === "void" && spec.mutates !== undefined
          ? fromJs(built[spec.mutates], spec.params[spec.mutates].type, compare)
          : fromJs(ret, spec.returns, compare);
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

const usesType = (spec: FunctionSpec, ...ts: string[]) =>
  [spec.returns, ...spec.params.map((p) => p.type)].some((x) => ts.some((t) => x.startsWith(t)));

const JS_LIST_DOC = `/**
 * Definition for singly-linked list (provided):
 * class ListNode { constructor(val = 0, next = null) { this.val = val; this.next = next; } }
 */
`;
const JS_TREE_DOC = `/**
 * Definition for a binary tree node (provided):
 * class TreeNode { constructor(val = 0, left = null, right = null) { this.val = val; this.left = left; this.right = right; } }
 */
`;

function jsStarter(spec: ProblemSpec): string {
  if (spec.kind === "function") {
    const doc = (usesType(spec, "ListNode", "CycleList") ? JS_LIST_DOC : "") + (usesType(spec, "TreeNode", "TreeRef") ? JS_TREE_DOC : "");
    return `${doc}function ${spec.fn}(${spec.params.map((p) => p.name).join(", ")}) {\n  // Write your code here\n};`;
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
  ListNode: "null", TreeNode: "null", "ListNode[]": "new ListNode[0]", CycleList: "null", TreeRef: "null",
  int: "0", long: "0L", double: "0.0", boolean: "false", String: "\"\"", char: "' '",
  "int[]": "new int[0]", "int[][]": "new int[0][]", "String[]": "new String[0]", "char[]": "new char[0]", "char[][]": "new char[0][]",
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
    case "char[]": return `new char[]{${(v as string[]).map((ch) => `'${ch}'`).join(", ")}}`;
    case "char[][]": return `new char[][]{${(v as string[][]).map((r) => `{${r.map((c) => `'${c}'`).join(", ")}}`).join(", ")}}`;
    case "List<Integer>": return `Arrays.asList(${(v as number[]).join(", ")})`;
    case "List<String>": return `Arrays.asList(${(v as string[]).map(jStr).join(", ")})`;
    case "List<List<Integer>>": return `Arrays.asList(${(v as number[][]).map((r) => javaLiteral(r, "List<Integer>")).join(", ")})`;
    case "List<List<String>>": return `Arrays.asList(${(v as string[][]).map((r) => javaLiteral(r, "List<String>")).join(", ")})`;
    case "ListNode": return `list(${(v as number[]).join(", ")})`;
    case "TreeNode": return `tree(new Integer[]{${(v as (number | null)[]).map(String).join(", ")}})`;
    case "ListNode[]": return `new ListNode[]{${(v as number[][]).map((r) => javaLiteral(r, "ListNode")).join(", ")}}`;
    case "CycleList": { const [vals, pos] = v as [number[], number]; return `cycle(new int[]{${vals.join(", ")}}, ${pos})`; }
    case "TreeRef": throw new Error("TreeRef literals need the tree; see javaTests");
  }
}

/** Java's List.toString rendering of expected values (used for design problems). */
function javaShow(v: unknown, t?: JType | "void"): string {
  if (v === null) return "null";
  if (Array.isArray(v)) return `[${v.map((x) => javaShow(x)).join(", ")}]`;
  if (t === "double" && Number.isInteger(v)) return `${v}.0`; // Java prints 2.0, JS prints 2
  return String(v);
}

/** Java type for a local holding an argument of this JType. */
const javaLocalType = (t: JType) => (t === "CycleList" ? "ListNode" : t === "TreeRef" ? "TreeNode" : t);

const sig = (params: Param[]) => params.map((p) => `${p.type} ${p.name}`).join(", ");

const JAVA_LIST_DOC = `/**
 * Definition for singly-linked list (provided):
 * class ListNode { int val; ListNode next; ListNode() {} ListNode(int val) { this.val = val; } ListNode(int val, ListNode next) { ... } }
 */
`;
const JAVA_TREE_DOC = `/**
 * Definition for a binary tree node (provided):
 * class TreeNode { int val; TreeNode left, right; TreeNode() {} TreeNode(int val) { this.val = val; } TreeNode(int val, TreeNode left, TreeNode right) { ... } }
 */
`;

function javaStarter(spec: ProblemSpec): string {
  if (spec.kind === "function") {
    const doc = (usesType(spec, "ListNode", "CycleList") ? JAVA_LIST_DOC : "") + (usesType(spec, "TreeNode", "TreeRef") ? JAVA_TREE_DOC : "");
    const ret = spec.returns === "void" ? "void" : javaLocalType(spec.returns);
    const sigF = spec.params.map((p) => `${javaLocalType(p.type)} ${p.name}`).join(", ");
    return `${doc}class Solution {\n    public ${ret} ${spec.fn}(${sigF}) {\n        // Write your code here${spec.returns === "void" ? "" : `\n        return ${javaDefault[spec.returns]};`}\n    }\n}\n`;
  }
  const methods = spec.methods
    .map((m) => `    public ${m.returns} ${m.name}(${sig(m.params)}) {\n        // Write your code here${m.returns === "void" ? "" : `\n        return ${javaDefault[m.returns]};`}\n    }`)
    .join("\n\n");
  return `class ${spec.className} {\n    public ${spec.className}(${sig(spec.ctor)}) {\n        // Initialize your data structure\n    }\n\n${methods}\n}\n`;
}

function javaTests(spec: ProblemSpec): string {
  if (spec.kind === "function") {
    const compare = spec.compare ?? "exact";
    const treeArg = spec.params.findIndex((p) => p.type === "TreeNode");
    return spec.tests
      .map((t, i) => {
        const locals = spec.params.map((p, k) => {
          const lit = p.type === "TreeRef" ? `find(a${treeArg}, ${t.args[k]})` : javaLiteral(t.args[k], p.type);
          return `${javaLocalType(p.type)} a${k} = ${lit};`;
        });
        const call = `s.${spec.fn}(${spec.params.map((_, k) => `a${k}`).join(", ")})`;
        // A fresh Solution per test, as on LeetCode: fields (e.g. a running best) must not leak.
        const body = (ret: string) => `() -> { Solution s = new Solution(); ${locals.join(" ")} ${ret} }`;
        const line = (expected: string, ret: string) => `      t(${i + 1}, ${expected}, ${body(ret)});`;

        if (spec.returns === "void") {
          const m = spec.mutates ?? 0;
          const mt = spec.params[m].type;
          if (mt === "ListNode") return line(javaLiteral(t.expected, "int[]"), `${call}; return toArr(a${m});`);
          if (mt === "TreeNode") return line(jStr(javaShow(t.expected)), `${call}; return treeStr(a${m});`);
          if (mt === "int[][]") return line(javaLiteral(t.expected, "int[][]"), `${call}; return a${m};`);
          return line(javaLiteral(t.expected, mt), `${call}; return a${m};`);
        }
        const r = spec.returns;
        if (r === "ListNode") return line(javaLiteral(t.expected, "int[]"), `return toArr(${call});`);
        if (r === "TreeNode") {
          if (compare === "nodeVal") return line(t.expected === null ? "null" : `(Integer) ${t.expected}`, `return valOf(${call});`);
          if (compare === "inorder") return line(javaLiteral(t.expected, "int[]"), `return inorderArr(${call});`);
          return line(jStr(javaShow(t.expected)), `return treeStr(${call});`);
        }
        if (compare === "anyOrder" || compare === "anyOrderDeep") {
          const deep = compare === "anyOrderDeep";
          if (r.startsWith("List")) return line(`canonAny(${javaLiteral(t.expected, r)}, ${deep})`, `return canonAny(${call}, ${deep});`);
          if (r === "int[]") return line(`sortInts(${javaLiteral(t.expected, "int[]")})`, `return sortInts(${call});`);
          if (r === "int[][]") return line(`canonRows(${javaLiteral(t.expected, "int[][]")})`, `return canonRows(${call});`);
        }
        return line(javaLiteral(t.expected, r), `return ${call};`);
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
      const shown = `[${t.expected.map((v, k) => javaShow(v, k === 0 ? undefined : spec.methods.find((x) => x.name === t.ops[k])?.returns)).join(", ")}]`;
      return `      t(${i + 1}, ${jStr(shown)}, () -> { ${lines.join(" ")} });`;
    })
    .join("\n");
}

export interface GeneratedJava { starter: string; tests: string; setup?: string }

export function toJava(spec: ProblemSpec): GeneratedJava {
  return {
    starter: javaStarter(spec),
    tests: javaTests(spec),
    // Every test builds its own Solution (or design object), so no shared instance.
    setup: "",
  };
}
