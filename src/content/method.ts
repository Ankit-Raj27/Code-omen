// Static content for the "Method" tab.

export interface MethodSection {
  title: string;
  items: string[];
}

export const METHOD_SECTIONS: MethodSection[] = [
  {
    title: "Daily loop (~1.5 h)",
    items: [
      "Revise first (20–30 min): clear everything in Today's queue before touching new problems.",
      "Then 2 new problems from this week's pattern.",
      "5 minutes on paper first: restate the problem, write 2 edge cases, write the brute force and its Big-O.",
      "Mediums get a 25-minute timebox. Stuck? Take a hint only, then +10 minutes.",
      "Still stuck? Read the solution, close it, and rewrite it from memory in a blank editor. Mark it \"needed help\".",
      "Log a one-line insight: the trick you'd want to remember in 3 weeks.",
    ],
  },
  {
    title: "Recognizing is not recalling",
    items: [
      "Always re-solve from a blank editor. Rereading your old code feels like progress but trains recognition, not recall.",
      "During revision, try to state the insight before you reveal it.",
    ],
  },
  {
    title: "Memorize",
    items: [
      "The signal → pattern map (the \"When to use\" line of every sheet).",
      "~12 templates: two pointers, sliding window, monotonic stack, binary search, BFS levels, DFS returning values, backtracking, Kahn's topo sort, union-find, Dijkstra, 1D DP recipe, 2D DP table.",
      "The invariant behind each template.",
      "Big-O of core operations: hash O(1), heap O(log n), sort O(n log n), BFS/DFS O(V + E).",
      "The Java APIs in each sheet's Java kit.",
    ],
  },
  {
    title: "Don't memorize",
    items: [
      "Full solutions — rebuild them from templates.",
      "Rare algorithms early (KMP, segment trees, Manacher).",
      "Proofs.",
      "Problem counts. 150 recalled beats 500 recognized.",
    ],
  },
  {
    title: "Interview habits",
    items: [
      "Think aloud, even when practising alone.",
      "Say the brute force first, with its complexity, then optimize.",
      "Dry-run on a small example before you run the code.",
      "Weekly timed mock: 2 unseen mediums in 60 minutes.",
    ],
  },
  {
    title: "Java traps",
    items: [
      "Use ArrayDeque, not Stack.",
      "Comparators: Integer.compare(a, b), never a − b (overflow).",
      "Compare Integer objects with .equals(), not == (cache only covers −128..127).",
      "Midpoint: lo + (hi − lo) / 2.",
      "Build strings in loops with StringBuilder.",
    ],
  },
];

export const METHOD_SOURCES: { title: string; url: string }[] = [
  { title: "Hacker News — interview prep discussions", url: "https://hn.algolia.com/?q=leetcode%20interview" },
  { title: "Red-Green-Code", url: "https://www.redgreencode.com/" },
  { title: "DEV Community — #leetcode", url: "https://dev.to/t/leetcode" },
  { title: "Sean Prashad's LeetCode Patterns", url: "https://seanprashad.com/leetcode-patterns/" },
  { title: "NeetCode roadmap", url: "https://neetcode.io/roadmap" },
];
