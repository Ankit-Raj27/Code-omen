// CodeOmen's local problem bank (src/utils/problems) is keyed by LeetCode slug.
import { PATTERNS, LEETCODE_URL, type Difficulty } from "@/content/patterns";
import { PROBLEM_KEY_RENAMES } from "@/config/redirects.mjs";
import { problems } from "@/utils/problems";

const RENAMES = PROBLEM_KEY_RENAMES as Record<string, string>;

/** Current bank key for a key saved before the Phase 2 rename (old logs). */
export function currentBankKey(key: string): string {
  return RENAMES[key] ?? key;
}

/** LeetCode slug for a bank key (they're the same since Phase 2; old keys are mapped). */
export function lcSlugForBank(bankKey: string): string {
  return currentBankKey(bankKey);
}

/** Bank key for a LeetCode slug, if that problem runs in CodeOmen. */
export function bankKeyForLc(lcSlug: string): string | undefined {
  return problems[lcSlug] ? lcSlug : undefined;
}

export function resolveUrl(bankKey: string): string {
  return `/problems/${encodeURIComponent(currentBankKey(bankKey))}?fresh=1`;
}

export interface LogPrefill {
  name: string;
  url: string;
  patternId: string;
  difficulty: Difficulty;
  bankSlug: string;
}

/** Prefill for a roadmap problem by LeetCode slug (used by /log?slug=...). */
export function prefillForLc(lcSlug: string): LogPrefill | undefined {
  for (const pattern of PATTERNS) {
    const hit = [...pattern.problems, ...(pattern.stretch ?? [])].find(([, , slug]) => slug === lcSlug);
    if (hit) {
      return {
        name: hit[1],
        url: LEETCODE_URL(lcSlug),
        patternId: pattern.id,
        difficulty: hit[3],
        bankSlug: bankKeyForLc(lcSlug) ?? "",
      };
    }
  }
  return undefined;
}

/** Bank problems that aren't on the roadmap: their pattern and difficulty. */
const OFF_ROADMAP: Record<string, [patternId: string, difficulty: Difficulty]> = {
  "valid-sudoku": ["arrays-hashing", "M"],
  "encode-and-decode-strings": ["arrays-hashing", "M"],
  "set-matrix-zeroes": ["arrays-hashing", "M"],
  "spiral-matrix": ["arrays-hashing", "M"],
  "pascals-triangle": ["dp-1d", "E"],
};

/** Pattern id for any bank problem (roadmap or not). */
export function patternIdForBank(bankKey: string): string | undefined {
  const key = currentBankKey(bankKey);
  return prefillForLc(key)?.patternId ?? OFF_ROADMAP[key]?.[0];
}

/** Prefill for logging a bank problem from its page. */
export function prefillForBank(bankKey: string): LogPrefill | undefined {
  const key = currentBankKey(bankKey);
  const p = problems[key];
  if (!p) return undefined;
  return (
    prefillForLc(key) ?? {
      name: p.title.replace(/^\d+\.\s*/, ""),
      url: LEETCODE_URL(key),
      patternId: OFF_ROADMAP[key]?.[0] ?? PATTERNS[0].id,
      difficulty: OFF_ROADMAP[key]?.[1] ?? "M",
      bankSlug: key,
    }
  );
}
