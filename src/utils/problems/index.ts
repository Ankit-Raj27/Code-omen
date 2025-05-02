import { Problem } from "../types/problems";
import { containsDuplicate } from "./contains-duplicate";
import { encodeDecodeStrings } from "./encode-and-decode-strings";
import { groupAnagrams } from "./group-anagram";
import { jumpGame } from "./jump-game";
import { reverseLinkedList } from "./reverse-linked-list";
import { search2DMatrix } from "./search-a-2d-matrix";
import { topKFrequent } from "./top-k-frequent-elements";
import { twoSum } from "./two-sum";
import { validAnagram } from "./valid-anagrams";
import { validParentheses } from "./valid-parentheses";

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
}