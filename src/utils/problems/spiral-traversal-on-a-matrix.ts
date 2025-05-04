import assert from "assert";
import { Problem } from "../types/problems";

const starterCodeSpiralMatrix = `function spiralOrder(matrix) {
  // Write your code here
};`;

const handlerSpiralMatrix = (fn: any) => {
  try {
    const inputs = [
      [[
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ]],
      [[
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12]
      ]],
      [[
        [7]
      ]]
    ];

    const outputs = [
      [1, 2, 3, 6, 9, 8, 7, 4, 5],
      [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7],
      [7],
    ];

    for (let i = 0; i < inputs.length; i++) {
      const result = fn(inputs[i][0]);
      assert.deepStrictEqual(result, outputs[i]);
    }

    return true;
  } catch (error: any) {
    console.log("spiralMatrix handler function error");
    throw new Error(error);
  }
};

export const spiralMatrix: Problem = {
  id: "spiral-matrix",
  title: "Spiral Matrix",
  problemStatement: `<p class='mt-3'>
    Given an <code>m x n</code> matrix, return all elements of the matrix in spiral order.
  </p>`,
  examples: [
    {
      id: 1,
      inputText: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
      outputText: "[1,2,3,6,9,8,7,4,5]",
      explanation: "The spiral order starts from top-left and goes clockwise inward.",
    },
    {
      id: 2,
      inputText: "matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]",
      outputText: "[1,2,3,4,8,12,11,10,9,5,6,7]",
    },
    {
      id: 3,
      inputText: "matrix = [[7]]",
      outputText: "[7]",
    },
  ],
  constraints: `<li class='mt-2'><code>m == matrix.length</code></li>
<li class='mt-2'><code>n == matrix[i].length</code></li>
<li class='mt-2'><code>1 ≤ m, n ≤ 10</code></li>
<li class='mt-2'><code>-100 ≤ matrix[i][j] ≤ 100</code></li>`,
  handlerFunction: handlerSpiralMatrix,
  starterCode: starterCodeSpiralMatrix,
  order: 12,
  starterFunctionName: "function spiralOrder(",
};
