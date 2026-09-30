// Registry of spec-generated problems. Add new batches here.
import type { Problem } from "@/utils/types/problems";
import { BATCH_A } from "./batchA";
import { BATCH_B } from "./batchB";
import { BATCH_C } from "./batchC";
import { toJava, toProblem, type GeneratedJava, type ProblemSpec } from "./spec";

export const SPECS: ProblemSpec[] = [...BATCH_A, ...BATCH_B, ...BATCH_C];

/** Orders continue after the 26 hand-written problems. */
const FIRST_ORDER = 27;

export const GENERATED_PROBLEMS: Record<string, Problem> = Object.fromEntries(
  SPECS.map((s, i) => [s.slug, toProblem(s, FIRST_ORDER + i)]),
);

export const GENERATED_JAVA: Record<string, GeneratedJava> = Object.fromEntries(SPECS.map((s) => [s.slug, toJava(s)]));

export const GENERATED_INSIGHTS: Record<string, string> = Object.fromEntries(SPECS.map((s) => [s.slug, s.insight]));
