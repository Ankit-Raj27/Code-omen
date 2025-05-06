import assert from "assert";
import { Problem } from "../types/problems";

const starterCodeImplementTrie = `class Trie {
  constructor() {
    // Initialize your trie data structure
  }

  insert(word) {
    // Insert a word into the trie
  }

  search(word) {
    // Returns true if the word is in the trie
  }

  startsWith(prefix) {
    // Returns true if there is any word in the trie that starts with the given prefix
  }
};`;

const handlerImplementTrie = (TrieConstructor: any) => {
  try {
    const trie = new TrieConstructor();
    trie.insert("apple");
    assert.strictEqual(trie.search("apple"), true);   // returns true
    assert.strictEqual(trie.search("app"), false);    // returns false
    assert.strictEqual(trie.startsWith("app"), true); // returns true
    trie.insert("app");
    assert.strictEqual(trie.search("app"), true);     // returns true

    return true;
  } catch (error: any) {
    console.log("trie handler function error");
    throw new Error(error);
  }
};

export const implementTrie: Problem = {
  id: "implement-trie",
  title: "Implement Trie (Prefix Tree)",
  problemStatement: `<p class='mt-3'>
    A <strong>trie</strong> (pronounced as "try") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. 
    There are various applications of this data structure, such as autocomplete and spellchecker.
  </p>
  <p class='mt-3'>
    Implement the Trie class:
    <ul class="list-disc pl-5">
      <li><code>Trie()</code> Initializes the trie object.</li>
      <li><code>void insert(String word)</code> Inserts the string <code>word</code> into the trie.</li>
      <li><code>boolean search(String word)</code> Returns <code>true</code> if the string <code>word</code> is in the trie (i.e., was inserted before), and <code>false</code> otherwise.</li>
      <li><code>boolean startsWith(String prefix)</code> Returns <code>true</code> if there is a previously inserted string <code>word</code> that has the prefix <code>prefix</code>, and <code>false</code> otherwise.</li>
    </ul>
  </p>`,
  examples: [
    {
      id: 1,
      inputText: 'trie = new Trie();\ntrie.insert("apple");\ntrie.search("apple");\ntrie.search("app");\ntrie.startsWith("app");\ntrie.insert("app");\ntrie.search("app");',
      outputText: "true, false, true, true",
      explanation: "The trie supports insertion and prefix matching correctly.",
    },
  ],
  constraints: `<li class='mt-2'><code>1 ≤ word.length, prefix.length ≤ 2000</code></li>
<li class='mt-2'><code>word</code> and <code>prefix</code> consist only of lowercase English letters.</li>
<li class='mt-2'>At most <code>3 * 10<sup>4</sup></code> calls will be made to <code>insert</code>, <code>search</code>, and <code>startsWith</code>.</li>`,
  handlerFunction: handlerImplementTrie,
  starterCode: starterCodeImplementTrie,
  order: 17,
  starterFunctionName: "class Trie",
};
