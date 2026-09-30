import assert from "assert";
import { Problem } from "../types/problems";

const starterCodeWordSearchII = `class WordSearch {
  constructor(board, words) {
    // Initialize your data structure with the board and list of words
  }

  findWords() {
    // Returns all words from the list that can be found on the board.
  }
};`;

const handlerWordSearchII = (WordSearchConstructor: any) => {
  try {
    const board = [
      ['o', 'a', 'a', 'n'],
      ['e', 't', 'a', 'e'],
      ['i', 'h', 'k', 'r'],
      ['i', 'f', 'l', 'v'],
    ];
    const words = ["oath", "pea", "eat", "rain"];
    const wordSearch = new WordSearchConstructor(board, words);

    const result = wordSearch.findWords();
    assert.deepStrictEqual(result, ["oath", "eat"]);  // the words "oath" and "eat" can be found

    return true;
  } catch (error: any) {
    console.log("wordSearch handler function error");
    throw new Error(error);
  }
};

export const wordSearchII: Problem = {
  id: "word-search-ii",
  title: "Word Search II",
  problemStatement: `<p class='mt-3'>A <code>WordSearch</code> is created with a grid of letters <code>board</code> and a list of <code>words</code>. <code>findWords()</code> returns every word from the list that can be traced on the grid.</p><p class='mt-3'>A word is traced by stepping between horizontally or vertically neighbouring cells, and one cell can't be used twice in the same word. Return the found words in any order.</p>`,
  examples: [
    { id: 1, inputText: "board = [[\"c\",\"a\",\"t\"],[\"x\",\"r\",\"o\"],[\"d\",\"o\",\"g\"]], words = [\"cat\",\"car\",\"dog\",\"tax\"]", outputText: "[\"cat\",\"car\",\"dog\"]", explanation: "\"tax\" would need a diagonal step from a to x." },
  ],
  constraints: `<li class='mt-2'><code>1 ≤ board.length, board[i].length ≤ 12</code></li><li class='mt-2'><code>1 ≤ words.length ≤ 3 × 10<sup>4</sup></code></li><li class='mt-2'>Letters are lowercase; words are distinct.</li>`,
  handlerFunction: handlerWordSearchII,
  starterCode: starterCodeWordSearchII,
  order: 19,
  starterFunctionName: "class WordSearch",
};
