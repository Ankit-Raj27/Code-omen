import assert from "assert";
import { Problem } from "../types/problems";

const starterCodeContainsDuplicate = `function containsDuplicate(nums){
  // Write your code here
};`;

// checks if the user has the correct code
const handlerContainsDuplicate = (fn: any) => {
  try {
    const inputs = [
      [1, 2, 3, 1],
      [1, 2, 3, 4],
      [1, 1, 1, 3, 3, 4, 3, 2, 4, 2],
    ];

    const expected = [true, false, true];

    for (let i = 0; i < inputs.length; i++) {
      const result = fn(inputs[i]);
      assert.deepStrictEqual(result, expected[i]);
    }
    return true;
  } catch (error: any) {
    console.log("containsDuplicate handler function error");
    throw new Error(error);
  }
};

export const containsDuplicate: Problem = {
  id: "contains-duplicate",
  title: "Contains Duplicate",
  problemStatement: `<p class='mt-3'>Given an integer array <code>nums</code>, return <code>true</code> if some value shows up at least twice, and <code>false</code> if every value is unique.</p>`,
  examples: [
    { id: 1, inputText: "nums = [7,3,9,3]", outputText: "true", explanation: "3 appears at positions 1 and 3." },
    { id: 2, inputText: "nums = [8,1,4]", outputText: "false" },
  ],
  constraints: `<li class='mt-2'><code>0 ≤ nums.length ≤ 10<sup>5</sup></code></li><li class='mt-2'><code>-10<sup>9</sup> ≤ nums[i] ≤ 10<sup>9</sup></code></li>`,
  handlerFunction: handlerContainsDuplicate,
  starterCode: starterCodeContainsDuplicate,
  order: 2,
  starterFunctionName: "function containsDuplicate(",
};
