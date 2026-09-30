// Pure timebox helpers for a solving session (the Method: 25 min, then +10).

export const TIMEBOX_MIN = 25;
export const EXTENSION_MIN = 10;

/** Minutes to prefill in the log: the timer if it ran, else the 25-minute default. */
export function loggedMinutes(elapsedSec: number): number {
  return elapsedSec > 0 ? Math.max(1, Math.round(elapsedSec / 60)) : TIMEBOX_MIN;
}

export type TimeboxPhase = "idle" | "on-track" | "over" | "extended" | "read-solution";

/** Where the attempt stands against the 25 + 10 minute method. */
export function timeboxPhase(elapsedSec: number, running: boolean, extended: boolean): TimeboxPhase {
  if (!running && elapsedSec === 0) return "idle";
  const min = elapsedSec / 60;
  if (min < TIMEBOX_MIN) return "on-track";
  if (!extended) return "over";
  return min < TIMEBOX_MIN + EXTENSION_MIN ? "extended" : "read-solution";
}
