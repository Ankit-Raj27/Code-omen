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
  problemStatement: `<p class='mt-3'>
    Given an integer array <code>nums</code>, return all the triplets <code>[nums[i], nums[j], nums[k]]</code> such that <code>i != j</code>, <code>i != k</code>, and <code>j != k</code>, and <code>nums[i] + nums[j] + nums[k] == 0</code>.
  </p>
  <p class='mt-3'>Notice that the solution set must not contain duplicate triplets.</p>`,
  examples: [
    {
      id: 1,
      inputText: "nums = [-1,0,1,2,-1,-4]",
      outputText: "[[-1,-1,2],[-1,0,1]]",
      explanation: "Triplets that sum to zero are [-1,-1,2] and [-1,0,1].",
    },
    {
      id: 2,
      inputText: "nums = [0,1,1]",
      outputText: "[]",
      explanation: "No three numbers sum to zero.",
    },
    {
      id: 3,
      inputText: "nums = [0,0,0]",
      outputText: "[[0,0,0]]",
      explanation: "Only one triplet sums to zero.",
    },
  ],
  constraints: `<li class='mt-2'><code>3 ≤ nums.length ≤ 3000</code></li>
<li class='mt-2'><code>-10<sup>5</sup> ≤ nums[i] ≤ 10<sup>5</sup></code></li>`,
  handlerFunction: handlerThreeSum,
  starterCode: starterCodeThreeSum,
  order: 14,
  starterFunctionName: "function threeSum(",
};
