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
  problemStatement: `<p class='mt-3'>
  Given an integer array <code>nums</code>, find the contiguous subarray (containing at least one number) which has the largest sum and return <em>its sum</em>.
</p>
<p class='mt-3'>
  A subarray is a contiguous part of an array.
</p>`,
  examples: [
    {
      id: 1,
      inputText: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
      outputText: "6",
      explanation: "The subarray [4,-1,2,1] has the largest sum = 6.",
    },
    {
      id: 2,
      inputText: "nums = [1]",
      outputText: "1",
    },
    {
      id: 3,
      inputText: "nums = [5,4,-1,7,8]",
      outputText: "23",
    },
  ],
  constraints: `<li class='mt-2'><code>1 ≤ nums.length ≤ 10⁵</code></li>
<li class='mt-2'><code>-10⁴ ≤ nums[i] ≤ 10⁴</code></li>`,
  handlerFunction: handlerMaxSubArray,
  starterCode: starterCodeMaxSubArray,
  order: 8,
  starterFunctionName: "function maxSubArray(",
};
