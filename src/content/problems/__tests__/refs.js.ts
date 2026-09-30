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
};
