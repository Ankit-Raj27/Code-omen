// Pure local-date helpers. All dates are "YYYY-MM-DD" strings in the user's
// local timezone. Never compare Date objects/timestamps for "due today".

export type Ymd = string;

const YMD_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isYmd(value: string): value is Ymd {
  return YMD_RE.test(value);
}

/** Calendar date of `now` in `timeZone` (defaults to the runtime's zone). */
export function todayLocal(now: Date = new Date(), timeZone?: string): Ymd {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Add whole calendar days to a YYYY-MM-DD string. DST-safe (pure UTC math). */
export function addDays(ymd: Ymd, days: number): Ymd {
  if (!isYmd(ymd)) throw new Error(`Invalid date: ${ymd}`);
  const [y, m, d] = ymd.split("-").map(Number);
  const t = Date.UTC(y, m - 1, d) + days * 86_400_000;
  return new Date(t).toISOString().slice(0, 10);
}

/** Whole days from a to b (b - a). */
export function daysBetween(a: Ymd, b: Ymd): number {
  const toUtc = (s: Ymd) => {
    const [y, m, d] = s.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((toUtc(b) - toUtc(a)) / 86_400_000);
}

/** Lexicographic compare works for zero-padded YYYY-MM-DD. */
export function compareYmd(a: Ymd, b: Ymd): number {
  return a < b ? -1 : a > b ? 1 : 0;
}
