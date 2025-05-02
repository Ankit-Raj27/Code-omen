import assert from "assert";
import { Problem } from "../types/problems";

const starterCodeEncodeDecode = `var encode = function(strs) {
  // Write your code here
};

var decode = function(s) {
  // Write your code here
};`;

// checks if the user has the correct code
interface EncodeFunction {
    (strs: string[]): string;
}

interface DecodeFunction {
    (s: string): string[];
}

const handlerEncodeDecode = (encodeFn: EncodeFunction, decodeFn: DecodeFunction): boolean => {
    try {
        const inputs: string[][] = [
            ["hello", "world"],
            ["abc", "123", "xyz"],
            ["a", "b", "c"],
        ];

        const encoded: string[] = [
            "5#hello5#world",
            "3#abc3#1233#xyz",
            "1#a1#b1#c",
        ];

        const decoded: string[][] = [
            ["hello", "world"],
            ["abc", "123", "xyz"],
            ["a", "b", "c"],
        ];

        // Loop through each test case to check if the encode/decode is correct
        for (let i = 0; i < inputs.length; i++) {
            const encodedStr: string = encodeFn(inputs[i]);
            const result: string[] = decodeFn(encodedStr);
            assert.deepStrictEqual(result, decoded[i]);
            assert.deepStrictEqual(encodedStr, encoded[i]);
        }

        return true;
    } catch (error: any) {
        console.log("encodeDecode handler function error");
        throw new Error(error);
    }
};

export const encodeDecodeStrings: Problem = {
  id: "encode-decode-strings",
  title: "Encode and Decode Strings",
  problemStatement: `<p class='mt-3'>
  Design an algorithm to encode a list of strings to a single string. 
  The encoded string is then decoded back to the original list of strings.
</p>
<p class='mt-3'>
  Implement an encoder and a decoder that can transform a list of strings into a single string and back.
</p>`,
  examples: [
    {
      id: 1,
      inputText: "strs = ['hello', 'world']",
      outputText: "'5#hello5#world'",
      explanation: "The encoded string represents the length of each string followed by the string itself.",
    },
    {
      id: 2,
      inputText: "strs = ['abc', '123', 'xyz']",
      outputText: "'3#abc3#1233#xyz'",
      explanation: "The encoded string represents the length of each string followed by the string itself.",
    },
    {
      id: 3,
      inputText: "strs = ['a', 'b', 'c']",
      outputText: "'1#a1#b1#c'",
      explanation: "The encoded string represents the length of each string followed by the string itself.",
    },
  ],
  constraints: `<li class='mt-2'>
  <code>1 ≤ strs.length ≤ 2000</code>
</li> <li class='mt-2'>
<code>1 ≤ strs[i].length ≤ 100</code>
</li>`,
  handlerFunction: (fn) => handlerEncodeDecode(fn.encode, fn.decode),
  starterCode: starterCodeEncodeDecode,
  order: 3,
  starterFunctionName: "var encode = function(",
};
