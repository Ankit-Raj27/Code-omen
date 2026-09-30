import assert from "assert";
import { Problem } from "../types/problems";

export const jumpGameHandler = (fn: any) => {
  try {
    const tests = [
      [2, 3, 1, 1, 4],
      [3, 2, 1, 0, 4],
      [2, 0, 0],
      [2, 5, 0, 0],
    ];
    const answers = [true, false, true, true];
    for (let i = 0; i < tests.length; i++) {
      const result = fn(tests[i]);
      assert.equal(result, answers[i]);
    }
    return true;
  } catch (error: any) {
    console.log("Error from jumpGameHandler: ", error);
    throw new Error(error);
  }
};

const starterCodeJumpGameJS = `function canJump(nums) {
  // Write your code here
};`;

export const jumpGame: Problem = {
  id: "jump-game",
  title: "3. Jump Game",
  problemStatement: `<p class='mt-3'>You start at index 0 of <code>nums</code>. From index <code>i</code> you may jump forward any number of steps from 1 up to <code>nums[i]</code>.</p><p class='mt-3'>Return <code>true</code> if you can reach the last index.</p>`,
  examples: [
    { id: 1, inputText: "nums = [1,2,0,1]", outputText: "true", explanation: "0 → 1, then jump 2 to index 3." },
    { id: 2, inputText: "nums = [1,0,2]", outputText: "false", explanation: "You get stuck at index 1." },
  ],
  constraints: `<li class='mt-2'><code>1 ≤ nums.length ≤ 10<sup>4</sup></code></li><li class='mt-2'><code>0 ≤ nums[i] ≤ 10<sup>5</sup></code></li>`,
  starterCode: starterCodeJumpGameJS,
  handlerFunction: jumpGameHandler,
  starterFunctionName: "function canJump(",
  order: 3,
};
