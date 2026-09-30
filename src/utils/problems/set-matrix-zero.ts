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
  problemStatement: `<p class='mt-3'>You're given an <code>m × n</code> integer matrix. Wherever a cell holds <code>0</code>, set that cell's entire row and entire column to <code>0</code>.</p><p class='mt-3'>Change the matrix in place; don't return anything. Zeros you write shouldn't trigger more zeroing.</p>`,
  examples: [
    { id: 1, inputText: "matrix = [[1,2],[0,4]]", outputText: "[[0,2],[0,0]]" },
    { id: 2, inputText: "matrix = [[5,0,7],[1,2,3]]", outputText: "[[0,0,0],[1,0,3]]" },
  ],
  constraints: `<li class='mt-2'><code>1 ≤ m, n ≤ 200</code></li><li class='mt-2'><code>-2<sup>31</sup> ≤ matrix[i][j] ≤ 2<sup>31</sup> - 1</code></li><li class='mt-2'>Try for O(1) extra space.</li>`,
  handlerFunction: handlerSetMatrixZeroes,
  starterCode: starterCodeSetMatrixZeroes,
  order: 10,
  starterFunctionName: "function setZeroes(",
};
