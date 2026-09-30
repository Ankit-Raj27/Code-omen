import assert from "assert";
import { Problem } from "../types/problems";

const starterCodeMaxSubArray = `function maxSubArray(nums) {
  // Write your code here
};`;

const handlerMaxSubArray = (fn: any) => {
  try {
    const inputs = [
      [-2, 1, -3, 4, -1, 2, 1, -5, 4],
      [1],
      [5, 4, -1, 7, 8],
      [-1, -2, -3, -4],
    ];

    const outputs = [6, 1, 23, -1];

    for (let i = 0; i < inputs.length; i++) {
      const result = fn(inputs[i]);
      assert.strictEqual(result, outputs[i]);
    }

    return true;
  } catch (error: any) {
    console.log("maxSubArray handler function error");
    throw new Error(error);
  }
};

export const kadaneAlgorithm: Problem = {
  id: "maximum-subarray",
  title: "Maximum Subarray (Kadane's Algorithm)",
  problemStatement: `<p class='mt-3'>Given an integer array <code>nums</code>, find the contiguous, non-empty slice with the largest sum and return that sum.</p>`,
  examples: [
    { id: 1, inputText: "nums = [3,-4,5,-1,2,-6]", outputText: "6", explanation: "The slice [5,-1,2] sums to 6." },
    { id: 2, inputText: "nums = [-7]", outputText: "-7" },
  ],
  constraints: `<li class='mt-2'><code>1 ≤ nums.length ≤ 10<sup>5</sup></code></li><li class='mt-2'><code>-10<sup>4</sup> ≤ nums[i] ≤ 10<sup>4</sup></code></li>`,
  handlerFunction: handlerMaxSubArray,
  starterCode: starterCodeMaxSubArray,
  order: 8,
  starterFunctionName: "function maxSubArray(",
};
