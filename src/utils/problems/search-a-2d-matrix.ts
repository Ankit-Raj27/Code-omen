import assert from "assert";
import { Problem } from "../types/problems";

export const search2DMatrixHandler = (fn: any) => {
  try {
    const tests = [
      {
        matrix: [
          [1, 3, 5, 7],
          [10, 11, 16, 20],
          [23, 30, 34, 60],
        ],
        target: 3,
      },
      {
        matrix: [
          [1, 3, 5, 7],
          [10, 11, 16, 20],
          [23, 30, 34, 60],
        ],
        target: 13,
      },
    ];
    const answers = [true, false];
    for (let i = 0; i < tests.length; i++) {
      const result = fn(tests[i].matrix, tests[i].target);
      assert.deepEqual(result, answers[i]);
    }
    return true;
  } catch (error: any) {
    console.log("Error from searchA2DMatrixHandler: ", error);
    throw new Error(error);
  }
};
const starterCodeSearch2DMatrixJS = `// Do not edit function name
function searchMatrix(matrix, target) {
  // Write your code here
};`;

export const search2DMatrix: Problem = {
  id: "search-a-2d-matrix",
  title: "5. Search a 2D Matrix",
  problemStatement: `<p class='mt-3'>Each row of the <code>m × n</code> matrix is sorted left to right, and each row's first value is larger than the previous row's last value, so reading row by row gives one sorted sequence.</p><p class='mt-3'>Return <code>true</code> if <code>target</code> is in the matrix. Aim for O(log(m · n)) time.</p>`,
  examples: [
    { id: 1, inputText: "matrix = [[1,4,7],[9,12,15],[20,22,30]], target = 12", outputText: "true" },
    { id: 2, inputText: "matrix = [[1,4,7],[9,12,15],[20,22,30]], target = 8", outputText: "false" },
  ],
  constraints: `<li class='mt-2'><code>1 ≤ m, n ≤ 100</code></li><li class='mt-2'><code>-10<sup>4</sup> ≤ matrix[i][j], target ≤ 10<sup>4</sup></code></li>`,
  starterCode: starterCodeSearch2DMatrixJS,
  handlerFunction: search2DMatrixHandler,
  starterFunctionName: "function searchMatrix",
  order: 5,
};
