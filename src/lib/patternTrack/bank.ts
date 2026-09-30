// Maps code-omen's local problem bank (src/utils/problems) to LeetCode slugs.
import { PATTERNS, LEETCODE_URL, type Difficulty } from "@/content/patterns";
import { problems } from "@/utils/problems";

// Bank keys that differ from the LeetCode slug.
const BANK_TO_LC: Record<string, string> = {
  "two-sum-two-input-array-is-sorted": "two-sum-ii-input-array-is-sorted",
  "implementing-trie-prefix-tree": "implement-trie-prefix-tree",
  "design-add-adn-search-words-data-structure": "design-add-and-search-words-data-structure",
  "words-search-II": "word-search-ii",
  "kadane's algorithm": "maximum-subarray",
  "stock-buy-and-sell": "best-time-to-buy-and-sell-stock",
};
const LC_TO_BANK: Record<string, string> = Object.fromEntries(
  Object.entries(BANK_TO_LC).map(([bank, lc]) => [lc, bank]),
);

export function lcSlugForBank(bankKey: string): string {
  return BANK_TO_LC[bankKey] ?? bankKey;
}

/** code-omen bank key for a LeetCode slug, if the problem exists in the bank. */
export function bankKeyForLc(lcSlug: string): string | undefined {
  const key = LC_TO_BANK[lcSlug] ?? lcSlug;
  return problems[key] ? key : undefined;
}

export function resolveUrl(bankKey: string): string {
  return `/problems/${encodeURIComponent(bankKey)}?fresh=1`;
}

export interface LogPrefill {
  name: string;
  url: string;
  patternId: string;
  difficulty: Difficulty;
  bankSlug: string;
}

/** Prefill values for logging a bank problem from its page. */
export function prefillForBank(bankKey: string): LogPrefill | undefined {
  const p = problems[bankKey];
  if (!p) return undefined;
  const lc = lcSlugForBank(bankKey);
  for (const pattern of PATTERNS) {
    const hit = pattern.problems.find(([, , slug]) => slug === lc);
    if (hit) {
      return { name: hit[1], url: LEETCODE_URL(lc), patternId: pattern.id, difficulty: hit[3], bankSlug: bankKey };
    }
  }
  return {
    name: p.title.replace(/^\d+\.\s*/, ""),
    url: LEETCODE_URL(lc),
    patternId: PATTERNS[0].id,
    difficulty: "M",
    bankSlug: bankKey,
  };
}
