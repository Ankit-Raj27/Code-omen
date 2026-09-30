import assert from "assert";
import { Problem } from "../types/problems";

const starterCodeProductExceptSelf = `function productExceptSelf(nums) {
  // Write your code here
};`;

const handlerProductExceptSelf = (fn: any) => {
  try {
    const inputs = [
      [1, 2, 3, 4],
      [-1, 1, 0, -3, 3],
      [2, 3, 4, 5],
    ];

    const outputs = [
      [24, 12, 8, 6],
      [0, 0, 9, 0, 0],
      [60, 40, 30, 24],
    ];

    for (let i = 0; i < inputs.length; i++) {
      const result = fn(inputs[i]);
      assert.deepStrictEqual(result, outputs[i]);
    }

    return true;
  } catch (error: any) {
    console.log("productExceptSelf handler function error");
    throw new Error(error);
  }
};

export const productExceptSelf: Problem = {
  id: "product-except-self",
  title: "Product of Array Except Self",
  problemStatement: `<p class='mt-3'>Given an integer array <code>nums</code>, build an array <code>answer</code> where <code>answer[i]</code> is the product of every element except <code>nums[i]</code>.</p><p class='mt-3'>Do it in O(n) time without using division.</p>`,
  examples: [
    { id: 1, inputText: "nums = [2,3,4]", outputText: "[12,8,6]" },
    { id: 2, inputText: "nums = [1,-2,0,5]", outputText: "[0,0,-10,0]", explanation: "Only the position holding 0 gets a non-zero product." },
  ],
  constraints: `<li class='mt-2'><code>2 ≤ nums.length ≤ 10<sup>5</sup></code></li><li class='mt-2'><code>-30 ≤ nums[i] ≤ 30</code></li><li class='mt-2'>Every product fits in a 32-bit integer.</li>`,
  handlerFunction: handlerProductExceptSelf,
  starterCode: starterCodeProductExceptSelf,
  order: 5,
  starterFunctionName: "function productExceptSelf(",
};
