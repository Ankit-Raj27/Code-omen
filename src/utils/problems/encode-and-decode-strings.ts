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
  problemStatement: `<p class='mt-3'>Write two functions. <code>encode(strs)</code> turns a list of strings into a single string, and <code>decode(s)</code> turns that string back into the original list.</p><p class='mt-3'>The strings may contain any characters, including whatever separator you'd be tempted to use, so the format has to be unambiguous. Any scheme is fine as long as <code>decode(encode(strs))</code> returns the exact original list.</p>`,
  examples: [
    { id: 1, inputText: "strs = [\"code\",\"omen\"]", outputText: "[\"code\",\"omen\"]", explanation: "decode(encode(strs)) gives back the same list." },
    { id: 2, inputText: "strs = [\"\", \"a#b\"]", outputText: "[\"\",\"a#b\"]", explanation: "Empty strings and separator-like characters must survive." },
  ],
  constraints: `<li class='mt-2'><code>0 ≤ strs.length ≤ 200</code></li><li class='mt-2'><code>0 ≤ strs[i].length ≤ 200</code></li>`,
  handlerFunction: (fn) => handlerEncodeDecode(fn.encode, fn.decode),
  starterCode: starterCodeEncodeDecode,
  order: 3,
  starterFunctionName: "var encode = function(",
};
