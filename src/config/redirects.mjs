// Old Pattern Track URLs → the routes that replaced them (Phase 1).
// Specific ?tab= rules come before the catch-all. Permanent: bookmarks should update.
const tab = (value) => [{ type: "query", key: "tab", value }];

// Old problem-bank URLs → LeetCode-slug URLs (Phase 2). Characters like ' and
// spaces are listed both raw and percent-encoded so either form matches.
export const PROBLEM_KEY_RENAMES = {
  "kadane's algorithm": "maximum-subarray",
  "stock-buy-and-sell": "best-time-to-buy-and-sell-stock",
  "pascal's-triangle": "pascals-triangle",
  "spiral-on-a-matrix": "spiral-matrix",
  "two-sum-two-input-array-is-sorted": "two-sum-ii-input-array-is-sorted",
  "implementing-trie-prefix-tree": "implement-trie-prefix-tree",
  "design-add-adn-search-words-data-structure": "design-add-and-search-words-data-structure",
  "words-search-II": "word-search-ii",
};

const encode = (k) => encodeURIComponent(k).replace(/'/g, "%27");
const problemRedirects = Object.entries(PROBLEM_KEY_RENAMES).flatMap(([oldKey, newKey]) =>
  [...new Set([oldKey, encode(oldKey)])].map((src) => ({
    source: `/problems/${src}`,
    destination: `/problems/${newKey}`,
    permanent: true,
  })),
);

export const redirects = [
  ...problemRedirects,
  { source: "/pattern-track", has: tab("today"), destination: "/", permanent: true },
  { source: "/pattern-track", has: tab("roadmap"), destination: "/patterns", permanent: true },
  { source: "/pattern-track", has: tab("log"), destination: "/log", permanent: true },
  { source: "/pattern-track", has: tab("method"), destination: "/method", permanent: true },
  { source: "/pattern-track", destination: "/", permanent: true },
];
