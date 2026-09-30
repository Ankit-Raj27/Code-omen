import assert from "assert";
import { Problem } from "../types/problems";

export const validParenthesesHandler = (fn: any) => {
	try {
		const tests = ["()", "()[]{}", "(]", "([)]", "{[]}"];
		const answers = [true, true, false, false, true];
		for (let i = 0; i < tests.length; i++) {
			const result = fn(tests[i]);
			assert.deepEqual(result, answers[i]);
		}
		return true;
	} catch (error: any) {
		console.error("Error from validParenthesesHandler: ", error);
		throw new Error(error);
	}
};

const starterCodeValidParenthesesJS = `function validParentheses(s) {
  // Write your code here
};`;

export const validParentheses: Problem = {
	id: "valid-parentheses",
	title: "4. Valid Parentheses",
	problemStatement: `<p class='mt-3'>A string <code>s</code> contains only the characters <code>()[]{}</code>. It is valid when every opening bracket is closed by the same type of bracket, and brackets close in the reverse order they were opened.</p><p class='mt-3'>Return <code>true</code> if <code>s</code> is valid.</p>`,
	examples: [
		{ id: 1, inputText: "s = \"{[()]}\"", outputText: "true" },
		{ id: 2, inputText: "s = \"(]\"", outputText: "false", explanation: "A ( is closed by ]." },
		{ id: 3, inputText: "s = \"(()\"", outputText: "false", explanation: "One ( is never closed." },
	],
	constraints: `<li class='mt-2'><code>1 ≤ s.length ≤ 10<sup>4</sup></code></li><li class='mt-2'><code>s</code> contains only <code>()[]{}</code>.</li>`,
	handlerFunction: validParenthesesHandler,
	starterCode: starterCodeValidParenthesesJS,
	starterFunctionName: "function validParentheses(",
	order: 4,
};