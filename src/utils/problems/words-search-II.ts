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
  problemStatement: `<p class='mt-3'>
    Given a 2D board and a list of words from the dictionary, find all words in the board.
  </p>
  <p class='mt-3'>
    Each word must be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.
  </p>
  <p class='mt-3'>
    Implement the <code>WordSearch</code> class:
    <ul class="list-disc pl-5">
      <li><code>WordSearch(board, words)</code> Initializes the object with a given board and a list of words.</li>
      <li><code>findWords()</code> Returns a list of all words that are found in the board.</li>
    </ul>
  </p>`,
  examples: [
    {
      id: 1,
      inputText: `board = [['o', 'a', 'a', 'n'], ['e', 't', 'a', 'e'], ['i', 'h', 'k', 'r'], ['i', 'f', 'l', 'v']];\nwords = ['oath', 'pea', 'eat', 'rain'];\nwordSearch = new WordSearch(board, words);\nwordSearch.findWords();`,
      outputText: `["oath", "eat"]`,
      explanation: "The words 'oath' and 'eat' can be formed from the board.",
    },
  ],
  constraints: `<li class='mt-2'><code>1 ≤ board.length ≤ 12</code></li>
<li class='mt-2'><code>1 ≤ board[i].length ≤ 12</code></li>
<li class='mt-2'><code>1 ≤ words.length ≤ 3 * 10^4</code></li>
<li class='mt-2'><code>1 ≤ words[i].length ≤ 10</code></li>
<li class='mt-2'>All words have distinct characters.</li>`,
  handlerFunction: handlerWordSearchII,
  starterCode: starterCodeWordSearchII,
  order: 19,
  starterFunctionName: "class WordSearch",
};
