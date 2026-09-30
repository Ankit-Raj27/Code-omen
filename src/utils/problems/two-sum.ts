import assert from "assert";
import { Problem } from "../types/problems"

const starterCodeTwoSum = `function twoSum(nums,target){
  // Write your code here
};`;

// checks if the user has the correct code
const handlerTwoSum = (fn: any) => {
  // fn is the callback that user's code is passed into
  try {
    const nums = [
      [2, 7, 11, 15],
      [3, 2, 4],
      [3, 3],
    ];

    const targets = [9, 6, 6];
    const answers = [
      [0, 1],
      [1, 2],
      [0, 1],
    ];

    // loop all tests to check if the user's code is correct
    for (let i = 0; i < nums.length; i++) {
      // result is the output of the user's function and answer is the expected output
      const result = fn(nums[i], targets[i]);
      assert.deepStrictEqual(result, answers[i]);
    }
    return true;
  } catch (error: any) {
    console.log("twoSum handler function error");
    throw new Error(error);
  }
};

export const twoSum: Problem = {
  id: "two-sum",
  title: "1. Two Sum",
  problemStatement: `<p class='mt-3'>You get an integer array <code>nums</code> and an integer <code>target</code>. Find the two different positions whose values add up to <code>target</code> and return those two indices.</p><p class='mt-3'>Every input has exactly one valid pair, and you can't use the same position twice. The two indices may be returned in either order.</p>`,
  examples: [
    { id: 1, inputText: "nums = [4,9,1,6], target = 7", outputText: "[2,3]", explanation: "nums[2] + nums[3] = 1 + 6 = 7." },
    { id: 2, inputText: "nums = [5,5,2], target = 10", outputText: "[0,1]" },
  ],
  constraints: `<li class='mt-2'><code>2 ≤ nums.length ≤ 10<sup>4</sup></code></li><li class='mt-2'><code>-10<sup>9</sup> ≤ nums[i], target ≤ 10<sup>9</sup></code></li><li class='mt-2'>Exactly one answer exists.</li>`,
  handlerFunction: handlerTwoSum,
  starterCode: starterCodeTwoSum,
  order: 1,
  starterFunctionName: "function twoSum(",
};
