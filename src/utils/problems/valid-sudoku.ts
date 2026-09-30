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
  problemStatement: `<p class='mt-3'>A 9 × 9 Sudoku <code>board</code> is partially filled: cells hold digits <code>'1'</code>–<code>'9'</code> or <code>'.'</code> for empty.</p><p class='mt-3'>Return <code>true</code> if the filled cells break no rule: no digit repeats within a row, within a column, or within any of the nine 3 × 3 boxes. You don't need to check whether the puzzle can actually be solved.</p>`,
  examples: [
    { id: 1, inputText: "a board whose first row contains two '5's", outputText: "false", explanation: "The first row repeats 5." },
    { id: 2, inputText: "a board with no repeats in any row, column or 3 × 3 box", outputText: "true" },
  ],
  constraints: `<li class='mt-2'><code>board.length == 9</code> and every row has 9 cells</li><li class='mt-2'>Each cell is a digit <code>'1'</code>–<code>'9'</code> or <code>'.'</code></li>`,
  handlerFunction: handlerValidSudoku,
  starterCode: starterCodeValidSudoku,
  order: 4,
  starterFunctionName: "function isValidSudoku(",
};
