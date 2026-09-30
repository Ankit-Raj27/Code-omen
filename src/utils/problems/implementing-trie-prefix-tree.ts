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
  problemStatement: `<p class='mt-3'>Build a <code>Trie</code> class for storing words and answering prefix questions:</p><p class='mt-3'><code>insert(word)</code> stores a word. <code>search(word)</code> returns <code>true</code> if that exact word was stored. <code>startsWith(prefix)</code> returns <code>true</code> if any stored word begins with <code>prefix</code>.</p>`,
  examples: [
    { id: 1, inputText: "insert(\"code\"), search(\"code\"), search(\"cod\"), startsWith(\"cod\")", outputText: "true, false, true", explanation: "\"cod\" was never inserted as a word, but it is a prefix of \"code\"." },
  ],
  constraints: `<li class='mt-2'><code>1 ≤ word.length, prefix.length ≤ 2000</code></li><li class='mt-2'>Lowercase English letters only.</li><li class='mt-2'>At most 3 × 10<sup>4</sup> calls in total.</li>`,
  handlerFunction: handlerImplementTrie,
  starterCode: starterCodeImplementTrie,
  order: 17,
  starterFunctionName: "class Trie",
};
