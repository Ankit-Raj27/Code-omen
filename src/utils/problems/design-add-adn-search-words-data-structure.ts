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
  problemStatement: `<p class='mt-3'>
    Design a data structure that supports adding new words and finding if a string matches any previously added string.
  </p>
  <p class='mt-3'>
    Implement the <code>WordDictionary</code> class:
    <ul class="list-disc pl-5">
      <li><code>WordDictionary()</code> Initializes the object.</li>
      <li><code>void addWord(word)</code> Adds <code>word</code> to the data structure.</li>
      <li><code>boolean search(word)</code> Returns true if there is any string in the data structure that matches <code>word</code>.
      <br/>A word could contain the dot character <code>'.'</code> to represent any one letter.
      </li>
    </ul>
  </p>`,
  examples: [
    {
      id: 1,
      inputText: `wordDictionary = new WordDictionary();\nwordDictionary.addWord("bad");\nwordDictionary.addWord("dad");\nwordDictionary.addWord("mad");\nwordDictionary.search("pad");\nwordDictionary.search("bad");\nwordDictionary.search(".ad");\nwordDictionary.search("b..");`,
      outputText: `false, true, true, true`,
      explanation: "The dot character matches any one character.",
    },
  ],
  constraints: `<li class='mt-2'><code>1 ≤ word.length ≤ 25</code></li>
<li class='mt-2'>word in <code>addWord</code> consists of lowercase English letters.</li>
<li class='mt-2'>word in <code>search</code> consists of <code>'.'</code> or lowercase English letters.</li>
<li class='mt-2'>At most <code>10<sup>4</sup></code> calls will be made to <code>addWord</code> and <code>search</code>.</li>`,
  handlerFunction: handlerWordDictionary,
  starterCode: starterCodeWordDictionary,
  order: 18,
  starterFunctionName: "class WordDictionary",
};
