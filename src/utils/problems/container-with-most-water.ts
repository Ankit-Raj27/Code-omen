import assert from "assert";
import { Problem } from "../types/problems";

const starterCodeContainerWithMostWater = `function maxArea(height) {
  // Write your code here
};`;

const handlerContainerWithMostWater = (fn: any) => {
  try {
    const inputs = [
      [[1, 8, 6, 2, 5, 4, 8, 3, 7]],
      [[1, 1]],
      [[4, 3, 2, 1, 4]],
      [[1, 2, 1]],
    ];
    const outputs = [49, 1, 16, 2];

    for (let i = 0; i < inputs.length; i++) {
      const result = fn(inputs[i]);
      assert.strictEqual(result, outputs[i]);
    }

    return true;
  } catch (error: any) {
    console.log("maxArea handler function error");
    throw new Error(error);
  }
};

export const containerWithMostWater: Problem = {
  id: "container-with-most-water",
  title: "Container With Most Water",
  problemStatement: `<p class='mt-3'><code>height[i]</code> is the height of a vertical wall at position <code>i</code>. Pick two walls; together with the ground they hold water up to the shorter wall's height, across the distance between them.</p><p class='mt-3'>Return the largest amount of water any pair of walls can hold.</p>`,
  examples: [
    { id: 1, inputText: "height = [2,5,4,3]", outputText: "6", explanation: "Walls 0 and 3 hold 2 × 3; walls 1 and 3 hold 3 × 2." },
    { id: 2, inputText: "height = [3,3]", outputText: "3" },
  ],
  constraints: `<li class='mt-2'><code>2 ≤ height.length ≤ 10<sup>5</sup></code></li><li class='mt-2'><code>0 ≤ height[i] ≤ 10<sup>4</sup></code></li>`,
  handlerFunction: handlerContainerWithMostWater,
  starterCode: starterCodeContainerWithMostWater,
  order: 15,
  starterFunctionName: "function maxArea(",
};
