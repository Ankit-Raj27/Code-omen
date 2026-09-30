import assert from "assert";
import { Problem } from "../types/problems";

const starterCodeTopKFrequent = `function topKFrequent(nums, k) {
  // Write your code here
};`;

const handlerTopKFrequent = (fn: any) => {
  try {
    const inputs = [
      [[1,1,1,2,2,3], 2],
      [[1], 1],
      [[4,1,-1,2,-1,2,3], 2]
    ];

    const expected = [
      [1,2],
      [1],
      [-1,2]
    ];

    for (let i = 0; i < inputs.length; i++) {
      const result = fn(...inputs[i]);
      assert.deepStrictEqual(new Set(result), new Set(expected[i]));
    }
    return true;
  } catch (error: any) {
    console.log("topKFrequent handler function error");
    throw new Error(error);
  }
};

export const topKFrequent: Problem = {
  id: "top-k-frequent-elements",
  title: "Top K Frequent Elements",
  problemStatement: `<p class='mt-3'>Given an integer array <code>nums</code> and a number <code>k</code>, return the <code>k</code> values that occur most often. The answer is guaranteed to be unambiguous, and it may be returned in any order.</p>`,
  examples: [
    { id: 1, inputText: "nums = [5,5,5,2,2,8], k = 2", outputText: "[5,2]", explanation: "5 appears three times, 2 twice, 8 once." },
    { id: 2, inputText: "nums = [9], k = 1", outputText: "[9]" },
  ],
  constraints: `<li class='mt-2'><code>1 ≤ nums.length ≤ 10<sup>5</sup></code></li><li class='mt-2'><code>1 ≤ k ≤</code> number of distinct values</li><li class='mt-2'>Aim for better than O(n log n).</li>`,
  handlerFunction: handlerTopKFrequent,
  starterCode: starterCodeTopKFrequent,
  order: 5,
  starterFunctionName: "function topKFrequent(",
};
