import assert from "assert";
import { Problem } from "../types/problems";

const starterCodeValidSudoku = `function isValidSudoku(board) {
  // Write your code here
};`;

const handlerValidSudoku = (fn: any) => {
  try {
    const board1 = [
      ["5","3",".",".","7",".",".",".","."],
      ["6",".",".","1","9","5",".",".","."],
      [".","9","8",".",".",".",".","6","."],
      ["8",".",".",".","6",".",".",".","3"],
      ["4",".",".","8",".","3",".",".","1"],
      ["7",".",".",".","2",".",".",".","6"],
      [".","6",".",".",".",".","2","8","."],
      [".",".",".","4","1","9",".",".","5"],
      [".",".",".",".","8",".",".","7","9"]
    ];

    const board2 = [
      ["8","3",".",".","7",".",".",".","."],
      ["6",".",".","1","9","5",".",".","."],
      [".","9","8",".",".",".",".","6","."],
      ["8",".",".",".","6",".",".",".","3"],
      ["4",".",".","8",".","3",".",".","1"],
      ["7",".",".",".","2",".",".",".","6"],
      [".","6",".",".",".",".","2","8","."],
      [".",".",".","4","1","9",".",".","5"],
      [".",".",".",".","8",".",".","7","9"]
    ];

    const board3 = [
      ["5","3",".",".","7",".",".",".","."],
      ["6",".",".","1","9","5",".",".","."],
      [".","9","8",".",".",".",".","6","."],
      ["8",".",".",".","6",".",".",".","3"],
      ["4",".",".","8",".","3",".",".","1"],
      ["7",".",".",".","2",".",".",".","6"],
      [".","6",".",".",".",".","2","8","."],
      [".",".",".","4","1","9",".",".","5"],
      [".",".",".",".","8",".",".","7","8"]
    ];

    assert.strictEqual(fn(board1), true);
    assert.strictEqual(fn(board2), false);
    assert.strictEqual(fn(board3), false);

    return true;
  } catch (error: any) {
    console.log("validSudoku handler function error");
    throw new Error(error);
  }
};

export const validSudoku: Problem = {
  id: "valid-sudoku",
  title: "Valid Sudoku",
  problemStatement: `<p class='mt-3'>
  Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to the following rules:
</p>
<ul class='mt-2'>
  <li>Each row must contain the digits <code>1-9</code> without repetition.</li>
  <li>Each column must contain the digits <code>1-9</code> without repetition.</li>
  <li>Each of the nine 3 x 3 sub-boxes of the grid must contain the digits <code>1-9</code> without repetition.</li>
</ul>
<p class='mt-3'>Note:</p>
<ul>
  <li>A Sudoku board (partially filled) could be valid but is not necessarily solvable.</li>
  <li>Only the filled cells need to be validated according to the mentioned rules.</li>
</ul>`,
  examples: [
    {
      id: 1,
      inputText: "board = valid partially filled 9x9 grid",
      outputText: "true",
      explanation: "The board is valid according to Sudoku rules.",
    },
    {
      id: 2,
      inputText: "board = with duplicate '8' in the top-left box",
      outputText: "false",
      explanation: "A number is repeated in a 3x3 sub-grid.",
    },
    {
      id: 3,
      inputText: "board = with duplicate '8' in the same row",
      outputText: "false",
    },
  ],
  constraints: `<li class='mt-2'>
  <code>board.length == 9</code> and <code>board[i].length == 9</code>
</li>
<li class='mt-2'>
<code>board[i][j]</code> is a digit <code>'1'-'9'</code> or <code>'.'</code>
</li>`,
  handlerFunction: handlerValidSudoku,
  starterCode: starterCodeValidSudoku,
  order: 4,
  starterFunctionName: "function isValidSudoku(",
};
