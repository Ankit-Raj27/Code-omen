// Java starter code + test harnesses for code-omen's problem bank.
// The harness body runs inside `public class Main { static void main }` with a
// `Solution s` in scope and the helpers from JAVA_PRELUDE. It is attached on the
// SERVER (pages/api/run.ts) so clients can't swap in their own tests.

export interface JavaProblem {
  starter: string;
  tests: string; // Java statements calling t(i, expected, () -> actual)
}

const sol = (body: string, extraImports = "") =>
  `${extraImports}class Solution {\n${body}\n}\n`;

export const JAVA_PROBLEMS: Record<string, JavaProblem> = {
  "two-sum": {
    starter: sol(`    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[0];\n    }`),
    tests: `
      t(1, new int[]{0, 1}, () -> sortInts(s.twoSum(new int[]{2, 7, 11, 15}, 9)));
      t(2, new int[]{1, 2}, () -> sortInts(s.twoSum(new int[]{3, 2, 4}, 6)));
      t(3, new int[]{0, 1}, () -> sortInts(s.twoSum(new int[]{3, 3}, 6)));`,
  },
  "contains-duplicate": {
    starter: sol(`    public boolean containsDuplicate(int[] nums) {\n        // Write your code here\n        return false;\n    }`),
    tests: `
      t(1, true, () -> s.containsDuplicate(new int[]{1, 2, 3, 1}));
      t(2, false, () -> s.containsDuplicate(new int[]{1, 2, 3, 4}));
      t(3, true, () -> s.containsDuplicate(new int[]{1, 1, 1, 3, 3, 4, 3, 2, 4, 2}));
      t(4, false, () -> s.containsDuplicate(new int[]{}));`,
  },
  "valid-anagram": {
    starter: sol(`    public boolean isAnagram(String s, String t) {\n        // Write your code here\n        return false;\n    }`),
    tests: `
      t(1, true, () -> s.isAnagram("anagram", "nagaram"));
      t(2, false, () -> s.isAnagram("rat", "car"));
      t(3, false, () -> s.isAnagram("a", "ab"));`,
  },
  "group-anagrams": {
    starter: sol(
      `    public List<List<String>> groupAnagrams(String[] strs) {\n        // Write your code here\n        return new ArrayList<>();\n    }`,
      "import java.util.*;\n\n",
    ),
    tests: `
      t(1, "[[ate, eat, tea], [bat], [nat, tan]]", () -> canonStr(s.groupAnagrams(new String[]{"eat", "tea", "tan", "ate", "nat", "bat"})));
      t(2, "[[]]", () -> canonStr(s.groupAnagrams(new String[]{""})));
      t(3, "[[a]]", () -> canonStr(s.groupAnagrams(new String[]{"a"})));`,
  },
  "top-k-frequent-elements": {
    starter: sol(`    public int[] topKFrequent(int[] nums, int k) {\n        // Write your code here\n        return new int[0];\n    }`),
    tests: `
      t(1, new int[]{1, 2}, () -> sortInts(s.topKFrequent(new int[]{1, 1, 1, 2, 2, 3}, 2)));
      t(2, new int[]{1}, () -> sortInts(s.topKFrequent(new int[]{1}, 1)));
      t(3, new int[]{-1, 2}, () -> sortInts(s.topKFrequent(new int[]{4, 1, -1, 2, -1, 2, 3}, 2)));`,
  },
  "product-of-array-except-self": {
    starter: sol(`    public int[] productExceptSelf(int[] nums) {\n        // Write your code here\n        return new int[0];\n    }`),
    tests: `
      t(1, new int[]{24, 12, 8, 6}, () -> s.productExceptSelf(new int[]{1, 2, 3, 4}));
      t(2, new int[]{0, 0, 9, 0, 0}, () -> s.productExceptSelf(new int[]{-1, 1, 0, -3, 3}));`,
  },
  "longest-consecutive-sequence": {
    starter: sol(`    public int longestConsecutive(int[] nums) {\n        // Write your code here\n        return 0;\n    }`),
    tests: `
      t(1, 4, () -> s.longestConsecutive(new int[]{100, 4, 200, 1, 3, 2}));
      t(2, 9, () -> s.longestConsecutive(new int[]{0, 3, 7, 2, 5, 8, 4, 6, 0, 1}));
      t(3, 0, () -> s.longestConsecutive(new int[]{}));`,
  },
  "valid-palindrome": {
    starter: sol(`    public boolean isPalindrome(String s) {\n        // Write your code here\n        return false;\n    }`),
    tests: `
      t(1, true, () -> s.isPalindrome("A man, a plan, a canal: Panama"));
      t(2, false, () -> s.isPalindrome("race a car"));
      t(3, true, () -> s.isPalindrome(" "));
      t(4, false, () -> s.isPalindrome("0P"));`,
  },
  "two-sum-two-input-array-is-sorted": {
    starter: sol(`    public int[] twoSum(int[] numbers, int target) {\n        // Return 1-indexed positions\n        return new int[0];\n    }`),
    tests: `
      t(1, new int[]{1, 2}, () -> s.twoSum(new int[]{2, 7, 11, 15}, 9));
      t(2, new int[]{1, 3}, () -> s.twoSum(new int[]{2, 3, 4}, 6));
      t(3, new int[]{1, 2}, () -> s.twoSum(new int[]{-1, 0}, -1));`,
  },
  "3sum": {
    starter: sol(
      `    public List<List<Integer>> threeSum(int[] nums) {\n        // Write your code here\n        return new ArrayList<>();\n    }`,
      "import java.util.*;\n\n",
    ),
    tests: `
      t(1, "[[-1, -1, 2], [-1, 0, 1]]", () -> canonInt(s.threeSum(new int[]{-1, 0, 1, 2, -1, -4})));
      t(2, "[]", () -> canonInt(s.threeSum(new int[]{0, 1, 1})));
      t(3, "[[0, 0, 0]]", () -> canonInt(s.threeSum(new int[]{0, 0, 0, 0})));`,
  },
  "container-with-most-water": {
    starter: sol(`    public int maxArea(int[] height) {\n        // Write your code here\n        return 0;\n    }`),
    tests: `
      t(1, 49, () -> s.maxArea(new int[]{1, 8, 6, 2, 5, 4, 8, 3, 7}));
      t(2, 1, () -> s.maxArea(new int[]{1, 1}));`,
  },
  "trapping-rain-water": {
    starter: sol(`    public int trap(int[] height) {\n        // Write your code here\n        return 0;\n    }`),
    tests: `
      t(1, 6, () -> s.trap(new int[]{0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1}));
      t(2, 9, () -> s.trap(new int[]{4, 2, 0, 3, 2, 5}));
      t(3, 0, () -> s.trap(new int[]{}));`,
  },
  "valid-parentheses": {
    starter: sol(`    public boolean isValid(String s) {\n        // Write your code here\n        return false;\n    }`),
    tests: `
      t(1, true, () -> s.isValid("()"));
      t(2, true, () -> s.isValid("()[]{}"));
      t(3, false, () -> s.isValid("(]"));
      t(4, false, () -> s.isValid("([)]"));
      t(5, true, () -> s.isValid("{[]}"));
      t(6, false, () -> s.isValid("(("));`,
  },
  "jump-game": {
    starter: sol(`    public boolean canJump(int[] nums) {\n        // Write your code here\n        return false;\n    }`),
    tests: `
      t(1, true, () -> s.canJump(new int[]{2, 3, 1, 1, 4}));
      t(2, false, () -> s.canJump(new int[]{3, 2, 1, 0, 4}));
      t(3, true, () -> s.canJump(new int[]{0}));`,
  },
  "kadane's algorithm": {
    starter: sol(`    public int maxSubArray(int[] nums) {\n        // Write your code here\n        return 0;\n    }`),
    tests: `
      t(1, 6, () -> s.maxSubArray(new int[]{-2, 1, -3, 4, -1, 2, 1, -5, 4}));
      t(2, 1, () -> s.maxSubArray(new int[]{1}));
      t(3, -1, () -> s.maxSubArray(new int[]{-3, -1, -2}));`,
  },
  "stock-buy-and-sell": {
    starter: sol(`    public int maxProfit(int[] prices) {\n        // Write your code here\n        return 0;\n    }`),
    tests: `
      t(1, 5, () -> s.maxProfit(new int[]{7, 1, 5, 3, 6, 4}));
      t(2, 0, () -> s.maxProfit(new int[]{7, 6, 4, 3, 1}));`,
  },
  "search-a-2d-matrix": {
    starter: sol(`    public boolean searchMatrix(int[][] matrix, int target) {\n        // Write your code here\n        return false;\n    }`),
    tests: `
      int[][] m = {{1, 3, 5, 7}, {10, 11, 16, 20}, {23, 30, 34, 60}};
      t(1, true, () -> s.searchMatrix(m, 3));
      t(2, false, () -> s.searchMatrix(m, 13));
      t(3, true, () -> s.searchMatrix(m, 60));`,
  },
  "pascal's-triangle": {
    starter: sol(
      `    public List<List<Integer>> generate(int numRows) {\n        // Write your code here\n        return new ArrayList<>();\n    }`,
      "import java.util.*;\n\n",
    ),
    tests: `
      t(1, "[[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]", () -> String.valueOf(s.generate(5)));
      t(2, "[[1]]", () -> String.valueOf(s.generate(1)));`,
  },
  "spiral-on-a-matrix": {
    starter: sol(
      `    public List<Integer> spiralOrder(int[][] matrix) {\n        // Write your code here\n        return new ArrayList<>();\n    }`,
      "import java.util.*;\n\n",
    ),
    tests: `
      t(1, "[1, 2, 3, 6, 9, 8, 7, 4, 5]", () -> String.valueOf(s.spiralOrder(new int[][]{{1, 2, 3}, {4, 5, 6}, {7, 8, 9}})));
      t(2, "[1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]", () -> String.valueOf(s.spiralOrder(new int[][]{{1, 2, 3, 4}, {5, 6, 7, 8}, {9, 10, 11, 12}})));`,
  },
  "set-matrix-zeroes": {
    starter: sol(`    public void setZeroes(int[][] matrix) {\n        // Modify matrix in place\n    }`),
    tests: `
      t(1, new int[][]{{1, 0, 1}, {0, 0, 0}, {1, 0, 1}}, () -> { int[][] a = {{1, 1, 1}, {1, 0, 1}, {1, 1, 1}}; s.setZeroes(a); return a; });
      t(2, new int[][]{{0, 0, 0, 0}, {0, 4, 5, 0}, {0, 3, 1, 0}}, () -> { int[][] a = {{0, 1, 2, 0}, {3, 4, 5, 2}, {1, 3, 1, 5}}; s.setZeroes(a); return a; });`,
  },
  "reverse-linked-list": {
    starter: `/**
 * Definition for singly-linked list (provided):
 * class ListNode { int val; ListNode next; ListNode(int val) { this.val = val; } }
 */
class Solution {
    public ListNode reverseList(ListNode head) {
        // Write your code here
        return head;
    }
}
`,
    tests: `
      t(1, new int[]{5, 4, 3, 2, 1}, () -> toArr(s.reverseList(list(1, 2, 3, 4, 5))));
      t(2, new int[]{2, 1}, () -> toArr(s.reverseList(list(1, 2))));
      t(3, new int[]{}, () -> toArr(s.reverseList(null)));`,
  },
};

