import assert from "assert";
import { Problem } from "../types/problems";

const starterCodeSetMatrixZeroes = `function setZeroes(matrix) {
  // Write your code here
};`;

const handlerSetMatrixZeroes = (fn: any) => {
  try {
    const inputs = [
      [[
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
      ]],
      [[
        [0, 1, 2, 0],
        [3, 4, 5, 2],
        [1, 3, 1, 5],
      ]],
    ];

    const outputs = [
      [
        [1, 0, 1],
        [0, 0, 0],
        [1, 0, 1],
      ],
      [
        [0, 0, 0, 0],
        [0, 4, 5, 0],
        [0, 3, 1, 0],
      ],
    ];

    for (let i = 0; i < inputs.length; i++) {
      fn(inputs[i][0]);
      assert.deepStrictEqual(inputs[i][0], outputs[i]);
    }

    return true;
  } catch (error: any) {
    console.log("setMatrixZeroes handler function error");
    throw new Error(error);
  }
};

export const setMatrixZeroes: Problem = {
  id: "set-matrix-zeroes",
  title: "Set Matrix Zeroes",
  problemStatement: `<p class='mt-3'>
    Given an <code>m x n</code> integer matrix <code>matrix</code>, if an element is 0, set its entire row and column to 0's.
  </p>
  <p class='mt-3'>
    You must do it <strong>in place</strong>.
  </p>`,
  examples: [
    {
      id: 1,
      inputText: "matrix = [[1,1,1],[1,0,1],[1,1,1]]",
      outputText: "[[1,0,1],[0,0,0],[1,0,1]]",
      explanation: "Element at (1,1) is 0, so entire row 1 and column 1 are set to 0.",
    },
    {
      id: 2,
      inputText: "matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]",
      outputText: "[[0,0,0,0],[0,4,5,0],[0,3,1,0]]",
      explanation: "Zeros found at (0,0) and (0,3) — entire rows and columns are set accordingly.",
    },
  ],
  constraints: `<li class='mt-2'><code>m == matrix.length</code></li>
<li class='mt-2'><code>n == matrix[0].length</code></li>
<li class='mt-2'><code>1 ≤ m, n ≤ 200</code></li>
<li class='mt-2'><code>-2³¹ ≤ matrix[i][j] ≤ 2³¹ - 1</code></li>`,
  handlerFunction: handlerSetMatrixZeroes,
  starterCode: starterCodeSetMatrixZeroes,
  order: 10,
  starterFunctionName: "function setZeroes(",
};
