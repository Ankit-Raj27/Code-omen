// Reference solutions used only by tests, to prove each spec's test data is right.
// Kept as source strings and evaluated exactly the way the editor runs user code.

export const JS_REFS: Record<string, string> = {
  "longest-substring-without-repeating-characters": `function lengthOfLongestSubstring(s) {
    const last = new Map(); let l = 0, best = 0;
    for (let r = 0; r < s.length; r++) {
      if (last.has(s[r]) && last.get(s[r]) >= l) l = last.get(s[r]) + 1;
      last.set(s[r], r); best = Math.max(best, r - l + 1);
    }
    return best;
  }`,
  "longest-repeating-character-replacement": `function characterReplacement(s, k) {
    const cnt = new Array(26).fill(0); let l = 0, maxf = 0, best = 0;
    for (let r = 0; r < s.length; r++) {
      maxf = Math.max(maxf, ++cnt[s.charCodeAt(r) - 65]);
      while (r - l + 1 - maxf > k) cnt[s.charCodeAt(l++) - 65]--;
      best = Math.max(best, r - l + 1);
    }
    return best;
  }`,
  "permutation-in-string": `function checkInclusion(s1, s2) {
    if (s1.length > s2.length) return false;
    const a = new Array(26).fill(0), b = new Array(26).fill(0);
    for (let i = 0; i < s1.length; i++) { a[s1.charCodeAt(i) - 97]++; b[s2.charCodeAt(i) - 97]++; }
    const eq = () => a.every((x, i) => x === b[i]);
    if (eq()) return true;
    for (let i = s1.length; i < s2.length; i++) {
      b[s2.charCodeAt(i) - 97]++; b[s2.charCodeAt(i - s1.length) - 97]--;
      if (eq()) return true;
    }
    return false;
  }`,
  "minimum-window-substring": `function minWindow(s, t) {
    const need = new Map(); for (const ch of t) need.set(ch, (need.get(ch) || 0) + 1);
    let missing = t.length, l = 0, best = [0, Infinity];
    for (let r = 0; r < s.length; r++) {
      if ((need.get(s[r]) || 0) > 0) missing--;
      need.set(s[r], (need.get(s[r]) || 0) - 1);
      while (missing === 0) {
        if (r - l < best[1] - best[0]) best = [l, r];
        need.set(s[l], need.get(s[l]) + 1);
        if (need.get(s[l]) > 0) missing++;
        l++;
      }
    }
    return best[1] === Infinity ? "" : s.slice(best[0], best[1] + 1);
  }`,
  "min-stack": `class MinStack {
    constructor() { this.s = []; }
    push(val) { const m = this.s.length ? Math.min(val, this.s[this.s.length - 1][1]) : val; this.s.push([val, m]); }
    pop() { this.s.pop(); }
    top() { return this.s[this.s.length - 1][0]; }
    getMin() { return this.s[this.s.length - 1][1]; }
  }`,
  "evaluate-reverse-polish-notation": `function evalRPN(tokens) {
    const st = [];
    for (const t of tokens) {
      if ("+-*/".includes(t) && t.length === 1) {
        const b = st.pop(), a = st.pop();
        st.push(t === "+" ? a + b : t === "-" ? a - b : t === "*" ? a * b : Math.trunc(a / b));
      } else st.push(Number(t));
    }
    return st[0] + 0;
  }`,
  "daily-temperatures": `function dailyTemperatures(temperatures) {
    const ans = new Array(temperatures.length).fill(0), st = [];
    temperatures.forEach((t, i) => {
      while (st.length && temperatures[st[st.length - 1]] < t) { const j = st.pop(); ans[j] = i - j; }
      st.push(i);
    });
    return ans;
  }`,
  "car-fleet": `function carFleet(target, position, speed) {
    const cars = position.map((p, i) => [p, (target - p) / speed[i]]).sort((a, b) => b[0] - a[0]);
    let fleets = 0, slowest = 0;
    for (const [, t] of cars) if (t > slowest) { fleets++; slowest = t; }
    return fleets;
  }`,
  "largest-rectangle-in-histogram": `function largestRectangleArea(heights) {
    const st = []; let best = 0;
    for (let i = 0; i <= heights.length; i++) {
      const h = i === heights.length ? 0 : heights[i];
      while (st.length && heights[st[st.length - 1]] >= h) {
        const height = heights[st.pop()];
        const left = st.length ? st[st.length - 1] : -1;
        best = Math.max(best, height * (i - left - 1));
      }
      st.push(i);
    }
    return best;
  }`,
  "binary-search": `function search(nums, target) {
    let lo = 0, hi = nums.length - 1;
    while (lo <= hi) { const m = lo + ((hi - lo) >> 1); if (nums[m] === target) return m; if (nums[m] < target) lo = m + 1; else hi = m - 1; }
    return -1;
  }`,
  "koko-eating-bananas": `function minEatingSpeed(piles, h) {
    let lo = 1, hi = Math.max(...piles);
    while (lo < hi) {
      const m = Math.floor((lo + hi) / 2);
      const hours = piles.reduce((s, p) => s + Math.ceil(p / m), 0);
      if (hours <= h) hi = m; else lo = m + 1;
    }
    return lo;
  }`,
  "find-minimum-in-rotated-sorted-array": `function findMin(nums) {
    let lo = 0, hi = nums.length - 1;
    while (lo < hi) { const m = (lo + hi) >> 1; if (nums[m] > nums[hi]) lo = m + 1; else hi = m; }
    return nums[lo];
  }`,
  "search-in-rotated-sorted-array": `function search(nums, target) {
    let lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
      const m = (lo + hi) >> 1;
      if (nums[m] === target) return m;
      if (nums[lo] <= nums[m]) { if (nums[lo] <= target && target < nums[m]) hi = m - 1; else lo = m + 1; }
      else { if (nums[m] < target && target <= nums[hi]) lo = m + 1; else hi = m - 1; }
    }
    return -1;
  }`,
  "time-based-key-value-store": `class TimeMap {
    constructor() { this.m = new Map(); }
    set(key, value, timestamp) { if (!this.m.has(key)) this.m.set(key, []); this.m.get(key).push([timestamp, value]); }
    get(key, timestamp) {
      const a = this.m.get(key) || []; let lo = 0, hi = a.length - 1, ans = "";
      while (lo <= hi) { const m = (lo + hi) >> 1; if (a[m][0] <= timestamp) { ans = a[m][1]; lo = m + 1; } else hi = m - 1; }
      return ans;
    }
  }`,
  "squares-of-a-sorted-array": `function sortedSquares(nums) {
    const out = new Array(nums.length); let l = 0, r = nums.length - 1;
    for (let i = nums.length - 1; i >= 0; i--) {
      if (Math.abs(nums[l]) > Math.abs(nums[r])) out[i] = nums[l] * nums[l++]; else out[i] = nums[r] * nums[r--];
    }
    return out;
  }`,
  "boats-to-save-people": `function numRescueBoats(people, limit) {
    people.sort((a, b) => a - b); let l = 0, r = people.length - 1, boats = 0;
    while (l <= r) { if (people[l] + people[r] <= limit) l++; r--; boats++; }
    return boats;
  }`,
  "3sum-closest": `function threeSumClosest(nums, target) {
    nums.sort((a, b) => a - b); let best = nums[0] + nums[1] + nums[2];
    for (let i = 0; i < nums.length - 2; i++) {
      let l = i + 1, r = nums.length - 1;
      while (l < r) {
        const s = nums[i] + nums[l] + nums[r];
        if (Math.abs(s - target) < Math.abs(best - target)) best = s;
        if (s < target) l++; else if (s > target) r--; else return s;
      }
    }
    return best;
  }`,
  "sliding-window-maximum": `function maxSlidingWindow(nums, k) {
    const dq = [], out = [];
    for (let i = 0; i < nums.length; i++) {
      while (dq.length && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();
      dq.push(i);
      if (dq[0] <= i - k) dq.shift();
      if (i >= k - 1) out.push(nums[dq[0]]);
    }
    return out;
  }`,
  "minimum-size-subarray-sum": `function minSubArrayLen(target, nums) {
    let l = 0, sum = 0, best = Infinity;
    for (let r = 0; r < nums.length; r++) { sum += nums[r]; while (sum >= target) { best = Math.min(best, r - l + 1); sum -= nums[l++]; } }
    return best === Infinity ? 0 : best;
  }`,
  "max-consecutive-ones-iii": `function longestOnes(nums, k) {
    let l = 0, zeros = 0, best = 0;
    for (let r = 0; r < nums.length; r++) { if (nums[r] === 0) zeros++; while (zeros > k) if (nums[l++] === 0) zeros--; best = Math.max(best, r - l + 1); }
    return best;
  }`,
  "generate-parentheses": `function generateParenthesis(n) {
    const out = [];
    const go = (s, open, close) => { if (s.length === 2 * n) { out.push(s); return; } if (open < n) go(s + "(", open + 1, close); if (close < open) go(s + ")", open, close + 1); };
    go("", 0, 0);
    return out;
  }`,
  "next-greater-element-i": `function nextGreaterElement(nums1, nums2) {
    const next = new Map(), st = [];
    for (const x of nums2) { while (st.length && st[st.length - 1] < x) next.set(st.pop(), x); st.push(x); }
    return nums1.map((x) => next.get(x) ?? -1);
  }`,
  "remove-k-digits": `function removeKdigits(num, k) {
    const st = [];
    for (const d of num) { while (k > 0 && st.length && st[st.length - 1] > d) { st.pop(); k--; } st.push(d); }
    while (k-- > 0) st.pop();
    const s = st.join("").replace(/^0+/, "");
    return s === "" ? "0" : s;
  }`,
  "search-insert-position": `function searchInsert(nums, target) {
    let lo = 0, hi = nums.length;
    while (lo < hi) { const m = (lo + hi) >> 1; if (nums[m] < target) lo = m + 1; else hi = m; }
    return lo;
  }`,
  "find-first-and-last-position-of-element-in-sorted-array": `function searchRange(nums, target) {
    const lb = (x) => { let lo = 0, hi = nums.length; while (lo < hi) { const m = (lo + hi) >> 1; if (nums[m] < x) lo = m + 1; else hi = m; } return lo; };
    const a = lb(target), b = lb(target + 1) - 1;
    return a <= b && nums[a] === target ? [a, b] : [-1, -1];
  }`,
  "capacity-to-ship-packages-within-d-days": `function shipWithinDays(weights, days) {
    let lo = Math.max(...weights), hi = weights.reduce((a, b) => a + b, 0);
    const ok = (cap) => { let d = 1, load = 0; for (const w of weights) { if (load + w > cap) { d++; load = 0; } load += w; } return d <= days; };
    while (lo < hi) { const m = (lo + hi) >> 1; if (ok(m)) hi = m; else lo = m + 1; }
    return lo;
  }`,
  // ---------------------------------------------------------------- batch B
  "merge-two-sorted-lists": `function mergeTwoLists(list1, list2) {
    const d = new ListNode(); let t = d;
    while (list1 && list2) { if (list1.val <= list2.val) { t.next = list1; list1 = list1.next; } else { t.next = list2; list2 = list2.next; } t = t.next; }
    t.next = list1 || list2; return d.next;
  }`,
  "linked-list-cycle": `function hasCycle(head) {
    let s = head, f = head;
    while (f && f.next) { s = s.next; f = f.next.next; if (s === f) return true; }
    return false;
  }`,
  "reorder-list": `function reorderList(head) {
    let s = head, f = head;
    while (f.next && f.next.next) { s = s.next; f = f.next.next; }
    let prev = null, cur = s.next; s.next = null;
    while (cur) { const n = cur.next; cur.next = prev; prev = cur; cur = n; }
    let a = head, b = prev;
    while (b) { const an = a.next, bn = b.next; a.next = b; b.next = an; a = an; b = bn; }
  }`,
  "remove-nth-node-from-end-of-list": `function removeNthFromEnd(head, n) {
    const d = new ListNode(0, head); let lead = d, trail = d;
    for (let i = 0; i < n; i++) lead = lead.next;
    while (lead.next) { lead = lead.next; trail = trail.next; }
    trail.next = trail.next.next; return d.next;
  }`,
  "lru-cache": `class LRUCache {
    constructor(capacity) { this.cap = capacity; this.m = new Map(); }
    get(key) { if (!this.m.has(key)) return -1; const v = this.m.get(key); this.m.delete(key); this.m.set(key, v); return v; }
    put(key, value) { this.m.delete(key); this.m.set(key, value); if (this.m.size > this.cap) this.m.delete(this.m.keys().next().value); }
  }`,
  "palindrome-linked-list": `function isPalindrome(head) {
    const v = []; for (let n = head; n; n = n.next) v.push(n.val);
    for (let i = 0, j = v.length - 1; i < j; i++, j--) if (v[i] !== v[j]) return false;
    return true;
  }`,
  "add-two-numbers": `function addTwoNumbers(l1, l2) {
    const d = new ListNode(); let t = d, carry = 0;
    while (l1 || l2 || carry) { const s = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry; carry = s >= 10 ? 1 : 0; t = t.next = new ListNode(s % 10); l1 = l1 && l1.next; l2 = l2 && l2.next; }
    return d.next;
  }`,
  "merge-k-sorted-lists": `function mergeKLists(lists) {
    const vals = []; for (let l of lists) for (; l; l = l.next) vals.push(l.val);
    vals.sort((a, b) => a - b); const d = new ListNode(); let t = d;
    for (const v of vals) t = t.next = new ListNode(v);
    return d.next;
  }`,
  "invert-binary-tree": `function invertTree(root) {
    if (!root) return null; const l = invertTree(root.left); root.left = invertTree(root.right); root.right = l; return root;
  }`,
  "maximum-depth-of-binary-tree": `function maxDepth(root) { return root ? 1 + Math.max(maxDepth(root.left), maxDepth(root.right)) : 0; }`,
  "diameter-of-binary-tree": `function diameterOfBinaryTree(root) {
    let best = 0; const h = (n) => { if (!n) return 0; const l = h(n.left), r = h(n.right); best = Math.max(best, l + r); return 1 + Math.max(l, r); };
    h(root); return best;
  }`,
  "binary-tree-level-order-traversal": `function levelOrder(root) {
    const out = []; let q = root ? [root] : [];
    while (q.length) { out.push(q.map((n) => n.val)); q = q.flatMap((n) => [n.left, n.right].filter(Boolean)); }
    return out;
  }`,
  "binary-tree-right-side-view": `function rightSideView(root) {
    const out = []; let q = root ? [root] : [];
    while (q.length) { out.push(q[q.length - 1].val); q = q.flatMap((n) => [n.left, n.right].filter(Boolean)); }
    return out;
  }`,
  "binary-tree-maximum-path-sum": `function maxPathSum(root) {
    let best = -Infinity; const g = (n) => { if (!n) return 0; const l = Math.max(0, g(n.left)), r = Math.max(0, g(n.right)); best = Math.max(best, n.val + l + r); return n.val + Math.max(l, r); };
    g(root); return best;
  }`,
  "same-tree": `function isSameTree(p, q) {
    if (!p || !q) return p === q; return p.val === q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
  }`,
  "balanced-binary-tree": `function isBalanced(root) {
    const h = (n) => { if (!n) return 0; const l = h(n.left), r = h(n.right); if (l < 0 || r < 0 || Math.abs(l - r) > 1) return -1; return 1 + Math.max(l, r); };
    return h(root) >= 0;
  }`,
  "construct-binary-tree-from-preorder-and-inorder-traversal": `function buildTree(preorder, inorder) {
    const at = new Map(inorder.map((v, i) => [v, i])); let k = 0;
    const go = (lo, hi) => { if (lo > hi) return null; const v = preorder[k++], m = at.get(v); const n = new TreeNode(v); n.left = go(lo, m - 1); n.right = go(m + 1, hi); return n; };
    return go(0, inorder.length - 1);
  }`,
  "validate-binary-search-tree": `function isValidBST(root) {
    const ok = (n, lo, hi) => !n || (n.val > lo && n.val < hi && ok(n.left, lo, n.val) && ok(n.right, n.val, hi));
    return ok(root, -Infinity, Infinity);
  }`,
  "kth-smallest-element-in-a-bst": `function kthSmallest(root, k) {
    const st = []; let c = root;
    while (true) { while (c) { st.push(c); c = c.left; } c = st.pop(); if (--k === 0) return c.val; c = c.right; }
  }`,
  "lowest-common-ancestor-of-a-binary-search-tree": `function lowestCommonAncestor(root, p, q) {
    let n = root;
    while (n) { if (p.val < n.val && q.val < n.val) n = n.left; else if (p.val > n.val && q.val > n.val) n = n.right; else return n; }
    return null;
  }`,
  "search-in-a-binary-search-tree": `function searchBST(root, val) {
    while (root && root.val !== val) root = val < root.val ? root.left : root.right; return root;
  }`,
  "insert-into-a-binary-search-tree": `function insertIntoBST(root, val) {
    if (!root) return new TreeNode(val);
    if (val < root.val) root.left = insertIntoBST(root.left, val); else root.right = insertIntoBST(root.right, val);
    return root;
  }`,
  "longest-common-prefix": `function longestCommonPrefix(strs) {
    let pre = strs[0]; for (const s of strs) while (!s.startsWith(pre)) pre = pre.slice(0, -1); return pre;
  }`,
  "kth-largest-element-in-a-stream": `class KthLargest {
    constructor(k, nums) { this.k = k; this.a = [...nums].sort((x, y) => x - y); }
    add(val) { let i = this.a.findIndex((x) => x >= val); if (i < 0) i = this.a.length; this.a.splice(i, 0, val); return this.a[this.a.length - this.k]; }
  }`,
  "last-stone-weight": `function lastStoneWeight(stones) {
    const a = [...stones];
    while (a.length > 1) { a.sort((x, y) => x - y); const y = a.pop(), x = a.pop(); if (y !== x) a.push(y - x); }
    return a.length ? a[0] : 0;
  }`,
  "k-closest-points-to-origin": `function kClosest(points, k) {
    return [...points].sort((a, b) => a[0] * a[0] + a[1] * a[1] - b[0] * b[0] - b[1] * b[1]).slice(0, k);
  }`,
  "kth-largest-element-in-an-array": `function findKthLargest(nums, k) { return [...nums].sort((a, b) => b - a)[k - 1]; }`,
  "task-scheduler": `function leastInterval(tasks, n) {
    const c = {}; for (const t of tasks) c[t] = (c[t] || 0) + 1;
    const f = Object.values(c), mx = Math.max(...f), ties = f.filter((x) => x === mx).length;
    return Math.max(tasks.length, (mx - 1) * (n + 1) + ties);
  }`,
  "find-median-from-data-stream": `class MedianFinder {
    constructor() { this.a = []; }
    addNum(num) { let i = this.a.findIndex((x) => x >= num); if (i < 0) i = this.a.length; this.a.splice(i, 0, num); }
    findMedian() { const a = this.a, m = a.length >> 1; return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2; }
  }`,
  "top-k-frequent-words": `function topKFrequent(words, k) {
    const c = new Map(); for (const w of words) c.set(w, (c.get(w) || 0) + 1);
    return [...c.keys()].sort((a, b) => c.get(b) - c.get(a) || (a < b ? -1 : 1)).slice(0, k);
  }`,
  "furthest-building-you-can-reach": `function furthestBuilding(heights, bricks, ladders) {
    const climbs = [];
    for (let i = 0; i < heights.length - 1; i++) {
      const d = heights[i + 1] - heights[i]; if (d <= 0) continue;
      climbs.push(d); climbs.sort((a, b) => a - b);
      if (climbs.length > ladders) { bricks -= climbs.shift(); if (bricks < 0) return i; }
    }
    return heights.length - 1;
  }`,
  "ipo": `function findMaximizedCapital(k, w, profits, capital) {
    const done = new Array(profits.length).fill(false);
    for (let r = 0; r < k; r++) {
      let best = -1; for (let i = 0; i < profits.length; i++) if (!done[i] && capital[i] <= w && (best < 0 || profits[i] > profits[best])) best = i;
      if (best < 0) break; done[best] = true; w += profits[best];
    }
    return w;
  }`,
  "merge-intervals": `function merge(intervals) {
    const a = [...intervals].sort((x, y) => x[0] - y[0]), out = [];
    for (const [s, e] of a) { if (out.length && s <= out[out.length - 1][1]) out[out.length - 1][1] = Math.max(out[out.length - 1][1], e); else out.push([s, e]); }
    return out;
  }`,
  "insert-interval": `function insert(intervals, newInterval) {
    const out = []; let [s, e] = newInterval, i = 0;
    while (i < intervals.length && intervals[i][1] < s) out.push(intervals[i++]);
    while (i < intervals.length && intervals[i][0] <= e) { s = Math.min(s, intervals[i][0]); e = Math.max(e, intervals[i][1]); i++; }
    out.push([s, e]); while (i < intervals.length) out.push(intervals[i++]);
    return out;
  }`,
  "non-overlapping-intervals": `function eraseOverlapIntervals(intervals) {
    const a = [...intervals].sort((x, y) => x[1] - y[1]); let end = -Infinity, removed = 0;
    for (const [s, e] of a) { if (s < end) removed++; else end = e; }
    return removed;
  }`,
  "gas-station": `function canCompleteCircuit(gas, cost) {
    let total = 0, tank = 0, start = 0;
    for (let i = 0; i < gas.length; i++) { total += gas[i] - cost[i]; tank += gas[i] - cost[i]; if (tank < 0) { start = i + 1; tank = 0; } }
    return total < 0 ? -1 : start;
  }`,
  "jump-game-ii": `function jump(nums) {
    let jumps = 0, end = 0, far = 0;
    for (let i = 0; i < nums.length - 1; i++) { far = Math.max(far, i + nums[i]); if (i === end) { jumps++; end = far; } }
    return jumps;
  }`,
  "meeting-rooms": `function canAttendMeetings(intervals) {
    const a = [...intervals].sort((x, y) => x[0] - y[0]);
    for (let i = 1; i < a.length; i++) if (a[i][0] < a[i - 1][1]) return false;
    return true;
  }`,
  "meeting-rooms-ii": `function minMeetingRooms(intervals) {
    const s = intervals.map((x) => x[0]).sort((a, b) => a - b), e = intervals.map((x) => x[1]).sort((a, b) => a - b);
    let rooms = 0, best = 0, j = 0;
    for (let i = 0; i < s.length; i++) { while (e[j] <= s[i]) { j++; rooms--; } rooms++; best = Math.max(best, rooms); }
    return best;
  }`,
};