/** Helpers + ListNode available to every harness. Java 13 compatible. */
export const JAVA_PRELUDE = `
class ListNode { int val; ListNode next; ListNode(int val) { this.val = val; } }

public class Main {
  private static int passed = 0, total = 0;
  interface Run { Object get() throws Exception; }

  static String show(Object o) {
    if (o == null) return "null";
    if (o.getClass().isArray()) return java.util.Arrays.deepToString(new Object[]{o}).replaceAll("^\\\\[|\\\\]$", "");
    return String.valueOf(o);
  }

  static void t(int i, Object expected, Run run) {
    total++;
    try {
      Object got = run.get();
      if (java.util.Objects.deepEquals(expected, got)) { passed++; System.out.println("PASS " + i); }
      else System.out.println("FAIL " + i + " expected=" + show(expected) + " got=" + show(got));
    } catch (Throwable e) {
      System.out.println("ERROR " + i + " " + e);
    }
  }

  static int[] sortInts(int[] a) { if (a == null) return null; int[] c = a.clone(); java.util.Arrays.sort(c); return c; }

  static String canonInt(java.util.List<java.util.List<Integer>> ll) {
    java.util.List<java.util.List<Integer>> c = new java.util.ArrayList<>();
    for (java.util.List<Integer> l : ll) { java.util.List<Integer> x = new java.util.ArrayList<>(l); java.util.Collections.sort(x); c.add(x); }
    c.sort((a, b) -> a.toString().compareTo(b.toString()));
    return c.toString();
  }

  static String canonStr(java.util.List<java.util.List<String>> ll) {
    java.util.List<java.util.List<String>> c = new java.util.ArrayList<>();
    for (java.util.List<String> l : ll) { java.util.List<String> x = new java.util.ArrayList<>(l); java.util.Collections.sort(x); c.add(x); }
    c.sort((a, b) -> a.toString().compareTo(b.toString()));
    return c.toString();
  }

  static ListNode list(int... v) { ListNode d = new ListNode(0), c = d; for (int x : v) { c.next = new ListNode(x); c = c.next; } return d.next; }
  static int[] toArr(ListNode h) { java.util.List<Integer> l = new java.util.ArrayList<>(); int guard = 0; while (h != null && guard++ < 100000) { l.add(h.val); h = h.next; } return l.stream().mapToInt(Integer::intValue).toArray(); }

  public static void main(String[] args) {
    final String nonce = "/*__NONCE__*/";
    Solution s = new Solution();
    /*__TESTS__*/
    System.out.flush();
    System.out.println();
    System.out.println("DONE " + nonce + " " + passed + "/" + total);
  }
}
`;
