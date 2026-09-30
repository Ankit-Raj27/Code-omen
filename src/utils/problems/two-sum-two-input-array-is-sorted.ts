import assert from "assert";
import { Problem } from "../types/problems";

const starterCodeTwoSumSorted = `function twoSum(numbers, target) {
  // Write your code here
};`;

const handlerTwoSumSorted = (fn: any) => {
  try {
    const inputs = [
      [[2, 7, 11, 15], 9],
      [[2, 3, 4], 6],
      [[-1, 0], -1],
    ];
    const outputs = [
      [1, 2],
      [1, 3],
      [1, 2],
    ];

    for (let i = 0; i < inputs.length; i++) {
      const result = fn(inputs[i][0], inputs[i][1]);
      assert.deepStrictEqual(result, outputs[i]);
    }

    return true;
  } catch (error: any) {
    console.log("twoSumSorted handler function error");
    throw new Error(error);
  }
};

export const twoSumSorted: Problem = {
  id: "two-sum-ii-input-array-is-sorted",
  title: "Two Sum II – Input Array Is Sorted",
  problemStatement: `<p class='mt-3'><code>numbers</code> is sorted in non-decreasing order. Find two different entries that add up to <code>target</code> and return their positions counted from 1, smaller position first.</p><p class='mt-3'>There is exactly one answer, and your solution should use only constant extra space.</p>`,
  examples: [
    { id: 1, inputText: "numbers = [1,3,4,8], target = 11", outputText: "[2,4]", explanation: "3 + 8 = 11, at positions 2 and 4." },
    { id: 2, inputText: "numbers = [-3,1,2], target = -1", outputText: "[1,3]" },
  ],
  constraints: `<li class='mt-2'><code>2 ≤ numbers.length ≤ 3 × 10<sup>4</sup></code></li><li class='mt-2'><code>-1000 ≤ numbers[i], target ≤ 1000</code></li>`,
  handlerFunction: handlerTwoSumSorted,
  starterCode: starterCodeTwoSumSorted,
  order: 13,
  starterFunctionName: "function twoSum(",
};
