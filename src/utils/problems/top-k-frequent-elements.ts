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
  problemStatement: `<p class='mt-3'>
  Given an integer array <code>nums</code> and an integer <code>k</code>, return the <code>k</code> most frequent elements. You may return the answer in <strong>any order</strong>.
</p>`,
  examples: [
    {
      id: 1,
      inputText: "nums = [1,1,1,2,2,3], k = 2",
      outputText: "[1,2]",
    },
    {
      id: 2,
      inputText: "nums = [1], k = 1",
      outputText: "[1]",
    },
    {
      id: 3,
      inputText: "nums = [4,1,-1,2,-1,2,3], k = 2",
      outputText: "[-1,2]",
    }
  ],
  constraints: `<li class='mt-2'>
  <code>1 ≤ nums.length ≤ 10^5</code>
</li> <li class='mt-2'>
<code>k</code> is in the range <code>[1, the number of unique elements in the array]</code>.
</li> <li class='mt-2'>
It is <strong>guaranteed</strong> that the answer is <strong>unique</strong>.
</li>`,
  handlerFunction: handlerTopKFrequent,
  starterCode: starterCodeTopKFrequent,
  order: 5,
  starterFunctionName: "function topKFrequent(",
};
