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
  problemStatement: `<p class='mt-3'>
    You are given an integer array <code>height</code> of length <code>n</code>. There are <code>n</code> vertical lines drawn such that the two endpoints of the <code>i<sup>th</sup></code> line are <code>(i, 0)</code> and <code>(i, height[i])</code>.
  </p>
  <p class='mt-3'>
    Find two lines that together with the x-axis form a container that holds the most water. Return the maximum amount of water a container can store.
  </p>
  <p class='mt-3'>
    <strong>Notice</strong> that you may not slant the container.
  </p>`,
  examples: [
    {
      id: 1,
      inputText: "height = [1,8,6,2,5,4,8,3,7]",
      outputText: "49",
      explanation:
        "The lines at index 1 and 8 form a container with max area: min(8,7) * (8-1) = 49.",
    },
    {
      id: 2,
      inputText: "height = [1,1]",
      outputText: "1",
      explanation: "Only one container can be formed: min(1,1) * 1 = 1.",
    },
  ],
  constraints: `<li class='mt-2'><code>n == height.length</code></li>
<li class='mt-2'><code>2 ≤ n ≤ 10<sup>5</sup></code></li>
<li class='mt-2'><code>0 ≤ height[i] ≤ 10<sup>4</sup></code></li>`,
  handlerFunction: handlerContainerWithMostWater,
  starterCode: starterCodeContainerWithMostWater,
  order: 15,
  starterFunctionName: "function maxArea(",
};
