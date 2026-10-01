import { Problem } from "../types/problems";
import { GENERATED_PROBLEMS } from "@/content/problems";
import { PATTERNS } from "@/content/patterns";
import { threeSum } from "./3sum";
import { containerWithMostWater } from "./container-with-most-water";
import { containsDuplicate } from "./contains-duplicate";
import { wordDictionary } from "./design-add-adn-search-words-data-structure";
import { encodeDecodeStrings } from "./encode-and-decode-strings";
import { groupAnagrams } from "./group-anagram";
import { implementTrie } from "./implementing-trie-prefix-tree";
import { jumpGame } from "./jump-game";
import { kadaneAlgorithm } from "./kadane's algorithm";
import { longestConsecutive } from "./longest-consecutive-sequence";
import {  pascalsTriangle } from "./pascal's-triangle";
import { productExceptSelf } from "./product-of-array-except-self";
import { reverseLinkedList } from "./reverse-linked-list";
import { search2DMatrix } from "./search-a-2d-matrix";
import { setMatrixZeroes } from "./set-matrix-zero";
import { spiralMatrix } from "./spiral-traversal-on-a-matrix";
import { stockBuyAndSell } from "./stock-buy-and-sell";
import { topKFrequent } from "./top-k-frequent-elements";
import { trappingRainWater } from "./trapping-rain-water";
import { twoSum } from "./two-sum";
import { twoSumSorted } from "./two-sum-two-input-array-is-sorted";
import { validAnagram } from "./valid-anagrams";
import { validPalindrome } from "./valid-palindrome";
import { validParentheses } from "./valid-parentheses";
import { validSudoku } from "./valid-sudoku";
import { wordSearchII } from "./words-search-II";

interface ProblemMap{
    [key:string]:Problem;
}
const RAW: ProblemMap = {
    // Spec-generated problems (src/content/problems); hand-written ones below.
    ...GENERATED_PROBLEMS,
    "two-sum":twoSum,
    "reverse-linked-list": reverseLinkedList,
    "jump-game": jumpGame,
    "search-a-2d-matrix":search2DMatrix,
    "valid-parentheses":validParentheses,
    "contains-duplicate":containsDuplicate,
    "valid-anagram":validAnagram,
    "group-anagrams":groupAnagrams,
    "top-k-frequent-elements":topKFrequent,
    "encode-and-decode-strings":encodeDecodeStrings,
    "valid-sudoku" : validSudoku,
    "product-of-array-except-self": productExceptSelf,
    "longest-consecutive-sequence": longestConsecutive,
    "valid-palindrome": validPalindrome,
    "maximum-subarray": kadaneAlgorithm,
    "best-time-to-buy-and-sell-stock": stockBuyAndSell,
    "set-matrix-zeroes": setMatrixZeroes,
    "pascals-triangle": pascalsTriangle,
    "spiral-matrix": spiralMatrix,
    "two-sum-ii-input-array-is-sorted": twoSumSorted,
    "3sum" : threeSum,
    "container-with-most-water": containerWithMostWater,
    "trapping-rain-water": trappingRainWater,
    "implement-trie-prefix-tree":implementTrie,
    "design-add-and-search-words-data-structure":wordDictionary,
    "word-search-ii":wordSearchII,
};

/** LeetCode numbers for bank problems that aren't on a pattern sheet. */
const OFF_SHEET_LC: Record<string, number> = { "spiral-matrix": 54, "pascals-triangle": 118, "top-k-frequent-elements": 347 };

/**
 * The bank in roadmap order: pattern by pattern, core then stretch, then anything
 * off the sheets. `order` is 1..N with no gaps (the problem page's previous/next
 * arrows walk it) and every title is "<LeetCode number>. <name>".
 */
function normalise(raw: ProblemMap): ProblemMap {
  const lcOf: Record<string, number> = { ...OFF_SHEET_LC };
  const keys: string[] = [];
  for (const p of PATTERNS) {
    for (const [lc, , slug] of [...p.problems, ...(p.stretch ?? [])]) {
      lcOf[slug] = lc;
      if (raw[slug] && !keys.includes(slug)) keys.push(slug);
    }
  }
  const rest = Object.keys(raw).filter((k) => !keys.includes(k)).sort((a, b) => raw[a].order - raw[b].order);
  return Object.fromEntries(
    [...keys, ...rest].map((k, i) => {
      const name = raw[k].title.replace(/^\d+\.\s*/, "");
      return [k, { ...raw[k], order: i + 1, title: lcOf[k] ? `${lcOf[k]}. ${name}` : name }];
    }),
  );
}

export const problems: ProblemMap = normalise(RAW);
