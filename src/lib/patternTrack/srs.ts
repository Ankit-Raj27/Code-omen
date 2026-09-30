// Spaced-repetition engine. PURE: no Firebase, no clock reads.
import { addDays, compareYmd, type Ymd } from "./dates";

export const INTERVALS = [1, 3, 7, 21, 45] as const;
export const MASTERED_STAGE = INTERVALS.length; // 5

export type ReviewResult = "clean" | "shaky" | "forgot";

export interface Review {
  date: Ymd;
  result: ReviewResult;
}

export interface SrsFields {
  stage: number;
  nextDue: Ymd;
  reviews: Review[];
}

export interface ScheduleResult {
  stage: number;
  nextDue: Ymd;
  reviews: Review[];
}

/** Initial SRS state for a newly logged problem. */
export function initialSchedule(dateSolved: Ymd): SrsFields {
  return { stage: 0, nextDue: addDays(dateSolved, INTERVALS[0]), reviews: [] };
}

/**
 * clean  → stage + 1
 * shaky  → same stage, same interval again
 * forgot → stage 0, due tomorrow
 * nextDue = today + INTERVALS[stage]; stage >= 5 is mastered (nextDue kept
 * for display but the entry leaves the queue).
 */
export function scheduleNext(
  entry: SrsFields,
  result: ReviewResult,
  today: Ymd,
): ScheduleResult {
  const current = clampStage(entry.stage);
  let stage: number;
  switch (result) {
    case "clean":
      stage = Math.min(current + 1, MASTERED_STAGE);
      break;
    case "shaky":
      stage = current;
      break;
    case "forgot":
      stage = 0;
      break;
    default: {
      const never: never = result;
      throw new Error(`Unknown result: ${never}`);
    }
  }
  const interval = INTERVALS[Math.min(stage, INTERVALS.length - 1)];
  return {
    stage,
    nextDue: addDays(today, interval),
    reviews: [...(entry.reviews ?? []), { date: today, result }],
  };
}

function clampStage(stage: number): number {
  if (!Number.isFinite(stage) || stage < 0) return 0;
  return Math.min(Math.floor(stage), MASTERED_STAGE);
}

export function isMastered(entry: Pick<SrsFields, "stage">): boolean {
  return entry.stage >= MASTERED_STAGE;
}

export function isDue(entry: Pick<SrsFields, "stage" | "nextDue">, today: Ymd): boolean {
  return !isMastered(entry) && compareYmd(entry.nextDue, today) <= 0;
}

export function isOverdue(entry: Pick<SrsFields, "stage" | "nextDue">, today: Ymd): boolean {
  return !isMastered(entry) && compareYmd(entry.nextDue, today) < 0;
}

/** Due + overdue entries, oldest nextDue first (stable). */
export function dueQueue<T extends Pick<SrsFields, "stage" | "nextDue">>(
  entries: T[],
  today: Ymd,
): T[] {
  return entries
    .filter((e) => isDue(e, today))
    .map((e, i) => [e, i] as const)
    .sort(([a, i], [b, j]) => compareYmd(a.nextDue, b.nextDue) || i - j)
    .map(([e]) => e);
}
