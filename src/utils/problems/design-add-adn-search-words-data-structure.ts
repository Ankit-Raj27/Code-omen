import assert from "assert";
import { Problem } from "../types/problems";

const starterCodeWordDictionary = `class WordDictionary {
  constructor() {
    // Initialize your data structure
  }

  addWord(word) {
    // Adds a word into the data structure.
  }

  search(word) {
    // Returns true if the word is in the data structure.
    // A word could contain the '.' character to represent any one letter.
  }
};`;

const handlerWordDictionary = (WordDictionaryConstructor: any) => {
  try {
    const wordDictionary = new WordDictionaryConstructor();
    wordDictionary.addWord("bad");
    wordDictionary.addWord("dad");
    wordDictionary.addWord("mad");

    assert.strictEqual(wordDictionary.search("pad"), false); // false
    assert.strictEqual(wordDictionary.search("bad"), true);  // true
    assert.strictEqual(wordDictionary.search(".ad"), true);  // true
    assert.strictEqual(wordDictionary.search("b.."), true);  // true

    return true;
  } catch (error: any) {
    console.log("wordDictionary handler function error");
    throw new Error(error);
  }
};

export const wordDictionary: Problem = {
  id: "word-dictionary",
  title: "Design Add and Search Words Data Structure",
  problemStatement: `<p class='mt-3'>Build a <code>WordDictionary</code> class. <code>addWord(word)</code> stores a word, and <code>search(pattern)</code> returns <code>true</code> if some stored word matches the pattern.</p><p class='mt-3'>In a pattern, <code>'.'</code> matches any single letter; every other character must match exactly, and lengths must be equal.</p>`,
  examples: [
    { id: 1, inputText: "addWord(\"pan\"), addWord(\"pen\"), search(\"p.n\"), search(\"pa\"), search(\"..n\")", outputText: "true, false, true", explanation: "\"pa\" is shorter than every stored word." },
  ],
  constraints: `<li class='mt-2'><code>1 ≤ word.length ≤ 25</code></li><li class='mt-2'>Stored words are lowercase letters; patterns may also contain <code>'.'</code>.</li><li class='mt-2'>At most 2 dots per search.</li>`,
  handlerFunction: handlerWordDictionary,
  starterCode: starterCodeWordDictionary,
  order: 18,
  starterFunctionName: "class WordDictionary",
};
