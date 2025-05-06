import { Problem } from "../types/problems";
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
export const problems:ProblemMap = {
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
    "kadane's algorithm": kadaneAlgorithm,
    "stock-buy-and-sell": stockBuyAndSell,
    "set-matrix-zeroes": setMatrixZeroes,
    "pascal's-triangle": pascalsTriangle,
    "spiral-on-a-matrix": spiralMatrix,
    "two-sum-two-input-array-is-sorted": twoSumSorted,
    "3sum" : threeSum,
    "container-with-most-water": containerWithMostWater,
    "trapping-rain-water": trappingRainWater,
    "implementing-trie-prefix-tree":implementTrie,
    "design-add-adn-search-words-data-structure":wordDictionary,
    "words-search-II":wordSearchII




    


}