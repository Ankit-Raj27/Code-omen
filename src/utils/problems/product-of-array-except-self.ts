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
  problemStatement: `<p class='mt-3'>
  Given an integer array <code>nums</code>, return an array <code>answer</code> such that <code>answer[i]</code> is equal to the product of all the elements of <code>nums</code> except <code>nums[i]</code>.
</p>
<p class='mt-3'>
  The solution must be done in <strong>O(n)</strong> time without using division.
</p>`,
  examples: [
    {
      id: 1,
      inputText: "nums = [1,2,3,4]",
      outputText: "[24,12,8,6]",
      explanation: "The product of all elements except nums[i] is returned in each index.",
    },
    {
      id: 2,
      inputText: "nums = [-1,1,0,-3,3]",
      outputText: "[0,0,9,0,0]",
      explanation: "The presence of a zero affects all products.",
    },
  ],
  constraints: `<li class='mt-2'><code>2 ≤ nums.length ≤ 10⁵</code></li>
<li class='mt-2'><code>-30 ≤ nums[i] ≤ 30</code></li>
<li class='mt-2'><strong>The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.</strong></li>`,
  handlerFunction: handlerProductExceptSelf,
  starterCode: starterCodeProductExceptSelf,
  order: 5,
  starterFunctionName: "function productExceptSelf(",
};
