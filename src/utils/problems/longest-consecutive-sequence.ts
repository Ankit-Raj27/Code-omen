import assert from "assert";
import { Problem } from "../types/problems";

const starterCodeLongestConsecutive = `function longestConsecutive(nums) {
  // Write your code here
};`;

const handlerLongestConsecutive = (fn: any) => {
  try {
    const inputs = [
      [100, 4, 200, 1, 3, 2],
      [0, 3, 7, 2, 5, 8, 4, 6, 0, 1],
      [],
      [1, 2, 0, 1],
    ];

    const outputs = [4, 9, 0, 3];

    for (let i = 0; i < inputs.length; i++) {
      const result = fn(inputs[i]);
      assert.strictEqual(result, outputs[i]);
    }

    return true;
  } catch (error: any) {
    console.log("longestConsecutive handler function error");
    throw new Error(error);
  }
};

export const longestConsecutive: Problem = {
  id: "longest-consecutive-sequence",
  title: "Longest Consecutive Sequence",
  problemStatement: `<p class='mt-3'>
  Given an unsorted array of integers <code>nums</code>, return the length of the longest consecutive elements sequence.
</p>
<p class='mt-3'>
  You must write an algorithm that runs in <strong>O(n)</strong> time.
</p>`,
  examples: [
    {
      id: 1,
      inputText: "nums = [100,4,200,1,3,2]",
      outputText: "4",
      explanation: "The longest consecutive sequence is [1,2,3,4].",
    },
    {
      id: 2,
      inputText: "nums = [0,3,7,2,5,8,4,6,0,1]",
      outputText: "9",
      explanation: "The longest consecutive sequence is [0,1,2,3,4,5,6,7,8].",
    },
  ],
  constraints: `<li class='mt-2'><code>0 ≤ nums.length ≤ 10⁵</code></li>
<li class='mt-2'><code>-10⁹ ≤ nums[i] ≤ 10⁹</code></li>`,
  handlerFunction: handlerLongestConsecutive,
  starterCode: starterCodeLongestConsecutive,
  order: 6,
  starterFunctionName: "function longestConsecutive(",
};
