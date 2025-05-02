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
  problemStatement: `<p class='mt-3'>
  Given two strings <code>s</code> and <code>t</code>, return <code>true</code> if <code>t</code> is an anagram of <code>s</code>, and <code>false</code> otherwise.
</p>
<p class='mt-3'>
  An <strong>Anagram</strong> is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.
</p>`,
  examples: [
    {
      id: 1,
      inputText: "s = \"anagram\", t = \"nagaram\"",
      outputText: "true",
      explanation: "All characters match in frequency and content.",
    },
    {
      id: 2,
      inputText: "s = \"rat\", t = \"car\"",
      outputText: "false",
      explanation: "Different characters present.",
    },
    {
      id: 3,
      inputText: "s = \"a\", t = \"ab\"",
      outputText: "false",
    },
  ],
  constraints: `<li class='mt-2'>
  <code>1 ≤ s.length, t.length ≤ 5 * 10^4</code>
</li> <li class='mt-2'>
<code>s</code> and <code>t</code> consist of lowercase English letters.
</li>`,
  handlerFunction: handlerValidAnagram,
  starterCode: starterCodeValidAnagram,
  order: 3,
  starterFunctionName: "function isAnagram(",
};
