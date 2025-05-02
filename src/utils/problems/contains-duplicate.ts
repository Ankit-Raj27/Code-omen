import assert from "assert";
import { Problem } from "../types/problems";

const starterCodeContainsDuplicate = `function containsDuplicate(nums){
  // Write your code here
};`;

// checks if the user has the correct code
const handlerContainsDuplicate = (fn: any) => {
  try {
    const inputs = [
      [1, 2, 3, 1],
      [1, 2, 3, 4],
      [1, 1, 1, 3, 3, 4, 3, 2, 4, 2],
    ];

    const expected = [true, false, true];

    for (let i = 0; i < inputs.length; i++) {
      const result = fn(inputs[i]);
      assert.deepStrictEqual(result, expected[i]);
    }
    return true;
  } catch (error: any) {
    console.log("containsDuplicate handler function error");
    throw new Error(error);
  }
};

export const containsDuplicate: Problem = {
  id: "contains-duplicate",
  title: "Contains Duplicate",
  problemStatement: `<p class='mt-3'>
  Given an integer array <code>nums</code>, return <code>true</code> if any value appears <strong>at least twice</strong> in the array, and return <code>false</code> if every element is distinct.
</p>`,
  examples: [
    {
      id: 1,
      inputText: "nums = [1,2,3,1]",
      outputText: "true",
      explanation: "1 appears twice, so the function returns true.",
    },
    {
      id: 2,
      inputText: "nums = [1,2,3,4]",
      outputText: "false",
      explanation: "All elements are distinct.",
    },
    {
      id: 3,
      inputText: "nums = [1,1,1,3,3,4,3,2,4,2]",
      outputText: "true",
    },
  ],
  constraints: `<li class='mt-2'>
  <code>1 ≤ nums.length ≤ 10</code>
</li> <li class='mt-2'>
<code>-10 ≤ nums[i] ≤ 10</code>
</li>`,
  handlerFunction: handlerContainsDuplicate,
  starterCode: starterCodeContainsDuplicate,
  order: 2,
  starterFunctionName: "function containsDuplicate(",
};
