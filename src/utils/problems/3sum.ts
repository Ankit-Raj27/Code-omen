import assert from "assert";
import { Problem } from "../types/problems";

const starterCodeThreeSum = `function threeSum(nums) {
  // Write your code here
};`;

const handlerThreeSum = (fn: any) => {
  try {
    const inputs = [
      [[-1, 0, 1, 2, -1, -4]],
      [[0, 1, 1]],
      [[0, 0, 0]],
    ];
    const outputs = [
      [[-1, -1, 2], [-1, 0, 1]],
      [],
      [[0, 0, 0]],
    ];

    for (let i = 0; i < inputs.length; i++) {
      const result = fn(inputs[i][0]);

      const sortTriplets = (triplets: number[][]) =>
        triplets.map(t => t.slice().sort((a, b) => a - b)).sort();

      assert.deepStrictEqual(sortTriplets(result), sortTriplets(outputs[i]));
    }

    return true;
  } catch (error: any) {
    console.log("threeSum handler function error");
    throw new Error(error);
  }
};

export const threeSum: Problem = {
  id: "3sum",
  title: "3Sum",
  problemStatement: `<p class='mt-3'>Given an integer array <code>nums</code>, return every distinct triplet of values from three different positions that adds up to <code>0</code>.</p><p class='mt-3'>No triplet may appear twice in the answer. Triplets, and the order inside each, may be in any order.</p>`,
  examples: [
    { id: 1, inputText: "nums = [-2,0,1,1,2]", outputText: "[[-2,0,2],[-2,1,1]]" },
    { id: 2, inputText: "nums = [1,2,3]", outputText: "[]", explanation: "No three values sum to 0." },
  ],
  constraints: `<li class='mt-2'><code>3 ≤ nums.length ≤ 3000</code></li><li class='mt-2'><code>-10<sup>5</sup> ≤ nums[i] ≤ 10<sup>5</sup></code></li>`,
  handlerFunction: handlerThreeSum,
  starterCode: starterCodeThreeSum,
  order: 14,
  starterFunctionName: "function threeSum(",
};
