import assert from "assert";
import { Problem } from "../types/problems";

const starterCodeValidAnagram = `function isAnagram(s, t) {
  // Write your code here
};`;

const handlerValidAnagram = (fn: any) => {
  try {
    const inputs = [
      ["anagram", "nagaram"],
      ["rat", "car"],
      ["a", "ab"],
    ];

    const expected = [true, false, false];

    for (let i = 0; i < inputs.length; i++) {
      const result = fn(...inputs[i]);
      assert.deepStrictEqual(result, expected[i]);
    }
    return true;
  } catch (error: any) {
    console.log("isAnagram handler function error");
    throw new Error(error);
  }
};

export const validAnagram: Problem = {
  id: "valid-anagram",
  title: "Valid Anagram",
  problemStatement: `<p class='mt-3'>Given two lowercase strings <code>s</code> and <code>t</code>, decide whether <code>t</code> uses exactly the same letters as <code>s</code>, each the same number of times, just possibly rearranged.</p>`,
  examples: [
    { id: 1, inputText: "s = \"stone\", t = \"notes\"", outputText: "true" },
    { id: 2, inputText: "s = \"hello\", t = \"hallo\"", outputText: "false", explanation: "s has two l's and an e; t has two l's and an a." },
  ],
  constraints: `<li class='mt-2'><code>1 ≤ s.length, t.length ≤ 5 × 10<sup>4</sup></code></li><li class='mt-2'>Both strings contain only lowercase English letters.</li>`,
  handlerFunction: handlerValidAnagram,
  starterCode: starterCodeValidAnagram,
  order: 3,
  starterFunctionName: "function isAnagram(",
};
