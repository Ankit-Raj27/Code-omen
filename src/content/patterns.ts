// Pattern Track roadmap content. Static, typed, reviewed in PRs — NOT Firestore.

export type Difficulty = "E" | "M" | "H";

/** [LeetCode number, title, LeetCode slug, difficulty] */
export type PatternProblem = [lc: number, title: string, slug: string, difficulty: Difficulty];

export interface Pattern {
  id: string;
  week: number; // 1–18 (18 spans weeks 18–22)
  name: string;
  signal: string; // when to use
  coreIdea: string;
  memorize: string[]; // templates + invariants
  dontMemorize: string[];
  javaKit: string;
  commonMistakes: string;
  realWorld: string;
  problems: PatternProblem[];
  /** Extra practice shown under the core set; never counted in progress. */
  stretch?: PatternProblem[];
}

export const TOTAL_WEEKS = 22;
export const DEFAULT_START_DATE = "2026-10-05";

export const PATTERNS: Pattern[] = [
  {
    id: "arrays-hashing",
    week: 1,
    name: "Arrays & Hashing",
    signal:
      "You need to find duplicates, count frequencies, group by some key, or answer \"have I seen X before?\" in O(1). Brute force is O(n²) because of a nested lookup.",
    coreIdea:
      "Trade space for time: store what you've seen in a hash map/set keyed by the thing you'll look up later, so each lookup is O(1). For grouping, compute a canonical key (sorted string, count signature).",
    memorize: [
      "Seen-set: for x in arr → if seen.contains(target − x) return; seen.add(x).",
      "Frequency map: map.merge(x, 1, Integer::sum).",
      "Group-by-key: map.computeIfAbsent(key(x), k -> new ArrayList<>()).add(x).",
      "Prefix/suffix products or sums: left[i] = product of everything before i.",
      "Invariant: the map holds exactly the elements processed so far (indices < i).",
      "Hash ops are O(1) average, O(n) worst; sorting a key of length k costs O(k log k).",
    ],
    dontMemorize: [
      "Exact solutions to Two Sum / Group Anagrams — rebuild them from the seen-set and group-by templates.",
      "Hash function internals or collision-resolution details.",
    ],
    javaKit:
      "HashMap<K,V> (getOrDefault, merge, computeIfAbsent, containsKey), HashSet<T> (add returns false if present), Arrays.sort(char[]), new String(chars), int[26] as a count key, Arrays.toString(counts) or String.valueOf(counts) for keys.",
    commonMistakes:
      "Adding to the set before checking (matches an element with itself); using char[] as a map key (reference equality); forgetting that 'longest consecutive' must only start counting at sequence starts (x−1 not in set) to stay O(n).",
    realWorld:
      "Deduplicating events in stream processors, caching (memoizing by request key), inverted indexes in search engines, counting page views per URL.",
    problems: [
      [217, "Contains Duplicate", "contains-duplicate", "E"],
      [242, "Valid Anagram", "valid-anagram", "E"],
      [1, "Two Sum", "two-sum", "E"],
      [49, "Group Anagrams", "group-anagrams", "M"],
      [238, "Product of Array Except Self", "product-of-array-except-self", "M"],
      [128, "Longest Consecutive Sequence", "longest-consecutive-sequence", "M"],
    ],
    stretch: [[36, "Valid Sudoku", "valid-sudoku", "M"], [271, "Encode and Decode Strings", "encode-and-decode-strings", "M"], [73, "Set Matrix Zeroes", "set-matrix-zeroes", "M"]] as PatternProblem[],
  },
  {
    id: "two-pointers",
    week: 2,
    name: "Two Pointers",
    signal:
      "Sorted array (or you can sort), pairs/triplets summing to a target, palindromes, or in-place partitioning/removal. You want O(n) instead of O(n²) over pairs.",
    coreIdea:
      "Move two indices toward each other (or same direction) so each step provably discards candidates that can't be the answer. Sortedness tells you which pointer to move.",
    memorize: [
      "Opposite ends: l=0, r=n−1; while l<r: if sum<target l++ else if sum>target r-- else record.",
      "Same direction (write pointer): w=0; for r: if keep(a[r]) a[w++]=a[r].",
      "3Sum = sort + fix i + two-pointer on the rest; skip duplicates at i, l and r.",
      "Container: always move the shorter wall — the taller one can't help with a narrower width.",
      "Invariant: every pair outside [l, r] has already been ruled out.",
    ],
    dontMemorize: ["The full Trapping Rain Water code — remember 'maxLeft vs maxRight, process the smaller side'.", "k-Sum generalization."],
    javaKit:
      "Arrays.sort(int[]), Character.isLetterOrDigit, Character.toLowerCase, List.of / Arrays.asList for triplets, StringBuilder.reverse only for checks, not as the solution.",
    commonMistakes:
      "Not skipping duplicates in 3Sum (duplicate triplets); infinite loop because neither pointer moves on a match; using l<=r where l<r is required; forgetting to sort first.",
    realWorld:
      "Merging sorted runs in databases (merge join), deduplicating sorted logs, comparing two versions of a sorted file (diff tools).",
    problems: [
      [125, "Valid Palindrome", "valid-palindrome", "E"],
      [167, "Two Sum II - Input Array Is Sorted", "two-sum-ii-input-array-is-sorted", "M"],
      [15, "3Sum", "3sum", "M"],
      [11, "Container With Most Water", "container-with-most-water", "M"],
      [42, "Trapping Rain Water", "trapping-rain-water", "H"],
    ],
    stretch: [[977, "Squares of a Sorted Array", "squares-of-a-sorted-array", "E"], [881, "Boats to Save People", "boats-to-save-people", "M"], [16, "3Sum Closest", "3sum-closest", "M"]] as PatternProblem[],
  },
  {
    id: "sliding-window",
    week: 3,
    name: "Sliding Window",
    signal:
      "Contiguous subarray/substring with a 'longest/shortest/count where condition holds' question, and the condition is monotonic as the window grows or shrinks.",
    coreIdea:
      "Expand the right edge every step; shrink the left edge while the window is invalid. Each index enters and leaves once → O(n).",
    memorize: [
      "Variable window: for r: add(a[r]); while invalid: remove(a[l++]); best = max(best, r−l+1).",
      "Fixed window of size k: add a[r]; if r ≥ k: remove a[r−k]; if r ≥ k−1: evaluate.",
      "'At most K' trick: exactly(K) = atMost(K) − atMost(K−1).",
      "Window state = a count map/array plus a 'matched' counter to avoid rescanning.",
      "Invariant: after the while-loop, [l, r] is the longest valid window ending at r.",
    ],
    dontMemorize: ["Minimum Window Substring line by line — rebuild from 'need / have' counters.", "Monotonic-deque optimizations for every variant (that's Week 4)."],
    javaKit: "int[128] or int[26] counts, HashMap.merge, Math.max/min, String.charAt, s.substring(l, r+1) only once at the end.",
    commonMistakes:
      "Using 'if' instead of 'while' to shrink; updating the answer before the window is valid; negative numbers break the monotonic assumption for sum windows (use prefix sums + hashmap instead).",
    realWorld: "Rate limiters (requests in the last N seconds), moving averages on metrics, TCP flow-control windows, streaming anomaly detection.",
    problems: [
      [121, "Best Time to Buy and Sell Stock", "best-time-to-buy-and-sell-stock", "E"],
      [3, "Longest Substring Without Repeating Characters", "longest-substring-without-repeating-characters", "M"],
      [424, "Longest Repeating Character Replacement", "longest-repeating-character-replacement", "M"],
      [567, "Permutation in String", "permutation-in-string", "M"],
      [76, "Minimum Window Substring", "minimum-window-substring", "H"],
    ],
    stretch: [[209, "Minimum Size Subarray Sum", "minimum-size-subarray-sum", "M"], [1004, "Max Consecutive Ones III", "max-consecutive-ones-iii", "M"], [239, "Sliding Window Maximum", "sliding-window-maximum", "H"]] as PatternProblem[],
  },
  {
    id: "stack",
    week: 4,
    name: "Stack / Monotonic Stack",
    signal:
      "Matching/nesting (brackets, undo), evaluate expressions, or 'next greater/smaller element', 'how far until warmer', 'largest rectangle' — each element waits for a future element to resolve it.",
    coreIdea:
      "A stack holds unresolved items. In a monotonic stack, pushing a new item pops (and resolves) everything it beats, so the stack stays sorted and each element is pushed/popped once.",
    memorize: [
      "Next greater: for i: while !st.isEmpty() && a[st.peek()] < a[i]: ans[st.pop()] = i; st.push(i).",
      "Store indices, not values, when you need distances or widths.",
      "Brackets: push openers; on closer, stack must be non-empty and top must match.",
      "Largest rectangle: on pop, width = i − (new top) − 1; add a sentinel 0 at the end.",
      "Invariant: stack is strictly increasing (or decreasing) from bottom to top.",
    ],
    dontMemorize: ["Min Stack variations beyond 'store (val, minSoFar) pairs'.", "Shunting-yard for full expression parsing."],
    javaKit: "Deque<Integer> st = new ArrayDeque<>(); push/pop/peek/isEmpty. Never java.util.Stack (synchronized, legacy). Integer.parseInt for RPN tokens.",
    commonMistakes:
      "Using Stack instead of ArrayDeque; comparing Integer objects with == on popped values; forgetting to flush the stack at the end (sentinel); wrong strict vs non-strict comparison causing duplicates to be mishandled.",
    realWorld: "Browser back/forward, undo/redo, call stacks, parsing JSON/HTML, compilers evaluating expressions, stock span indicators.",
    problems: [
      [20, "Valid Parentheses", "valid-parentheses", "E"],
      [155, "Min Stack", "min-stack", "M"],
      [150, "Evaluate Reverse Polish Notation", "evaluate-reverse-polish-notation", "M"],
      [739, "Daily Temperatures", "daily-temperatures", "M"],
      [853, "Car Fleet", "car-fleet", "M"],
      [84, "Largest Rectangle in Histogram", "largest-rectangle-in-histogram", "H"],
    ],
    stretch: [[496, "Next Greater Element I", "next-greater-element-i", "E"], [22, "Generate Parentheses", "generate-parentheses", "M"], [402, "Remove K Digits", "remove-k-digits", "M"]] as PatternProblem[],
  },
  {
    id: "binary-search",
    week: 5,
    name: "Binary Search (incl. search-on-answer)",
    signal:
      "Sorted/rotated input, or the question is 'minimum X such that feasible(X)' where feasible is monotonic (false…false true…true). Constraints like n up to 10⁹ hint at log time.",
    coreIdea:
      "Keep an interval that always contains the answer and halve it. For search-on-answer, binary search over the answer space and test each guess with an O(n) feasibility check.",
    memorize: [
      "Lower bound: lo=0, hi=n; while lo<hi: mid=lo+(hi−lo)/2; if a[mid] < x lo=mid+1 else hi=mid. Return lo.",
      "Search on answer: lo=min possible, hi=max possible; if feasible(mid) hi=mid else lo=mid+1.",
      "Rotated array: one half is always sorted; check whether target lies in that half.",
      "Invariant: answer ∈ [lo, hi]; loop ends when lo==hi.",
      "Cost: O(log n) steps × cost of the check.",
    ],
    dontMemorize: ["Three different templates — pick ONE (lo<hi, hi=mid) and use it everywhere.", "Median of Two Sorted Arrays partition math — understand it, don't recite it."],
    javaKit: "lo + (hi - lo) / 2, Arrays.binarySearch (returns −(insertion)−1 when absent), long for sums in feasibility checks, Math.ceilDiv (Java 18+) or (a + b − 1) / b.",
    commonMistakes: "(lo+hi)/2 overflow; infinite loop from lo=mid; wrong bounds for search-on-answer (hi too small); int overflow when summing hours in Koko.",
    realWorld: "git bisect, database B-tree lookups, finding the first bad deploy, capacity planning ('smallest instance that meets SLA'), autoscaling thresholds.",
    problems: [
      [704, "Binary Search", "binary-search", "E"],
      [74, "Search a 2D Matrix", "search-a-2d-matrix", "M"],
      [875, "Koko Eating Bananas", "koko-eating-bananas", "M"],
      [153, "Find Minimum in Rotated Sorted Array", "find-minimum-in-rotated-sorted-array", "M"],
      [33, "Search in Rotated Sorted Array", "search-in-rotated-sorted-array", "M"],
      [981, "Time Based Key-Value Store", "time-based-key-value-store", "M"],
    ],
    stretch: [[35, "Search Insert Position", "search-insert-position", "E"], [34, "Find First and Last Position of Element in Sorted Array", "find-first-and-last-position-of-element-in-sorted-array", "M"], [1011, "Capacity To Ship Packages Within D Days", "capacity-to-ship-packages-within-d-days", "M"]] as PatternProblem[],
  },
  {
    id: "linked-list",
    week: 6,
    name: "Linked List",
    signal: "Input is a ListNode, or you need O(1) insert/delete with a pointer to the node. Cycle detection, middle, k-th from end, reversing in place.",
    coreIdea: "Rewire pointers carefully; use a dummy head to avoid special-casing the first node, and fast/slow pointers for cycles and midpoints.",
    memorize: [
      "Reverse: prev=null; while cur: next=cur.next; cur.next=prev; prev=cur; cur=next. Return prev.",
      "Dummy head: ListNode dummy = new ListNode(0, head); … return dummy.next.",
      "Fast/slow: slow moves 1, fast moves 2; they meet iff there's a cycle; slow ends at the middle.",
      "k-th from end: advance fast k steps, then move both until fast is null.",
      "LRU = HashMap<key, node> + doubly linked list with sentinel head/tail.",
    ],
    dontMemorize: ["Floyd's cycle-start proof.", "Recursive reversal (know the iterative one cold)."],
    javaKit: "Custom ListNode class, LinkedHashMap(capacity, 0.75f, true) + removeEldestEntry for LRU sanity checks, PriorityQueue<ListNode> for merging k lists.",
    commonMistakes: "Losing the rest of the list by overwriting next before saving it; NPE on fast.next.next; forgetting to cut the list when splitting (cycles); not updating both map and list in LRU.",
    realWorld: "LRU caches (Redis, CPU caches), OS free-lists, undo histories, music playlist next/prev, blockchain-style hash chains.",
    problems: [
      [206, "Reverse Linked List", "reverse-linked-list", "E"],
      [21, "Merge Two Sorted Lists", "merge-two-sorted-lists", "E"],
      [141, "Linked List Cycle", "linked-list-cycle", "E"],
      [143, "Reorder List", "reorder-list", "M"],
      [19, "Remove Nth Node From End of List", "remove-nth-node-from-end-of-list", "M"],
      [146, "LRU Cache", "lru-cache", "M"],
    ],
    stretch: [[234, "Palindrome Linked List", "palindrome-linked-list", "E"], [2, "Add Two Numbers", "add-two-numbers", "M"], [23, "Merge k Sorted Lists", "merge-k-sorted-lists", "H"]] as PatternProblem[],
  },
  {
    id: "trees-dfs-bfs",
    week: 7,
    name: "Trees DFS/BFS",
    signal: "Input is a TreeNode. Depth/diameter/path sums → DFS returning a value up. Level-by-level, right side view, min depth → BFS.",
    coreIdea: "Define what each recursive call returns for its subtree, combine children's answers at the parent, and (optionally) update a global answer on the way up.",
    memorize: [
      "Postorder DFS: int dfs(node){ if(node==null) return base; l=dfs(left); r=dfs(right); update global; return combine(l,r); }",
      "BFS levels: q.offer(root); while(!q.isEmpty()){ int size=q.size(); for i<size: poll, offer children }",
      "Diameter/max path: return best single-branch to parent, record best two-branch globally.",
      "Balanced check: return −1 to signal 'already unbalanced' and short-circuit.",
      "Time O(n), space O(h) for DFS, O(width) for BFS.",
    ],
    dontMemorize: ["Morris traversal.", "Iterative postorder with one stack."],
    javaKit: "Queue<TreeNode> q = new ArrayDeque<>() (offer/poll; ArrayDeque rejects null — check before offering), int[] or a field for global answers, Math.max.",
    commonMistakes: "Offering null into ArrayDeque (NPE); confusing height vs depth; returning the global answer instead of the single-branch value; forgetting negative values in max path sum (clamp with max(0, …)).",
    realWorld: "DOM traversal, file-system size calculation (du), org charts, compiler ASTs, React reconciliation.",
    problems: [
      [226, "Invert Binary Tree", "invert-binary-tree", "E"],
      [104, "Maximum Depth of Binary Tree", "maximum-depth-of-binary-tree", "E"],
      [543, "Diameter of Binary Tree", "diameter-of-binary-tree", "E"],
      [102, "Binary Tree Level Order Traversal", "binary-tree-level-order-traversal", "M"],
      [199, "Binary Tree Right Side View", "binary-tree-right-side-view", "M"],
      [124, "Binary Tree Maximum Path Sum", "binary-tree-maximum-path-sum", "H"],
    ],
    stretch: [[100, "Same Tree", "same-tree", "E"], [110, "Balanced Binary Tree", "balanced-binary-tree", "E"], [105, "Construct Binary Tree from Preorder and Inorder Traversal", "construct-binary-tree-from-preorder-and-inorder-traversal", "M"]] as PatternProblem[],
  },
  {
    id: "bst-trie",
    week: 8,
    name: "BST & Trie",
    signal: "BST: ordered queries, k-th smallest, validate ordering, LCA using values. Trie: prefix search, autocomplete, word dictionary with wildcards, many words vs one board.",
    coreIdea: "BST: inorder is sorted; carry (min, max) bounds down. Trie: one node per character; walk the prefix once instead of comparing whole strings.",
    memorize: [
      "Validate BST: dfs(node, lo, hi) — node.val must be strictly within (lo, hi).",
      "Inorder iterative with a stack gives k-th smallest in O(h + k).",
      "LCA in BST: if both < node go left, both > node go right, else node.",
      "Trie node: TrieNode[26] children; boolean end. insert/search/startsWith are O(L).",
      "Word Search II: build a trie of words, DFS the board, prune by removing found words.",
    ],
    dontMemorize: ["Self-balancing tree rotations (AVL/red-black).", "Compressed/radix trie implementations."],
    javaKit: "TreeMap/TreeSet (floorKey, ceilingKey, higherKey) for ordered queries, long bounds (Long.MIN_VALUE) for validation, char − 'a' indexing.",
    commonMistakes: "Validating with only parent comparison (misses grandparent violations); Integer.MIN_VALUE as a sentinel when node values can equal it; not marking end-of-word; revisiting cells in board DFS.",
    realWorld: "Autocomplete in search bars, IP routing tables (longest prefix match), spell checkers, database indexes, TreeMap-backed order books.",
    problems: [
      [98, "Validate Binary Search Tree", "validate-binary-search-tree", "M"],
      [230, "Kth Smallest Element in a BST", "kth-smallest-element-in-a-bst", "M"],
      [235, "Lowest Common Ancestor of a Binary Search Tree", "lowest-common-ancestor-of-a-binary-search-tree", "M"],
      [208, "Implement Trie (Prefix Tree)", "implement-trie-prefix-tree", "M"],
      [211, "Design Add and Search Words Data Structure", "design-add-and-search-words-data-structure", "M"],
      [212, "Word Search II", "word-search-ii", "H"],
    ],
    stretch: [[700, "Search in a Binary Search Tree", "search-in-a-binary-search-tree", "E"], [701, "Insert into a Binary Search Tree", "insert-into-a-binary-search-tree", "M"], [14, "Longest Common Prefix", "longest-common-prefix", "E"]] as PatternProblem[],
  },
  {
    id: "heap",
    week: 9,
    name: "Heap / Top K / Two Heaps",
    signal: "'K largest/smallest/closest/most frequent', merge K sorted things, schedule by priority, or a running median.",
    coreIdea: "Keep only what matters in a heap: a size-k min-heap keeps the top k largest in O(n log k). Two heaps split a stream into lower/upper halves for medians.",
    memorize: [
      "Top k largest: min-heap; offer; if size > k poll. Heap top = k-th largest.",
      "Merge k lists: heap of heads; poll smallest, push its next.",
      "Median: maxHeap (low half), minHeap (high half); keep sizes differ by ≤1; median from tops.",
      "Heap push/pop O(log n), peek O(1), heapify O(n).",
    ],
    dontMemorize: ["Heap sift-up/sift-down code.", "Quickselect partition code (know it exists: O(n) average)."],
    javaKit: "new PriorityQueue<>() (min), new PriorityQueue<>(Collections.reverseOrder()) (max), comparator (a, b) -> Integer.compare(a[0], b[0]), Map.Entry.comparingByValue().",
    commonMistakes: "Comparator a − b overflow; using a max-heap of size n when a min-heap of size k suffices; unbalanced two heaps; forgetting PriorityQueue iteration order is NOT sorted.",
    realWorld: "OS schedulers, Dijkstra in routing, 'trending now' top-K, load balancers picking the least-loaded server, p50 latency tracking.",
    problems: [
      [703, "Kth Largest Element in a Stream", "kth-largest-element-in-a-stream", "E"],
      [1046, "Last Stone Weight", "last-stone-weight", "E"],
      [973, "K Closest Points to Origin", "k-closest-points-to-origin", "M"],
      [215, "Kth Largest Element in an Array", "kth-largest-element-in-an-array", "M"],
      [621, "Task Scheduler", "task-scheduler", "M"],
      [295, "Find Median from Data Stream", "find-median-from-data-stream", "H"],
    ],
    stretch: [[692, "Top K Frequent Words", "top-k-frequent-words", "M"], [1642, "Furthest Building You Can Reach", "furthest-building-you-can-reach", "M"], [502, "IPO", "ipo", "H"]] as PatternProblem[],
  },
  {
    id: "intervals-greedy",
    week: 10,
    name: "Intervals & Greedy",
    signal: "Input is [start, end] pairs (merge, insert, overlaps, rooms), or a locally optimal choice can be proven never to hurt (jump reach, gas station, max subarray).",
    coreIdea: "Intervals: sort by start (or end) and sweep once. Greedy: find an exchange argument — the greedy choice is at least as good as any other.",
    memorize: [
      "Merge: sort by start; if cur.start <= last.end: last.end = max(last.end, cur.end) else append.",
      "Min removals to make non-overlapping: sort by END, keep earliest-finishing.",
      "Meeting rooms: sort starts and ends separately, two pointers; or min-heap of end times.",
      "Kadane: cur = max(x, cur + x); best = max(best, cur).",
      "Jump Game: track farthest reachable; fail if i > farthest.",
    ],
    dontMemorize: ["Greedy correctness proofs for every problem.", "Sweep-line with segment trees."],
    javaKit: "Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0])), List<int[]> then list.toArray(new int[0][]), PriorityQueue<Integer> of end times.",
    commonMistakes: "Sorting by start when the problem needs end; < vs <= for touching intervals; a[0] − b[0] comparator overflow; mutating the input interval you already appended.",
    realWorld: "Calendar free/busy merging, booking systems, CPU/job scheduling, compaction of time ranges in time-series databases.",
    problems: [
      [53, "Maximum Subarray", "maximum-subarray", "M"],
      [55, "Jump Game", "jump-game", "M"],
      [56, "Merge Intervals", "merge-intervals", "M"],
      [57, "Insert Interval", "insert-interval", "M"],
      [435, "Non-overlapping Intervals", "non-overlapping-intervals", "M"],
      [134, "Gas Station", "gas-station", "M"],
    ],
    stretch: [[45, "Jump Game II", "jump-game-ii", "M"], [252, "Meeting Rooms", "meeting-rooms", "E"], [253, "Meeting Rooms II", "meeting-rooms-ii", "M"]] as PatternProblem[],
  },
  {
    id: "backtracking",
    week: 11,
    name: "Backtracking",
    signal: "'Return ALL subsets/permutations/combinations/partitions', place items under constraints (N-Queens, sudoku), or search a board path. Small n (≤ 15–20).",
    coreIdea: "Build a candidate step by step; at each step choose, recurse, un-choose. Prune branches that can't lead to a valid answer.",
    memorize: [
      "void bt(start, path){ record(path); for i from start: choose(i); bt(i+1, path); unchoose(); }",
      "Permutations: used[] array instead of start index.",
      "Duplicates: sort, then skip i > start && a[i] == a[i−1].",
      "Reuse allowed (combination sum): recurse with i, not i+1.",
      "Complexity: subsets O(n·2ⁿ), permutations O(n·n!).",
    ],
    dontMemorize: ["N-Queens diagonal index formulas — derive r−c and r+c when needed.", "Sudoku solver optimizations."],
    javaKit: "List<List<Integer>> res; res.add(new ArrayList<>(path)) (copy!), path.remove(path.size() − 1), boolean[] used, char[][] board with a temporary '#' mark.",
    commonMistakes: "Adding path by reference (all results end up empty); forgetting to undo the choice; wrong duplicate-skip condition (i > 0 instead of i > start); no pruning → TLE.",
    realWorld: "Constraint solvers (scheduling, timetable generation), regex engines, puzzle solvers, dependency-resolution search in package managers.",
    problems: [
      [78, "Subsets", "subsets", "M"],
      [39, "Combination Sum", "combination-sum", "M"],
      [46, "Permutations", "permutations", "M"],
      [90, "Subsets II", "subsets-ii", "M"],
      [79, "Word Search", "word-search", "M"],
      [51, "N-Queens", "n-queens", "H"],
    ],
  },
  {
    id: "graphs-grids",
    week: 12,
    name: "Graphs BFS/DFS & Grids",
    signal: "Connected components, islands, flood fill, 'minimum steps' on an unweighted grid/graph, multi-source spread (rotting oranges), cloning a graph.",
    coreIdea: "Treat each cell/node as a vertex. DFS/BFS from each unvisited vertex; BFS gives shortest paths in unweighted graphs; multi-source BFS starts with all sources in the queue.",
    memorize: [
      "Directions: int[][] D = {{1,0},{-1,0},{0,1},{0,-1}}; bounds check before visiting.",
      "Mark visited WHEN ENQUEUING, not when polling.",
      "Multi-source BFS: enqueue all sources at distance 0, then BFS by levels.",
      "Reverse thinking: Pacific/Atlantic — BFS from the oceans inward.",
      "Complexity O(V + E); grid O(rows·cols).",
    ],
    dontMemorize: ["Tarjan's bridges/articulation points (yet).", "Bidirectional BFS details."],
    javaKit: "ArrayDeque<int[]> for (r, c) pairs, boolean[][] visited, List<List<Integer>> adjacency, HashMap<Node, Node> for cloning.",
    commonMistakes: "Marking visited on poll (same cell enqueued many times); recursion depth overflow on large grids (use BFS); mutating input when not allowed; off-by-one in bounds.",
    realWorld: "Social-network degrees of separation, web crawlers, flood-fill in paint tools, network reachability, game map pathing on uniform grids.",
    problems: [
      [200, "Number of Islands", "number-of-islands", "M"],
      [695, "Max Area of Island", "max-area-of-island", "M"],
      [133, "Clone Graph", "clone-graph", "M"],
      [994, "Rotting Oranges", "rotting-oranges", "M"],
      [417, "Pacific Atlantic Water Flow", "pacific-atlantic-water-flow", "M"],
      [130, "Surrounded Regions", "surrounded-regions", "M"],
    ],
  },
  {
    id: "topo-union-find",
    week: 13,
    name: "Topological Sort & Union-Find",
    signal: "Dependencies/prerequisites/order of tasks, cycle detection in a directed graph → topo sort. Dynamic connectivity, 'are these connected', redundant edge, count components → union-find.",
    coreIdea: "Kahn's algorithm peels nodes with indegree 0; if not all nodes are peeled there's a cycle. Union-find merges sets with near-O(1) find via path compression + union by rank/size.",
    memorize: [
      "Kahn: indegree[]; queue all 0s; poll, append, decrement neighbours, enqueue new 0s; result.size()==n ⇔ DAG.",
      "find(x){ if(p[x]!=x) p[x]=find(p[x]); return p[x]; }",
      "union(a,b){ ra=find(a), rb=find(b); if(ra==rb) return false; attach smaller to larger; return true; }",
      "Components = n − successful unions.",
      "Undirected cycle ⇔ union returns false for some edge.",
    ],
    dontMemorize: ["Inverse-Ackermann complexity proof.", "Alien Dictionary edge cases beyond 'prefix longer than word is invalid'."],
    javaKit: "int[] parent, int[] size; List<Integer>[] adj (or List<List<Integer>>); ArrayDeque<Integer> queue.",
    commonMistakes: "Building edges in the wrong direction (prereq → course); forgetting path compression; union without comparing roots; using DFS topo without a 'visiting' state (misses cycles).",
    realWorld: "Build systems (Make, Bazel), package managers, spreadsheet recalculation order, CI pipelines (DAGs), Kruskal's MST, network partition detection.",
    problems: [
      [207, "Course Schedule", "course-schedule", "M"],
      [210, "Course Schedule II", "course-schedule-ii", "M"],
      [323, "Number of Connected Components in an Undirected Graph", "number-of-connected-components-in-an-undirected-graph", "M"],
      [684, "Redundant Connection", "redundant-connection", "M"],
      [261, "Graph Valid Tree", "graph-valid-tree", "M"],
      [269, "Alien Dictionary", "alien-dictionary", "H"],
    ],
  },
  {
    id: "shortest-paths",
    week: 14,
    name: "Weighted Shortest Paths",
    signal: "Edges have weights/costs/times; 'minimum cost/time to reach', 'cheapest with at most k stops', 'minimum effort path', MST (connect all points cheaply).",
    coreIdea: "Dijkstra: always expand the closest unfinalized node (non-negative weights). Bellman-Ford: relax all edges k times (handles stop limits / negatives). Prim/Kruskal for MST.",
    memorize: [
      "Dijkstra: dist[src]=0; pq(dist,node); poll; if d > dist[u] continue; relax neighbours, push improved.",
      "Bellman-Ford with k stops: copy dist each round; relax from the previous round's copy.",
      "Grid Dijkstra: cost = max(effort) or sum depending on the problem.",
      "Prim: pq of (cost, node), add unvisited node with cheapest edge.",
      "Dijkstra O((V+E) log V); Bellman-Ford O(k·E).",
    ],
    dontMemorize: ["Floyd–Warshall (know O(V³) all-pairs exists).", "A* heuristics.", "Fibonacci-heap Dijkstra."],
    javaKit: "PriorityQueue<int[]>((a, b) -> Integer.compare(a[0], b[0])), int[] dist filled with Integer.MAX_VALUE, Arrays.fill, long when sums can overflow.",
    commonMistakes: "Missing the stale-entry check (d > dist[u]); Dijkstra with negative edges; in k-stops, relaxing from the current round's dist (uses more stops than allowed); overflow adding to MAX_VALUE.",
    realWorld: "Google Maps routing, network routing (OSPF), ride-hailing ETA, cheapest flight search, laying out cable/fiber networks (MST).",
    problems: [
      [743, "Network Delay Time", "network-delay-time", "M"],
      [787, "Cheapest Flights Within K Stops", "cheapest-flights-within-k-stops", "M"],
      [1631, "Path With Minimum Effort", "path-with-minimum-effort", "M"],
      [1584, "Min Cost to Connect All Points", "min-cost-to-connect-all-points", "M"],
      [778, "Swim in Rising Water", "swim-in-rising-water", "H"],
    ],
  },
  {
    id: "dp-1d",
    week: 15,
    name: "1D DP",
    signal: "'Number of ways', 'min/max cost', 'can you reach', and the answer for i depends on a few smaller indices. Brute-force recursion has overlapping subproblems.",
    coreIdea: "Define dp[i] in words, write the recurrence from the last choice, set base cases, choose iteration order. Then compress space if only the last few states are used.",
    memorize: [
      "Recipe: state → recurrence → base case → order → answer location.",
      "Climbing/house robber: dp[i] = f(dp[i−1], dp[i−2]) → two variables.",
      "Coin change (min): dp[a] = min(dp[a − c] + 1); init with amount+1 as infinity.",
      "Word break: dp[i] = any(dp[j] && dict.contains(s[j..i))).",
      "LIS: O(n²) dp or O(n log n) with patience tails + binary search.",
    ],
    dontMemorize: ["Final code for each problem — only the dp definition and recurrence.", "Space-optimized versions before the plain table works."],
    javaKit: "int[] dp = new int[n + 1]; Arrays.fill(dp, INF); Integer[] memo for top-down (null = unknown), HashSet<String> dictionary, Collections.binarySearch / Arrays.binarySearch for LIS tails.",
    commonMistakes: "Using Integer.MAX_VALUE as infinity then adding 1 (overflow); off-by-one between dp size n and n+1; wrong loop order for combinations vs permutations in coin problems; forgetting the empty base case.",
    realWorld: "Text justification in editors, resource allocation, speech/handwriting recognition (Viterbi), pricing and inventory optimization.",
    problems: [
      [70, "Climbing Stairs", "climbing-stairs", "E"],
      [198, "House Robber", "house-robber", "M"],
      [322, "Coin Change", "coin-change", "M"],
      [139, "Word Break", "word-break", "M"],
      [300, "Longest Increasing Subsequence", "longest-increasing-subsequence", "M"],
      [416, "Partition Equal Subset Sum", "partition-equal-subset-sum", "M"],
    ],
  },
  {
    id: "dp-2d",
    week: 16,
    name: "2D DP & Strings",
    signal: "Two sequences (compare, align, edit), a grid of paths, or a string with substring/interval choices (palindromes). State needs two indices.",
    coreIdea: "dp[i][j] = answer for prefixes a[0..i) and b[0..j) (or grid cell, or interval i..j). Fill in an order where dependencies are already computed.",
    memorize: [
      "LCS: dp[i][j] = a[i−1]==b[j−1] ? dp[i−1][j−1]+1 : max(dp[i−1][j], dp[i][j−1]).",
      "Edit distance: match → diag; else 1 + min(insert, delete, replace).",
      "Grid paths: dp[r][c] = dp[r−1][c] + dp[r][c−1].",
      "Palindromes: expand around 2n−1 centers, O(n²) time, O(1) space.",
      "Interval DP: iterate by length, then left index.",
      "Rolling rows: only dp[i−1] needed → two 1D arrays.",
    ],
    dontMemorize: ["Manacher's algorithm.", "Burst Balloons / interval DP variants beyond the template.", "KMP / Z-function early."],
    javaKit: "int[][] dp = new int[m + 1][n + 1]; s.toCharArray(); String.valueOf / substring once; StringBuilder for reconstruction.",
    commonMistakes: "Mixing 0- and 1-based indices; iterating in an order that reads uncomputed cells; building substrings inside the loop (O(n³)); forgetting base row/column initialization.",
    realWorld: "diff/git merge (LCS), spell-check suggestions (edit distance), DNA sequence alignment, fuzzy search, OCR correction.",
    problems: [
      [62, "Unique Paths", "unique-paths", "M"],
      [1143, "Longest Common Subsequence", "longest-common-subsequence", "M"],
      [5, "Longest Palindromic Substring", "longest-palindromic-substring", "M"],
      [647, "Palindromic Substrings", "palindromic-substrings", "M"],
      [518, "Coin Change II", "coin-change-ii", "M"],
      [72, "Edit Distance", "edit-distance", "M"],
    ],
  },
  {
    id: "bit-manipulation",
    week: 17,
    name: "Bit Manipulation",
    signal: "'Single number', counting bits, powers of two, 'without using + or −', subsets as masks, O(1) extra space constraints on integer arrays.",
    coreIdea: "Work directly on binary representation: XOR cancels pairs, x & (x−1) drops the lowest set bit, masks encode small sets.",
    memorize: [
      "a ^ a = 0, a ^ 0 = a → XOR everything to find the unpaired element.",
      "x & (x − 1) clears the lowest set bit; x & −x isolates it.",
      "Power of two: x > 0 && (x & (x − 1)) == 0.",
      "Count bits DP: bits[i] = bits[i >> 1] + (i & 1).",
      "Check / set / clear bit k: (x >> k) & 1, x | (1 << k), x & ~(1 << k).",
    ],
    dontMemorize: ["Two's-complement proofs.", "Gray code / bit tricks rarely asked in interviews."],
    javaKit: "Integer.bitCount, Integer.toBinaryString, >>> (unsigned shift) vs >>, 1L << k for k ≥ 31, Integer.reverse.",
    commonMistakes: "Using >> on negatives when >>> is needed; 1 << 31 overflow (use 1L); operator precedence (x & 1 == 0 parses wrong — add parentheses).",
    realWorld: "Feature flags and permission bitmasks, Bloom filters, network subnet masks, compression and checksums, chess engines (bitboards).",
    problems: [
      [136, "Single Number", "single-number", "E"],
      [191, "Number of 1 Bits", "number-of-1-bits", "E"],
      [338, "Counting Bits", "counting-bits", "E"],
      [268, "Missing Number", "missing-number", "E"],
      [190, "Reverse Bits", "reverse-bits", "E"],
      [371, "Sum of Two Integers", "sum-of-two-integers", "M"],
    ],
  },
  {
    id: "mixed-mocks",
    week: 18,
    name: "Mixed Mocks",
    signal: "Weeks 18–22. No fixed problems — the pattern is unknown, which is the point. Train recognition under time pressure.",
    coreIdea:
      "Pick 2 unseen mediums from mixed lists each session, 60 minutes total, think aloud. Before coding, name the pattern and why (signal → pattern). Log each attempt; review with the same spaced repetition.",
    memorize: [
      "Your signal → pattern map (the 'signal' line of every sheet).",
      "The 5-minute opener: restate, 2 edge cases, brute force + Big-O, then optimize.",
      "Your own top-10 recurring mistakes from the log's 'stuck on' column.",
    ],
    dontMemorize: ["New patterns — stop adding breadth; consolidate what you have.", "Company-tagged problem lists verbatim."],
    javaKit: "Everything from weeks 1–17. Keep a one-page cheat sheet of the Java APIs you actually reached for.",
    commonMistakes: "Jumping to code before naming the pattern; not timeboxing; skipping the review queue during mock weeks; only doing problems you've seen before.",
    realWorld: "The interview itself: unseen problem, time limit, someone listening. Mocks are the closest rehearsal.",
    problems: [],
  },
];

export const PATTERN_BY_ID: Record<string, Pattern> = Object.fromEntries(PATTERNS.map((p) => [p.id, p]));

export const LEETCODE_URL = (slug: string) => `https://leetcode.com/problems/${slug}/`;
