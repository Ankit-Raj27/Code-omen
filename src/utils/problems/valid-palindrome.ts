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
  problemStatement: `<p class='mt-3'>Given a string <code>s</code>, ignore everything that isn't a letter or a digit and treat uppercase and lowercase letters as equal. Return <code>true</code> if what remains reads the same forwards and backwards.</p>`,
  examples: [
    { id: 1, inputText: "s = \"Was it a car or a cat I saw?\"", outputText: "true", explanation: "Cleaned up it becomes \"wasitacaroracatisaw\"." },
    { id: 2, inputText: "s = \"code omen\"", outputText: "false" },
  ],
  constraints: `<li class='mt-2'><code>1 ≤ s.length ≤ 2 × 10<sup>5</sup></code></li><li class='mt-2'><code>s</code> contains printable ASCII characters.</li>`,
  handlerFunction: handlerValidPalindrome,
  starterCode: starterCodeValidPalindrome,
  order: 7,
  starterFunctionName: "function isPalindrome(",
};
