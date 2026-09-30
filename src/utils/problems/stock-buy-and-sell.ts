import assert from "assert";
import { Problem } from "../types/problems";

const starterCodeMaxProfit = `function maxProfit(prices) {
  // Write your code here
};`;

const handlerMaxProfit = (fn: any) => {
  try {
    const inputs = [
      [7, 1, 5, 3, 6, 4],
      [7, 6, 4, 3, 1],
      [1, 2],
      [2, 1, 2, 1, 2],
    ];

    const outputs = [5, 0, 1, 1];

    for (let i = 0; i < inputs.length; i++) {
      const result = fn(inputs[i]);
      assert.strictEqual(result, outputs[i]);
    }

    return true;
  } catch (error: any) {
    console.log("maxProfit handler function error");
    throw new Error(error);
  }
};

export const stockBuyAndSell: Problem = {
  id: "best-time-to-buy-and-sell-stock",
  title: "Best Time to Buy and Sell Stock",
  problemStatement: `<p class='mt-3'><code>prices[i]</code> is a stock's price on day <code>i</code>. You may buy once and then sell once on a later day. Return the most profit you can make, or <code>0</code> if no trade makes money.</p>`,
  examples: [
    { id: 1, inputText: "prices = [9,2,6,1,5]", outputText: "4", explanation: "Buy at 2 and sell at 6 (buying at 1 and selling at 5 also gives 4)." },
    { id: 2, inputText: "prices = [5,4,3]", outputText: "0", explanation: "Prices only fall, so don't trade." },
  ],
  constraints: `<li class='mt-2'><code>1 ≤ prices.length ≤ 10<sup>5</sup></code></li><li class='mt-2'><code>0 ≤ prices[i] ≤ 10<sup>4</sup></code></li>`,
  handlerFunction: handlerMaxProfit,
  starterCode: starterCodeMaxProfit,
  order: 9,
  starterFunctionName: "function maxProfit(",
};
