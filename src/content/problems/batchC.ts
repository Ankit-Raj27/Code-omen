// Batch C: weeks 11–14 core problems + stretch (backtracking, graphs & grids,
// topological sort & union-find, weighted shortest paths). Original statements and
// examples; test data verified against reference solutions in JavaScript and Java.
import type { Param, ProblemSpec } from "./spec";

const c = (s: string) => `<code>${s}</code>`;
const p = (...xs: string[]) => xs.map((x) => `<p class='mt-3'>${x}</p>`).join("");
const int = (name: string): Param => ({ name, type: "int" });
const ints = (name: string): Param => ({ name, type: "int[]" });
const grid = (name: string): Param => ({ name, type: "int[][]" });
const chars = (name: string): Param => ({ name, type: "char[][]" });
const str = (name: string): Param => ({ name, type: "String" });
/** Character grid from row strings: g("10", "01") → [["1","0"],["0","1"]]. */
const g = (...rows: string[]) => rows.map((r) => r.split(""));
const UNIQUE = "The tests here are built so exactly one answer is valid.";

export const BATCH_C: ProblemSpec[] = [
  // ------------------------------------------------ Week 11 · Backtracking
  {
    kind: "function", slug: "subsets", lc: 78, title: "Subsets", difficulty: "M", patternId: "backtracking",
    statement: p(`${c("nums")} holds distinct integers. Return every subset of it (including the empty one), in any order, with no subset repeated.`),
    examples: [
      { inputText: "nums = [2,4]", outputText: "[[],[2],[4],[2,4]]" },
      { inputText: "nums = [0]", outputText: "[[],[0]]" },
    ],
    constraints: [`${c("1 ≤ nums.length ≤ 10")}`, "All values are distinct."],
    insight: "At each index make two choices, take it or skip it, and record the path when you reach the end. Equivalently: record the path at every node, then extend it with each later index.",
    fn: "subsets", params: [ints("nums")], returns: "List<List<Integer>>", compare: "anyOrderDeep",
    tests: [
      { args: [[1, 2, 3]], expected: [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]] }, { args: [[0]], expected: [[], [0]] },
      { args: [[5, -1]], expected: [[], [5], [-1], [5, -1]] }, { args: [[2, 4]], expected: [[], [2], [4], [2, 4]] },
    ],
  },
  {
    kind: "function", slug: "combination-sum", lc: 39, title: "Combination Sum", difficulty: "M", patternId: "backtracking",
    statement: p(
      `Return every combination of numbers from ${c("candidates")} (all distinct) that adds up to ${c("target")}. Each number may be used any number of times.`,
      "Two combinations are the same if they use the same numbers the same number of times. Any order is fine.",
    ),
    examples: [
      { inputText: "candidates = [7,3], target = 6", outputText: "[[3,3]]" },
      { inputText: "candidates = [2,3,6,7], target = 7", outputText: "[[2,2,3],[7]]" },
    ],
    constraints: [`${c("1 ≤ candidates.length ≤ 30")}`, `${c("2 ≤ candidates[i] ≤ 40")}`, `${c("1 ≤ target ≤ 40")}`],
    insight: "Backtrack with a start index: at index i you may take candidates[i] again (stay at i) or move on. Never go back to earlier indices, so no combination appears twice.",
    fn: "combinationSum", params: [ints("candidates"), int("target")], returns: "List<List<Integer>>", compare: "anyOrderDeep",
    tests: [
      { args: [[2, 3, 6, 7], 7], expected: [[2, 2, 3], [7]] }, { args: [[2, 3, 5], 8], expected: [[2, 2, 2, 2], [2, 3, 3], [3, 5]] },
      { args: [[2], 1], expected: [] }, { args: [[1], 2], expected: [[1, 1]] }, { args: [[7, 3], 6], expected: [[3, 3]] },
    ],
  },
  {
    kind: "function", slug: "permutations", lc: 46, title: "Permutations", difficulty: "M", patternId: "backtracking",
    statement: p(`Return every ordering of the distinct integers in ${c("nums")}, in any order.`),
    examples: [
      { inputText: "nums = [0,1]", outputText: "[[0,1],[1,0]]" },
      { inputText: "nums = [1]", outputText: "[[1]]" },
    ],
    constraints: [`${c("1 ≤ nums.length ≤ 6")}`, "All values are distinct."],
    insight: "Build the permutation one slot at a time, marking which values are used. Add a value, recurse, then unmark it: the classic choose / explore / unchoose.",
    fn: "permute", params: [ints("nums")], returns: "List<List<Integer>>", compare: "anyOrder",
    tests: [
      { args: [[1, 2, 3]], expected: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]] },
      { args: [[0, 1]], expected: [[0, 1], [1, 0]] }, { args: [[1]], expected: [[1]] }, { args: [[-1, 4]], expected: [[-1, 4], [4, -1]] },
    ],
  },
  {
    kind: "function", slug: "subsets-ii", lc: 90, title: "Subsets II", difficulty: "M", patternId: "backtracking",
    statement: p(`${c("nums")} may contain duplicates. Return every distinct subset, in any order.`),
    examples: [
      { inputText: "nums = [1,2,2]", outputText: "[[],[1],[1,2],[1,2,2],[2],[2,2]]" },
      { inputText: "nums = [4,4,4]", outputText: "[[],[4],[4,4],[4,4,4]]" },
    ],
    constraints: [`${c("1 ≤ nums.length ≤ 10")}`, `${c("-10 ≤ nums[i] ≤ 10")}`],
    insight: "Sort first. When looping over choices at one level, skip a value equal to the previous one at that same level; deeper levels may still use it.",
    fn: "subsetsWithDup", params: [ints("nums")], returns: "List<List<Integer>>", compare: "anyOrderDeep",
    tests: [
      { args: [[1, 2, 2]], expected: [[], [1], [1, 2], [1, 2, 2], [2], [2, 2]] }, { args: [[0]], expected: [[], [0]] },
      { args: [[4, 4, 4]], expected: [[], [4], [4, 4], [4, 4, 4]] }, { args: [[3, 1, 3]], expected: [[], [1], [1, 3], [1, 3, 3], [3], [3, 3]] },
    ],
  },
  {
    kind: "function", slug: "word-search", lc: 79, title: "Word Search", difficulty: "M", patternId: "backtracking",
    statement: p(`Return ${c("true")} if ${c("word")} can be spelled by a path through ${c("board")} that moves up, down, left or right, using each cell at most once.`),
    examples: [
      { inputText: 'board = [["a","b"],["c","d"]], word = "abdc"', outputText: "true" },
      { inputText: 'board = [["a","b"],["c","d"]], word = "abcd"', outputText: "false", explanation: "b and c only touch diagonally." },
    ],
    constraints: [`${c("1 ≤ rows, cols ≤ 6")}`, `${c("1 ≤ word.length ≤ 15")}`, "Letters only."],
    insight: "DFS from every cell that matches word[0]. Mark a cell as used before recursing into its neighbours and restore it afterwards, so other paths can reuse it.",
    fn: "exist", params: [chars("board"), str("word")], returns: "boolean",
    tests: [
      { args: [g("ABCE", "SFCS", "ADEE"), "ABCCED"], expected: true }, { args: [g("ABCE", "SFCS", "ADEE"), "SEE"], expected: true },
      { args: [g("ABCE", "SFCS", "ADEE"), "ABCB"], expected: false }, { args: [g("a"), "a"], expected: true },
      { args: [g("ab", "cd"), "abdc"], expected: true }, { args: [g("ab", "cd"), "abcd"], expected: false },
    ],
  },
  {
    kind: "function", slug: "n-queens", lc: 51, title: "N-Queens", difficulty: "H", patternId: "backtracking",
    statement: p(
      `Place ${c("n")} queens on an n × n board so that no two share a row, column or diagonal. Return every such board, in any order.`,
      `Each board is a list of ${c("n")} strings, with ${c("'Q'")} for a queen and ${c("'.'")} for an empty square.`,
    ),
    examples: [
      { inputText: "n = 4", outputText: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]' },
      { inputText: "n = 2", outputText: "[]" },
    ],
    constraints: [`${c("1 ≤ n ≤ 9")}`],
    insight: "Place one queen per row. Track used columns and both diagonals (r − c and r + c) in sets, so each placement check is O(1).",
    fn: "solveNQueens", params: [int("n")], returns: "List<List<String>>", compare: "anyOrder",
    tests: [
      { args: [4], expected: [[".Q..", "...Q", "Q...", "..Q."], ["..Q.", "Q...", "...Q", ".Q.."]] },
      { args: [1], expected: [["Q"]] }, { args: [2], expected: [] }, { args: [3], expected: [] },
    ],
  },
  // stretch
  {
    kind: "function", slug: "combination-sum-ii", lc: 40, title: "Combination Sum II", difficulty: "M", patternId: "backtracking",
    statement: p(`Return every distinct combination of ${c("candidates")} that sums to ${c("target")}. Each element may be used once, but the array may contain equal values. Any order is fine.`),
    examples: [
      { inputText: "candidates = [2,5,2,1,2], target = 5", outputText: "[[1,2,2],[5]]" },
      { inputText: "candidates = [3,3,3], target = 6", outputText: "[[3,3]]" },
    ],
    constraints: [`${c("1 ≤ candidates.length ≤ 100")}`, `${c("1 ≤ candidates[i] ≤ 50")}`, `${c("1 ≤ target ≤ 30")}`],
    insight: "Sort, then backtrack moving to i + 1 after each pick. At one level, skip a candidate equal to the one before it, so equal values don't create duplicate combinations.",
    fn: "combinationSum2", params: [ints("candidates"), int("target")], returns: "List<List<Integer>>", compare: "anyOrderDeep",
    tests: [
      { args: [[10, 1, 2, 7, 6, 1, 5], 8], expected: [[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]] },
      { args: [[2, 5, 2, 1, 2], 5], expected: [[1, 2, 2], [5]] }, { args: [[1], 2], expected: [] }, { args: [[3, 3, 3], 6], expected: [[3, 3]] },
    ],
  },
  {
    kind: "function", slug: "letter-combinations-of-a-phone-number", lc: 17, title: "Letter Combinations of a Phone Number", difficulty: "M", patternId: "backtracking",
    statement: p(
      `On a phone keypad, 2 is abc, 3 def, 4 ghi, 5 jkl, 6 mno, 7 pqrs, 8 tuv and 9 wxyz. Given a string of digits 2–9, return every letter string they could spell, in any order.`,
      `An empty input gives an empty list.`,
    ),
    examples: [
      { inputText: 'digits = "2"', outputText: '["a","b","c"]' },
      { inputText: 'digits = ""', outputText: "[]" },
    ],
    constraints: [`${c("0 ≤ digits.length ≤ 4")}`, "Digits 2–9 only."],
    insight: "One recursion level per digit: append each of its letters, recurse to the next digit, remove the letter. Record the string when every digit is used.",
    fn: "letterCombinations", params: [str("digits")], returns: "List<String>", compare: "anyOrder",
    tests: [
      { args: ["23"], expected: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"] }, { args: [""], expected: [] },
      { args: ["2"], expected: ["a", "b", "c"] },
      { args: ["79"], expected: ["pw", "px", "py", "pz", "qw", "qx", "qy", "qz", "rw", "rx", "ry", "rz", "sw", "sx", "sy", "sz"] },
    ],
  },
  {
    kind: "function", slug: "palindrome-partitioning", lc: 131, title: "Palindrome Partitioning", difficulty: "M", patternId: "backtracking",
    statement: p(`Split ${c("s")} into pieces so that every piece is a palindrome. Return every such split, in any order.`),
    examples: [
      { inputText: 's = "aba"', outputText: '[["a","b","a"],["aba"]]' },
      { inputText: 's = "ab"', outputText: '[["a","b"]]' },
    ],
    constraints: [`${c("1 ≤ s.length ≤ 16")}`, "Lowercase English letters."],
    insight: "From position i, try every end j where s[i..j] is a palindrome, add it to the path and recurse from j + 1. The path is complete when i reaches the end.",
    fn: "partition", params: [str("s")], returns: "List<List<String>>", compare: "anyOrder",
    tests: [
      { args: ["aab"], expected: [["a", "a", "b"], ["aa", "b"]] }, { args: ["a"], expected: [["a"]] },
      { args: ["aba"], expected: [["a", "b", "a"], ["aba"]] }, { args: ["abba"], expected: [["a", "b", "b", "a"], ["a", "bb", "a"], ["abba"]] },
      { args: ["ab"], expected: [["a", "b"]] },
    ],
  },

  // ------------------------------------------------ Week 12 · Graphs BFS/DFS & Grids
  {
    kind: "function", slug: "number-of-islands", lc: 200, title: "Number of Islands", difficulty: "M", patternId: "graphs-grids",
    statement: p(`${c("grid")} is a map of ${c("'1'")} (land) and ${c("'0'")} (water). Land cells connect up, down, left and right, not diagonally. Count the islands.`),
    examples: [
      { inputText: 'grid = [["1","0","1"],["0","1","0"],["1","0","1"]]', outputText: "5" },
      { inputText: 'grid = [["0"]]', outputText: "0" },
    ],
    constraints: [`${c("1 ≤ rows, cols ≤ 300")}`],
    insight: "Scan every cell. Each time you find unvisited land, count one island and flood it (DFS or BFS), marking every connected land cell as visited.",
    fn: "numIslands", params: [chars("grid")], returns: "int",
    tests: [
      { args: [g("11110", "11010", "11000", "00000")], expected: 1 }, { args: [g("11000", "11000", "00100", "00011")], expected: 3 },
      { args: [g("0")], expected: 0 }, { args: [g("101", "010", "101")], expected: 5 }, { args: [g("1")], expected: 1 },
    ],
  },
  {
    kind: "function", slug: "max-area-of-island", lc: 695, title: "Max Area of Island", difficulty: "M", patternId: "graphs-grids",
    statement: p(`In a grid of 0s and 1s, an island is a group of 1s connected up, down, left or right. Return the number of cells in the largest island, or 0 if there is none.`),
    examples: [
      { inputText: "grid = [[1,1,0],[0,1,0],[1,0,1]]", outputText: "3" },
      { inputText: "grid = [[0,0,0]]", outputText: "0" },
    ],
    constraints: [`${c("1 ≤ rows, cols ≤ 50")}`],
    insight: "Same flood fill as Number of Islands, but have the DFS return how many cells it visited, and keep the maximum.",
    fn: "maxAreaOfIsland", params: [grid("grid")], returns: "int",
    tests: [
      { args: [[[0, 0, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0], [1, 1, 1, 1]]], expected: 4 }, { args: [[[0, 0, 0]]], expected: 0 },
      { args: [[[1]]], expected: 1 }, { args: [[[1, 1, 0], [0, 1, 0], [1, 0, 1]]], expected: 3 },
    ],
  },
  {
    kind: "function", slug: "clone-graph", lc: 133, title: "Clone Graph", difficulty: "M", patternId: "graphs-grids",
    statement: p(
      `You get one node of a connected undirected graph. Each node has an integer ${c("val")} and a list of ${c("neighbors")}. Return a deep copy: brand-new nodes, wired the same way.`,
      "In the examples, the graph is an adjacency list where entry i lists the neighbours of the node with value i + 1. You receive the node with value 1 (or null for an empty graph).",
    ),
    examples: [
      { inputText: "adjList = [[2,4],[1,3],[2,4],[1,3]]", outputText: "[[2,4],[1,3],[2,4],[1,3]]" },
      { inputText: "adjList = [[]]", outputText: "[[]]", explanation: "One node, no edges." },
    ],
    constraints: ["0 to 100 nodes with distinct values 1..n.", "No self-loops or repeated edges."],
    insight: "Keep a map from original node to its copy. DFS: create a node's copy the first time you see it, then fill its neighbour list with the copies of its neighbours. The map also stops cycles.",
    fn: "cloneGraph", params: [{ name: "node", type: "Graph" }], returns: "Graph",
    tests: [
      { args: [[[2, 4], [1, 3], [2, 4], [1, 3]]], expected: [[2, 4], [1, 3], [2, 4], [1, 3]] }, { args: [[[]]], expected: [[]] },
      { args: [[]], expected: [] }, { args: [[[2], [1]]], expected: [[2], [1]] }, { args: [[[2, 3], [1, 3], [1, 2]]], expected: [[2, 3], [1, 3], [1, 2]] },
    ],
  },
  {
    kind: "function", slug: "rotting-oranges", lc: 994, title: "Rotting Oranges", difficulty: "M", patternId: "graphs-grids",
    statement: p(
      `Each cell is ${c("0")} (empty), ${c("1")} (fresh orange) or ${c("2")} (rotten orange). Every minute, each fresh orange next to a rotten one (up, down, left, right) turns rotten.`,
      `Return the minutes until no fresh orange is left, or ${c("-1")} if some never rot.`,
    ),
    examples: [
      { inputText: "grid = [[2,2],[1,1]]", outputText: "1" },
      { inputText: "grid = [[1]]", outputText: "-1", explanation: "No rotten orange ever reaches it." },
    ],
    constraints: [`${c("1 ≤ rows, cols ≤ 10")}`],
    insight: "Multi-source BFS: start the queue with every rotten orange at once and process it level by level. Each level is one minute; afterwards, any fresh orange left means -1.",
    fn: "orangesRotting", params: [grid("grid")], returns: "int",
    tests: [
      { args: [[[2, 1, 1], [1, 1, 0], [0, 1, 1]]], expected: 4 }, { args: [[[2, 1, 1], [0, 1, 1], [1, 0, 1]]], expected: -1 },
      { args: [[[0, 2]]], expected: 0 }, { args: [[[0]]], expected: 0 }, { args: [[[1]]], expected: -1 }, { args: [[[2, 2], [1, 1]]], expected: 1 },
    ],
  },
  {
    kind: "function", slug: "pacific-atlantic-water-flow", lc: 417, title: "Pacific Atlantic Water Flow", difficulty: "M", patternId: "graphs-grids",
    statement: p(
      `${c("heights")} is an island map. The Pacific touches the top and left edges, the Atlantic the bottom and right edges. Rain flows from a cell to a neighbour (up, down, left, right) whose height is less than or equal to its own.`,
      `Return the coordinates ${c("[r, c]")} of every cell whose water can reach both oceans, in any order.`,
    ),
    examples: [
      { inputText: "heights = [[1,2],[4,3]]", outputText: "[[0,1],[1,0],[1,1]]" },
      { inputText: "heights = [[1]]", outputText: "[[0,0]]" },
    ],
    constraints: [`${c("1 ≤ rows, cols ≤ 200")}`, `${c("0 ≤ heights[r][c] ≤ 10<sup>5</sup>")}`],
    insight: "Search backwards from each ocean: start at its edge cells and move uphill (to neighbours at least as high). The answer is the cells both searches reach.",
    fn: "pacificAtlantic", params: [grid("heights")], returns: "List<List<Integer>>", compare: "anyOrder",
    tests: [
      {
        args: [[[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]]],
        expected: [[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]],
      },
      { args: [[[1]]], expected: [[0, 0]] }, { args: [[[1, 2], [4, 3]]], expected: [[0, 1], [1, 0], [1, 1]] },
      { args: [[[3, 3], [3, 3]]], expected: [[0, 0], [0, 1], [1, 0], [1, 1]] },
    ],
  },
  {
    kind: "function", slug: "surrounded-regions", lc: 130, title: "Surrounded Regions", difficulty: "M", patternId: "graphs-grids",
    statement: p(
      `${c("board")} holds ${c("'X'")} and ${c("'O'")}. Flip every region of O's that is completely enclosed by X's to X. A region that touches the border is not enclosed and stays.`,
      "Change the board in place; the function returns nothing.",
    ),
    examples: [
      { inputText: 'board = [["X","X","X"],["X","O","X"],["X","X","X"]]', outputText: '[["X","X","X"],["X","X","X"],["X","X","X"]]' },
      { inputText: 'board = [["O","O"],["O","O"]]', outputText: '[["O","O"],["O","O"]]' },
    ],
    constraints: [`${c("1 ≤ rows, cols ≤ 200")}`],
    insight: "Flip the question: find the O's that survive. Flood from every border O and mark it safe; then every O not marked safe becomes X.",
    fn: "solve", params: [chars("board")], returns: "void", mutates: 0,
    tests: [
      { args: [g("XXXX", "XOOX", "XXOX", "XOXX")], expected: g("XXXX", "XXXX", "XXXX", "XOXX") }, { args: [g("X")], expected: g("X") },
      { args: [g("OO", "OO")], expected: g("OO", "OO") }, { args: [g("XXX", "XOX", "XXX")], expected: g("XXX", "XXX", "XXX") },
      { args: [g("XOX", "XOX", "XXX")], expected: g("XOX", "XOX", "XXX") },
    ],
  },
  // stretch
  {
    kind: "function", slug: "flood-fill", lc: 733, title: "Flood Fill", difficulty: "E", patternId: "graphs-grids",
    statement: p(`Starting at ${c("image[sr][sc]")}, repaint that pixel and every pixel connected to it (up, down, left, right) through the same original colour with ${c("color")}. Return the image.`),
    examples: [
      { inputText: "image = [[0,1],[1,0]], sr = 0, sc = 0, color = 3", outputText: "[[3,1],[1,0]]" },
      { inputText: "image = [[5]], sr = 0, sc = 0, color = 5", outputText: "[[5]]" },
    ],
    constraints: [`${c("1 ≤ rows, cols ≤ 50")}`, "Colours are 0 to 2<sup>16</sup>."],
    insight: "DFS from the start over cells of the original colour. If the new colour equals the original, return immediately, or the search never ends.",
    fn: "floodFill", params: [grid("image"), int("sr"), int("sc"), int("color")], returns: "int[][]",
    tests: [
      { args: [[[1, 1, 1], [1, 1, 0], [1, 0, 1]], 1, 1, 2], expected: [[2, 2, 2], [2, 2, 0], [2, 0, 1]] },
      { args: [[[0, 0, 0], [0, 0, 0]], 0, 0, 0], expected: [[0, 0, 0], [0, 0, 0]] },
      { args: [[[0, 1], [1, 0]], 0, 0, 3], expected: [[3, 1], [1, 0]] }, { args: [[[5]], 0, 0, 5], expected: [[5]] },
    ],
  },
  {
    kind: "function", slug: "01-matrix", lc: 542, title: "01 Matrix", difficulty: "M", patternId: "graphs-grids",
    statement: p(`For every cell of a 0/1 matrix, return its distance (in up/down/left/right steps) to the nearest 0. The matrix contains at least one 0.`),
    examples: [
      { inputText: "mat = [[0,1,1,1]]", outputText: "[[0,1,2,3]]" },
      { inputText: "mat = [[0,0,0],[0,1,0],[1,1,1]]", outputText: "[[0,0,0],[0,1,0],[1,2,1]]" },
    ],
    constraints: [`${c("1 ≤ rows × cols ≤ 10<sup>4</sup>")}`],
    insight: "Multi-source BFS from every 0 at once. The first time BFS reaches a cell is its shortest distance, so each cell is set exactly once.",
    fn: "updateMatrix", params: [grid("mat")], returns: "int[][]",
    tests: [
      { args: [[[0, 0, 0], [0, 1, 0], [0, 0, 0]]], expected: [[0, 0, 0], [0, 1, 0], [0, 0, 0]] },
      { args: [[[0, 0, 0], [0, 1, 0], [1, 1, 1]]], expected: [[0, 0, 0], [0, 1, 0], [1, 2, 1]] },
      { args: [[[0, 1, 1, 1]]], expected: [[0, 1, 2, 3]] }, { args: [[[1], [0]]], expected: [[1], [0]] },
    ],
  },
  {
    kind: "function", slug: "shortest-path-in-binary-matrix", lc: 1091, title: "Shortest Path in Binary Matrix", difficulty: "M", patternId: "graphs-grids",
    statement: p(
      `In an n × n grid of 0s (open) and 1s (blocked), find the shortest path from the top-left to the bottom-right cell through open cells. You may step in all 8 directions.`,
      `Return the number of cells on that path, or ${c("-1")} if there is none.`,
    ),
    examples: [
      { inputText: "grid = [[0,1],[1,0]]", outputText: "2", explanation: "One diagonal step." },
      { inputText: "grid = [[0,0],[0,1]]", outputText: "-1" },
    ],
    constraints: [`${c("1 ≤ n ≤ 100")}`],
    insight: "Plain BFS from (0,0) with 8 neighbours, counting cells. Check the start and end cells are open before you begin.",
    fn: "shortestPathBinaryMatrix", params: [grid("grid")], returns: "int",
    tests: [
      { args: [[[0, 1], [1, 0]]], expected: 2 }, { args: [[[0, 0, 0], [1, 1, 0], [1, 1, 0]]], expected: 4 },
      { args: [[[1, 0, 0], [1, 1, 0], [1, 1, 0]]], expected: -1 }, { args: [[[0]]], expected: 1 }, { args: [[[0, 0], [0, 1]]], expected: -1 },
    ],
  },

  // ------------------------------------------------ Week 13 · Topological Sort & Union-Find
  {
    kind: "function", slug: "course-schedule", lc: 207, title: "Course Schedule", difficulty: "M", patternId: "topo-union-find",
    statement: p(`There are ${c("numCourses")} courses, 0 to n − 1. Each pair ${c("[a, b]")} in ${c("prerequisites")} means you must take b before a. Return ${c("true")} if you can finish every course.`),
    examples: [
      { inputText: "numCourses = 2, prerequisites = [[1,0]]", outputText: "true" },
      { inputText: "numCourses = 2, prerequisites = [[1,0],[0,1]]", outputText: "false", explanation: "Each course waits for the other." },
    ],
    constraints: [`${c("1 ≤ numCourses ≤ 2000")}`, `${c("0 ≤ prerequisites.length ≤ 5000")}`, "No duplicate pairs."],
    insight: "It's possible exactly when the prerequisite graph has no cycle. Kahn's algorithm: repeatedly take courses with no remaining prerequisites; if you take all n, there's no cycle.",
    fn: "canFinish", params: [int("numCourses"), grid("prerequisites")], returns: "boolean",
    tests: [
      { args: [2, [[1, 0]]], expected: true }, { args: [2, [[1, 0], [0, 1]]], expected: false }, { args: [3, []], expected: true },
      { args: [4, [[1, 0], [2, 1], [3, 2], [1, 3]]], expected: false }, { args: [5, [[1, 0], [2, 0], [3, 1], [3, 2], [4, 3]]], expected: true },
    ],
  },
  {
    kind: "function", slug: "course-schedule-ii", lc: 210, title: "Course Schedule II", difficulty: "M", patternId: "topo-union-find",
    statement: p(
      `Same setup as Course Schedule: ${c("[a, b]")} means take b before a. Return an order in which you can take all ${c("numCourses")} courses, or an empty array if it's impossible.`,
      UNIQUE,
    ),
    examples: [
      { inputText: "numCourses = 3, prerequisites = [[0,2],[1,0]]", outputText: "[2,0,1]" },
      { inputText: "numCourses = 2, prerequisites = [[1,0],[0,1]]", outputText: "[]" },
    ],
    constraints: [`${c("1 ≤ numCourses ≤ 2000")}`, "No duplicate pairs."],
    insight: "Kahn's algorithm again, but record the order you take courses in. If fewer than n come out, there's a cycle: return an empty array.",
    fn: "findOrder", params: [int("numCourses"), grid("prerequisites")], returns: "int[]",
    tests: [
      { args: [2, [[1, 0]]], expected: [0, 1] }, { args: [2, [[1, 0], [0, 1]]], expected: [] }, { args: [1, []], expected: [0] },
      { args: [4, [[1, 0], [2, 1], [3, 2]]], expected: [0, 1, 2, 3] }, { args: [3, [[0, 2], [1, 0]]], expected: [2, 0, 1] },
      { args: [4, [[1, 0], [2, 0], [3, 1], [3, 2], [2, 1]]], expected: [0, 1, 2, 3] },
    ],
  },
  {
    kind: "function", slug: "number-of-connected-components-in-an-undirected-graph", lc: 323,
    title: "Number of Connected Components in an Undirected Graph", difficulty: "M", patternId: "topo-union-find",
    statement: p(`A graph has ${c("n")} nodes (0 to n − 1) and the undirected ${c("edges")} given. Return how many connected components it has.`),
    examples: [
      { inputText: "n = 5, edges = [[0,1],[1,2],[3,4]]", outputText: "2" },
      { inputText: "n = 3, edges = []", outputText: "3" },
    ],
    constraints: [`${c("1 ≤ n ≤ 2000")}`, "No self-loops or repeated edges."],
    insight: "Start with n components and union-find. Every union that joins two different roots merges two components, so subtract one.",
    fn: "countComponents", params: [int("n"), grid("edges")], returns: "int",
    tests: [
      { args: [5, [[0, 1], [1, 2], [3, 4]]], expected: 2 }, { args: [5, [[0, 1], [1, 2], [2, 3], [3, 4]]], expected: 1 },
      { args: [3, []], expected: 3 }, { args: [1, []], expected: 1 }, { args: [6, [[0, 1], [2, 3], [4, 5], [1, 0]]], expected: 3 },
    ],
  },
  {
    kind: "function", slug: "redundant-connection", lc: 684, title: "Redundant Connection", difficulty: "M", patternId: "topo-union-find",
    statement: p(
      `A tree with nodes 1 to n had one extra edge added, making ${c("edges")}. Return an edge you can remove so the rest is a tree again. If several work, return the one that appears last in the input.`,
    ),
    examples: [
      { inputText: "edges = [[1,2],[1,3],[2,3]]", outputText: "[2,3]" },
      { inputText: "edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]", outputText: "[1,4]" },
    ],
    constraints: [`${c("3 ≤ n ≤ 1000")}`, "The input is a tree plus one edge."],
    insight: "Union-find over the edges in order. The first edge whose two ends already share a root closes the cycle, and it's the last cycle edge in the input.",
    fn: "findRedundantConnection", params: [grid("edges")], returns: "int[]",
    tests: [
      { args: [[[1, 2], [1, 3], [2, 3]]], expected: [2, 3] }, { args: [[[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]], expected: [1, 4] },
      { args: [[[1, 2], [2, 3], [3, 1]]], expected: [3, 1] }, { args: [[[3, 4], [1, 2], [2, 4], [3, 5], [2, 5]]], expected: [2, 5] },
    ],
  },
  {
    kind: "function", slug: "graph-valid-tree", lc: 261, title: "Graph Valid Tree", difficulty: "M", patternId: "topo-union-find",
    statement: p(`Given ${c("n")} nodes (0 to n − 1) and a list of undirected ${c("edges")}, return ${c("true")} if they form a valid tree: connected, with no cycles.`),
    examples: [
      { inputText: "n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]", outputText: "true" },
      { inputText: "n = 4, edges = [[0,1],[2,3]]", outputText: "false", explanation: "Two separate pieces." },
    ],
    constraints: [`${c("1 ≤ n ≤ 2000")}`, "No self-loops or repeated edges."],
    insight: "A tree has exactly n − 1 edges. With that count, it's a tree iff no edge joins two nodes already connected (check with union-find).",
    fn: "validTree", params: [int("n"), grid("edges")], returns: "boolean",
    tests: [
      { args: [5, [[0, 1], [0, 2], [0, 3], [1, 4]]], expected: true }, { args: [5, [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]]], expected: false },
      { args: [1, []], expected: true }, { args: [2, []], expected: false }, { args: [4, [[0, 1], [2, 3]]], expected: false },
    ],
  },
  {
    kind: "function", slug: "alien-dictionary", lc: 269, title: "Alien Dictionary", difficulty: "H", patternId: "topo-union-find",
    statement: p(
      `An alien language uses lowercase English letters in an unknown order. ${c("words")} is a list sorted by that order. Return a string of all the letters that appear, in the language's order, or ${c('""')} if the list can't be sorted under any order.`,
      UNIQUE,
    ),
    examples: [
      { inputText: 'words = ["z","x"]', outputText: '"zx"' },
      { inputText: 'words = ["abc","ab"]', outputText: '""', explanation: "A word can't come before its own prefix." },
    ],
    constraints: [`${c("1 ≤ words.length ≤ 100")}`, `${c("1 ≤ words[i].length ≤ 100")}`],
    insight: "Compare each adjacent pair of words: the first differing letter gives one edge (a before b). Topologically sort the letters. A cycle, or a longer word before its prefix, means \"\".",
    fn: "alienOrder", params: [{ name: "words", type: "String[]" }], returns: "String",
    tests: [
      { args: [["wrt", "wrf", "er", "ett", "rftt"]], expected: "wertf" }, { args: [["z", "x"]], expected: "zx" },
      { args: [["z", "x", "z"]], expected: "" }, { args: [["abc", "ab"]], expected: "" }, { args: [["ab", "ac", "bc"]], expected: "abc" },
      { args: [["x"]], expected: "x" },
    ],
  },
  // stretch
  {
    kind: "function", slug: "number-of-provinces", lc: 547, title: "Number of Provinces", difficulty: "M", patternId: "topo-union-find",
    statement: p(`${c("isConnected[i][j]")} is 1 when cities i and j are directly connected. A province is a group of cities connected directly or through others. Return the number of provinces.`),
    examples: [
      { inputText: "isConnected = [[1,1,0],[1,1,0],[0,0,1]]", outputText: "2" },
      { inputText: "isConnected = [[1]]", outputText: "1" },
    ],
    constraints: [`${c("1 ≤ n ≤ 200")}`, "The matrix is symmetric with 1s on the diagonal."],
    insight: "It's connected components on an adjacency matrix: union i and j for every 1 above the diagonal and count the roots, or DFS from each unvisited city.",
    fn: "findCircleNum", params: [grid("isConnected")], returns: "int",
    tests: [
      { args: [[[1, 1, 0], [1, 1, 0], [0, 0, 1]]], expected: 2 }, { args: [[[1, 0, 0], [0, 1, 0], [0, 0, 1]]], expected: 3 },
      { args: [[[1]]], expected: 1 }, { args: [[[1, 0, 0, 1], [0, 1, 1, 0], [0, 1, 1, 1], [1, 0, 1, 1]]], expected: 1 },
    ],
  },
  {
    kind: "function", slug: "find-eventual-safe-states", lc: 802, title: "Find Eventual Safe States", difficulty: "M", patternId: "topo-union-find",
    statement: p(
      `${c("graph[i]")} lists the nodes that node i has a directed edge to. A node is safe if every path starting from it ends at a node with no outgoing edges.`,
      "Return all safe nodes in ascending order.",
    ),
    examples: [
      { inputText: "graph = [[1],[]]", outputText: "[0,1]" },
      { inputText: "graph = [[0]]", outputText: "[]", explanation: "Node 0 loops to itself forever." },
    ],
    constraints: [`${c("1 ≤ n ≤ 10<sup>4</sup>")}`],
    insight: "Reverse every edge and run Kahn's algorithm from the nodes with no outgoing edges. Whatever gets removed is safe; nodes on or leading into cycles never reach zero.",
    fn: "eventualSafeNodes", params: [grid("graph")], returns: "List<Integer>",
    tests: [
      { args: [[[1, 2], [2, 3], [5], [0], [5], [], []]], expected: [2, 4, 5, 6] }, { args: [[[1, 2, 3, 4], [1, 2], [3, 4], [0, 4], []]], expected: [4] },
      { args: [[[]]], expected: [0] }, { args: [[[0]]], expected: [] }, { args: [[[1], []]], expected: [0, 1] },
    ],
  },
  {
    kind: "function", slug: "minimum-height-trees", lc: 310, title: "Minimum Height Trees", difficulty: "M", patternId: "topo-union-find",
    statement: p(`${c("edges")} form a tree on nodes 0 to n − 1. Picking a root gives a tree of some height. Return every root that gives the smallest height, in any order.`),
    examples: [
      { inputText: "n = 4, edges = [[1,0],[1,2],[1,3]]", outputText: "[1]" },
      { inputText: "n = 2, edges = [[0,1]]", outputText: "[0,1]" },
    ],
    constraints: [`${c("1 ≤ n ≤ 2 × 10<sup>4</sup>")}`, "The input is a tree."],
    insight: "Peel leaves layer by layer, like Kahn's algorithm on degrees. The last one or two nodes standing are the centres of the tree.",
    fn: "findMinHeightTrees", params: [int("n"), grid("edges")], returns: "List<Integer>", compare: "anyOrder",
    tests: [
      { args: [4, [[1, 0], [1, 2], [1, 3]]], expected: [1] }, { args: [6, [[3, 0], [3, 1], [3, 2], [3, 4], [5, 4]]], expected: [3, 4] },
      { args: [1, []], expected: [0] }, { args: [2, [[0, 1]]], expected: [0, 1] }, { args: [5, [[0, 1], [1, 2], [2, 3], [3, 4]]], expected: [2] },
    ],
  },

  // ------------------------------------------------ Week 14 · Weighted Shortest Paths
  {
    kind: "function", slug: "network-delay-time", lc: 743, title: "Network Delay Time", difficulty: "M", patternId: "shortest-paths",
    statement: p(
      `A network has nodes 1 to ${c("n")}. Each ${c("[u, v, w]")} in ${c("times")} is a directed edge from u to v that takes w time. A signal starts at node ${c("k")}.`,
      `Return how long until every node has received it, or ${c("-1")} if some node never does.`,
    ),
    examples: [
      { inputText: "times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2", outputText: "2" },
      { inputText: "times = [[1,2,1]], n = 2, k = 2", outputText: "-1" },
    ],
    constraints: [`${c("1 ≤ n ≤ 100")}`, `${c("0 ≤ w ≤ 100")}`, "No repeated (u, v) pairs."],
    insight: "Dijkstra from k with a min-heap of (distance, node). The answer is the largest final distance; if any node stays unreached, return -1.",
    fn: "networkDelayTime", params: [grid("times"), int("n"), int("k")], returns: "int",
    tests: [
      { args: [[[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2], expected: 2 }, { args: [[[1, 2, 1]], 2, 1], expected: 1 },
      { args: [[[1, 2, 1]], 2, 2], expected: -1 }, { args: [[[1, 2, 1], [2, 3, 2], [1, 3, 4]], 3, 1], expected: 3 }, { args: [[], 1, 1], expected: 0 },
    ],
  },
  {
    kind: "function", slug: "cheapest-flights-within-k-stops", lc: 787, title: "Cheapest Flights Within K Stops", difficulty: "M", patternId: "shortest-paths",
    statement: p(
      `There are ${c("n")} cities. Each ${c("[from, to, price]")} in ${c("flights")} is a one-way flight. Return the cheapest price from ${c("src")} to ${c("dst")} with at most ${c("k")} stops in between, or ${c("-1")} if there's no such route.`,
    ),
    examples: [
      { inputText: "n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 1", outputText: "200" },
      { inputText: "same flights, k = 0", outputText: "500", explanation: "No stops allowed, so only the direct flight." },
    ],
    constraints: [`${c("1 ≤ n ≤ 100")}`, `${c("0 ≤ k < n")}`, "No repeated flights, src ≠ dst."],
    insight: "Bellman-Ford limited to k + 1 rounds: each round relaxes every flight using a copy of the previous round's prices, so a round adds exactly one flight.",
    fn: "findCheapestPrice", params: [int("n"), grid("flights"), int("src"), int("dst"), int("k")], returns: "int",
    tests: [
      { args: [4, [[0, 1, 100], [1, 2, 100], [2, 0, 100], [1, 3, 600], [2, 3, 200]], 0, 3, 1], expected: 700 },
      { args: [3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 1], expected: 200 },
      { args: [3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 0], expected: 500 },
      { args: [3, [[0, 1, 100]], 0, 2, 1], expected: -1 }, { args: [2, [[0, 1, 5]], 0, 1, 0], expected: 5 },
    ],
  },
  {
    kind: "function", slug: "path-with-minimum-effort", lc: 1631, title: "Path With Minimum Effort", difficulty: "M", patternId: "shortest-paths",
    statement: p(
      "Walk from the top-left to the bottom-right cell of a height map, moving up, down, left or right. A route's effort is the largest height difference between two consecutive cells on it.",
      "Return the smallest possible effort.",
    ),
    examples: [
      { inputText: "heights = [[1,10]]", outputText: "9" },
      { inputText: "heights = [[1,2,2],[3,8,2],[5,3,5]]", outputText: "2" },
    ],
    constraints: [`${c("1 ≤ rows, cols ≤ 100")}`, `${c("1 ≤ heights[r][c] ≤ 10<sup>6</sup>")}`],
    insight: "Dijkstra where a path's cost is its largest step, not its sum: relax a neighbour with max(current effort, |height difference|).",
    fn: "minimumEffortPath", params: [grid("heights")], returns: "int",
    tests: [
      { args: [[[1, 2, 2], [3, 8, 2], [5, 3, 5]]], expected: 2 }, { args: [[[1, 2, 3], [3, 8, 4], [5, 3, 5]]], expected: 1 },
      { args: [[[1, 2, 1, 1, 1], [1, 2, 1, 2, 1], [1, 2, 1, 2, 1], [1, 2, 1, 2, 1], [1, 1, 1, 2, 1]]], expected: 0 },
      { args: [[[5]]], expected: 0 }, { args: [[[1, 10]]], expected: 9 },
    ],
  },
  {
    kind: "function", slug: "min-cost-to-connect-all-points", lc: 1584, title: "Min Cost to Connect All Points", difficulty: "M", patternId: "shortest-paths",
    statement: p(`Connecting two points costs their Manhattan distance, |x1 − x2| + |y1 − y2|. Return the smallest total cost that connects all ${c("points")} (every point reachable from every other).`),
    examples: [
      { inputText: "points = [[0,0],[1,1],[1,0],[-1,1]]", outputText: "4" },
      { inputText: "points = [[0,0]]", outputText: "0" },
    ],
    constraints: [`${c("1 ≤ points.length ≤ 1000")}`, `${c("-10<sup>6</sup> ≤ x, y ≤ 10<sup>6</sup>")}`, "All points are distinct."],
    insight: "It's a minimum spanning tree on a complete graph. Prim's with an O(n²) array of best distances beats building all n² edges for Kruskal.",
    fn: "minCostConnectPoints", params: [grid("points")], returns: "int",
    tests: [
      { args: [[[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]]], expected: 20 }, { args: [[[3, 12], [-2, 5], [-4, 1]]], expected: 18 },
      { args: [[[0, 0]]], expected: 0 }, { args: [[[0, 0], [1, 1], [1, 0], [-1, 1]]], expected: 4 },
      { args: [[[-1000000, -1000000], [1000000, 1000000]]], expected: 4000000 },
    ],
  },
  {
    kind: "function", slug: "swim-in-rising-water", lc: 778, title: "Swim in Rising Water", difficulty: "H", patternId: "shortest-paths",
    statement: p(
      `${c("grid[r][c]")} is the height of each cell in an n × n pool, and all heights are distinct. At time t the water level is t, and you can swim between adjacent cells (up, down, left, right) when both heights are at most t. Swimming takes no time.`,
      "Return the earliest time you can get from the top-left to the bottom-right cell.",
    ),
    examples: [
      { inputText: "grid = [[0,2],[1,3]]", outputText: "3" },
      { inputText: "grid = [[3,2],[0,1]]", outputText: "3", explanation: "You can't leave the start before t = 3." },
    ],
    constraints: [`${c("1 ≤ n ≤ 50")}`, `${c("grid")} is a permutation of 0 to n² − 1.`],
    insight: "The answer is the smallest possible maximum height on a path: Dijkstra (or a min-heap flood) that always expands the lowest reachable cell, tracking the highest height seen.",
    fn: "swimInWater", params: [grid("grid")], returns: "int",
    tests: [
      { args: [[[0, 2], [1, 3]]], expected: 3 },
      { args: [[[0, 1, 2, 3, 4], [24, 23, 22, 21, 5], [12, 13, 14, 15, 16], [11, 17, 18, 19, 20], [10, 9, 8, 7, 6]]], expected: 16 },
      { args: [[[0]]], expected: 0 }, { args: [[[3, 2], [0, 1]]], expected: 3 },
    ],
  },
  // stretch
  {
    kind: "function", slug: "find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance", lc: 1334,
    title: "Find the City With the Smallest Number of Neighbors at a Threshold Distance", difficulty: "M", patternId: "shortest-paths",
    statement: p(
      `${c("n")} cities are joined by weighted, two-way ${c("edges")} ${c("[a, b, w]")}. For each city, count the other cities whose shortest distance is at most ${c("distanceThreshold")}.`,
      "Return the city with the smallest count; on a tie, return the largest city number.",
    ),
    examples: [
      { inputText: "n = 2, edges = [[0,1,5]], distanceThreshold = 4", outputText: "1", explanation: "Both cities reach no one; 1 is larger." },
      { inputText: "n = 4, edges = [[0,1,3],[1,2,1],[1,3,4],[2,3,1]], distanceThreshold = 4", outputText: "3" },
    ],
    constraints: [`${c("2 ≤ n ≤ 100")}`, `${c("1 ≤ w, distanceThreshold ≤ 10<sup>4</sup>")}`],
    insight: "n is small, so compute all-pairs shortest paths with Floyd–Warshall (three nested loops, k outermost), then count per city.",
    fn: "findTheCity", params: [int("n"), grid("edges"), int("distanceThreshold")], returns: "int",
    tests: [
      { args: [4, [[0, 1, 3], [1, 2, 1], [1, 3, 4], [2, 3, 1]], 4], expected: 3 },
      { args: [5, [[0, 1, 2], [0, 4, 8], [1, 2, 3], [1, 4, 2], [2, 3, 1], [3, 4, 1]], 2], expected: 0 },
      { args: [2, [[0, 1, 5]], 4], expected: 1 }, { args: [3, [[0, 1, 1], [1, 2, 1]], 1], expected: 2 },
    ],
  },
  {
    kind: "function", slug: "number-of-ways-to-arrive-at-destination", lc: 1976, title: "Number of Ways to Arrive at Destination", difficulty: "M", patternId: "shortest-paths",
    statement: p(
      `A city has intersections 0 to n − 1 and two-way ${c("roads")} ${c("[u, v, time]")}. Count the different routes from 0 to n − 1 that take the shortest possible time.`,
      `Return the count modulo 10<sup>9</sup> + 7.`,
    ),
    examples: [
      { inputText: "n = 4, roads = [[0,1,1],[0,2,1],[1,3,1],[2,3,1]]", outputText: "2" },
      { inputText: "n = 2, roads = [[1,0,10]]", outputText: "1" },
    ],
    constraints: [`${c("1 ≤ n ≤ 200")}`, `${c("1 ≤ time ≤ 10<sup>9</sup>")}`, "Every intersection is reachable from 0."],
    insight: "Dijkstra that also counts: a strictly shorter distance to v resets ways[v] to ways[u]; an equal one adds ways[u]. Use 64-bit distances.",
    fn: "countPaths", params: [int("n"), grid("roads")], returns: "int",
    tests: [
      { args: [7, [[0, 6, 7], [0, 1, 2], [1, 2, 3], [1, 3, 3], [6, 3, 3], [3, 5, 1], [6, 5, 1], [2, 5, 1], [0, 4, 5], [4, 6, 2]]], expected: 4 },
      { args: [2, [[1, 0, 10]]], expected: 1 }, { args: [1, []], expected: 1 }, { args: [4, [[0, 1, 1], [0, 2, 1], [1, 3, 1], [2, 3, 1]]], expected: 2 },
    ],
  },
  {
    kind: "function", slug: "minimum-obstacle-removal-to-reach-corner", lc: 2290, title: "Minimum Obstacle Removal to Reach Corner", difficulty: "H", patternId: "shortest-paths",
    statement: p(`In a grid of 0s (empty) and 1s (obstacles), move up, down, left or right from the top-left to the bottom-right. Return the fewest obstacles you must remove. The two corners are always empty.`),
    examples: [
      { inputText: "grid = [[0,1],[1,0]]", outputText: "1" },
      { inputText: "grid = [[0,1,0,0,0],[0,1,0,1,0],[0,0,0,1,0]]", outputText: "0" },
    ],
    constraints: [`${c("2 ≤ rows × cols ≤ 10<sup>5</sup>")}`],
    insight: "Edge weights are only 0 or 1, so use 0-1 BFS: a deque where stepping onto an empty cell goes to the front and onto an obstacle goes to the back.",
    fn: "minimumObstacles", params: [grid("grid")], returns: "int",
    tests: [
      { args: [[[0, 1, 1], [1, 1, 0], [1, 1, 0]]], expected: 2 }, { args: [[[0, 1, 0, 0, 0], [0, 1, 0, 1, 0], [0, 0, 0, 1, 0]]], expected: 0 },
      { args: [[[0, 0]]], expected: 0 }, { args: [[[0, 1], [1, 0]]], expected: 1 },
    ],
  },
];
