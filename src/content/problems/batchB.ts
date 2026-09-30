// Batch B: weeks 6–10 core problems + stretch (linked lists, trees, BST & trie, heaps,
// intervals & greedy). Original statements and examples; test data verified against
// reference solutions in JavaScript and Java (see __tests__).
import type { Param, ProblemSpec } from "./spec";

const c = (s: string) => `<code>${s}</code>`;
const p = (...xs: string[]) => xs.map((x) => `<p class='mt-3'>${x}</p>`).join("");
const list = (name: string): Param => ({ name, type: "ListNode" });
const tree = (name: string): Param => ({ name, type: "TreeNode" });
const int = (name: string): Param => ({ name, type: "int" });
const ints = (name: string): Param => ({ name, type: "int[]" });
const grid = (name: string): Param => ({ name, type: "int[][]" });
const TREE_NODES = (n: string) => `The tree has between 0 and ${n} nodes.`;

export const BATCH_B: ProblemSpec[] = [
  // ------------------------------------------------ Week 6 · Linked List
  {
    kind: "function", slug: "merge-two-sorted-lists", lc: 21, title: "Merge Two Sorted Lists", difficulty: "E", patternId: "linked-list",
    statement: p(`You get the heads of two linked lists, each sorted in non-decreasing order. Splice their nodes together into one sorted list and return its head.`),
    examples: [
      { inputText: "list1 = [2,5,8], list2 = [1,5,9]", outputText: "[1,2,5,5,8,9]" },
      { inputText: "list1 = [], list2 = [4]", outputText: "[4]" },
    ],
    constraints: ["Each list has 0 to 50 nodes.", `${c("-100 ≤ Node.val ≤ 100")}`, "Both lists are sorted."],
    insight: "Start from a dummy node and keep a tail pointer. Repeatedly attach the smaller of the two heads; when one list runs out, attach the rest of the other.",
    fn: "mergeTwoLists", params: [list("list1"), list("list2")], returns: "ListNode",
    tests: [
      { args: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4] }, { args: [[], []], expected: [] },
      { args: [[], [0]], expected: [0] }, { args: [[5], [1, 2, 3]], expected: [1, 2, 3, 5] },
      { args: [[-3, 0, 7], [-5, -3, 8, 9]], expected: [-5, -3, -3, 0, 7, 8, 9] }, { args: [[2, 2], [2]], expected: [2, 2, 2] },
    ],
  },
  {
    kind: "function", slug: "linked-list-cycle", lc: 141, title: "Linked List Cycle", difficulty: "E", patternId: "linked-list",
    statement: p(
      `Given the ${c("head")} of a linked list, return ${c("true")} if following ${c("next")} pointers ever brings you back to a node you already visited.`,
      `In the examples, ${c("pos")} is the index the tail links back to (${c("-1")} means no loop). It only describes the input; your function receives just ${c("head")}.`,
    ),
    examples: [
      { inputText: "head = [4,7,1], pos = 0", outputText: "true", explanation: "The last node points back to the first." },
      { inputText: "head = [4,7,1], pos = -1", outputText: "false" },
    ],
    constraints: ["The list has 0 to 10<sup>4</sup> nodes.", "Aim for O(1) extra memory."],
    insight: "Run two pointers, one moving one step and one moving two. If there is a loop the fast one eventually lands on the slow one; if not, it falls off the end.",
    fn: "hasCycle", params: [{ name: "head", type: "CycleList" }], returns: "boolean",
    tests: [
      { args: [[[3, 2, 0, -4], 1]], expected: true }, { args: [[[1, 2], 0]], expected: true }, { args: [[[1], -1]], expected: false },
      { args: [[[], -1]], expected: false }, { args: [[[1], 0]], expected: true }, { args: [[[1, 2, 3, 4, 5], -1]], expected: false },
      { args: [[[1, 2, 3, 4, 5], 4]], expected: true },
    ],
  },
  {
    kind: "function", slug: "reorder-list", lc: 143, title: "Reorder List", difficulty: "M", patternId: "linked-list",
    statement: p(
      `A list ${c("L0 → L1 → … → Ln")} should be rearranged in place into ${c("L0 → Ln → L1 → Ln-1 → L2 → …")}: first, last, second, second-to-last, and so on.`,
      "Relink the nodes themselves; don't change any values. The function returns nothing.",
    ),
    examples: [
      { inputText: "head = [1,2,3,4]", outputText: "[1,4,2,3]" },
      { inputText: "head = [10,20,30,40,50]", outputText: "[10,50,20,40,30]" },
    ],
    constraints: ["The list has 1 to 5 × 10<sup>4</sup> nodes.", `${c("1 ≤ Node.val ≤ 1000")}`],
    insight: "Three steps you already know: find the middle with slow/fast pointers, reverse the second half, then weave the two halves together one node at a time.",
    fn: "reorderList", params: [list("head")], returns: "void", mutates: 0,
    tests: [
      { args: [[1, 2, 3, 4]], expected: [1, 4, 2, 3] }, { args: [[1, 2, 3, 4, 5]], expected: [1, 5, 2, 4, 3] },
      { args: [[1]], expected: [1] }, { args: [[1, 2]], expected: [1, 2] }, { args: [[1, 2, 3]], expected: [1, 3, 2] },
      { args: [[10, 20, 30, 40, 50, 60]], expected: [10, 60, 20, 50, 30, 40] },
    ],
  },
  {
    kind: "function", slug: "remove-nth-node-from-end-of-list", lc: 19, title: "Remove Nth Node From End of List", difficulty: "M", patternId: "linked-list",
    statement: p(`Delete the ${c("n")}-th node counting from the end of the list (the last node is 1st) and return the head of the result.`),
    examples: [
      { inputText: "head = [7,8,9], n = 3", outputText: "[8,9]", explanation: "The 3rd node from the end is the head itself." },
      { inputText: "head = [1,2,3,4,5], n = 2", outputText: "[1,2,3,5]" },
    ],
    constraints: ["The list has 1 to 30 nodes.", `${c("1 ≤ n ≤ list length")}`, "Try it in one pass."],
    insight: "Put a dummy before the head, move a lead pointer n steps ahead, then move both until the lead hits the end. The trailing pointer now sits just before the node to cut.",
    fn: "removeNthFromEnd", params: [list("head"), int("n")], returns: "ListNode",
    tests: [
      { args: [[1, 2, 3, 4, 5], 2], expected: [1, 2, 3, 5] }, { args: [[1], 1], expected: [] }, { args: [[1, 2], 1], expected: [1] },
      { args: [[1, 2], 2], expected: [2] }, { args: [[7, 8, 9], 3], expected: [8, 9] }, { args: [[7, 8, 9], 1], expected: [7, 8] },
    ],
  },
  {
    kind: "design", slug: "lru-cache", lc: 146, title: "LRU Cache", difficulty: "M", patternId: "linked-list",
    statement: p(
      `Build an ${c("LRUCache")} that holds at most ${c("capacity")} key/value pairs. ${c("get(key)")} returns the value, or ${c("-1")} if the key is absent. ${c("put(key, value)")} inserts or updates a key.`,
      "Both reading and writing a key make it the most recently used. When a put would exceed capacity, first evict the least recently used key. Both operations must be O(1) on average.",
    ),
    examples: [{ inputText: "capacity 1: put(2,1), get(2), put(3,2), get(2)", outputText: "1, -1", explanation: "Adding key 3 evicts key 2." }],
    constraints: [`${c("1 ≤ capacity ≤ 3000")}`, `${c("0 ≤ key ≤ 10<sup>4</sup>")}, ${c("0 ≤ value ≤ 10<sup>5</sup>")}`, "At most 2 × 10<sup>5</sup> calls."],
    insight: "A hash map finds a key's node in O(1); a doubly linked list keeps nodes in recency order. Move a node to the front on every touch and evict from the back.",
    className: "LRUCache", ctor: [int("capacity")],
    methods: [
      { name: "get", params: [int("key")], returns: "int" },
      { name: "put", params: [int("key"), int("value")], returns: "void" },
    ],
    tests: [
      { ops: ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"], args: [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]], expected: [null, null, null, 1, null, -1, null, -1, 3, 4] },
      { ops: ["LRUCache", "put", "get", "put", "get", "get"], args: [[1], [2, 1], [2], [3, 2], [2], [3]], expected: [null, null, 1, null, -1, 2] },
      { ops: ["LRUCache", "put", "put", "put", "put", "get", "get", "get"], args: [[2], [1, 1], [2, 2], [1, 10], [3, 3], [2], [1], [3]], expected: [null, null, null, null, null, -1, 10, 3] },
      { ops: ["LRUCache", "put", "put", "get", "put", "get", "get", "get"], args: [[2], [1, 1], [2, 2], [1], [3, 3], [2], [3], [1]], expected: [null, null, null, 1, null, -1, 3, 1] },
    ],
  },
  // stretch
  {
    kind: "function", slug: "palindrome-linked-list", lc: 234, title: "Palindrome Linked List", difficulty: "E", patternId: "linked-list",
    statement: p(`Return ${c("true")} if the values of the linked list read the same forwards and backwards.`),
    examples: [
      { inputText: "head = [3,8,8,3]", outputText: "true" },
      { inputText: "head = [3,8]", outputText: "false" },
    ],
    constraints: ["The list has 1 to 10<sup>5</sup> nodes.", `${c("0 ≤ Node.val ≤ 9")}`, "Can you do it with O(1) extra memory?"],
    insight: "Find the middle with slow/fast pointers, reverse the second half, and walk both halves together comparing values.",
    fn: "isPalindrome", params: [list("head")], returns: "boolean",
    tests: [
      { args: [[1, 2, 2, 1]], expected: true }, { args: [[1, 2]], expected: false }, { args: [[1]], expected: true },
      { args: [[1, 2, 3, 2, 1]], expected: true }, { args: [[1, 2, 3, 1]], expected: false }, { args: [[4, 4]], expected: true },
      { args: [[1, 0, 0]], expected: false },
    ],
  },
  {
    kind: "function", slug: "add-two-numbers", lc: 2, title: "Add Two Numbers", difficulty: "M", patternId: "linked-list",
    statement: p(
      "Two non-negative integers are stored as linked lists of digits, least significant digit first (so 342 is 2 → 4 → 3).",
      "Return their sum in the same format. Neither number has leading zeros, except the number 0 itself.",
    ),
    examples: [
      { inputText: "l1 = [5], l2 = [5]", outputText: "[0,1]", explanation: "5 + 5 = 10." },
      { inputText: "l1 = [9], l2 = [1,9,9]", outputText: "[0,0,0,1]", explanation: "9 + 991 = 1000." },
    ],
    constraints: ["Each list has 1 to 100 nodes.", `${c("0 ≤ Node.val ≤ 9")}`],
    insight: "Walk both lists together like column addition, carrying 0 or 1. Keep going while either list has nodes or the carry is 1.",
    fn: "addTwoNumbers", params: [list("l1"), list("l2")], returns: "ListNode",
    tests: [
      { args: [[2, 4, 3], [5, 6, 4]], expected: [7, 0, 8] }, { args: [[0], [0]], expected: [0] },
      { args: [[9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9]], expected: [8, 9, 9, 9, 0, 0, 0, 1] }, { args: [[5], [5]], expected: [0, 1] },
      { args: [[1, 8], [0]], expected: [1, 8] }, { args: [[9], [1, 9, 9]], expected: [0, 0, 0, 1] },
    ],
  },
  {
    kind: "function", slug: "merge-k-sorted-lists", lc: 23, title: "Merge k Sorted Lists", difficulty: "H", patternId: "linked-list",
    statement: p(`You get an array of ${c("k")} linked lists, each sorted ascending. Merge them all into one sorted list and return its head.`),
    examples: [
      { inputText: "lists = [[5],[],[1,9]]", outputText: "[1,5,9]" },
      { inputText: "lists = []", outputText: "[]" },
    ],
    constraints: [`${c("0 ≤ k ≤ 10<sup>4</sup>")}`, "Each list has at most 500 nodes; at most 10<sup>4</sup> nodes in total.", `${c("-10<sup>4</sup> ≤ Node.val ≤ 10<sup>4</sup>")}`],
    insight: "Keep one candidate per list in a min-heap keyed by value. Pop the smallest, append it, and push that node's successor: O(N log k).",
    fn: "mergeKLists", params: [{ name: "lists", type: "ListNode[]" }], returns: "ListNode",
    tests: [
      { args: [[[1, 4, 5], [1, 3, 4], [2, 6]]], expected: [1, 1, 2, 3, 4, 4, 5, 6] }, { args: [[]], expected: [] },
      { args: [[[]]], expected: [] }, { args: [[[5], [], [1, 9]]], expected: [1, 5, 9] },
      { args: [[[-2, -1], [-3], [0, 0]]], expected: [-3, -2, -1, 0, 0] }, { args: [[[1], [1], [1]]], expected: [1, 1, 1] },
    ],
  },

  // ------------------------------------------------ Week 7 · Trees DFS/BFS
  {
    kind: "function", slug: "invert-binary-tree", lc: 226, title: "Invert Binary Tree", difficulty: "E", patternId: "trees-dfs-bfs",
    statement: p(`Mirror a binary tree: at every node, swap its left and right children. Return the root.`),
    examples: [
      { inputText: "root = [2,1,3]", outputText: "[2,3,1]" },
      { inputText: "root = [1,2]", outputText: "[1,null,2]" },
    ],
    constraints: [TREE_NODES("100"), `${c("-100 ≤ Node.val ≤ 100")}`],
    insight: "Swap the two children, then invert each subtree (either order works). Any traversal that visits every node once does it.",
    fn: "invertTree", params: [tree("root")], returns: "TreeNode",
    tests: [
      { args: [[4, 2, 7, 1, 3, 6, 9]], expected: [4, 7, 2, 9, 6, 3, 1] }, { args: [[2, 1, 3]], expected: [2, 3, 1] },
      { args: [[]], expected: [] }, { args: [[1, 2]], expected: [1, null, 2] }, { args: [[1, null, 2, null, 3]], expected: [1, 2, null, 3] },
    ],
  },
  {
    kind: "function", slug: "maximum-depth-of-binary-tree", lc: 104, title: "Maximum Depth of Binary Tree", difficulty: "E", patternId: "trees-dfs-bfs",
    statement: p("Return how many nodes lie on the longest path from the root down to a leaf. An empty tree has depth 0."),
    examples: [
      { inputText: "root = [3,9,20,null,null,15,7]", outputText: "3" },
      { inputText: "root = [1,null,2]", outputText: "2" },
    ],
    constraints: [TREE_NODES("10<sup>4</sup>"), `${c("-100 ≤ Node.val ≤ 100")}`],
    insight: "depth(node) = 1 + max(depth(left), depth(right)), with depth(null) = 0. Or count levels with a BFS.",
    fn: "maxDepth", params: [tree("root")], returns: "int",
    tests: [
      { args: [[3, 9, 20, null, null, 15, 7]], expected: 3 }, { args: [[1, null, 2]], expected: 2 }, { args: [[]], expected: 0 },
      { args: [[1]], expected: 1 }, { args: [[1, 2, null, 3, null, 4]], expected: 4 },
    ],
  },
  {
    kind: "function", slug: "diameter-of-binary-tree", lc: 543, title: "Diameter of Binary Tree", difficulty: "E", patternId: "trees-dfs-bfs",
    statement: p("The diameter of a tree is the number of edges on the longest path between any two nodes. That path may or may not pass through the root. Return it."),
    examples: [
      { inputText: "root = [1,2,3,4,5]", outputText: "3", explanation: "4 → 2 → 1 → 3 has 3 edges." },
      { inputText: "root = [1,2]", outputText: "1" },
    ],
    constraints: ["The tree has 1 to 10<sup>4</sup> nodes.", `${c("-100 ≤ Node.val ≤ 100")}`],
    insight: "One DFS returns each subtree's height. At every node, left height + right height is a candidate path; keep the best in an outer variable.",
    fn: "diameterOfBinaryTree", params: [tree("root")], returns: "int",
    tests: [
      { args: [[1, 2, 3, 4, 5]], expected: 3 }, { args: [[1, 2]], expected: 1 }, { args: [[1]], expected: 0 },
      { args: [[1, 2, null, 3, 4, 5, null, null, 6]], expected: 4 }, { args: [[1, 2, 3, 4, null, null, 5, 6, null, null, 7]], expected: 6 },
    ],
  },
  {
    kind: "function", slug: "binary-tree-level-order-traversal", lc: 102, title: "Binary Tree Level Order Traversal", difficulty: "M", patternId: "trees-dfs-bfs",
    statement: p("Return the node values level by level, top to bottom, and left to right within each level."),
    examples: [
      { inputText: "root = [3,9,20,null,null,15,7]", outputText: "[[3],[9,20],[15,7]]" },
      { inputText: "root = []", outputText: "[]" },
    ],
    constraints: [TREE_NODES("2000"), `${c("-1000 ≤ Node.val ≤ 1000")}`],
    insight: "BFS with a queue. Before processing a level, record the queue's size; pop exactly that many nodes into this level's list and push their children.",
    fn: "levelOrder", params: [tree("root")], returns: "List<List<Integer>>",
    tests: [
      { args: [[3, 9, 20, null, null, 15, 7]], expected: [[3], [9, 20], [15, 7]] }, { args: [[1]], expected: [[1]] },
      { args: [[]], expected: [] }, { args: [[1, 2, 3, 4, null, null, 5]], expected: [[1], [2, 3], [4, 5]] },
      { args: [[1, null, 2, null, 3]], expected: [[1], [2], [3]] },
    ],
  },
  {
    kind: "function", slug: "binary-tree-right-side-view", lc: 199, title: "Binary Tree Right Side View", difficulty: "M", patternId: "trees-dfs-bfs",
    statement: p("Imagine standing to the right of the tree. Return the values you can see, from top to bottom: the rightmost node of each level."),
    examples: [
      { inputText: "root = [1,2,3,null,5,null,4]", outputText: "[1,3,4]" },
      { inputText: "root = [1,2,3,4]", outputText: "[1,3,4]", explanation: "4 is on the left, but it is the only node on its level." },
    ],
    constraints: [TREE_NODES("100"), `${c("-100 ≤ Node.val ≤ 100")}`],
    insight: "Level-order BFS and keep the last node of each level. Or DFS visiting right before left, recording the first node seen at each depth.",
    fn: "rightSideView", params: [tree("root")], returns: "List<Integer>",
    tests: [
      { args: [[1, 2, 3, null, 5, null, 4]], expected: [1, 3, 4] }, { args: [[1, null, 3]], expected: [1, 3] }, { args: [[]], expected: [] },
      { args: [[1, 2, 3, 4]], expected: [1, 3, 4] }, { args: [[1, 2]], expected: [1, 2] },
    ],
  },
  {
    kind: "function", slug: "binary-tree-maximum-path-sum", lc: 124, title: "Binary Tree Maximum Path Sum", difficulty: "H", patternId: "trees-dfs-bfs",
    statement: p(
      "A path is a sequence of nodes where each adjacent pair is joined by an edge, and no node appears twice. It doesn't have to pass through the root, and it has at least one node.",
      "Return the largest possible sum of the values on a path.",
    ),
    examples: [
      { inputText: "root = [1,-2,3]", outputText: "4", explanation: "1 → 3." },
      { inputText: "root = [-3]", outputText: "-3" },
    ],
    constraints: ["The tree has 1 to 3 × 10<sup>4</sup> nodes.", `${c("-1000 ≤ Node.val ≤ 1000")}`],
    insight: "DFS returns the best downward path from a node: val + max(0, left, right). At each node, val + max(0,left) + max(0,right) is a candidate for the answer.",
    fn: "maxPathSum", params: [tree("root")], returns: "int",
    tests: [
      { args: [[1, 2, 3]], expected: 6 }, { args: [[-10, 9, 20, null, null, 15, 7]], expected: 42 }, { args: [[-3]], expected: -3 },
      { args: [[2, -1]], expected: 2 }, { args: [[1, -2, 3]], expected: 4 },
      { args: [[5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1]], expected: 48 },
    ],
  },
  // stretch
  {
    kind: "function", slug: "same-tree", lc: 100, title: "Same Tree", difficulty: "E", patternId: "trees-dfs-bfs",
    statement: p(`Return ${c("true")} if the two trees have exactly the same shape and the same value at every position.`),
    examples: [
      { inputText: "p = [1,2,3], q = [1,2,3]", outputText: "true" },
      { inputText: "p = [1,2], q = [1,null,2]", outputText: "false" },
    ],
    constraints: ["Each tree has 0 to 100 nodes.", `${c("-10<sup>4</sup> ≤ Node.val ≤ 10<sup>4</sup>")}`],
    insight: "Two nulls match; one null doesn't. Otherwise the values must match and both pairs of subtrees must be the same.",
    fn: "isSameTree", params: [tree("p"), tree("q")], returns: "boolean",
    tests: [
      { args: [[1, 2, 3], [1, 2, 3]], expected: true }, { args: [[1, 2], [1, null, 2]], expected: false },
      { args: [[1, 2, 1], [1, 1, 2]], expected: false }, { args: [[], []], expected: true }, { args: [[1], []], expected: false },
      { args: [[5, 4, null, 3], [5, 4, null, 3]], expected: true },
    ],
  },
  {
    kind: "function", slug: "balanced-binary-tree", lc: 110, title: "Balanced Binary Tree", difficulty: "E", patternId: "trees-dfs-bfs",
    statement: p(`A tree is height-balanced when, at every node, the heights of the two subtrees differ by at most 1. Return ${c("true")} if the tree is.`),
    examples: [
      { inputText: "root = [3,9,20,null,null,15,7]", outputText: "true" },
      { inputText: "root = [1,null,2,null,3]", outputText: "false" },
    ],
    constraints: [TREE_NODES("5000"), `${c("-10<sup>4</sup> ≤ Node.val ≤ 10<sup>4</sup>")}`],
    insight: "Compute heights bottom-up in one DFS and return -1 as soon as any node is unbalanced, so no height is computed twice.",
    fn: "isBalanced", params: [tree("root")], returns: "boolean",
    tests: [
      { args: [[3, 9, 20, null, null, 15, 7]], expected: true }, { args: [[1, 2, 2, 3, 3, null, null, 4, 4]], expected: false },
      { args: [[]], expected: true }, { args: [[1, null, 2, null, 3]], expected: false }, { args: [[1, 2, 3, 4, null, null, 5]], expected: true },
    ],
  },
  {
    kind: "function", slug: "construct-binary-tree-from-preorder-and-inorder-traversal", lc: 105,
    title: "Construct Binary Tree from Preorder and Inorder Traversal", difficulty: "M", patternId: "trees-dfs-bfs",
    statement: p(`${c("preorder")} and ${c("inorder")} are two traversals of the same binary tree, whose values are all distinct. Rebuild the tree and return its root.`),
    examples: [
      { inputText: "preorder = [1,2], inorder = [2,1]", outputText: "[1,2]" },
      { inputText: "preorder = [1,2], inorder = [1,2]", outputText: "[1,null,2]" },
    ],
    constraints: [`${c("1 ≤ preorder.length ≤ 3000")}`, "Values are distinct and both arrays describe the same tree."],
    insight: "preorder's next value is the current root. Its index in inorder (look it up in a map) splits the remaining values into the left and right subtrees.",
    fn: "buildTree", params: [ints("preorder"), ints("inorder")], returns: "TreeNode",
    tests: [
      { args: [[3, 9, 20, 15, 7], [9, 3, 15, 20, 7]], expected: [3, 9, 20, null, null, 15, 7] }, { args: [[-1], [-1]], expected: [-1] },
      { args: [[1, 2], [2, 1]], expected: [1, 2] }, { args: [[1, 2], [1, 2]], expected: [1, null, 2] },
      { args: [[1, 2, 4, 5, 3], [4, 2, 5, 1, 3]], expected: [1, 2, 3, 4, 5] },
    ],
  },

  // ------------------------------------------------ Week 8 · BST & Trie
  {
    kind: "function", slug: "validate-binary-search-tree", lc: 98, title: "Validate Binary Search Tree", difficulty: "M", patternId: "bst-trie",
    statement: p(
      `Return ${c("true")} if the tree is a valid binary search tree: every value in a node's left subtree is strictly smaller than the node, every value in its right subtree is strictly larger, and both subtrees are BSTs too.`,
    ),
    examples: [
      { inputText: "root = [2,1,3]", outputText: "true" },
      { inputText: "root = [5,4,6,null,null,3,7]", outputText: "false", explanation: "3 is in 5's right subtree but smaller than 5." },
    ],
    constraints: ["The tree has 1 to 10<sup>4</sup> nodes.", `${c("-2<sup>31</sup> ≤ Node.val ≤ 2<sup>31</sup> - 1")}`],
    insight: "Checking only parent/child pairs isn't enough. Pass down an open (low, high) range, or check that an in-order traversal is strictly increasing.",
    fn: "isValidBST", params: [tree("root")], returns: "boolean",
    tests: [
      { args: [[2, 1, 3]], expected: true }, { args: [[5, 1, 4, null, null, 3, 6]], expected: false }, { args: [[2, 2, 2]], expected: false },
      { args: [[5, 4, 6, null, null, 3, 7]], expected: false }, { args: [[2147483647]], expected: true },
      { args: [[-2147483648, null, 2147483647]], expected: true }, { args: [[3, 1, 5, 0, 2, 4, 6]], expected: true },
    ],
  },
  {
    kind: "function", slug: "kth-smallest-element-in-a-bst", lc: 230, title: "Kth Smallest Element in a BST", difficulty: "M", patternId: "bst-trie",
    statement: p(`Return the ${c("k")}-th smallest value (1-indexed) in a binary search tree.`),
    examples: [
      { inputText: "root = [3,1,4,null,2], k = 1", outputText: "1" },
      { inputText: "root = [3,1,5,0,2,4,6], k = 4", outputText: "3" },
    ],
    constraints: [`${c("1 ≤ k ≤ n ≤ 10<sup>4</sup>")}`, `${c("0 ≤ Node.val ≤ 10<sup>4</sup>")}`],
    insight: "In-order traversal of a BST visits values in sorted order. Walk it iteratively with a stack and stop at the k-th pop.",
    fn: "kthSmallest", params: [tree("root"), int("k")], returns: "int",
    tests: [
      { args: [[3, 1, 4, null, 2], 1], expected: 1 }, { args: [[5, 3, 6, 2, 4, null, null, 1], 3], expected: 3 },
      { args: [[1], 1], expected: 1 }, { args: [[3, 1, 5, 0, 2, 4, 6], 7], expected: 6 }, { args: [[3, 1, 5, 0, 2, 4, 6], 4], expected: 3 },
    ],
  },
  {
    kind: "function", slug: "lowest-common-ancestor-of-a-binary-search-tree", lc: 235,
    title: "Lowest Common Ancestor of a Binary Search Tree", difficulty: "M", patternId: "bst-trie",
    statement: p(
      `You get the root of a BST and two nodes ${c("p")} and ${c("q")} in it. Return their lowest common ancestor: the deepest node that has both as descendants (a node counts as its own descendant).`,
    ),
    examples: [
      { inputText: "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8", outputText: "6" },
      { inputText: "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4", outputText: "2", explanation: "2 is an ancestor of 4 and of itself." },
    ],
    constraints: ["The tree has 2 to 10<sup>5</sup> nodes with distinct values.", `${c("p")} and ${c("q")} are different and both in the tree.`],
    insight: "Start at the root. If both values are smaller, go left; if both are larger, go right. The first node where they split (or that equals one of them) is the answer.",
    fn: "lowestCommonAncestor", params: [tree("root"), { name: "p", type: "TreeRef" }, { name: "q", type: "TreeRef" }], returns: "TreeNode", compare: "nodeVal",
    tests: [
      { args: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 8], expected: 6 },
      { args: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 4], expected: 2 },
      { args: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 3, 5], expected: 4 },
      { args: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 0, 5], expected: 2 },
      { args: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 7, 9], expected: 8 },
      { args: [[2, 1], 2, 1], expected: 2 },
    ],
  },
  // stretch
  {
    kind: "function", slug: "search-in-a-binary-search-tree", lc: 700, title: "Search in a Binary Search Tree", difficulty: "E", patternId: "bst-trie",
    statement: p(`Find the node whose value is ${c("val")} in a BST and return it (the subtree rooted there). Return ${c("null")} if there is no such node.`),
    examples: [
      { inputText: "root = [4,2,7,1,3], val = 2", outputText: "[2,1,3]" },
      { inputText: "root = [4,2,7,1,3], val = 5", outputText: "[]" },
    ],
    constraints: ["The tree has 1 to 5000 nodes with distinct values.", `${c("1 ≤ val ≤ 10<sup>7</sup>")}`],
    insight: "Use the ordering: go left when val is smaller, right when larger. That's O(height), no need to visit every node.",
    fn: "searchBST", params: [tree("root"), int("val")], returns: "TreeNode",
    tests: [
      { args: [[4, 2, 7, 1, 3], 2], expected: [2, 1, 3] }, { args: [[4, 2, 7, 1, 3], 5], expected: [] },
      { args: [[4, 2, 7, 1, 3], 7], expected: [7] }, { args: [[1], 1], expected: [1] }, { args: [[8, 3, 10, 1, 6, null, 14], 6], expected: [6] },
    ],
  },
  {
    kind: "function", slug: "insert-into-a-binary-search-tree", lc: 701, title: "Insert into a Binary Search Tree", difficulty: "M", patternId: "bst-trie",
    statement: p(
      `Insert ${c("val")} into the BST and return the root. ${c("val")} is not already in the tree.`,
      "Any result that is still a valid BST containing all the values is accepted.",
    ),
    examples: [
      { inputText: "root = [4,2,7,1,3], val = 5", outputText: "[4,2,7,1,3,5]" },
      { inputText: "root = [], val = 5", outputText: "[5]" },
    ],
    constraints: [TREE_NODES("10<sup>4</sup>"), "All values are distinct."],
    insight: "Walk down as if searching for val. The spot where the search falls off the tree is exactly where the new leaf goes.",
    fn: "insertIntoBST", params: [tree("root"), int("val")], returns: "TreeNode", compare: "inorder",
    tests: [
      { args: [[4, 2, 7, 1, 3], 5], expected: [1, 2, 3, 4, 5, 7] }, { args: [[], 5], expected: [5] },
      { args: [[40, 20, 60, 10, 30, 50, 70], 25], expected: [10, 20, 25, 30, 40, 50, 60, 70] },
      { args: [[1], 0], expected: [0, 1] }, { args: [[1], 2], expected: [1, 2] },
    ],
  },
  {
    kind: "function", slug: "longest-common-prefix", lc: 14, title: "Longest Common Prefix", difficulty: "E", patternId: "bst-trie",
    statement: p(`Return the longest string that every word in ${c("strs")} starts with. Return ${c('""')} if they share no prefix.`),
    examples: [
      { inputText: 'strs = ["interview","internet","interval"]', outputText: '"inter"' },
      { inputText: 'strs = ["dog","cat"]', outputText: '""' },
    ],
    constraints: [`${c("1 ≤ strs.length ≤ 200")}`, `${c("0 ≤ strs[i].length ≤ 200")}`, "Lowercase English letters."],
    insight: "Compare column by column across all words and stop at the first mismatch or the end of the shortest word. (A trie gives the same answer: follow nodes while they have exactly one child.)",
    fn: "longestCommonPrefix", params: [{ name: "strs", type: "String[]" }], returns: "String",
    tests: [
      { args: [["flower", "flow", "flight"]], expected: "fl" }, { args: [["dog", "racecar", "car"]], expected: "" },
      { args: [["a"]], expected: "a" }, { args: [["abc", "abc"]], expected: "abc" }, { args: [["ab", "a"]], expected: "a" },
      { args: [["interview", "internet", "interval"]], expected: "inter" },
    ],
  },

  // ------------------------------------------------ Week 9 · Heap / Top K / Two Heaps
  {
    kind: "design", slug: "kth-largest-element-in-a-stream", lc: 703, title: "Kth Largest Element in a Stream", difficulty: "E", patternId: "heap",
    statement: p(
      `Build a ${c("KthLargest")} class. The constructor receives ${c("k")} and an initial array ${c("nums")}. Each call to ${c("add(val)")} adds a number to the stream and returns the ${c("k")}-th largest number seen so far.`,
      `When ${c("add")} is called, at least ${c("k")} numbers will have been seen.`,
    ),
    examples: [{ inputText: "k = 3, nums = [4,5,8,2]: add(3), add(5), add(10)", outputText: "4, 5, 5" }],
    constraints: [`${c("1 ≤ k ≤ 10<sup>4</sup>")}`, "At most 10<sup>4</sup> calls to add."],
    insight: "Keep a min-heap of the k largest values. Its top is the k-th largest; when the heap grows past k, pop the smallest.",
    className: "KthLargest", ctor: [int("k"), ints("nums")],
    methods: [{ name: "add", params: [int("val")], returns: "int" }],
    tests: [
      { ops: ["KthLargest", "add", "add", "add", "add", "add"], args: [[3, [4, 5, 8, 2]], [3], [5], [10], [9], [4]], expected: [null, 4, 5, 5, 8, 8] },
      { ops: ["KthLargest", "add", "add", "add", "add", "add"], args: [[1, []], [-3], [-2], [-4], [0], [4]], expected: [null, -3, -2, -2, 0, 4] },
      { ops: ["KthLargest", "add", "add", "add", "add", "add"], args: [[2, [0]], [-1], [1], [-2], [-4], [3]], expected: [null, -1, 0, 0, 0, 1] },
    ],
  },
  {
    kind: "function", slug: "last-stone-weight", lc: 1046, title: "Last Stone Weight", difficulty: "E", patternId: "heap",
    statement: p(
      "Each turn, take the two heaviest stones, with weights x ≤ y, and smash them. Equal weights destroy both; otherwise one stone of weight y − x remains.",
      `Keep going until at most one stone is left and return its weight, or ${c("0")} if none remain.`,
    ),
    examples: [
      { inputText: "stones = [10,4,2,10]", outputText: "2", explanation: "10 and 10 cancel, then 4 and 2 leave 2." },
      { inputText: "stones = [3,3]", outputText: "0" },
    ],
    constraints: [`${c("1 ≤ stones.length ≤ 30")}`, `${c("1 ≤ stones[i] ≤ 1000")}`],
    insight: "A max-heap gives you the two heaviest stones in O(log n); push the difference back when it's non-zero.",
    fn: "lastStoneWeight", params: [ints("stones")], returns: "int",
    tests: [
      { args: [[2, 7, 4, 1, 8, 1]], expected: 1 }, { args: [[1]], expected: 1 }, { args: [[3, 3]], expected: 0 },
      { args: [[10, 4, 2, 10]], expected: 2 }, { args: [[9, 3, 2, 10]], expected: 0 }, { args: [[1, 3]], expected: 2 },
    ],
  },
  {
    kind: "function", slug: "k-closest-points-to-origin", lc: 973, title: "K Closest Points to Origin", difficulty: "M", patternId: "heap",
    statement: p(`Return the ${c("k")} points closest to (0, 0) by straight-line distance, in any order. The answer is guaranteed to be unique.`),
    examples: [
      { inputText: "points = [[3,3],[5,-1],[-2,4]], k = 2", outputText: "[[3,3],[-2,4]]" },
      { inputText: "points = [[1,3],[-2,2]], k = 1", outputText: "[[-2,2]]" },
    ],
    constraints: [`${c("1 ≤ k ≤ points.length ≤ 10<sup>4</sup>")}`, `${c("-10<sup>4</sup> ≤ x, y ≤ 10<sup>4</sup>")}`],
    insight: "Compare squared distances (no square roots). Keep a max-heap of size k: push each point and pop the farthest whenever the heap exceeds k.",
    fn: "kClosest", params: [grid("points"), int("k")], returns: "int[][]", compare: "anyOrder",
    tests: [
      { args: [[[1, 3], [-2, 2]], 1], expected: [[-2, 2]] }, { args: [[[3, 3], [5, -1], [-2, 4]], 2], expected: [[3, 3], [-2, 4]] },
      { args: [[[0, 1], [1, 0]], 2], expected: [[0, 1], [1, 0]] }, { args: [[[1, 1], [2, 2], [3, 3], [-1, -1]], 2], expected: [[1, 1], [-1, -1]] },
      { args: [[[0, 0]], 1], expected: [[0, 0]] },
    ],
  },
  {
    kind: "function", slug: "kth-largest-element-in-an-array", lc: 215, title: "Kth Largest Element in an Array", difficulty: "M", patternId: "heap",
    statement: p(`Return the ${c("k")}-th largest element in ${c("nums")}: the element that would be at position ${c("k")} if the array were sorted descending (duplicates count).`),
    examples: [
      { inputText: "nums = [7,7,7,1], k = 3", outputText: "7" },
      { inputText: "nums = [3,2,1,5,6,4], k = 2", outputText: "5" },
    ],
    constraints: [`${c("1 ≤ k ≤ nums.length ≤ 10<sup>5</sup>")}`, "Try to beat a full sort."],
    insight: "A min-heap of size k leaves the k-th largest on top: O(n log k). Quickselect gets O(n) on average.",
    fn: "findKthLargest", params: [ints("nums"), int("k")], returns: "int",
    tests: [
      { args: [[3, 2, 1, 5, 6, 4], 2], expected: 5 }, { args: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], expected: 4 }, { args: [[1], 1], expected: 1 },
      { args: [[-1, -1], 2], expected: -1 }, { args: [[7, 7, 7, 1], 3], expected: 7 }, { args: [[2, 1], 2], expected: 1 },
    ],
  },
  {
    kind: "function", slug: "task-scheduler", lc: 621, title: "Task Scheduler", difficulty: "M", patternId: "heap",
    statement: p(
      `Each letter in ${c("tasks")} is a task that takes one time unit. The CPU does one task or sits idle each unit, and two runs of the same letter must be at least ${c("n")} units apart.`,
      "Return the fewest units needed to finish every task.",
    ),
    examples: [
      { inputText: 'tasks = ["A","A","A","B","B","B"], n = 2', outputText: "8", explanation: "A B idle A B idle A B." },
      { inputText: 'tasks = ["A","B","C","D"], n = 3', outputText: "4" },
    ],
    constraints: [`${c("1 ≤ tasks.length ≤ 10<sup>4</sup>")}`, "Uppercase letters.", `${c("0 ≤ n ≤ 100")}`],
    insight: "The most frequent task sets the frame: (maxCount − 1) blocks of n + 1 slots, plus one slot per task tied for maxCount. The answer is the larger of that and the number of tasks.",
    fn: "leastInterval", params: [{ name: "tasks", type: "char[]" }, int("n")], returns: "int",
    tests: [
      { args: [["A", "A", "A", "B", "B", "B"], 2], expected: 8 }, { args: [["A", "C", "A", "B", "D", "B"], 1], expected: 6 },
      { args: [["A", "A", "A", "B", "B", "B"], 3], expected: 10 }, { args: [["A"], 5], expected: 1 },
      { args: [["A", "A", "A", "A", "B", "C"], 2], expected: 10 }, { args: [["A", "B", "C", "D"], 3], expected: 4 },
      { args: [["A", "A", "B", "B", "C", "C", "D", "D"], 1], expected: 8 },
    ],
  },
  {
    kind: "design", slug: "find-median-from-data-stream", lc: 295, title: "Find Median from Data Stream", difficulty: "H", patternId: "heap",
    statement: p(
      `Build a ${c("MedianFinder")}: ${c("addNum(num)")} adds a number, and ${c("findMedian()")} returns the median of everything added so far.`,
      "The median is the middle value of the sorted numbers, or the average of the two middle values when the count is even. findMedian is only called after at least one addNum.",
    ),
    examples: [{ inputText: "addNum(1), addNum(2), findMedian(), addNum(3), findMedian()", outputText: "1.5, 2.0" }],
    constraints: [`${c("-10<sup>5</sup> ≤ num ≤ 10<sup>5</sup>")}`, "At most 5 × 10<sup>4</sup> calls."],
    insight: "Two heaps: a max-heap for the lower half and a min-heap for the upper half, kept within one element of each other. The median lives on their tops.",
    className: "MedianFinder", ctor: [],
    methods: [
      { name: "addNum", params: [int("num")], returns: "void" },
      { name: "findMedian", params: [], returns: "double" },
    ],
    tests: [
      { ops: ["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"], args: [[], [1], [2], [], [3], []], expected: [null, null, null, 1.5, null, 2] },
      {
        ops: ["MedianFinder", "addNum", "findMedian", "addNum", "findMedian", "addNum", "findMedian", "addNum", "findMedian", "addNum", "findMedian"],
        args: [[], [-1], [], [-2], [], [-3], [], [-4], [], [-5], []],
        expected: [null, null, -1, null, -1.5, null, -2, null, -2.5, null, -3],
      },
      { ops: ["MedianFinder", "addNum", "addNum", "addNum", "addNum", "findMedian", "addNum", "findMedian"], args: [[], [5], [15], [1], [3], [], [8], []], expected: [null, null, null, null, null, 4, null, 5] },
    ],
  },
  // stretch
  {
    kind: "function", slug: "top-k-frequent-words", lc: 692, title: "Top K Frequent Words", difficulty: "M", patternId: "heap",
    statement: p(`Return the ${c("k")} most frequent words, most frequent first. Words with the same count are ordered alphabetically.`),
    examples: [
      { inputText: 'words = ["aa","a","aa","a","b"], k = 3', outputText: '["a","aa","b"]', explanation: '"a" and "aa" both appear twice; "a" comes first alphabetically.' },
      { inputText: 'words = ["b","a","c"], k = 2', outputText: '["a","b"]' },
    ],
    constraints: [`${c("1 ≤ words.length ≤ 500")}`, "Lowercase words.", `${c("1 ≤ k ≤")} number of distinct words`],
    insight: "Count with a map. Then keep a size-k heap whose 'worst' is the lower count, or the alphabetically later word on a tie; pop the rest and reverse.",
    fn: "topKFrequent", params: [{ name: "words", type: "String[]" }, int("k")], returns: "List<String>",
    tests: [
      { args: [["i", "love", "leetcode", "i", "love", "coding"], 2], expected: ["i", "love"] },
      { args: [["the", "day", "is", "sunny", "the", "the", "the", "sunny", "is", "is"], 4], expected: ["the", "is", "sunny", "day"] },
      { args: [["b", "a", "c"], 2], expected: ["a", "b"] }, { args: [["x"], 1], expected: ["x"] },
      { args: [["aa", "a", "aa", "a", "b"], 3], expected: ["a", "aa", "b"] },
    ],
  },
  {
    kind: "function", slug: "furthest-building-you-can-reach", lc: 1642, title: "Furthest Building You Can Reach", difficulty: "M", patternId: "heap",
    statement: p(
      `You walk from building 0 toward the end of ${c("heights")}. Stepping down or level is free. Stepping up by d needs either d bricks or one ladder.`,
      `With ${c("bricks")} bricks and ${c("ladders")} ladders, return the furthest building index you can reach.`,
    ),
    examples: [
      { inputText: "heights = [4,2,7,6,9,14,12], bricks = 5, ladders = 1", outputText: "4" },
      { inputText: "heights = [3,3,3], bricks = 0, ladders = 0", outputText: "2" },
    ],
    constraints: [`${c("1 ≤ heights.length ≤ 10<sup>5</sup>")}`, `${c("0 ≤ bricks ≤ 10<sup>9</sup>")}, ${c("0 ≤ ladders ≤ heights.length")}`],
    insight: "Ladders should cover the biggest climbs. Push every climb into a min-heap; once it holds more than `ladders` climbs, pay for the smallest one with bricks. Stop when bricks go negative.",
    fn: "furthestBuilding", params: [ints("heights"), int("bricks"), int("ladders")], returns: "int",
    tests: [
      { args: [[4, 2, 7, 6, 9, 14, 12], 5, 1], expected: 4 }, { args: [[4, 12, 2, 7, 3, 18, 20, 3, 19], 10, 2], expected: 7 },
      { args: [[14, 3, 19, 3], 17, 0], expected: 3 }, { args: [[1, 2], 0, 0], expected: 0 },
      { args: [[1, 5, 1, 2, 3, 4, 10000], 4, 1], expected: 5 }, { args: [[3, 3, 3], 0, 0], expected: 2 },
    ],
  },
  {
    kind: "function", slug: "ipo", lc: 502, title: "IPO", difficulty: "H", patternId: "heap",
    statement: p(
      `You start with capital ${c("w")} and may finish at most ${c("k")} projects, one after another. Project i needs at least ${c("capital[i]")} to start and adds ${c("profits[i]")} to your capital when done.`,
      "Return the largest capital you can end with.",
    ),
    examples: [
      { inputText: "k = 2, w = 0, profits = [1,2,3], capital = [0,1,1]", outputText: "4", explanation: "Do project 0 (capital 1), then project 2 (capital 4)." },
      { inputText: "k = 1, w = 0, profits = [1,2,3], capital = [1,1,2]", outputText: "0" },
    ],
    constraints: [`${c("1 ≤ k ≤ 10<sup>5</sup>")}`, `${c("0 ≤ w ≤ 10<sup>9</sup>")}`, "Up to 10<sup>5</sup> projects."],
    insight: "Sort projects by required capital. Each round, push every newly affordable project's profit into a max-heap and take the top. Stop early when nothing is affordable.",
    fn: "findMaximizedCapital", params: [int("k"), int("w"), ints("profits"), ints("capital")], returns: "int",
    tests: [
      { args: [2, 0, [1, 2, 3], [0, 1, 1]], expected: 4 }, { args: [3, 0, [1, 2, 3], [0, 1, 2]], expected: 6 },
      { args: [1, 0, [1, 2, 3], [1, 1, 2]], expected: 0 }, { args: [1, 2, [1, 2, 3], [1, 1, 2]], expected: 5 },
      { args: [10, 0, [1], [0]], expected: 1 },
    ],
  },

  // ------------------------------------------------ Week 10 · Intervals & Greedy
  {
    kind: "function", slug: "merge-intervals", lc: 56, title: "Merge Intervals", difficulty: "M", patternId: "intervals-greedy",
    statement: p(`Merge every group of overlapping intervals (touching counts as overlapping) and return the result sorted by start.`),
    examples: [
      { inputText: "intervals = [[4,7],[1,4]]", outputText: "[[1,7]]" },
      { inputText: "intervals = [[1,3],[2,6],[8,10]]", outputText: "[[1,6],[8,10]]" },
    ],
    constraints: [`${c("1 ≤ intervals.length ≤ 10<sup>4</sup>")}`, `${c("0 ≤ start ≤ end ≤ 10<sup>4</sup>")}`],
    insight: "Sort by start. Walk once: if the next interval starts at or before the last merged end, extend that end; otherwise start a new interval.",
    fn: "merge", params: [grid("intervals")], returns: "int[][]",
    tests: [
      { args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] }, { args: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
      { args: [[[4, 7], [1, 4]]], expected: [[1, 7]] }, { args: [[[1, 4], [2, 3]]], expected: [[1, 4]] }, { args: [[[5, 6]]], expected: [[5, 6]] },
      { args: [[[2, 3], [4, 5], [6, 7], [8, 9], [1, 10]]], expected: [[1, 10]] },
    ],
  },
  {
    kind: "function", slug: "insert-interval", lc: 57, title: "Insert Interval", difficulty: "M", patternId: "intervals-greedy",
    statement: p(`${c("intervals")} is sorted by start and has no overlaps. Insert ${c("newInterval")}, merging where needed, and return the list, still sorted and non-overlapping.`),
    examples: [
      { inputText: "intervals = [[1,3],[6,9]], newInterval = [2,5]", outputText: "[[1,5],[6,9]]" },
      { inputText: "intervals = [[3,5]], newInterval = [1,2]", outputText: "[[1,2],[3,5]]" },
    ],
    constraints: [`${c("0 ≤ intervals.length ≤ 10<sup>4</sup>")}`, `${c("0 ≤ start ≤ end ≤ 10<sup>5</sup>")}`],
    insight: "Three phases in one pass: copy intervals that end before the new one starts, absorb every interval that overlaps it (widening it), then copy the rest.",
    fn: "insert", params: [grid("intervals"), ints("newInterval")], returns: "int[][]",
    tests: [
      { args: [[[1, 3], [6, 9]], [2, 5]], expected: [[1, 5], [6, 9]] },
      { args: [[[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]], expected: [[1, 2], [3, 10], [12, 16]] },
      { args: [[], [5, 7]], expected: [[5, 7]] }, { args: [[[1, 5]], [6, 8]], expected: [[1, 5], [6, 8]] },
      { args: [[[3, 5]], [1, 2]], expected: [[1, 2], [3, 5]] }, { args: [[[1, 5]], [2, 3]], expected: [[1, 5]] },
    ],
  },
  {
    kind: "function", slug: "non-overlapping-intervals", lc: 435, title: "Non-overlapping Intervals", difficulty: "M", patternId: "intervals-greedy",
    statement: p("Return the fewest intervals you must remove so the rest don't overlap. Intervals that only touch, like [1,2] and [2,3], don't overlap."),
    examples: [
      { inputText: "intervals = [[1,2],[2,3],[3,4],[1,3]]", outputText: "1" },
      { inputText: "intervals = [[1,2],[1,2],[1,2]]", outputText: "2" },
    ],
    constraints: [`${c("1 ≤ intervals.length ≤ 10<sup>5</sup>")}`, `${c("-5 × 10<sup>4</sup> ≤ start < end ≤ 5 × 10<sup>4</sup>")}`],
    insight: "Sort by end and keep greedily: an interval that ends earliest leaves the most room. Count every interval that starts before the last kept end.",
    fn: "eraseOverlapIntervals", params: [grid("intervals")], returns: "int",
    tests: [
      { args: [[[1, 2], [2, 3], [3, 4], [1, 3]]], expected: 1 }, { args: [[[1, 2], [1, 2], [1, 2]]], expected: 2 },
      { args: [[[1, 2], [2, 3]]], expected: 0 }, { args: [[[1, 100], [11, 22], [1, 11], [2, 12]]], expected: 2 }, { args: [[[0, 5]]], expected: 0 },
    ],
  },
  {
    kind: "function", slug: "gas-station", lc: 134, title: "Gas Station", difficulty: "M", patternId: "intervals-greedy",
    statement: p(
      `Stations sit on a loop. Station i gives ${c("gas[i]")} fuel, and driving from i to i + 1 burns ${c("cost[i]")}. You start with an empty tank.`,
      `Return the station you can start from to drive all the way around once, or ${c("-1")} if none works. If an answer exists it is unique.`,
    ),
    examples: [
      { inputText: "gas = [1,2], cost = [2,1]", outputText: "1" },
      { inputText: "gas = [4], cost = [5]", outputText: "-1" },
    ],
    constraints: [`${c("1 ≤ n ≤ 10<sup>5</sup>")}`, `${c("0 ≤ gas[i], cost[i] ≤ 10<sup>4</sup>")}`],
    insight: "If total gas < total cost, return -1. Otherwise run one pass with a tank; whenever it goes negative, no station up to here can be the start, so restart just after it.",
    fn: "canCompleteCircuit", params: [ints("gas"), ints("cost")], returns: "int",
    tests: [
      { args: [[1, 2, 3, 4, 5], [3, 4, 5, 1, 2]], expected: 3 }, { args: [[2, 3, 4], [3, 4, 3]], expected: -1 },
      { args: [[5], [4]], expected: 0 }, { args: [[3, 1, 1], [1, 2, 2]], expected: 0 }, { args: [[1, 2], [2, 1]], expected: 1 },
      { args: [[4], [5]], expected: -1 },
    ],
  },
  // stretch
  {
    kind: "function", slug: "jump-game-ii", lc: 45, title: "Jump Game II", difficulty: "M", patternId: "intervals-greedy",
    statement: p(`From index i you can jump forward up to ${c("nums[i]")} steps. Starting at index 0, return the fewest jumps to reach the last index. It is always reachable.`),
    examples: [
      { inputText: "nums = [2,3,1,1,4]", outputText: "2", explanation: "0 → 1 → 4." },
      { inputText: "nums = [5,1,1,1,1,1]", outputText: "1" },
    ],
    constraints: [`${c("1 ≤ nums.length ≤ 10<sup>4</sup>")}`, `${c("0 ≤ nums[i] ≤ 1000")}`],
    insight: "Think in BFS levels: everything reachable with j jumps is one window. Track the farthest index the current window reaches; when you pass the window's end, jump++.",
    fn: "jump", params: [ints("nums")], returns: "int",
    tests: [
      { args: [[2, 3, 1, 1, 4]], expected: 2 }, { args: [[2, 3, 0, 1, 4]], expected: 2 }, { args: [[0]], expected: 0 },
      { args: [[1, 1, 1, 1]], expected: 3 }, { args: [[5, 1, 1, 1, 1, 1]], expected: 1 }, { args: [[1, 2]], expected: 1 },
    ],
  },
  {
    kind: "function", slug: "meeting-rooms", lc: 252, title: "Meeting Rooms", difficulty: "E", patternId: "intervals-greedy",
    statement: p(`Each ${c("[start, end]")} is a meeting. Return ${c("true")} if one person could attend all of them. A meeting ending at 5 and another starting at 5 don't clash.`),
    examples: [
      { inputText: "intervals = [[0,30],[5,10],[15,20]]", outputText: "false" },
      { inputText: "intervals = [[7,10],[2,4]]", outputText: "true" },
    ],
    constraints: [`${c("0 ≤ intervals.length ≤ 10<sup>4</sup>")}`, `${c("0 ≤ start < end ≤ 10<sup>6</sup>")}`],
    insight: "Sort by start time; the schedule works exactly when every meeting starts at or after the previous one ends.",
    fn: "canAttendMeetings", params: [grid("intervals")], returns: "boolean",
    tests: [
      { args: [[[0, 30], [5, 10], [15, 20]]], expected: false }, { args: [[[7, 10], [2, 4]]], expected: true }, { args: [[]], expected: true },
      { args: [[[1, 5], [5, 8]]], expected: true }, { args: [[[1, 5], [4, 8]]], expected: false },
    ],
  },
  {
    kind: "function", slug: "meeting-rooms-ii", lc: 253, title: "Meeting Rooms II", difficulty: "M", patternId: "intervals-greedy",
    statement: p("Return the smallest number of rooms needed to hold all the meetings. A room freed at time 5 can host a meeting starting at 5."),
    examples: [
      { inputText: "intervals = [[0,30],[5,10],[15,20]]", outputText: "2" },
      { inputText: "intervals = [[7,10],[2,4]]", outputText: "1" },
    ],
    constraints: [`${c("0 ≤ intervals.length ≤ 10<sup>4</sup>")}`, `${c("0 ≤ start < end ≤ 10<sup>6</sup>")}`],
    insight: "Sort by start and keep a min-heap of end times for rooms in use. Before placing a meeting, free the earliest room if it has ended. The heap's peak size is the answer.",
    fn: "minMeetingRooms", params: [grid("intervals")], returns: "int",
    tests: [
      { args: [[[0, 30], [5, 10], [15, 20]]], expected: 2 }, { args: [[[7, 10], [2, 4]]], expected: 1 }, { args: [[[1, 5], [5, 8]]], expected: 1 },
      { args: [[[1, 10], [2, 9], [3, 8]]], expected: 3 }, { args: [[[1, 4], [2, 5], [6, 8], [7, 9]]], expected: 2 }, { args: [[]], expected: 0 },
    ],
  },
];
