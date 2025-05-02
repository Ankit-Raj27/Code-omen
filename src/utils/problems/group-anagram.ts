import assert from "assert";
import { Problem } from "../types/problems";

const starterCodeGroupAnagrams = `function groupAnagrams(strs) {
  // Write your code here
};`;

const handlerGroupAnagrams = (fn: any) => {
  try {
    const inputs = [
      ["eat", "tea", "tan", "ate", "nat", "bat"],
      [""],
      ["a"]
    ];

    const expected = [
      [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]],
      [[""]],
      [["a"]],
    ];

    for (let i = 0; i < inputs.length; i++) {
      const result = fn(inputs[i]);
      const expectedFlat = expected[i].map(arr => arr.sort()).sort();
    const resultFlat: string[][] = result.map((arr: string[]) => arr.sort()).sort();
      assert.deepStrictEqual(resultFlat, expectedFlat);
    }
    return true;
  } catch (error: any) {
    console.log("groupAnagrams handler function error");
    throw new Error(error);
  }
};

export const groupAnagrams: Problem = {
  id: "group-anagrams",
  title: "Group Anagrams",
  problemStatement: `<p class='mt-3'>
  Given an array of strings <code>strs</code>, group the anagrams together. You can return the answer in <strong>any order</strong>.
</p>
<p class='mt-3'>
  An <strong>Anagram</strong> is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.
</p>`,
  examples: [
    {
      id: 1,
      inputText: "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]",
      outputText: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]",
    },
    {
      id: 2,
      inputText: "strs = [\"\"]",
      outputText: "[[\"\"]]",
    },
    {
      id: 3,
      inputText: "strs = [\"a\"]",
      outputText: "[[\"a\"]]",
    }
  ],
  constraints: `<li class='mt-2'>
  <code>1 ≤ strs.length ≤ 10^4</code>
</li> <li class='mt-2'>
<code>0 ≤ strs[i].length ≤ 100</code>
</li> <li class='mt-2'>
<code>strs[i]</code> consists of lowercase English letters.
</li>`,
  handlerFunction: handlerGroupAnagrams,
  starterCode: starterCodeGroupAnagrams,
  order: 4,
  starterFunctionName: "function groupAnagrams(",
};
