// Batch A: weeks 3–5 core problems + stretch problems for weeks 2–5.
// Original statements and examples; test data verified against reference solutions
// in JavaScript and Java (see __tests__).
import type { ProblemSpec } from "./spec";

const c = (s: string) => `<code>${s}</code>`;
const p = (...xs: string[]) => xs.map((x) => `<p class='mt-3'>${x}</p>`).join("");

export const BATCH_A: ProblemSpec[] = [
  // ------------------------------------------------ Week 3 · Sliding Window
  {
    kind: "function", slug: "longest-substring-without-repeating-characters", lc: 3,
    title: "Longest Substring Without Repeating Characters", difficulty: "M", patternId: "sliding-window",
    statement: p(`Given a string ${c("s")}, return the length of the longest contiguous piece of it in which no character appears twice.`),
    examples: [
      { inputText: 's = "oompaa"', outputText: "4", explanation: '"ompa" has four distinct characters.' },
      { inputText: 's = "aaaa"', outputText: "1" },
    ],
    constraints: [`${c("0 ≤ s.length ≤ 5 × 10<sup>4</sup>")}`, "Letters, digits, symbols and spaces."],
    insight: "Grow the window on the right; when the new character is already inside it, jump the left edge past that character's last position.",
    fn: "lengthOfLongestSubstring", params: [{ name: "s", type: "String" }], returns: "int",
    tests: [
      { args: ["oompaa"], expected: 4 }, { args: ["aaaa"], expected: 1 }, { args: ["abcabcbb"], expected: 3 },
      { args: ["pwwkew"], expected: 3 }, { args: [""], expected: 0 }, { args: [" "], expected: 1 },
      { args: ["dvdf"], expected: 3 }, { args: ["abba"], expected: 2 },
    ],
  },
  {
    kind: "function", slug: "longest-repeating-character-replacement", lc: 424,
    title: "Longest Repeating Character Replacement", difficulty: "M", patternId: "sliding-window",
    statement: p(
      `You get an uppercase string ${c("s")} and a number ${c("k")}. You may change any character to any other uppercase letter, at most ${c("k")} times in total.`,
      "Return the length of the longest block of identical letters you can end up with.",
    ),
    examples: [
      { inputText: 's = "XYYX", k = 1', outputText: "3", explanation: 'Change one X to get "YYY" inside "XYYX".' },
      { inputText: 's = "QQQ", k = 0', outputText: "3" },
    ],
    constraints: [`${c("1 ≤ s.length ≤ 10<sup>5</sup>")}`, "Only uppercase English letters.", `${c("0 ≤ k ≤ s.length")}`],
    insight: "A window is fine while its length minus the count of its most frequent letter is at most k. The max count never needs to shrink, so the window only slides.",
    fn: "characterReplacement", params: [{ name: "s", type: "String" }, { name: "k", type: "int" }], returns: "int",
    tests: [
      { args: ["XYYX", 1], expected: 3 }, { args: ["QQQ", 0], expected: 3 }, { args: ["ABAB", 2], expected: 4 },
      { args: ["AABABBA", 1], expected: 4 }, { args: ["A", 0], expected: 1 }, { args: ["ABCDE", 1], expected: 2 },
      { args: ["AAAB", 0], expected: 3 }, { args: ["BAAAB", 2], expected: 5 },
    ],
  },
  {
    kind: "function", slug: "permutation-in-string", lc: 567,
    title: "Permutation in String", difficulty: "M", patternId: "sliding-window",
    statement: p(`Return ${c("true")} if some contiguous piece of ${c("s2")} is a rearrangement of ${c("s1")} (same letters, same counts), otherwise ${c("false")}.`),
    examples: [
      { inputText: 's1 = "dog", s2 = "xgodz"', outputText: "true", explanation: '"god" is a rearrangement of "dog".' },
      { inputText: 's1 = "dog", s2 = "dxog"', outputText: "false" },
    ],
    constraints: [`${c("1 ≤ s1.length, s2.length ≤ 10<sup>4</sup>")}`, "Lowercase English letters."],
    insight: "Slide a window of exactly |s1| over s2 and keep 26 letter counts for it; compare with s1's counts as each letter enters and leaves.",
    fn: "checkInclusion", params: [{ name: "s1", type: "String" }, { name: "s2", type: "String" }], returns: "boolean",
    tests: [
      { args: ["dog", "xgodz"], expected: true }, { args: ["dog", "dxog"], expected: false },
      { args: ["ab", "eidbaooo"], expected: true }, { args: ["ab", "eidboaoo"], expected: false },
      { args: ["adc", "dcda"], expected: true }, { args: ["a", "a"], expected: true },
      { args: ["abc", "ab"], expected: false }, { args: ["hello", "ooolleoooleh"], expected: false },
    ],
  },
  {
    kind: "function", slug: "minimum-window-substring", lc: 76,
    title: "Minimum Window Substring", difficulty: "H", patternId: "sliding-window",
    statement: p(
      `Find the shortest contiguous piece of ${c("s")} that contains every character of ${c("t")}, counting repeats (if ${c("t")} has two a's, the piece needs two a's).`,
      `Return that piece, or ${c('""')} if none exists. When an answer exists it is unique.`,
    ),
    examples: [
      { inputText: 's = "XYZAXZY", t = "ZX"', outputText: '"XZ"' },
      { inputText: 's = "a", t = "aa"', outputText: '""', explanation: "s has only one a." },
    ],
    constraints: [`${c("1 ≤ s.length, t.length ≤ 10<sup>5</sup>")}`, "Uppercase and lowercase English letters."],
    insight: "Expand right until the window covers t (track how many required counts are met), then shrink from the left while it still covers, recording the smallest.",
    fn: "minWindow", params: [{ name: "s", type: "String" }, { name: "t", type: "String" }], returns: "String",
    tests: [
      { args: ["XYZAXZY", "ZX"], expected: "XZ" }, { args: ["a", "aa"], expected: "" },
      { args: ["ADOBECODEBANC", "ABC"], expected: "BANC" }, { args: ["a", "a"], expected: "a" },
      { args: ["ab", "b"], expected: "b" }, { args: ["aa", "aa"], expected: "aa" },
      { args: ["cabwefgewcwaefgcf", "cae"], expected: "cwae" },
    ],
  },

  // ------------------------------------------------ Week 4 · Stack
  {
    kind: "design", slug: "min-stack", lc: 155, title: "Min Stack", difficulty: "M", patternId: "stack",
    statement: p(
      `Build a ${c("MinStack")} class: ${c("push(val)")}, ${c("pop()")}, ${c("top()")} and ${c("getMin()")}, where ${c("getMin")} returns the smallest value currently on the stack.`,
      "Every operation must run in O(1) time. pop, top and getMin are only called on a non-empty stack.",
    ),
    examples: [
      { inputText: "push(4), push(1), getMin(), pop(), getMin(), top()", outputText: "1, 4, 4" },
    ],
    constraints: [`${c("-2<sup>31</sup> ≤ val ≤ 2<sup>31</sup> - 1")}`, "At most 3 × 10<sup>4</sup> calls in total."],
    insight: "Store, next to each value, the minimum of the stack at the moment it was pushed. The top pair always knows the current minimum.",
    className: "MinStack", ctor: [],
    methods: [
      { name: "push", params: [{ name: "val", type: "int" }], returns: "void" },
      { name: "pop", params: [], returns: "void" },
      { name: "top", params: [], returns: "int" },
      { name: "getMin", params: [], returns: "int" },
    ],
    tests: [
      { ops: ["MinStack", "push", "push", "getMin", "pop", "getMin", "top"], args: [[], [4], [1], [], [], [], []], expected: [null, null, null, 1, null, 4, 4] },
      { ops: ["MinStack", "push", "push", "push", "getMin", "pop", "top", "getMin"], args: [[], [-2], [0], [-3], [], [], [], []], expected: [null, null, null, null, -3, null, 0, -2] },
      { ops: ["MinStack", "push", "push", "getMin", "push", "getMin", "pop", "getMin", "top"], args: [[], [5], [5], [], [3], [], [], [], []], expected: [null, null, null, 5, null, 3, null, 5, 5] },
      { ops: ["MinStack", "push", "push", "push", "pop", "getMin", "pop", "getMin"], args: [[], [2], [1], [1], [], [], [], []], expected: [null, null, null, null, null, 1, null, 2] },
    ],
  },
  {
    kind: "function", slug: "evaluate-reverse-polish-notation", lc: 150,
    title: "Evaluate Reverse Polish Notation", difficulty: "M", patternId: "stack",
    statement: p(
      `${c("tokens")} is an arithmetic expression in postfix form: each operator (${c("+ - * /")}) comes after its two operands. Evaluate it and return the integer result.`,
      "Division truncates toward zero. The expression is always valid and never divides by zero.",
    ),
    examples: [
      { inputText: 'tokens = ["6","2","-","4","*"]', outputText: "16", explanation: "(6 − 2) × 4" },
      { inputText: 'tokens = ["-7","2","/"]', outputText: "-3" },
    ],
    constraints: [`${c("1 ≤ tokens.length ≤ 10<sup>4</sup>")}`, "Each token is an operator or an integer in [-200, 200]."],
    insight: "Push numbers; on an operator pop b then a (order matters for − and ÷), push a op b. The last value on the stack is the answer.",
    fn: "evalRPN", params: [{ name: "tokens", type: "String[]" }], returns: "int",
    tests: [
      { args: [["6", "2", "-", "4", "*"]], expected: 16 }, { args: [["-7", "2", "/"]], expected: -3 },
      { args: [["2", "1", "+", "3", "*"]], expected: 9 }, { args: [["4", "13", "5", "/", "+"]], expected: 6 },
      { args: [["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]], expected: 22 },
      { args: [["3", "-4", "/"]], expected: 0 }, { args: [["42"]], expected: 42 },
    ],
  },
  {
    kind: "function", slug: "daily-temperatures", lc: 739,
    title: "Daily Temperatures", difficulty: "M", patternId: "stack",
    statement: p(`For each day in ${c("temperatures")}, return how many days you have to wait for a strictly warmer day. Use ${c("0")} when no warmer day follows.`),
    examples: [{ inputText: "temperatures = [20,25,21,19,30]", outputText: "[1,3,2,1,0]" }],
    constraints: [`${c("1 ≤ temperatures.length ≤ 10<sup>5</sup>")}`, `${c("30 ≤ temperatures[i] ≤ 100")} in the original problem; any integers here.`],
    insight: "Keep a stack of indices still waiting for a warmer day. Each new day pops every colder waiting day and answers it with the index difference.",
    fn: "dailyTemperatures", params: [{ name: "temperatures", type: "int[]" }], returns: "int[]",
    tests: [
      { args: [[20, 25, 21, 19, 30]], expected: [1, 3, 2, 1, 0] },
      { args: [[73, 74, 75, 71, 69, 72, 76, 73]], expected: [1, 1, 4, 2, 1, 1, 0, 0] },
      { args: [[30, 40, 50, 60]], expected: [1, 1, 1, 0] }, { args: [[30, 60, 90]], expected: [1, 1, 0] },
      { args: [[50]], expected: [0] }, { args: [[70, 70, 70]], expected: [0, 0, 0] },
    ],
  },
  {
    kind: "function", slug: "car-fleet", lc: 853,
    title: "Car Fleet", difficulty: "M", patternId: "stack",
    statement: p(
      `Cars drive toward ${c("target")} on a one-lane road. Car ${c("i")} starts at ${c("position[i]")} with constant speed ${c("speed[i]")}. A car that catches up with a slower car ahead can't pass, so it slows down and they move together as a fleet.`,
      "Return how many fleets arrive at the target. A car catching up exactly at the target joins that fleet.",
    ),
    examples: [{ inputText: "target = 10, position = [8,3,1], speed = [1,2,1]", outputText: "3", explanation: "Arrival times 2, 3.5 and 9: nobody catches anyone." }],
    constraints: [`${c("1 ≤ n ≤ 10<sup>5</sup>")}`, "All starting positions are different and less than target."],
    insight: "Sort cars by position, closest to the target first, and compute each arrival time. A car forms a new fleet only if it arrives later than the fleet in front of it.",
    fn: "carFleet", params: [{ name: "target", type: "int" }, { name: "position", type: "int[]" }, { name: "speed", type: "int[]" }], returns: "int",
    tests: [
      { args: [10, [8, 3, 1], [1, 2, 1]], expected: 3 }, { args: [12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3]], expected: 3 },
      { args: [10, [3], [3]], expected: 1 }, { args: [100, [0, 2, 4], [4, 2, 1]], expected: 1 },
      { args: [10, [0, 4, 2], [2, 1, 3]], expected: 1 }, { args: [10, [6, 8], [3, 2]], expected: 2 },
    ],
  },
  {
    kind: "function", slug: "largest-rectangle-in-histogram", lc: 84,
    title: "Largest Rectangle in Histogram", difficulty: "H", patternId: "stack",
    statement: p(`${c("heights")} are the bars of a histogram, each 1 unit wide. Return the area of the largest rectangle that fits entirely inside the bars.`),
    examples: [
      { inputText: "heights = [3,1,3,3]", outputText: "6", explanation: "The last two bars form a 2 × 3 rectangle." },
      { inputText: "heights = [4,4]", outputText: "8" },
    ],
    constraints: [`${c("1 ≤ heights.length ≤ 10<sup>5</sup>")}`, `${c("0 ≤ heights[i] ≤ 10<sup>4</sup>")}`],
    insight: "Keep indices in an increasing-height stack. When a shorter bar arrives, each popped bar is the height of a rectangle bounded by the new bar and the bar now below it.",
    fn: "largestRectangleArea", params: [{ name: "heights", type: "int[]" }], returns: "int",
    tests: [
      { args: [[3, 1, 3, 3]], expected: 6 }, { args: [[4, 4]], expected: 8 }, { args: [[2, 1, 5, 6, 2, 3]], expected: 10 },
      { args: [[2, 4]], expected: 4 }, { args: [[1]], expected: 1 }, { args: [[2, 2, 2]], expected: 6 },
      { args: [[6, 2, 5, 4, 5, 1, 6]], expected: 12 }, { args: [[0, 0]], expected: 0 },
    ],
  },

  // ------------------------------------------------ Week 5 · Binary Search
  {
    kind: "function", slug: "binary-search", lc: 704,
    title: "Binary Search", difficulty: "E", patternId: "binary-search",
    statement: p(`${c("nums")} is sorted in increasing order with no duplicates. Return the index of ${c("target")}, or ${c("-1")} if it isn't there. Aim for O(log n).`),
    examples: [
      { inputText: "nums = [2,4,7,11], target = 7", outputText: "2" },
      { inputText: "nums = [2,4,7,11], target = 5", outputText: "-1" },
    ],
    constraints: [`${c("1 ≤ nums.length ≤ 10<sup>4</sup>")}`, "All values are distinct and sorted ascending."],
    insight: "Keep lo..hi containing every index the target could be at; compare with the middle and discard the half that can't hold it.",
    fn: "search", params: [{ name: "nums", type: "int[]" }, { name: "target", type: "int" }], returns: "int",
    tests: [
      { args: [[2, 4, 7, 11], 7], expected: 2 }, { args: [[2, 4, 7, 11], 5], expected: -1 },
      { args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 }, { args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
      { args: [[5], 5], expected: 0 }, { args: [[5], -5], expected: -1 }, { args: [[1, 3], 3], expected: 1 },
    ],
  },
  {
    kind: "function", slug: "koko-eating-bananas", lc: 875,
    title: "Koko Eating Bananas", difficulty: "M", patternId: "binary-search",
    statement: p(
      `There are piles of bananas, ${c("piles[i]")} in pile ${c("i")}. Each hour Koko picks one pile and eats up to ${c("k")} bananas from it; if the pile has fewer, she finishes it and waits for the next hour.`,
      `Return the smallest integer speed ${c("k")} that lets her finish every pile within ${c("h")} hours.`,
    ),
    examples: [{ inputText: "piles = [5,9], h = 4", outputText: "5", explanation: "At 5 per hour: 1 + 2 = 3 hours. At 4 per hour it would take 5." }],
    constraints: [`${c("1 ≤ piles.length ≤ h ≤ 10<sup>9</sup>")}`, `${c("1 ≤ piles[i] ≤ 10<sup>9</sup>")}`],
    insight: "Binary search the answer: speeds from 1 to max(piles). Hours needed only go down as speed goes up, so find the first speed whose total hours fit in h. Sum hours in a 64-bit integer.",
    fn: "minEatingSpeed", params: [{ name: "piles", type: "int[]" }, { name: "h", type: "int" }], returns: "int",
    tests: [
      { args: [[5, 9], 4], expected: 5 }, { args: [[3, 6, 7, 11], 8], expected: 4 },
      { args: [[30, 11, 23, 4, 20], 5], expected: 30 }, { args: [[30, 11, 23, 4, 20], 6], expected: 23 },
      { args: [[1], 1], expected: 1 }, { args: [[1000000000], 2], expected: 500000000 },
      { args: [[312884470], 312884469], expected: 2 },
    ],
  },
  {
    kind: "function", slug: "find-minimum-in-rotated-sorted-array", lc: 153,
    title: "Find Minimum in Rotated Sorted Array", difficulty: "M", patternId: "binary-search",
    statement: p(`An increasing array of distinct numbers was rotated some number of times (its tail moved to the front). Return its smallest element in O(log n) time.`),
    examples: [{ inputText: "nums = [8,9,2,5]", outputText: "2" }],
    constraints: [`${c("1 ≤ nums.length ≤ 5000")}`, "All values are distinct."],
    insight: "Compare the middle with the right end: if nums[mid] > nums[hi], the drop (and the minimum) is to the right of mid; otherwise it's at mid or to its left.",
    fn: "findMin", params: [{ name: "nums", type: "int[]" }], returns: "int",
    tests: [
      { args: [[8, 9, 2, 5]], expected: 2 }, { args: [[3, 4, 5, 1, 2]], expected: 1 },
      { args: [[4, 5, 6, 7, 0, 1, 2]], expected: 0 }, { args: [[11, 13, 15, 17]], expected: 11 },
      { args: [[2, 1]], expected: 1 }, { args: [[1]], expected: 1 }, { args: [[5, 1, 2, 3, 4]], expected: 1 },
    ],
  },
  {
    kind: "function", slug: "search-in-rotated-sorted-array", lc: 33,
    title: "Search in Rotated Sorted Array", difficulty: "M", patternId: "binary-search",
    statement: p(`${c("nums")} is an increasing array of distinct numbers that has been rotated. Return the index of ${c("target")}, or ${c("-1")}, in O(log n) time.`),
    examples: [{ inputText: "nums = [6,8,1,3], target = 1", outputText: "2" }],
    constraints: [`${c("1 ≤ nums.length ≤ 5000")}`, "All values are distinct."],
    insight: "At every step one half around mid is sorted. Check whether the target falls inside that sorted half's range; if so search it, otherwise search the other half.",
    fn: "search", params: [{ name: "nums", type: "int[]" }, { name: "target", type: "int" }], returns: "int",
    tests: [
      { args: [[6, 8, 1, 3], 1], expected: 2 }, { args: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4 },
      { args: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1 }, { args: [[1], 0], expected: -1 },
      { args: [[1, 3], 3], expected: 1 }, { args: [[3, 1], 1], expected: 1 }, { args: [[5, 1, 3], 5], expected: 0 },
    ],
  },
  {
    kind: "design", slug: "time-based-key-value-store", lc: 981,
    title: "Time Based Key-Value Store", difficulty: "M", patternId: "binary-search",
    statement: p(
      `Build a ${c("TimeMap")}. ${c("set(key, value, timestamp)")} records a value for a key at a moment in time. ${c("get(key, timestamp)")} returns the value set most recently at or before ${c("timestamp")}, or ${c('""')} if there is none.`,
      `Timestamps passed to ${c("set")} for the same key always increase.`,
    ),
    examples: [{ inputText: 'set("k","v",5), get("k",4), get("k",9)', outputText: '"", "v"' }],
    constraints: ["Keys and values are 1–100 lowercase letters or digits.", `${c("1 ≤ timestamp ≤ 10<sup>7</sup>")}`, "At most 2 × 10<sup>5</sup> calls."],
    insight: "Per key, keep (timestamp, value) pairs in insertion order — already sorted. get binary-searches for the last timestamp ≤ the query.",
    className: "TimeMap", ctor: [],
    methods: [
      { name: "set", params: [{ name: "key", type: "String" }, { name: "value", type: "String" }, { name: "timestamp", type: "int" }], returns: "void" },
      { name: "get", params: [{ name: "key", type: "String" }, { name: "timestamp", type: "int" }], returns: "String" },
    ],
    tests: [
      { ops: ["TimeMap", "set", "get", "get"], args: [[], ["k", "v", 5], ["k", 4], ["k", 9]], expected: [null, null, "", "v"] },
      { ops: ["TimeMap", "set", "get", "get", "set", "get", "get"], args: [[], ["foo", "bar", 1], ["foo", 1], ["foo", 3], ["foo", "bar2", 4], ["foo", 4], ["foo", 5]], expected: [null, null, "bar", "bar", null, "bar2", "bar2"] },
      { ops: ["TimeMap", "set", "set", "set", "get", "get", "get", "get"], args: [[], ["a", "1", 1], ["a", "2", 2], ["b", "x", 2], ["a", 1], ["a", 2], ["b", 1], ["zz", 9]], expected: [null, null, null, null, "1", "2", "", ""] },
    ],
  },

  // ------------------------------------------------ Stretch · Week 2 Two Pointers
  {
    kind: "function", slug: "squares-of-a-sorted-array", lc: 977,
    title: "Squares of a Sorted Array", difficulty: "E", patternId: "two-pointers",
    statement: p(`${c("nums")} is sorted in non-decreasing order and may contain negatives. Return the squares of its values, also sorted, in O(n) time.`),
    examples: [{ inputText: "nums = [-2,1,3]", outputText: "[1,4,9]" }],
    constraints: [`${c("1 ≤ nums.length ≤ 10<sup>4</sup>")}`, `${c("-10<sup>4</sup> ≤ nums[i] ≤ 10<sup>4</sup>")}`],
    insight: "The largest square sits at one of the two ends. Fill the result from the back, taking the bigger square from the left or right pointer each time.",
    fn: "sortedSquares", params: [{ name: "nums", type: "int[]" }], returns: "int[]",
    tests: [
      { args: [[-2, 1, 3]], expected: [1, 4, 9] }, { args: [[-4, -1, 0, 3, 10]], expected: [0, 1, 9, 16, 100] },
      { args: [[-7, -3, 2, 3, 11]], expected: [4, 9, 9, 49, 121] }, { args: [[1]], expected: [1] }, { args: [[-3, -2]], expected: [4, 9] },
    ],
  },
  {
    kind: "function", slug: "boats-to-save-people", lc: 881,
    title: "Boats to Save People", difficulty: "M", patternId: "two-pointers",
    statement: p(`Each boat carries at most two people with total weight at most ${c("limit")}. Given everyone's weight in ${c("people")} (each ≤ limit), return the fewest boats needed.`),
    examples: [{ inputText: "people = [4,2,2,3], limit = 5", outputText: "3", explanation: "Pair 2 with 3; 4 and the other 2 go alone." }],
    constraints: [`${c("1 ≤ people.length ≤ 5 × 10<sup>4</sup>")}`, `${c("1 ≤ people[i] ≤ limit ≤ 3 × 10<sup>4</sup>")}`],
    insight: "Sort. The heaviest person always takes a boat; they share it with the lightest person if the two fit. Move the pointers inward.",
    fn: "numRescueBoats", params: [{ name: "people", type: "int[]" }, { name: "limit", type: "int" }], returns: "int",
    tests: [
      { args: [[4, 2, 2, 3], 5], expected: 3 }, { args: [[1, 2], 3], expected: 1 }, { args: [[3, 2, 2, 1], 3], expected: 3 },
      { args: [[3, 5, 3, 4], 5], expected: 4 }, { args: [[5, 1, 4, 2], 6], expected: 2 }, { args: [[2], 2], expected: 1 },
    ],
  },
  {
    kind: "function", slug: "3sum-closest", lc: 16,
    title: "3Sum Closest", difficulty: "M", patternId: "two-pointers",
    statement: p(`Pick three numbers from different positions of ${c("nums")} whose sum is as close as possible to ${c("target")}, and return that sum. Exactly one closest sum exists.`),
    examples: [{ inputText: "nums = [1,2,4,8], target = 10", outputText: "11", explanation: "1 + 2 + 8 = 11 is 1 away; nothing is closer." }],
    constraints: [`${c("3 ≤ nums.length ≤ 500")}`, `${c("-1000 ≤ nums[i] ≤ 1000")}`],
    insight: "Sort, fix the first number, then move two pointers on the rest: sum too small → move left up, too big → move right down, tracking the closest sum seen.",
    fn: "threeSumClosest", params: [{ name: "nums", type: "int[]" }, { name: "target", type: "int" }], returns: "int",
    tests: [
      { args: [[1, 2, 4, 8], 10], expected: 11 }, { args: [[-1, 2, 1, -4], 1], expected: 2 }, { args: [[0, 0, 0], 1], expected: 0 },
      { args: [[1, 1, 1, 0], -100], expected: 2 }, { args: [[4, 0, 5, -5, 3, 3, 0, -4, -5], -2], expected: -2 },
    ],
  },

  // ------------------------------------------------ Stretch · Week 3 Sliding Window
  {
    kind: "function", slug: "sliding-window-maximum", lc: 239,
    title: "Sliding Window Maximum", difficulty: "H", patternId: "sliding-window",
    statement: p(`A window of size ${c("k")} slides over ${c("nums")} one step at a time. Return the maximum of each window position, in order, in O(n) total time.`),
    examples: [{ inputText: "nums = [2,7,1,3], k = 2", outputText: "[7,7,3]" }],
    constraints: [`${c("1 ≤ k ≤ nums.length ≤ 10<sup>5</sup>")}`],
    insight: "Keep a deque of indices with decreasing values. Pop from the back anything smaller than the new value, drop the front once it leaves the window; the front is the max.",
    fn: "maxSlidingWindow", params: [{ name: "nums", type: "int[]" }, { name: "k", type: "int" }], returns: "int[]",
    tests: [
      { args: [[2, 7, 1, 3], 2], expected: [7, 7, 3] }, { args: [[1, 3, -1, -3, 5, 3, 6, 7], 3], expected: [3, 3, 5, 5, 6, 7] },
      { args: [[1], 1], expected: [1] }, { args: [[9, 11], 2], expected: [11] }, { args: [[4, -2], 2], expected: [4] },
      { args: [[1, -1], 1], expected: [1, -1] },
    ],
  },
  {
    kind: "function", slug: "minimum-size-subarray-sum", lc: 209,
    title: "Minimum Size Subarray Sum", difficulty: "M", patternId: "sliding-window",
    statement: p(`${c("nums")} holds positive integers. Return the length of the shortest contiguous piece whose sum is at least ${c("target")}, or ${c("0")} if no piece reaches it.`),
    examples: [{ inputText: "target = 6, nums = [1,5,1,2]", outputText: "2", explanation: "[1,5] sums to 6." }],
    constraints: [`${c("1 ≤ nums.length ≤ 10<sup>5</sup>")}`, `${c("1 ≤ nums[i] ≤ 10<sup>4</sup>")}`],
    insight: "All values are positive, so the window sum only grows as it widens. Add on the right; while the sum is ≥ target, record the length and shrink from the left.",
    fn: "minSubArrayLen", params: [{ name: "target", type: "int" }, { name: "nums", type: "int[]" }], returns: "int",
    tests: [
      { args: [6, [1, 5, 1, 2]], expected: 2 }, { args: [7, [2, 3, 1, 2, 4, 3]], expected: 2 }, { args: [4, [1, 4, 4]], expected: 1 },
      { args: [11, [1, 1, 1, 1, 1, 1, 1, 1]], expected: 0 }, { args: [15, [1, 2, 3, 4, 5]], expected: 5 },
    ],
  },
  {
    kind: "function", slug: "max-consecutive-ones-iii", lc: 1004,
    title: "Max Consecutive Ones III", difficulty: "M", patternId: "sliding-window",
    statement: p(`${c("nums")} contains only 0s and 1s. If you may flip at most ${c("k")} zeros to ones, return the length of the longest run of ones you can get.`),
    examples: [{ inputText: "nums = [1,0,0,1], k = 1", outputText: "2" }],
    constraints: [`${c("1 ≤ nums.length ≤ 10<sup>5</sup>")}`, `${c("0 ≤ k ≤ nums.length")}`],
    insight: "Find the longest window containing at most k zeros: extend right, and while the window holds more than k zeros, move left forward.",
    fn: "longestOnes", params: [{ name: "nums", type: "int[]" }, { name: "k", type: "int" }], returns: "int",
    tests: [
      { args: [[1, 0, 0, 1], 1], expected: 2 }, { args: [[1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2], expected: 6 },
      { args: [[0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1], 3], expected: 10 },
      { args: [[0, 0, 0], 0], expected: 0 }, { args: [[1, 0, 1], 1], expected: 3 },
    ],
  },

  // ------------------------------------------------ Stretch · Week 4 Stack
  {
    kind: "function", slug: "generate-parentheses", lc: 22,
    title: "Generate Parentheses", difficulty: "M", patternId: "stack",
    statement: p(`Return every string of ${c("n")} pairs of parentheses that is correctly balanced, in any order.`),
    examples: [{ inputText: "n = 2", outputText: '["(())","()()"]' }],
    constraints: [`${c("1 ≤ n ≤ 8")}`],
    insight: "Build strings left to right: add '(' while fewer than n are open-used, add ')' only while it wouldn't close more than were opened.",
    fn: "generateParenthesis", params: [{ name: "n", type: "int" }], returns: "List<String>", compare: "anyOrder",
    tests: [
      { args: [2], expected: ["(())", "()()"] }, { args: [1], expected: ["()"] },
      { args: [3], expected: ["((()))", "(()())", "(())()", "()(())", "()()()"] },
    ],
  },
  {
    kind: "function", slug: "next-greater-element-i", lc: 496,
    title: "Next Greater Element I", difficulty: "E", patternId: "stack",
    statement: p(
      `${c("nums1")} is a subset of ${c("nums2")}, and all values are distinct. For each value in ${c("nums1")}, find it in ${c("nums2")} and return the first larger value to its right there, or ${c("-1")}.`,
    ),
    examples: [{ inputText: "nums1 = [3], nums2 = [5,3,6]", outputText: "[6]" }],
    constraints: [`${c("1 ≤ nums1.length ≤ nums2.length ≤ 1000")}`, "All values are distinct."],
    insight: "One monotonic-stack pass over nums2 gives the next greater value for every element; store it in a map, then answer nums1 by lookup.",
    fn: "nextGreaterElement", params: [{ name: "nums1", type: "int[]" }, { name: "nums2", type: "int[]" }], returns: "int[]",
    tests: [
      { args: [[3], [5, 3, 6]], expected: [6] }, { args: [[4, 1, 2], [1, 3, 4, 2]], expected: [-1, 3, -1] },
      { args: [[2, 4], [1, 2, 3, 4]], expected: [3, -1] }, { args: [[1], [1]], expected: [-1] },
    ],
  },
  {
    kind: "function", slug: "remove-k-digits", lc: 402,
    title: "Remove K Digits", difficulty: "M", patternId: "stack",
    statement: p(
      `${c("num")} is a non-negative integer written as a string. Remove exactly ${c("k")} digits so the remaining number is as small as possible, and return it as a string without leading zeros (${c('"0"')} if nothing remains).`,
    ),
    examples: [{ inputText: 'num = "5337", k = 2', outputText: '"33"' }],
    constraints: [`${c("1 ≤ k ≤ num.length ≤ 10<sup>5</sup>")}`, "num has no leading zeros except for \"0\" itself."],
    insight: "Scan left to right with a stack: while k > 0 and the top digit is bigger than the current one, pop it. Remove any leftover k from the end, then strip leading zeros.",
    fn: "removeKdigits", params: [{ name: "num", type: "String" }, { name: "k", type: "int" }], returns: "String",
    tests: [
      { args: ["5337", 2], expected: "33" }, { args: ["1432219", 3], expected: "1219" }, { args: ["10200", 1], expected: "200" },
      { args: ["10", 2], expected: "0" }, { args: ["9", 1], expected: "0" }, { args: ["112", 1], expected: "11" },
    ],
  },

  // ------------------------------------------------ Stretch · Week 5 Binary Search
  {
    kind: "function", slug: "search-insert-position", lc: 35,
    title: "Search Insert Position", difficulty: "E", patternId: "binary-search",
    statement: p(`${c("nums")} is sorted with distinct values. Return the index of ${c("target")} if present, otherwise the index where it would be inserted to keep the order.`),
    examples: [{ inputText: "nums = [10,20,30], target = 25", outputText: "2" }],
    constraints: [`${c("1 ≤ nums.length ≤ 10<sup>4</sup>")}`],
    insight: "This is the lower bound: the first index whose value is ≥ target. Search with lo < hi and hi = mid when nums[mid] ≥ target.",
    fn: "searchInsert", params: [{ name: "nums", type: "int[]" }, { name: "target", type: "int" }], returns: "int",
    tests: [
      { args: [[10, 20, 30], 25], expected: 2 }, { args: [[1, 3, 5, 6], 5], expected: 2 }, { args: [[1, 3, 5, 6], 2], expected: 1 },
      { args: [[1, 3, 5, 6], 7], expected: 4 }, { args: [[1, 3, 5, 6], 0], expected: 0 }, { args: [[1], 1], expected: 0 },
    ],
  },
  {
    kind: "function", slug: "find-first-and-last-position-of-element-in-sorted-array", lc: 34,
    title: "Find First and Last Position of Element in Sorted Array", difficulty: "M", patternId: "binary-search",
    statement: p(`${c("nums")} is sorted and may contain repeats. Return ${c("[first, last]")}: the first and last index of ${c("target")}, or ${c("[-1, -1]")} if it's absent. Aim for O(log n).`),
    examples: [{ inputText: "nums = [1,4,4,4,9], target = 4", outputText: "[1,3]" }],
    constraints: [`${c("0 ≤ nums.length ≤ 10<sup>5</sup>")}`],
    insight: "Run two lower-bound searches: one for target (first index) and one for target + 1 (one past the last index).",
    fn: "searchRange", params: [{ name: "nums", type: "int[]" }, { name: "target", type: "int" }], returns: "int[]",
    tests: [
      { args: [[1, 4, 4, 4, 9], 4], expected: [1, 3] }, { args: [[5, 7, 7, 8, 8, 10], 8], expected: [3, 4] },
      { args: [[5, 7, 7, 8, 8, 10], 6], expected: [-1, -1] }, { args: [[], 0], expected: [-1, -1] },
      { args: [[1], 1], expected: [0, 0] }, { args: [[2, 2, 2], 2], expected: [0, 2] },
    ],
  },
  {
    kind: "function", slug: "capacity-to-ship-packages-within-d-days", lc: 1011,
    title: "Capacity To Ship Packages Within D Days", difficulty: "M", patternId: "binary-search",
    statement: p(
      `Packages must ship in the given order; ${c("weights[i]")} is package ${c("i")}'s weight. Each day the ship is loaded with packages in order until the next one would exceed its capacity.`,
      `Return the smallest capacity that ships everything within ${c("days")} days.`,
    ),
    examples: [{ inputText: "weights = [4,2,5], days = 2", outputText: "6", explanation: "Day 1: 4 + 2, day 2: 5. With capacity 5 it takes 3 days." }],
    constraints: [`${c("1 ≤ days ≤ weights.length ≤ 5 × 10<sup>4</sup>")}`, `${c("1 ≤ weights[i] ≤ 500")}`],
    insight: "Binary search the capacity between max(weights) and sum(weights); a greedy day count tells you if a capacity is enough, and that answer only improves as capacity grows.",
    fn: "shipWithinDays", params: [{ name: "weights", type: "int[]" }, { name: "days", type: "int" }], returns: "int",
    tests: [
      { args: [[4, 2, 5], 2], expected: 6 }, { args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5], expected: 15 },
      { args: [[3, 2, 2, 4, 1, 4], 3], expected: 6 }, { args: [[1, 2, 3, 1, 1], 4], expected: 3 }, { args: [[10], 1], expected: 10 },
    ],
  },
];
