// Connects the NeetCode / Striver / GFG list rows to Pattern Track.
import { PATTERNS, PATTERN_BY_ID, type Pattern } from "@/content/patterns";
import { currentBankKey, patternIdForBank } from "./bank";
import { urlMatchesSlug, type LogEntry } from "./stats";

export interface ListProblemLike {
  id: string;
  link?: string;
}

/** LeetCode slug for a list row: from its LeetCode link when present, else its id. */
export function listProblemSlug(p: ListProblemLike): string {
  const m = p.link?.match(/leetcode\.com\/problems\/([^/?#]+)/i);
  return (m?.[1] ?? p.id).toLowerCase();
}

/** The roadmap pattern this list problem belongs to, if any. */
export function patternForListProblem(p: ListProblemLike): Pattern | undefined {
  const slug = listProblemSlug(p);
  const onRoadmap = PATTERNS.find((pt) => pt.problems.some(([, , s]) => s === slug));
  return onRoadmap ?? PATTERN_BY_ID[patternIdForBank(slug) ?? ""];
}

/** True when any log entry is for this problem (by LeetCode URL or CodeOmen bank key). */
export function isLoggedListProblem(p: ListProblemLike, logs: LogEntry[]): boolean {
  const slug = listProblemSlug(p);
  return logs.some(
    (l) => urlMatchesSlug(l.url, slug) || currentBankKey(l.bankSlug ?? "") === slug || (!!p.link && l.url === p.link),
  );
}
