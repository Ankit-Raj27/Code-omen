import assert from "assert";
import { Problem } from "../types/problems";

const starterCodePascalsTriangle = `function generate(numRows) {
  // Write your code here
};`;

export const handlerPascalsTriangle = (fn: any) => {
  try {
    const inputs = [5, 1, 6];
    const outputs = [
      [
        [1],
        [1, 1],
        [1, 2, 1],
        [1, 3, 3, 1],
        [1, 4, 6, 4, 1],
      ],
      [[1]],
      [
        [1],
        [1, 1],
        [1, 2, 1],
        [1, 3, 3, 1],
        [1, 4, 6, 4, 1],
        [1, 5, 10, 10, 5, 1],
      ],
    ];

    for (let i = 0; i < inputs.length; i++) {
      const result = fn(inputs[i]);
      assert.deepStrictEqual(result, outputs[i]);
    }

    return true;
  } catch (error: any) {
    console.log("pascalsTriangle handler function error");
    throw new Error(error);
  }
};

export const pascalsTriangle: Problem = {
  id: "pascals-triangle",
  title: "Pascal's Triangle",
  problemStatement: `<p class='mt-3'>
    Given an integer <code>numRows</code>, return the first <code>numRows</code> of Pascal's triangle.
  </p>
  <p class='mt-3'>
    In Pascal's triangle, each number is the sum of the two numbers directly above it.
  </p>`,
  examples: [
    {
      id: 1,
      inputText: "numRows = 5",
      outputText: "[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]",
      explanation: "Each row is constructed by summing adjacent elements from the previous row.",
    },
    {
      id: 2,
      inputText: "numRows = 1",
      outputText: "[[1]]",
    },
  ],
  constraints: `<li class='mt-2'><code>1 ≤ numRows ≤ 30</code></li>`,
  handlerFunction: handlerPascalsTriangle,
  starterCode: starterCodePascalsTriangle,
  order: 11,
  starterFunctionName: "function generate(",
};
