import assert from "assert";
import { Problem } from "../types/problems";

const starterCodeValidPalindrome = `function isPalindrome(s) {
  // Write your code here
};`;

const handlerValidPalindrome = (fn: any) => {
  try {
    const inputs = [
      "A man, a plan, a canal: Panama",
      "race a car",
      " ",
      "0P",
    ];

    const outputs = [true, false, true, false];

    for (let i = 0; i < inputs.length; i++) {
      const result = fn(inputs[i]);
      assert.strictEqual(result, outputs[i]);
    }

    return true;
  } catch (error: any) {
    console.log("validPalindrome handler function error");
    throw new Error(error);
  }
};

export const validPalindrome: Problem = {
  id: "valid-palindrome",
  title: "Valid Palindrome",
  problemStatement: `<p class='mt-3'>
  A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.
</p>
<p class='mt-3'>
  Given a string <code>s</code>, return <code>true</code> if it is a palindrome, or <code>false</code> otherwise.
</p>`,
  examples: [
    {
      id: 1,
      inputText: "s = 'A man, a plan, a canal: Panama'",
      outputText: "true",
      explanation: "After cleaning the input, it's 'amanaplanacanalpanama', which is a palindrome.",
    },
    {
      id: 2,
      inputText: "s = 'race a car'",
      outputText: "false",
      explanation: "The cleaned string is 'raceacar', which is not a palindrome.",
    },
    {
      id: 3,
      inputText: "s = ' '",
      outputText: "true",
      explanation: "An empty string is a valid palindrome.",
    },
  ],
  constraints: `<li class='mt-2'><code>1 ≤ s.length ≤ 2 × 10⁵</code></li>
<li class='mt-2'>The string <code>s</code> consists only of printable ASCII characters.</li>`,
  handlerFunction: handlerValidPalindrome,
  starterCode: starterCodeValidPalindrome,
  order: 7,
  starterFunctionName: "function isPalindrome(",
};
