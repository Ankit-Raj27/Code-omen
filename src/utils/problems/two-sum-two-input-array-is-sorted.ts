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
  problemStatement: `<p class='mt-3'>
    Given a <strong>1-indexed</strong> array of integers <code>numbers</code> that is already <strong>sorted in non-decreasing order</strong>, find two numbers such that they add up to a specific <code>target</code> number. 
  </p>
  <p class='mt-3'>
    Return the indices of the two numbers <strong>added by one</strong> as an integer array <code>[index1, index2]</code> of length 2.
  </p>
  <p class='mt-3'>
    The tests are generated such that there is exactly one solution. You <strong>may not</strong> use the same element twice.
  </p>
  <p class='mt-3'>
    Your solution must use only constant extra space.
  </p>`,
  examples: [
    {
      id: 1,
      inputText: "numbers = [2,7,11,15], target = 9",
      outputText: "[1,2]",
      explanation: "The sum of numbers[0] + numbers[1] = 2 + 7 = 9. Therefore, return [1, 2].",
    },
    {
      id: 2,
      inputText: "numbers = [2,3,4], target = 6",
      outputText: "[1,3]",
    },
    {
      id: 3,
      inputText: "numbers = [-1,0], target = -1",
      outputText: "[1,2]",
    },
  ],
  constraints: `<li class='mt-2'><code>2 ≤ numbers.length ≤ 10<sup>3</sup></code></li>
<li class='mt-2'><code>-1000 ≤ numbers[i] ≤ 1000</code></li>
<li class='mt-2'><code>numbers</code> is sorted in <strong>non-decreasing order</strong>.</li>
<li class='mt-2'><strong>Only one valid answer exists.</strong></li>`,
  handlerFunction: handlerTwoSumSorted,
  starterCode: starterCodeTwoSumSorted,
  order: 13,
  starterFunctionName: "function twoSum(",
};
