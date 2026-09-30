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
  problemStatement: `<p class='mt-3'>You're given a list of lowercase words <code>strs</code>. Put words that are rearrangements of each other into the same group and return the list of groups.</p><p class='mt-3'>Groups may come back in any order, and so may the words inside each group.</p>`,
  examples: [
    { id: 1, inputText: "strs = [\"pots\",\"stop\",\"tops\",\"cat\",\"act\",\"dog\"]", outputText: "[[\"pots\",\"stop\",\"tops\"],[\"cat\",\"act\"],[\"dog\"]]" },
    { id: 2, inputText: "strs = [\"z\"]", outputText: "[[\"z\"]]" },
  ],
  constraints: `<li class='mt-2'><code>1 ≤ strs.length ≤ 10<sup>4</sup></code></li><li class='mt-2'><code>0 ≤ strs[i].length ≤ 100</code></li><li class='mt-2'>Only lowercase English letters.</li>`,
  handlerFunction: handlerGroupAnagrams,
  starterCode: starterCodeGroupAnagrams,
  order: 4,
  starterFunctionName: "function groupAnagrams(",
};
