// Hint 3 of the workspace hint ladder: the one idea that cracks each problem.
// Keyed by LeetCode slug (= bank key). Ideas, not code. Reviewed in PRs.

import { GENERATED_INSIGHTS } from "@/content/problems";

export const KEY_INSIGHTS: Record<string, string> = {
  ...GENERATED_INSIGHTS,
  "two-sum": "For each number, the partner you need is target − x. Keep a map of value → index for what you've already seen and check it before inserting.",
  "contains-duplicate": "A set answers 'seen before?' in O(1). The first time add() finds the value already there, you're done.",
  "valid-anagram": "Same length, and a 26-slot count array that goes +1 for s and −1 for t ends all zeros.",
  "group-anagrams": "Anagrams share a canonical key: the sorted letters, or the 26 letter counts. Group words in a map under that key.",
  "top-k-frequent-elements": "Count with a map, then bucket values by frequency (index = count). Walk buckets from high to low until you have k.",
  "encode-and-decode-strings": "Prefix every string with its length and a delimiter (\"4#code\"). The decoder reads the length first, so any character inside the string is safe.",
  "valid-sudoku": "One pass over the 81 cells. Track seen digits per row, per column and per box, where box = (r / 3) * 3 + c / 3.",
  "product-of-array-except-self": "answer[i] = (product of everything left of i) × (product of everything right of i). One pass left to right, one pass right to left.",
  "longest-consecutive-sequence": "Put everything in a set. Only start counting at x when x − 1 isn't in the set, so each run is walked once.",
  "valid-palindrome": "Two pointers from both ends; skip anything that isn't a letter or digit and compare lowercase characters.",
  "two-sum-ii-input-array-is-sorted": "Sorted input: if the sum is too small move the left pointer right, if too big move the right pointer left.",
  "3sum": "Sort, fix the first number, then run two-sum-II on the rest. Skip equal neighbours at every level to avoid duplicate triplets.",
  "container-with-most-water": "Start with the widest pair. The shorter wall caps the area, so moving the taller one can never help: always move the shorter.",
  "trapping-rain-water": "Water above i = min(maxLeft, maxRight) − height[i]. With two pointers, process whichever side has the smaller max: its bound is already known.",
  "best-time-to-buy-and-sell-stock": "Sweep once, tracking the lowest price so far. Today's best profit is price − lowest; keep the maximum.",
  "valid-parentheses": "Push openers on a stack. A closer must match the top; at the end the stack must be empty.",
  "search-a-2d-matrix": "Treat the matrix as one sorted array of length m·n. Index k maps to row k / n, column k % n; binary search on k.",
  "reverse-linked-list": "Walk the list with prev and cur. Save cur.next before pointing cur.next back at prev, then step both forward.",
  "maximum-subarray": "At each index, either extend the best run ending before it or start fresh: cur = max(x, cur + x). Track the best cur seen.",
  "jump-game": "Track the farthest index reachable so far. If you ever stand on an index beyond it, you're stuck.",
  "set-matrix-zeroes": "Use the first row and first column as marker storage, plus one flag for whether the first row or column itself had a zero.",
  "spiral-matrix": "Keep four bounds (top, bottom, left, right). Walk one edge, shrink that bound, and repeat until the bounds cross.",
  "pascals-triangle": "Each row starts and ends with 1; every inner value is the sum of the two values above it in the previous row.",
  "implement-trie-prefix-tree": "Each node holds up to 26 children and an end-of-word flag. search needs the flag at the end; startsWith only needs the path to exist.",
  "design-add-and-search-words-data-structure": "Store words in a trie. On '.', try every child with a DFS; on a letter, follow that single child.",
  "word-search-ii": "Build a trie of the words, then DFS the board once, walking the trie alongside. Mark cells while visiting and remove found words to prune.",
};
