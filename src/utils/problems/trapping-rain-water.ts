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
  problemStatement: `<p class='mt-3'>
    Given <code>n</code> non-negative integers representing an elevation map where the width of each bar is <code>1</code>, compute how much water it can trap after raining.
  </p>`,
  examples: [
    {
      id: 1,
      inputText: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
      outputText: "6",
      explanation:
        "After it rains, 6 units of water are trapped in the valleys of the elevation map.",
    },
    {
      id: 2,
      inputText: "height = [4,2,0,3,2,5]",
      outputText: "9",
    },
    {
      id: 3,
      inputText: "height = [2,0,2]",
      outputText: "2",
    },
  ],
  constraints: `<li class='mt-2'><code>n == height.length</code></li>
<li class='mt-2'><code>1 ≤ n ≤ 2 * 10<sup>4</sup></code></li>
<li class='mt-2'><code>0 ≤ height[i] ≤ 10<sup>5</sup></code></li>`,
  handlerFunction: handlerTrappingRainWater,
  starterCode: starterCodeTrappingRainWater,
  order: 16,
  starterFunctionName: "function trap(",
};
