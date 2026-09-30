import assert from "assert";
import { Problem } from "../types/problems";

const starterCodeTrappingRainWater = `function trap(height) {
  // Write your code here
};`;

const handlerTrappingRainWater = (fn: any) => {
  try {
    const inputs = [
      [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]],
      [[4, 2, 0, 3, 2, 5]],
      [[1, 0, 2]],
      [[2, 0, 2]],
    ];
    const outputs = [6, 9, 1, 2];

    for (let i = 0; i < inputs.length; i++) {
      const result = fn(inputs[i]);
      assert.strictEqual(result, outputs[i]);
    }

    return true;
  } catch (error: any) {
    console.log("trap handler function error");
    throw new Error(error);
  }
};

export const trappingRainWater: Problem = {
  id: "trapping-rain-water",
  title: "Trapping Rain Water",
  problemStatement: `<p class='mt-3'><code>height</code> describes a row of bars, each 1 unit wide. After it rains, water settles in the dips between taller bars. Return the total units of water trapped.</p>`,
  examples: [
    { id: 1, inputText: "height = [3,0,2,0,4]", outputText: "7", explanation: "3 + 1 + 3 units sit above positions 1, 2 and 3." },
    { id: 2, inputText: "height = [1,2,3]", outputText: "0", explanation: "Nothing can be held on a steady slope." },
  ],
  constraints: `<li class='mt-2'><code>0 ≤ height.length ≤ 2 × 10<sup>4</sup></code></li><li class='mt-2'><code>0 ≤ height[i] ≤ 10<sup>5</sup></code></li>`,
  handlerFunction: handlerTrappingRainWater,
  starterCode: starterCodeTrappingRainWater,
  order: 16,
  starterFunctionName: "function trap(",
};
