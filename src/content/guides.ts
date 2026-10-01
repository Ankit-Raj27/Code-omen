// Per-problem guidance for the problem page's Pattern tab: how to think about THIS
// question, and a 3-step hint ladder written for it (not for its pattern).
// Keyed by bank key (= LeetCode slug). Reviewed in PRs like the rest of src/content.

export interface ProblemGuide {
  /** Ways to think about and approach the problem: what's asked, brute force, the unlock, the pitfall. */
  approach: string[];
  /** Escalating hints: a nudge, the direction, then the key idea. */
  hints: [string, string, string];
}

export const GUIDES: Record<string, ProblemGuide> = {
// arrays-hashing
  "contains-duplicate": {
    approach: [
      "You only need a yes or no: does any value in nums appear at least twice? You don't need to know which value or where.",
      "Comparing every pair is O(n^2), which times out on large arrays. Sorting first and checking neighbours works in O(n log n) but reorders or copies the input.",
      "Membership checks are the real operation. If you remember every value seen so far in a hash set, each new value is a constant-time lookup, giving O(n) time and O(n) space.",
      "You can return true the moment a repeat appears; there is no need to finish the scan.",
    ],
    hints: [
      "In [7,3,9,3], at what moment do you know the answer is true? What would you need to have remembered to recognise it then?",
      "Keep a hash set of the values you've already passed while walking nums once.",
      "For each value, if the set already contains it return true; otherwise add it. If the loop ends, every value was unique, so return false.",
    ],
  },
  "valid-anagram": {
    approach: [
      "You're checking that s and t contain the same multiset of letters: each of the 26 lowercase letters occurs the same number of times in both.",
      "Sorting both strings and comparing works but costs O(n log n). Removing each letter of t from s one by one is O(n^2).",
      "Because the alphabet is fixed at 26 letters, a count array replaces the sort. Add for letters of s, subtract for letters of t; all zeros at the end means anagram. That is O(n) time, O(1) space.",
      "Check lengths first: \"hello\" and \"hallo\" have equal length but different counts, while different lengths can fail immediately.",
    ],
    hints: [
      "Does the order of letters matter at all? What single summary of a string would be identical for \"stone\" and \"notes\"?",
      "Count letters. Since inputs are lowercase only, a fixed array of 26 integers is enough; no map needed.",
      "If lengths differ return false. Otherwise increment count[s[i]-'a'] and decrement count[t[i]-'a'] in one loop, then confirm every slot is zero.",
    ],
  },
  "two-sum": {
    approach: [
      "You need the indices of two different positions in nums whose values sum to target. Exactly one such pair exists.",
      "Trying every pair i < j is O(n^2). Sorting and using two pointers loses the original indices unless you carry them along, which is clumsy.",
      "Once you fix x = nums[i], the partner is fully determined: target - x. So the question becomes \"have I already seen target - x?\", which a value-to-index map answers in O(1), giving O(n) overall.",
      "Look up the complement before inserting the current value, so [5,5,2] with target 10 pairs the two 5s without reusing one index.",
    ],
    hints: [
      "For nums[i] = 1 and target = 7, what exact value must the other number be? Is there any choice involved?",
      "Use a hash map from value to index for the elements you've already walked past.",
      "At index i compute need = target - nums[i]. If need is in the map, return [map[need], i]; otherwise store nums[i] -> i and continue.",
    ],
  },
  "group-anagrams": {
    approach: [
      "Words that are rearrangements of each other must land in the same group; you return the groups in any order.",
      "Comparing every word with every other word (each comparison an anagram check) is O(n^2 * k) and needs extra bookkeeping to avoid regrouping.",
      "Anagrams share a canonical form. If you compute a key that is identical for \"pots\", \"stop\" and \"tops\", a hash map from key to list does the grouping in one pass.",
      "Sorted letters give an O(k log k) key; a 26-count signature gives O(k). If you join counts into a string, use a separator so counts like 1,11 and 11,1 can't collide.",
    ],
    hints: [
      "What could you compute from \"stop\" that would come out exactly the same for \"pots\" and \"tops\" but differently for \"dog\"?",
      "Use a hash map whose key is that canonical form and whose value is the list of words sharing it.",
      "For each word build its key (sorted characters, or the 26 letter counts encoded as a string), append the word to map[key], and return all the map's values.",
    ],
  },
  "product-of-array-except-self": {
    approach: [
      "For each index i you need the product of all of nums except nums[i], without using division, in O(n).",
      "Recomputing the product for every i is O(n^2). Dividing the total by nums[i] is banned, and breaks on zeros anyway, as [1,-2,0,5] shows.",
      "Everything except i splits into the part left of i and the part right of i. Both are running products, so one forward and one backward pass build them in O(n).",
      "You can store the left products directly in answer and multiply in the right product with a single variable, giving O(1) extra space.",
    ],
    hints: [
      "For answer[1] in [2,3,4], which elements are multiplied? Split them by whether they sit before or after index 1.",
      "Compute prefix products from the left and suffix products from the right; each answer combines one of each.",
      "Pass 1: answer[i] = product of nums[0..i-1], starting at 1. Pass 2 from the right: keep suffix = 1, multiply answer[i] by suffix, then suffix *= nums[i].",
    ],
  },
  "longest-consecutive-sequence": {
    approach: [
      "You want the longest run of integer values x, x+1, x+2, ... that all exist somewhere in nums, regardless of position. An empty array returns 0.",
      "Sorting and scanning for runs is O(n log n), which misses the O(n) requirement. Counting up from every element is O(n^2) in the worst case.",
      "With all values in a set, lookups are O(1). A run only needs to be counted from its smallest value, which is exactly an x where x-1 is missing, so each run is walked once: O(n).",
      "Duplicates in nums must not lengthen a run; iterating the set instead of the array handles that.",
    ],
    hints: [
      "In [10,5,12,3,4,11,6], why does counting upward from 4 or 5 waste work? Which element is the natural place to start the run 3,4,5,6?",
      "Load nums into a hash set, then only launch a count from values that begin a run.",
      "For each x in the set, if x-1 is absent, walk x+1, x+2 while present and count; track the maximum length. Each value is visited at most twice overall.",
    ],
  },
  "valid-sudoku": {
    approach: [
      "You only verify that no digit repeats in any row, any column or any of the nine 3 x 3 boxes among the filled cells. Solvability is irrelevant.",
      "Checking each of the 27 units separately with its own scan works but repeats work and is error-prone; the box indexing is where bugs usually hide.",
      "Every filled cell belongs to exactly one row, one column and one box. Visiting the 81 cells once and recording the digit in three seen-sets catches any repeat immediately.",
      "Skip '.' cells, and get the box index right: (r / 3) * 3 + c / 3 with integer division.",
    ],
    hints: [
      "A '5' at row 0, column 4 constrains which three groups of cells? Can you name each group with a number from 0 to 8?",
      "Keep 9 seen-sets (or boolean arrays) each for rows, columns and boxes, and fill them in a single pass.",
      "For each non-empty cell compute b = (r/3)*3 + c/3. If the digit is already in rows[r], cols[c] or boxes[b], return false; otherwise add it to all three.",
    ],
  },
  "encode-and-decode-strings": {
    approach: [
      "You design a format: encode turns a list of strings into one string, and decode must recover the exact list, including empty strings and strings containing any character.",
      "Joining with a separator like '#' fails as soon as a string contains '#', as \"a#b\" shows. Escaping works but makes both sides fiddly.",
      "If each piece announces its own length before its content, the decoder never has to search for a separator inside the data. It reads a number, a delimiter, then exactly that many characters.",
      "Remember the empty string: \"0#\" must decode to \"\", and multi-digit lengths like 12 must be read fully before the delimiter.",
    ],
    hints: [
      "For [\"\", \"a#b\"], why does any single separator character break? What could the decoder know in advance that removes the need to search?",
      "Store a length header before each string so decoding becomes a pointer that reads headers and slices exact spans.",
      "Encode each s as len(s) + \"#\" + s. To decode, from position i find the next '#', parse the number n before it, take the n characters after it, and set i past them.",
    ],
  },
  "set-matrix-zeroes": {
    approach: [
      "Every row and column that contained an original 0 must become all zeros, in place, and zeros you write must not spread further.",
      "Zeroing while scanning cascades and wipes too much. Copying the matrix or keeping row and column sets costs O(mn) or O(m+n) extra space.",
      "You only need one bit per row and per column. The first row and first column can hold those marks, as long as you separately remember whether they originally had a zero, giving O(1) extra space.",
      "Order matters: apply marks to the inner cells first, and zero the first row and column last, or their marks get destroyed.",
    ],
    hints: [
      "In [[5,0,7],[1,2,3]], why can't you zero column 1 the instant you see the 0? What information do you actually need to record?",
      "Record \"this row needs zeroing\" and \"this column needs zeroing\" flags, and look for space inside the matrix itself to store them.",
      "Save two booleans for whether row 0 and column 0 had zeros. Mark matrix[r][0] and matrix[0][c] for each zero, zero inner cells from those marks, then handle row 0 and column 0.",
    ],
  },
  "spiral-matrix": {
    approach: [
      "Read the m x n matrix layer by layer: top row left to right, right column down, bottom row right to left, left column up, then move inward.",
      "Simulating with a direction vector and a visited matrix works but needs O(mn) extra space and careful turn logic.",
      "Each finished edge permanently removes one row or column from consideration, so four shrinking bounds describe the remaining rectangle with no visited array.",
      "Non-square inputs like [[1,2,3],[4,5,6]] are the trap: after walking top and right, recheck that top <= bottom and left <= right before walking bottom and left, or you repeat values.",
    ],
    hints: [
      "After you read the whole top row, which part of the matrix is left? How could you describe it with just a few numbers?",
      "Maintain top, bottom, left and right bounds and shrink one after each edge you traverse.",
      "Loop while top <= bottom and left <= right: read top row then top++, right column then right--, then if still valid bottom row then bottom--, and left column then left++.",
    ],
  },
// two-pointers
  "valid-palindrome": {
    approach: [
      "Keep only letters and digits from s, lowercase them, and check whether that sequence reads the same both ways.",
      "Building a cleaned copy and comparing it to its reverse is O(n) time but O(n) extra space, and creates two new strings.",
      "A palindrome check only ever compares a character with its mirror. Two indices moving inward can skip non-alphanumeric characters on the fly, so you use O(1) extra space.",
      "Strings with nothing alphanumeric, or a single character, are palindromes. Make sure the skipping loops also respect left < right.",
    ],
    hints: [
      "In \"Was it a car or a cat I saw?\", which characters actually take part in the comparison, and which pairs of them must match?",
      "Use one index at each end and move them toward each other, ignoring characters that don't count.",
      "While left < right: advance left past non-alphanumerics, retreat right likewise, compare lowercase forms; mismatch returns false, otherwise move both inward. Finishing returns true.",
    ],
  },
  "two-sum-ii-input-array-is-sorted": {
    approach: [
      "Find two different entries in sorted numbers that sum to target, returning 1-based positions with the smaller first, using constant extra space.",
      "Checking every pair is O(n^2). A hash map gives O(n) time but violates the constant-space rule, and binary searching per element is O(n log n).",
      "Because numbers is sorted, the pair (left end, right end) tells you which way to move: a sum too small can only grow by moving left right, too large only shrinks by moving right left. That is O(n), O(1) space.",
      "Remember to add 1 to both indices when returning.",
    ],
    hints: [
      "In [1,3,4,8] with target 11, 1 + 8 = 9 is too small. Can 1 ever be part of the answer now? Why?",
      "Start one pointer at each end of numbers and use the sorted order to decide which pointer to move.",
      "If numbers[l] + numbers[r] < target, l++; if greater, r--; if equal return [l+1, r+1]. Each step discards a value that cannot be in any valid pair.",
    ],
  },
  "3sum": {
    approach: [
      "Return every distinct value triplet from three different positions of nums that sums to 0, with no duplicate triplets in the output.",
      "Three nested loops are O(n^3), and deduplicating results with a set of sorted triplets is extra work on top.",
      "After sorting, fixing nums[i] reduces the rest to finding pairs summing to -nums[i] in a sorted suffix, which two pointers do in linear time: O(n^2) total.",
      "Duplicates are the main pitfall, as [-2,0,1,1,2] shows: skip equal values for the fixed index and, after a hit, move both pointers past equal neighbours.",
    ],
    hints: [
      "If you fix the first number of the triplet, what problem is left for the other two? Have you solved that one on sorted input?",
      "Sort nums, loop over the first element, and run an inward two-pointer search on the part to its right.",
      "Skip i when nums[i] == nums[i-1]. With l = i+1, r = end: sum < 0 moves l, > 0 moves r; on 0 record it, then advance l and r past repeated values.",
    ],
  },
  "container-with-most-water": {
    approach: [
      "Choose two walls i < j to maximise min(height[i], height[j]) * (j - i).",
      "Trying every pair is O(n^2), too slow for large height arrays.",
      "Starting with the widest pair, any narrower pair that keeps the shorter wall cannot beat the current area, since width drops and height stays capped. So you can discard the shorter wall each step, giving O(n).",
      "When both walls are equal, moving either one is safe.",
    ],
    hints: [
      "For height = [2,5,4,3], compute the area of the outermost pair. Could pairing the 2 with any closer wall do better?",
      "Start with pointers at both ends and move one inward each step, keeping the best area seen.",
      "Compute area = min(h[l], h[r]) * (r - l), update the best, then move whichever pointer has the shorter wall, because that wall can't be in a better pair.",
    ],
  },
  "trapping-rain-water": {
    approach: [
      "Sum, over every bar i, the water that sits on top of it after rain: how high the level is above height[i].",
      "For each i, scanning left and right for the tallest bars is O(n^2). Precomputing leftMax and rightMax arrays is O(n) time but O(n) space.",
      "The level at i is min(maxLeft, maxRight) - height[i]. If the left side's running max is smaller than the right's, the left bar's level is already decided, so two pointers give O(n) time and O(1) space.",
      "Bars at the edges and strictly rising inputs like [1,2,3] hold nothing, so never add a negative amount.",
    ],
    hints: [
      "In [3,0,2,0,4], how much water sits on index 1, and which two bars decide that number?",
      "Track the tallest bar seen from the left and from the right while two pointers walk inward.",
      "If leftMax < rightMax, add leftMax - height[l] (after updating leftMax with height[l]) and move l; otherwise do the same on the right. The smaller max is the binding bound.",
    ],
  },
  "squares-of-a-sorted-array": {
    approach: [
      "Return the squares of nums in sorted order, in O(n), even though negatives make the squares unsorted.",
      "Squaring then sorting is O(n log n), which misses the target.",
      "Squares are largest at the extremes: either the most negative value or the largest positive. Comparing the two ends always gives the next largest square, so you fill the output from the back.",
      "With mixed signs like [-2,1,3], the smallest square is in the middle, which is why filling from the front is hard and the back is easy.",
    ],
    hints: [
      "In [-2,1,3], where in the input can the largest square come from? Where can the smallest come from?",
      "Use a pointer at each end of nums and write results into the output from its last index backward.",
      "Compare nums[l]^2 with nums[r]^2; write the larger at position k, move that pointer inward, and decrement k until the output is filled.",
    ],
  },
  "boats-to-save-people": {
    approach: [
      "Each boat takes one or two people with combined weight at most limit. Minimise the number of boats for everyone in people.",
      "Trying all pairings is exponential, and matching each person with the best available partner by searching is O(n^2).",
      "The heaviest remaining person needs a boat regardless. Pairing them with the lightest remaining person is the best possible use of the spare capacity, so after sorting, two pointers decide greedily in O(n log n).",
      "Boats hold at most two people, so never try to squeeze a third light person in.",
    ],
    hints: [
      "With people = [4,2,2,3] and limit 5, who must definitely get a boat, and who is the best candidate to share it?",
      "Sort the weights, then work with pointers at the lightest and heaviest remaining people.",
      "Each round uses one boat for people[r] and moves r left; if people[l] + people[r] <= limit, also move l right. Count rounds until l passes r.",
    ],
  },
  "3sum-closest": {
    approach: [
      "Choose three numbers from distinct positions whose sum is nearest to target, and return the sum itself, not the indices.",
      "Checking all triplets is O(n^3).",
      "After sorting and fixing the first number, the remaining pair can be steered with two pointers: too small means increase the left, too large means decrease the right. You compare every sum you pass with the best so far, O(n^2) total.",
      "Initialise the best with a real triplet sum, not infinity, to avoid overflow in the distance calculation, and return early if a sum equals target.",
    ],
    hints: [
      "For [1,2,4,8] and target 10, if a candidate sum is 7, which of the three numbers should change, and in which direction?",
      "Sort nums, fix index i, and move two pointers over the part to its right while recording the closest sum.",
      "For each sum, update best if |sum - target| < |best - target|. Then sum < target moves l right, sum > target moves r left, equal returns target.",
    ],
  },
// sliding-window
  "best-time-to-buy-and-sell-stock": {
    approach: [
      "Pick a buy day and a later sell day in prices to maximise sell minus buy; return 0 if prices never rise.",
      "Trying every buy and sell pair is O(n^2).",
      "For a fixed sell day the best buy is simply the cheapest earlier price. So one left-to-right sweep keeping the running minimum gives the best profit for every day in O(n), O(1) space.",
      "The minimum must come before the sale: in [9,2,6,1,5], the 1 on day 3 can't be sold on day 2 for 6.",
    ],
    hints: [
      "If you had to sell on the last day of [9,2,6,1,5], which buy day would you pick, and what do you need to remember to know it?",
      "Sweep once, keeping the lowest price seen so far and the best profit seen so far.",
      "For each price p: best = max(best, p - minSoFar), then minSoFar = min(minSoFar, p). Start best at 0 so falling prices return 0.",
    ],
  },
  "longest-substring-without-repeating-characters": {
    approach: [
      "Find the length of the longest contiguous stretch of s with all characters distinct. For \"oompaa\" that is \"ompa\", length 4.",
      "Checking every substring for uniqueness is O(n^2) or worse.",
      "If s[l..r] has no repeats, any valid substring ending at r+1 starts at or after l, so the left edge never needs to move backward. Storing each character's last index lets you jump it forward in O(1), giving O(n).",
      "Only jump left if the stored index is inside the current window: use left = max(left, last[c] + 1), or old positions pull it backward.",
    ],
    hints: [
      "In \"oompaa\", when you reach the second 'o', where is the earliest point a valid substring ending here could start?",
      "Keep a window [left, right] with no repeats and a map from character to the last index you saw it.",
      "For each right: if s[right] was last seen at j >= left, set left = j + 1. Record last[s[right]] = right and update best with right - left + 1.",
    ],
  },
  "longest-repeating-character-replacement": {
    approach: [
      "Find the longest substring of s that can become one repeated letter by changing at most k characters.",
      "Trying every substring and every target letter is O(26 * n^2).",
      "A window works if its length minus its most frequent letter's count is at most k, since you replace everything else. Grow on the right and slide when invalid; counts for 26 letters keep each step O(1), O(n) overall.",
      "You may keep maxCount as a historical maximum without decreasing it; the answer only improves when a larger count appears, so the window never needs to shrink below the best length.",
    ],
    hints: [
      "In \"XYYX\" with k = 1, for the window \"XYY\", how many changes does it need, and which letter do you keep?",
      "Use a window with 26 letter counts and track the highest count of any single letter inside it.",
      "Add s[r], update maxCount. If (r - l + 1) - maxCount > k, decrement the count of s[l] and move l once. The answer is the largest window length seen.",
    ],
  },
  "permutation-in-string": {
    approach: [
      "Decide whether some substring of s2 of length exactly |s1| has the same letter counts as s1.",
      "Generating all permutations of s1 is factorial. Recounting letters for every length-|s1| substring is O(|s1| * |s2|).",
      "Consecutive windows of fixed length differ by one letter in and one out, so you update 26 counts in O(1) per step and compare, giving O(26 * |s2|).",
      "If s1 is longer than s2 return false immediately. Tracking how many of the 26 letters currently match avoids a full array comparison each step.",
    ],
    hints: [
      "In \"xgodz\", which substrings even have a chance of matching \"dog\"? How long are they?",
      "Slide a fixed-size window of length |s1| across s2, keeping letter counts for the window.",
      "Add s2[r] and, once r >= |s1|, remove s2[r - |s1|]. Return true when the window's 26 counts equal s1's counts.",
    ],
  },
  "minimum-window-substring": {
    approach: [
      "Find the shortest substring of s containing every character of t with multiplicity; return \"\" if impossible, as with s = \"a\", t = \"aa\".",
      "Checking every substring for coverage is O(n^2) substrings times a count check, far too slow.",
      "Once a window covers t, extending right only makes it longer, so shrink from the left until it stops covering. Each index enters and leaves once, so it's O(|s| + |t|) if you track how many required counts are satisfied.",
      "Count the satisfied requirement with a counter of fully met characters, not by comparing whole maps each step.",
    ],
    hints: [
      "In \"XYZAXZY\" with t = \"ZX\", once a window contains both letters, which side of it might be safely trimmed?",
      "Keep a window with character counts, a need map from t, and a count of how many characters currently meet their requirement.",
      "Expand r and update counts; when formed equals the number of distinct t characters, record the window and move l, decrementing formed when a count drops below need.",
    ],
  },
  "minimum-size-subarray-sum": {
    approach: [
      "Find the length of the shortest contiguous subarray of nums with sum at least target, or 0 if none reaches it.",
      "Summing every subarray is O(n^2), or O(n^3) without prefix sums.",
      "Since all values are positive, widening only increases the sum and narrowing only decreases it. Once a window reaches target, shrinking from the left is the only way it could get shorter, so each index moves once: O(n).",
      "This only works because values are positive. With negatives you would need prefix sums and a different method.",
    ],
    hints: [
      "In [1,5,1,2] with target 6, once [1,5] reaches 6, what's the only way a shorter qualifying subarray ending at index 1 could exist?",
      "Keep a window sum, extending on the right and shrinking from the left.",
      "Add nums[r] to sum. While sum >= target, record r - l + 1 as a candidate minimum, subtract nums[l] and move l. Return 0 if no candidate was ever recorded.",
    ],
  },
  "max-consecutive-ones-iii": {
    approach: [
      "Return the length of the longest run of 1s possible in nums after flipping at most k zeros.",
      "Trying every subarray and counting its zeros is O(n^2).",
      "Rephrase it: find the longest window containing at most k zeros, because those are the zeros you flip. Adding on the right and shrinking on the left when the zero count exceeds k keeps it O(n).",
      "With k = 0 the answer is the longest existing run of 1s; the same loop handles it.",
    ],
    hints: [
      "Instead of deciding which zeros to flip, what property must a stretch of nums have to become all 1s?",
      "Use a window over nums and track how many zeros are inside it.",
      "Extend r, incrementing zeros when nums[r] is 0. While zeros > k, move l forward, decrementing when nums[l] is 0. Track the max window length.",
    ],
  },
  "sliding-window-maximum": {
    approach: [
      "For every window of size k over nums, report its maximum, in order, in O(n) total.",
      "Scanning each window is O(n * k). A heap gives O(n log n) but requires lazily removing elements that left the window.",
      "A value that has a larger value to its right inside the window can never be a max again. Discarding those leaves indices with decreasing values, whose front is always the current max, each index added and removed once.",
      "Store indices, not values, so you can tell when the front has slid out of the window.",
    ],
    hints: [
      "In [2,7,1,3] with k = 2, once 7 arrives, can 2 ever be a window's maximum again? What about 1 once 3 arrives?",
      "Keep a deque of indices whose values decrease from front to back.",
      "For each i: pop the back while nums[back] <= nums[i], push i, pop the front if it is <= i - k, and once i >= k - 1 output nums[front].",
    ],
  },

  // stack
  "valid-parentheses": {
    approach: [
      "You are asked whether every bracket in s is closed by the same type, in reverse order of opening, with nothing left unclosed.",
      "Repeatedly deleting adjacent pairs like \"()\" until nothing changes works, but each pass rescans the string, giving O(n^2) on deeply nested input.",
      "The most recently opened bracket must be the first one closed. That last-in, first-out order means a stack of unmatched openers answers each closer in O(1), for O(n) total.",
      "Two failure modes are easy to miss: a closer arriving when no opener is waiting, as in \"(]\" style input, and openers left over at the end, as in \"(()\".",
    ],
    hints: [
      "When you read a closing bracket, which earlier opening bracket is the only one it is allowed to match?",
      "Keep a stack of the opening brackets you have not matched yet; a map from each closer to its opener makes the check short.",
      "On a closer, the stack must be non-empty and its top must be the matching opener, so pop it. After the scan, s is valid only if the stack is empty.",
    ],
  },
  "min-stack": {
    approach: [
      "You need a stack whose getMin returns the smallest value currently stored, with push, pop, top and getMin all O(1).",
      "Scanning the stack in getMin is O(n). Keeping one global min variable fails because after pop() removes the minimum you cannot recover the previous one.",
      "The minimum only changes at push and pop, and a stack undoes pushes in reverse. So if each level remembers the minimum as of its push, popping restores the old minimum automatically.",
      "Duplicates of the minimum matter: pushing 1, 1 and popping once must still report 1.",
    ],
    hints: [
      "After pop(), getMin must give the minimum of a stack you have seen before. Could you have saved that answer back then?",
      "Store extra state per level: either pairs of (value, min so far) or a second stack that tracks minimums in parallel with the main one.",
      "On push(val), record min(val, current min) alongside val. getMin reads the top record's min; pop removes both value and its saved min together.",
    ],
  },
  "evaluate-reverse-polish-notation": {
    approach: [
      "You evaluate the postfix expression in tokens, where each operator applies to the two values produced immediately before it, and return the integer result.",
      "Converting back to infix with parentheses, or repeatedly finding an operator and collapsing it with its two neighbours in the list, costs extra passes and O(n^2) work.",
      "Every operator consumes the two most recent unconsumed results and produces one new result, so a stack of pending values evaluates it in a single O(n) pass.",
      "Operand order matters for - and /: in [\"6\",\"2\",\"-\"] the answer is 4, not -4. Division truncates toward zero, so -7 / 2 is -3.",
    ],
    hints: [
      "When you hit an operator in [\"6\",\"2\",\"-\",\"4\",\"*\"], which two values does it act on, and where were they produced?",
      "Use a stack of integers: numbers are pushed, operators pop operands and push their result.",
      "On an operator pop b first, then a, and push a op b. Use integer division that truncates toward zero. The single value left at the end is the answer.",
    ],
  },
  "daily-temperatures": {
    approach: [
      "For each index in temperatures, you return the distance to the next later index with a strictly higher temperature, or 0 if none exists.",
      "Scanning forward from every day is O(n^2), which is slow when temperatures fall steadily for a long stretch before a hot day.",
      "One hot day can answer many earlier colder days at once. Days still waiting always form a non-increasing run of temperatures, so the coldest waiters sit on top and get answered first.",
      "Strictly warmer means equal temperatures do not answer each other; the last day and any day with no warmer future stay 0.",
    ],
    hints: [
      "In [20,25,21,19,30], the 30 answers several earlier days at once. Which days are still waiting just before it arrives?",
      "Keep a stack of indices whose answer is unknown; their temperatures decrease from bottom to top.",
      "For each day i, while the top index j has temperatures[j] < temperatures[i], pop it and set answer[j] = i - j. Then push i. Every index is pushed and popped once: O(n).",
    ],
  },
  "car-fleet": {
    approach: [
      "You count how many groups arrive at target, where a faster car that catches a slower one ahead merges into it and moves at that slower pace.",
      "Simulating the cars step by step over time is awkward because catch-up happens at fractional moments, and checking every pair is O(n^2).",
      "Cars never pass, so only the car directly ahead matters. Process cars from nearest target outward and compare each car's solo arrival time (target - position) / speed with the fleet in front.",
      "Use a strict comparison: a car arriving at exactly the same time as the fleet ahead joins it. Use floating point or compare by cross-multiplication.",
    ],
    hints: [
      "If a car would reach target before the car ahead of it, does its own speed affect anything after they meet?",
      "Sort cars by position descending and compute each car's time to reach target alone; track the arrival time of the most recent fleet.",
      "Walking from closest to farthest, a car starts a new fleet only if its time is greater than the current fleet's time; then that becomes the fleet time. O(n log n) for the sort.",
    ],
  },
  "largest-rectangle-in-histogram": {
    approach: [
      "Among all rectangles that fit under the bars of heights, you want the maximum area, where the rectangle's height is the shortest bar in its span.",
      "Trying every pair of left and right edges with a running minimum is O(n^2) and too slow for long inputs.",
      "Fix which bar is the shortest. Its best rectangle stretches to the nearest shorter bar on each side. A stack of increasing heights finds both boundaries for every bar in one O(n) pass.",
      "Bars still on the stack at the end extend to the right edge; a sentinel of height 0 flushes them. In [3,1,3,3], the 1 spans all four bars.",
    ],
    hints: [
      "For each bar, if it is the shortest one in the rectangle, how far left and right can that rectangle extend?",
      "Maintain a stack of indices with increasing heights; a shorter incoming bar tells popped bars where their right boundary is.",
      "When bar i is shorter than the top, pop index j: its width runs from the new top + 1 to i - 1, area heights[j] times that width. Append a 0-height bar to empty the stack.",
    ],
  },
  "next-greater-element-i": {
    approach: [
      "For each value in nums1, locate it in nums2 and report the first value to its right in nums2 that is larger, or -1.",
      "Finding each value in nums2 and scanning right costs O(len(nums1) times len(nums2)).",
      "The answers depend only on nums2, and values are distinct. Compute the next greater value for every element of nums2 once, keyed by value, then nums1 becomes simple lookups.",
    ],
    hints: [
      "Does the answer for a value change based on what else is in nums1, or only on nums2?",
      "Precompute a map from each nums2 value to its next greater value using a stack of values still waiting for a larger one.",
      "Scan nums2; while the current value exceeds the stack top, pop and map top to current. Push current. Leftovers map to -1. Then read nums1 from the map, O(n + m).",
    ],
  },
  "generate-parentheses": {
    approach: [
      "You must list every balanced string that uses exactly n opening and n closing parentheses.",
      "Generating all 2^(2n) strings of length 2n and filtering the balanced ones wastes almost all its work on invalid strings.",
      "A prefix can be extended to a valid string exactly when opens used is at most n and closes never exceed opens. Building character by character under those two rules never makes a dead end.",
    ],
    hints: [
      "For n = 2, at each position, which characters can you legally place given what has already been written?",
      "Build strings recursively, tracking how many \"(\" and \")\" you have placed so far.",
      "Add \"(\" while open < n; add \")\" only while close < open. When the length reaches 2n, record the string. Every leaf is a valid answer.",
    ],
  },
  "remove-k-digits": {
    approach: [
      "You delete exactly k digits from num, keeping the rest in order, so the remaining number is as small as possible, returned without leading zeros.",
      "Trying every subset of k positions is combinatorial, and even removing one digit at a time by rescanning is O(nk).",
      "Earlier digits dominate. Whenever a digit is followed by a smaller one, removing the larger earlier digit always helps, so you want the kept digits to be non-decreasing as far as k allows.",
      "If k is still positive after the scan, cut from the end. Strip leading zeros and return \"0\" if nothing remains.",
    ],
    hints: [
      "In \"5337\" with k = 2, which digit hurts the number most, and what about it makes removing it a clear win?",
      "Use a stack of kept digits that you try to keep non-decreasing, spending one removal per pop.",
      "For each digit, while k > 0 and the top is greater than it, pop and decrement k; then push. Drop k digits from the end if any remain, then trim leading zeros. O(n).",
    ],
  },
  // binary-search
  "binary-search": {
    approach: [
      "Given sorted, distinct nums, return the index where target sits or -1 if it is missing.",
      "Checking each element in turn is O(n) and ignores the sorted order you were given.",
      "Because nums is sorted, one comparison at the middle tells you which half cannot contain target. Halving the range each time gives O(log n).",
      "Be consistent with boundaries: if you search lo <= hi, move to mid + 1 or mid - 1 so the loop always shrinks.",
    ],
    hints: [
      "Comparing target with one element in the middle of [2,4,7,11], what do you learn about all the elements on one side?",
      "Keep a range lo..hi that must contain target if it exists and shrink it around the middle element.",
      "While lo <= hi: if nums[mid] equals target return mid; if smaller set lo = mid + 1, else hi = mid - 1. When the range empties, return -1.",
    ],
  },
  "search-a-2d-matrix": {
    approach: [
      "You must decide whether target appears in matrix, where reading rows in order gives one fully sorted sequence.",
      "Scanning every cell is O(mn). Scanning rows to find the right one, then searching it, is O(m + log n), still linear in rows.",
      "Since the row-by-row reading is one sorted list of length m times n, you can binary search over virtual positions and convert each position to a cell. That is O(log(mn)).",
    ],
    hints: [
      "If you flattened matrix into one list row by row, what property would that list have?",
      "Binary search over indices 0 to m*n - 1 without building the flattened list.",
      "Map index k to matrix[k / n][k % n], where n is the number of columns, and compare that with target exactly as in a normal binary search.",
    ],
  },
  "koko-eating-bananas": {
    approach: [
      "You need the smallest integer speed k such that eating the piles, one pile per hour at most k bananas, finishes within h hours.",
      "Trying k = 1, 2, 3 and so on, computing total hours each time, costs O(max(piles) times n), far too slow when piles are large.",
      "Total hours, the sum of ceil(pile / k), only decreases as k grows. So speeds split into too slow then fast enough, and you binary search for the boundary between 1 and max(piles).",
      "Hour sums can overflow a 32-bit int; use a long. Compute ceilings as (pile + k - 1) / k.",
    ],
    hints: [
      "If speed k finishes in time, does every faster speed also finish in time?",
      "Binary search over speeds, not over piles, using a helper that returns the hours needed at a given speed.",
      "Search lo = 1, hi = max(piles). If hours(mid) <= h, set hi = mid, else lo = mid + 1. lo is the answer. O(n log max(piles)).",
    ],
  },
  "find-minimum-in-rotated-sorted-array": {
    approach: [
      "nums was sorted then rotated, so it has at most one drop; you return the value right after that drop, the minimum, in O(log n).",
      "A linear scan for the drop is O(n), which misses the required bound.",
      "Comparing nums[mid] with the last element tells you which side the drop is on: if nums[mid] is larger, the minimum is right of mid; otherwise it is at mid or left.",
      "An unrotated array like [2,5,8,9] has no drop; comparing with the right end handles that, while comparing with the left end is easy to get wrong.",
    ],
    hints: [
      "In [8,9,2,5], how does the middle value compare with the last value, and what does that say about where the smallest value is?",
      "Binary search with lo < hi, using nums[hi] as the reference that decides which half to keep.",
      "If nums[mid] > nums[hi], set lo = mid + 1; otherwise set hi = mid, since mid could be the minimum. When lo equals hi, nums[lo] is the answer.",
    ],
  },
  "search-in-rotated-sorted-array": {
    approach: [
      "In a rotated sorted array of distinct values, you return the index of target or -1, in O(log n).",
      "A linear scan is O(n). Finding the rotation point first and then searching the correct side works but needs two searches and careful index shifts.",
      "Splitting at any mid leaves at least one half fully sorted, and you can tell which one from its endpoints. Checking whether target lies in that sorted half's range decides which half to keep.",
      "Use inclusive range checks, such as nums[lo] <= target < nums[mid], or targets equal to an endpoint get dropped.",
    ],
    hints: [
      "Pick any mid in [6,8,1,3]. Is at least one side of mid in normal sorted order, and how can you tell?",
      "Do a single binary search; at each step identify the sorted half by comparing nums[lo] with nums[mid].",
      "If nums[lo] <= nums[mid], the left half is sorted: keep it when nums[lo] <= target < nums[mid], else go right. Otherwise mirror that with the right half's range.",
    ],
  },
  "time-based-key-value-store": {
    approach: [
      "get(key, timestamp) must return the value from the latest set for that key whose timestamp is at or before the query time, or \"\".",
      "Storing all values per key and scanning them on each get is O(number of sets for that key) per query.",
      "Timestamps for set calls arrive in increasing order, so each key's list is already sorted by time. A get is then a search for the last timestamp not exceeding the query, O(log n).",
      "A query earlier than every stored timestamp, like get(\"k\",4) in the example, must return \"\".",
    ],
    hints: [
      "Since set calls come with increasing timestamps, what order is each key's history already in?",
      "Keep a map from key to a list of (timestamp, value) pairs and binary search that list on get.",
      "Find the rightmost pair with timestamp <= query (an upper bound minus one). If no such pair exists, return \"\"; otherwise return its value.",
    ],
  },
  "search-insert-position": {
    approach: [
      "Return target's index in sorted, distinct nums, or the position it would take if inserted to keep the order.",
      "Scanning for the first value not less than target is O(n).",
      "Both cases ask the same thing: the first index whose value is at least target. That boundary splits nums into smaller then not smaller, so binary search finds it in O(log n).",
      "The answer can be len(nums) when target is larger than everything, so the search range must include that position.",
    ],
    hints: [
      "In [10,20,30] with target 25, the answer is 2. What is true about nums[2] compared with every earlier value?",
      "Binary search for a boundary, not an exact match, over the range 0 to len(nums).",
      "With lo = 0, hi = n, while lo < hi: if nums[mid] >= target set hi = mid, else lo = mid + 1. Return lo.",
    ],
  },
  "find-first-and-last-position-of-element-in-sorted-array": {
    approach: [
      "In sorted nums with repeats, return the first and last index of target, or [-1, -1] if it is not there.",
      "Finding any copy and then walking left and right is O(n) when target repeats many times.",
      "The first index is the first position with value >= target; one past the last is the first position with value > target. Two boundary searches give both in O(log n).",
      "Check that the first boundary is in range and actually holds target before reporting it; otherwise return [-1, -1].",
    ],
    hints: [
      "In [1,4,4,4,9], how could you describe index 1 and index 4 without referring to the value 4 being equal to anything?",
      "Write one lower-bound binary search and call it twice with different targets or comparisons.",
      "first = lowerBound(target); if first is out of range or nums[first] != target return [-1,-1]. last = lowerBound(target + 1) - 1.",
    ],
  },
  "capacity-to-ship-packages-within-d-days": {
    approach: [
      "Find the smallest ship capacity that moves all weights, in their given order, within days, loading each day greedily until the next package would overflow.",
      "Trying capacities upward from 1 and simulating each one costs O(sum(weights) times n), too slow.",
      "Days needed only decrease as capacity grows, and the greedy fill is the correct way to count days for a fixed capacity. So binary search capacity between max(weights) and sum(weights).",
      "The lower bound must be max(weights); below that, the heaviest package can never ship.",
    ],
    hints: [
      "If a capacity of 6 ships [4,2,5] in 2 days, can capacity 7 ever need more days?",
      "Binary search on capacity, using a helper that simulates loading in order and counts days.",
      "Search lo = max(weights), hi = sum(weights). If daysNeeded(mid) <= days, set hi = mid, else lo = mid + 1. Return lo. O(n log sum).",
    ],
  },
  // linked-list
  "reverse-linked-list": {
    approach: [
      "Reverse every next pointer in the list and return the old tail as the new head.",
      "Copying values into an array and rebuilding, or recursing, works but uses O(n) extra space; an in-place pass needs only O(1).",
      "Each node just needs its next pointer flipped to the node before it. Walking once with a pointer to the previous node does that, as long as you save the next node before overwriting the link.",
      "An empty list returns null, and the old head's next must end up null.",
    ],
    hints: [
      "Once you change cur.next to point backwards, how will you reach the rest of the list?",
      "Walk the list with two pointers, prev and cur, flipping one link per step.",
      "Each step: save next = cur.next, set cur.next = prev, then prev = cur and cur = next. When cur is null, prev is the new head.",
    ],
  },
  "merge-two-sorted-lists": {
    approach: [
      "Splice the nodes of list1 and list2 into one sorted list without creating new nodes, and return its head.",
      "Collecting all values, sorting, and building a new list costs O(n log n) time and extra nodes.",
      "The smallest remaining node is always one of the two current heads, so repeatedly taking the smaller head builds the merged list in O(n + m).",
      "When one list empties, attach the other list's remainder in one step. A dummy head avoids special-casing the first node and empty inputs.",
    ],
    hints: [
      "Of all nodes not yet placed, where can the smallest one possibly be?",
      "Use a dummy node and a tail pointer, comparing the heads of list1 and list2 each step.",
      "Attach the smaller head to tail.next, advance that list and tail. When either list runs out, set tail.next to the other. Return dummy.next.",
    ],
  },
  "linked-list-cycle": {
    approach: [
      "Decide whether following next pointers from head ever revisits a node instead of reaching null.",
      "Storing visited nodes in a hash set works in O(n) time but uses O(n) memory.",
      "In a loop, a pointer moving two steps gains one node per step on a pointer moving one step, so it must eventually land on it. Without a loop it reaches null. That gives O(1) space.",
      "Check fast and fast.next for null before stepping two, or you will crash on lists like [4,7,1] with no cycle.",
    ],
    hints: [
      "If two runners circle the same track at different speeds, what happens eventually? What if the track has an end instead?",
      "Use two pointers starting at head that advance at different speeds.",
      "Move slow one step and fast two steps while fast and fast.next exist. If they ever point to the same node, return true; if fast hits null, return false.",
    ],
  },
  "reorder-list": {
    approach: [
      "Relink the nodes in place into first, last, second, second-to-last, and so on, without changing values.",
      "Putting nodes in an array and relinking from both ends is easy but O(n) space. Repeatedly walking to the current tail is O(n^2).",
      "The pattern interleaves the first half with the second half read backwards. So split at the middle, reverse the second half, then merge the two alternately, all in O(n) time and O(1) space.",
      "Cut the link between halves, or the result loops. With odd length, like [10,20,30,40,50], the middle node stays at the end.",
    ],
    hints: [
      "Look at [1,2,3,4] becoming [1,4,2,3]. In what order are the second-half nodes used?",
      "Break it into three linked-list sub-tasks you already know: find the middle, reverse a list, merge two lists.",
      "Find the middle with slow and fast pointers, set slow.next = null, reverse the rest, then alternately take one node from each half until the second half runs out.",
    ],
  },
  "remove-nth-node-from-end-of-list": {
    approach: [
      "Delete the node that is n-th from the end (the last node counts as 1st) and return the possibly new head.",
      "Counting the length first and then walking to position length - n works but takes two passes.",
      "If one pointer is n nodes ahead of another, when the leader reaches the end the follower is n nodes from the end. Starting the follower at a dummy node leaves it just before the node to delete.",
      "When n equals the length, as in [7,8,9] with n = 3, the head itself is removed; the dummy makes that case ordinary.",
    ],
    hints: [
      "How could you know you are n nodes from the end without knowing the list's length?",
      "Use a dummy node before head and two pointers kept a fixed gap apart.",
      "Move lead n steps from the dummy, then advance lead and trail together until lead.next is null. Set trail.next = trail.next.next and return dummy.next.",
    ],
  },
  "lru-cache": {
    approach: [
      "Build a fixed-capacity cache where get and put both mark a key as most recently used, and inserting past capacity evicts the least recently used key, all in O(1).",
      "A map plus a list or timestamp scan to find the oldest key costs O(n) per eviction or per touch.",
      "You need O(1) lookup by key and O(1) move-to-front and remove-from-back. A hash map from key to node in a doubly linked list gives both, since a node can unlink itself.",
      "put on an existing key updates the value and recency without evicting. Remove the evicted key from the map too.",
    ],
    hints: [
      "Which two operations must both be O(1): finding a key, and what else about its position in usage order?",
      "Combine a hash map with a doubly linked list ordered from most to least recently used, using dummy head and tail nodes.",
      "On get or put, unlink the key's node and insert it after head. If size exceeds capacity, remove the node before tail and delete its key from the map.",
    ],
  },
  "palindrome-linked-list": {
    approach: [
      "Return whether the list's values read the same forwards and backwards.",
      "Copying values to an array and checking with two indices is O(n) extra space; you cannot walk a singly linked list backwards to avoid that.",
      "A palindrome's second half reversed equals its first half. Reverse the second half in place, then walk both halves together comparing values, for O(n) time and O(1) space.",
      "For odd lengths, the middle node needs no partner. Optionally restore the list afterward.",
    ],
    hints: [
      "To compare first with last, second with second-to-last, what would make walking from the end possible?",
      "Locate the middle with slow and fast pointers, then reverse only the second half.",
      "Compare nodes from head and from the reversed half's head step by step until the reversed half ends; any mismatch means false.",
    ],
  },
  "add-two-numbers": {
    approach: [
      "l1 and l2 store numbers with least significant digit first; return their sum as a list in the same format.",
      "Converting each list to an integer, adding, and converting back overflows for long lists.",
      "Since the ones digit comes first, you can add column by column exactly as on paper, carrying 0 or 1 to the next node. One pass, O(max(m, n)).",
      "Lists may differ in length, and a final carry creates an extra node: [9] + [1,9,9] gives [0,0,0,1].",
    ],
    hints: [
      "Why is it convenient that 342 is stored as 2, 4, 3 when you add by hand?",
      "Walk both lists together with a carry, building the result from a dummy node.",
      "Loop while l1, l2 or carry remains: sum the available digits plus carry, append sum % 10, set carry = sum / 10, and advance whichever lists are not finished.",
    ],
  },
  "merge-k-sorted-lists": {
    approach: [
      "Merge all k sorted lists into one sorted list and return its head; some lists, or the array itself, may be empty.",
      "Merging lists one after another into a growing result repeatedly copies earlier nodes, O(Nk). Collecting and sorting all values is O(N log N).",
      "The next node is always the smallest among the k current heads, so you only need a fast way to get the minimum of k items: a min-heap, giving O(N log k).",
      "Skip empty lists when filling the heap, and handle lists = [] by returning null.",
    ],
    hints: [
      "At any moment, how many nodes are candidates to be the next one in the output?",
      "Keep the current head of each non-empty list in a min-heap ordered by value.",
      "Pop the smallest node, append it to the tail, and push its next if it exists. Repeat until the heap is empty. Dividing and merging pairs also reaches O(N log k).",
    ],
  },

// trees-dfs-bfs
  "invert-binary-tree": {
    approach: [
      "You need to turn root into its mirror image: every left child becomes a right child and vice versa, at every level, then return the same root.",
      "Building a brand new mirrored tree node by node works but wastes O(n) extra nodes and is more code than needed; you can rearrange the existing nodes in place.",
      "Mirroring a tree is the same as swapping root's two children and then mirroring each of those subtrees. That self-similar structure means a single visit per node, O(n) time, finishes the job.",
      "Handle a null root by returning null, and remember to return root itself, not one of the children.",
    ],
    hints: [
      "Look at the first example: what changes at the root itself, and what has to happen inside each of its children afterwards?",
      "Use recursion (or a queue/stack traversal). The only work per node is a local operation on its two child pointers.",
      "At each node, swap left and right, then invert both children recursively. Order does not matter as long as every node is swapped exactly once. Base case: null returns null.",
    ],
  },
  "maximum-depth-of-binary-tree": {
    approach: [
      "Count the nodes on the longest root-to-leaf path in root. An empty tree has depth 0, a single node has depth 1.",
      "Listing every root-to-leaf path and measuring each one works but builds paths you never need; you only need lengths, not the paths themselves.",
      "The deepest path through a node goes into whichever child subtree is deeper, so a node's depth depends only on its children's depths. Compute bottom-up in O(n) time, O(height) stack.",
    ],
    hints: [
      "If you already knew how deep the left and right subtrees of root were, how would you get root's depth?",
      "Recursion that returns a number per subtree works; alternatively, a level-by-level queue traversal where you count the levels.",
      "depth(null) = 0 and depth(node) = 1 + the larger of its two children's depths. For BFS, increment a counter once per full level drained from the queue.",
    ],
  },
  "diameter-of-binary-tree": {
    approach: [
      "Find the longest path between any two nodes in root, counted in edges, not nodes. In [1,2,3,4,5] that is 4-2-1-3 with 3 edges.",
      "Treating every node as the path's top and computing both subtree heights from scratch costs O(n) per node, O(n^2) on a skewed tree.",
      "Every path has a single highest node, and its length there is left height + right height. One post-order DFS that returns heights can check this candidate at every node in O(n).",
      "The best path may not go through root, so track the maximum in an outer variable rather than returning it from the root call.",
    ],
    hints: [
      "Any path bends at exactly one topmost node. What two quantities at that node determine the path's length?",
      "Do a single bottom-up DFS that returns each subtree's height, and keep a separate running best answer while it runs.",
      "At each node, with lh and rh the child heights (null = 0), update best = max(best, lh + rh) and return 1 + max(lh, rh). best counts edges directly.",
    ],
  },
  "binary-tree-level-order-traversal": {
    approach: [
      "Return a list of lists: values of root's depth 0, then depth 1, and so on, each inner list read left to right.",
      "You could compute each node's depth with DFS and bucket by depth, which works, but a plain queue BFS gives the order naturally without tracking depth per node.",
      "A FIFO queue processes nodes exactly in level order, left to right. The only trick is knowing where one level ends and the next begins, which you get by snapshotting the queue size. O(n).",
      "Return an empty list for an empty root, not [[]].",
    ],
    hints: [
      "If you visit nodes in the order they are discovered from the top, what order do you get? How would you tell where a level stops?",
      "Breadth-first search with a queue. Children are enqueued left before right so each level stays left-to-right.",
      "At the start of each round, read size = queue length; pop exactly size nodes into a new list, enqueuing their non-null children. Append that list and repeat until the queue is empty.",
    ],
  },
  "binary-tree-right-side-view": {
    approach: [
      "For each depth of root, return the value of the rightmost node on that level, top to bottom. In [1,2,3,4] the 4 is visible because nothing on the right reaches that depth.",
      "Simply following right pointers from root fails: example 2 shows the deepest visible node can sit in the left subtree.",
      "The answer is one value per level, the last one in left-to-right order. So any traversal that knows level boundaries, or depth, can pick that node in O(n).",
    ],
    hints: [
      "Why is 4 in the answer for [1,2,3,4] even though it is a left descendant? What makes a node visible?",
      "Either a level-by-level BFS, or a DFS that carries the current depth and visits one side before the other.",
      "BFS: record the last node popped in each level. DFS: visit right before left and add node.val when depth equals the answer's current size, meaning it is the first node seen at that depth.",
    ],
  },
  "binary-tree-maximum-path-sum": {
    approach: [
      "Find the maximum sum of values along any path of at least one node in root; the path can start and end anywhere and values can be negative, as [-3] returning -3 shows.",
      "Enumerating all node pairs and summing the path between them is O(n^2) or worse.",
      "Every path has a highest node where it can use both a left and right downward branch. A DFS that returns the best single downward branch per node lets you score each node as the peak in O(n).",
      "Negative branches should be dropped (treated as 0), but the answer must still start at negative infinity so an all-negative tree returns its largest node.",
    ],
    hints: [
      "Any path bends at one topmost node. From there it goes down at most one way on each side. When is it better to not extend down a side?",
      "Post-order DFS that returns one number per node (best downward chain starting there) while a global variable holds the best full path.",
      "Let l = max(0, dfs(left)), r = max(0, dfs(right)). Update best with node.val + l + r, but return node.val + max(l, r) since a parent can only extend one branch. Initialize best to the minimum value.",
    ],
  },
  "same-tree": {
    approach: [
      "Decide whether trees p and q match exactly: same shape and the same value at every position. [1,2] and [1,null,2] fail because 2 sits on different sides.",
      "Serializing both trees and comparing strings works only if nulls are written out; without them, example 2 would look equal. It also uses O(n) extra space.",
      "Two trees are equal exactly when their roots match and both left subtrees and both right subtrees are equal. Walk them in lockstep in O(n), stopping at the first difference.",
    ],
    hints: [
      "What should happen when you reach a spot where one tree has a node and the other does not?",
      "Recurse on pairs of nodes, one from p and one from q, at the same position.",
      "Both null: true. Exactly one null: false. Different values: false. Otherwise return same(p.left, q.left) and same(p.right, q.right).",
    ],
  },
  "balanced-binary-tree": {
    approach: [
      "Check whether, at every node of root, the left and right subtree heights differ by at most 1. [1,null,2,null,3] fails at the root, where heights are 0 and 2.",
      "Calling a separate height function at each node recomputes heights repeatedly, O(n^2) on a skewed tree.",
      "Heights are naturally computed bottom-up, and each node's balance check needs only its children's heights. Fold the check into the height DFS and use a sentinel to signal failure, giving O(n).",
    ],
    hints: [
      "To check a node you need two heights. Are you computing those same heights again when you check the nodes above it?",
      "One post-order DFS that returns a height, plus some way to signal that a subtree is already unbalanced.",
      "Return -1 if either child returned -1 or |lh - rh| > 1; otherwise return 1 + max(lh, rh). The tree is balanced if the root call is not -1.",
    ],
  },
  "construct-binary-tree-from-preorder-and-inorder-traversal": {
    approach: [
      "Given preorder and inorder of one tree with distinct values, rebuild it. Example 2 shows both orders together are needed to tell [1,2] from [1,null,2].",
      "Recursing with array slices and a linear search for the root in inorder each time works but costs O(n^2) on skewed trees plus copying.",
      "preorder always lists a subtree's root first, and inorder puts that root between its left and right parts. Knowing the root's inorder position tells you the left subtree's size. With a value-to-index map and index bounds, it is O(n).",
      "Build the left subtree before the right, since that is the order preorder consumes values.",
    ],
    hints: [
      "In each example, which array tells you the root immediately, and which tells you what goes on its left versus its right?",
      "Recursion over an inorder index range, with a hash map from value to inorder index and a pointer moving through preorder.",
      "build(lo, hi): if lo > hi return null; root = preorder[p++]; m = index[root]; root.left = build(lo, m - 1); root.right = build(m + 1, hi). Left must be built first.",
    ],
  },
  // bst-trie
  "validate-binary-search-tree": {
    approach: [
      "Decide whether root is a strict BST: every value in a left subtree is below the node and every value in a right subtree is above it, not just the direct children.",
      "Comparing each node only with its children passes example 2 wrongly: 3 is less than 6 but sits in 5's right subtree. Collecting each subtree's min and max separately is O(n^2).",
      "Each node must lie in an open interval set by all its ancestors. Passing that interval down, or checking that the in-order sequence is strictly increasing, validates in O(n).",
      "Use null or long bounds rather than int extremes, since node values may equal Integer.MIN_VALUE or MAX_VALUE. Duplicates make it invalid.",
    ],
    hints: [
      "In [5,4,6,null,null,3,7], every parent-child pair looks fine. Which ancestor does 3 actually violate?",
      "DFS that carries a lower and upper bound for each node, or an in-order walk that remembers the previous value.",
      "check(node, low, high): node.val must satisfy low < val < high; recurse left with (low, val) and right with (val, high). Null nodes are valid.",
    ],
  },
  "kth-smallest-element-in-a-bst": {
    approach: [
      "Return the k-th smallest value in root, counting from 1. In [3,1,5,0,2,4,6] with k = 4 the sorted values are 0,1,2,3, so the answer is 3.",
      "Dumping all values into a list and sorting is O(n log n) and ignores that the BST is already ordered; even a full in-order list visits all n nodes.",
      "In-order traversal of a BST yields values in sorted order, so the k-th visited node is the answer. An iterative walk can stop right there, costing O(height + k).",
    ],
    hints: [
      "Which traversal order of a BST gives you the values already sorted?",
      "An iterative in-order traversal with an explicit stack, counting nodes as you visit them.",
      "Push nodes while going left; pop one, decrement k, return its value when k hits 0; otherwise move to its right child and repeat.",
    ],
  },
  "lowest-common-ancestor-of-a-binary-search-tree": {
    approach: [
      "Find the deepest node in root that has both p and q in its subtree, where a node counts as its own descendant, as example 2 shows with 2 being the answer.",
      "The general binary-tree LCA visits the whole tree in O(n) and ignores the ordering that a BST gives you.",
      "Compare p and q with the current node: if both are smaller the answer is on the left, if both larger it is on the right. The first node where they split, or that equals one, is the LCA. O(height), O(1) space.",
    ],
    hints: [
      "Start at 6 with p = 2 and q = 8. Can either child of 6 contain both? What about p = 2, q = 4?",
      "Walk down a single path from root using the BST ordering; no full traversal or recursion stack is needed.",
      "While true: if p.val and q.val are both less than node.val go left; if both greater go right; otherwise return node.",
    ],
  },
  "implement-trie-prefix-tree": {
    approach: [
      "Support insert, exact search, and startsWith. The example shows search(\"cod\") is false even though \"code\" exists, while startsWith(\"cod\") is true.",
      "Keeping a list or hash set of words makes startsWith scan every word, O(total characters) per query.",
      "Store words character by character in a tree where shared prefixes share nodes. Each operation then costs O(length of the word), independent of how many words are stored.",
      "A node existing at the end of the path is not enough for search; you need a separate end-of-word marker.",
    ],
    hints: [
      "What is the difference between \"cod\" being a word and \"cod\" being a prefix? What extra fact do you need to store?",
      "A tree of nodes, each with up to 26 children (array or map) and a boolean flag.",
      "insert creates missing child nodes along the word and sets isEnd on the last. search walks the path and returns isEnd at the end; startsWith returns true if the walk never hits a missing child.",
    ],
  },
  "design-add-and-search-words-data-structure": {
    approach: [
      "Store words, and answer search(pattern) where '.' matches any single letter. \"pa\" fails because no word is exactly two letters, so matches must have the same length.",
      "Checking the pattern against every stored word costs O(words x length) per search, slow when many words are added.",
      "A trie lets letters follow one child directly; a '.' just branches into every existing child. Searches without dots are O(length), and dots explore only paths that exist.",
      "A match requires the end-of-word flag at the final node, not just reaching it.",
    ],
    hints: [
      "For \"p.n\", once you fix 'p', which letters are actually worth trying at the dot position?",
      "Store words in a trie; search with a DFS over the pattern index and the current trie node.",
      "dfs(i, node): if i == length return node.isEnd. For a letter, follow that child or fail. For '.', return true if dfs(i + 1, child) succeeds for any non-null child.",
    ],
  },
  "word-search-ii": {
    approach: [
      "Return every word from words that can be traced on board through adjacent cells without reusing a cell. In the example \"tax\" fails because t, a, x are not a connected path.",
      "Running a separate grid search for each word repeats the same exploration many times, O(words x cells x 4^L).",
      "Many words share prefixes, so walk the board once per starting cell while walking a trie of all words alongside. A dead trie branch stops the search immediately, pruning hard.",
      "Avoid duplicate results by clearing a word once found, and restore each cell after backtracking.",
    ],
    hints: [
      "\"cat\" and \"car\" start the same way. Could one walk from 'c' check both at once?",
      "Build a trie of words, then backtracking DFS from each cell, moving through trie children in step with grid cells.",
      "DFS(cell, node): stop if the letter has no trie child; else move to the child, record and null its stored word if present, mark the cell visited, recurse to 4 neighbors, unmark. Prune leaf nodes for speed.",
    ],
  },
  "search-in-a-binary-search-tree": {
    approach: [
      "Return the node in root whose value is val, which is the whole subtree under it, or null if val is absent, as with 5 in example 2.",
      "A full DFS or BFS visits every node, O(n), ignoring the ordering.",
      "At each node, the BST property tells you which side val must be on, so you follow one path down: O(height).",
    ],
    hints: [
      "At root 4 looking for 2, can 2 possibly be in the right subtree?",
      "Walk a single path from the root, iteratively or recursively, choosing a side by comparison.",
      "While node is not null and node.val != val, move to left if val < node.val else right. Return node, which is null if you fell off.",
    ],
  },
  "insert-into-a-binary-search-tree": {
    approach: [
      "Add val, which is not yet in the tree, so root stays a valid BST, and return the root. An empty root means the new node is the root.",
      "Collecting all values, adding val, and rebuilding a tree is O(n) and needlessly restructures it.",
      "Searching for val follows a path that ends at a null where val would have been. Placing a new leaf there keeps every ordering constraint intact, O(height).",
    ],
    hints: [
      "If you searched for 5 in [4,2,7,1,3], where exactly would the search fail?",
      "Do the same comparison walk as a BST search, remembering where you are about to step off.",
      "Recursively: if node is null return new node(val); if val < node.val set node.left = insert(node.left, val), else the right side; return node.",
    ],
  },
  "longest-common-prefix": {
    approach: [
      "Find the longest string every word in strs starts with, such as \"inter\" in example 1, or \"\" when even the first letters differ.",
      "Generating every prefix of the first word and checking it against all words repeats work, O(L^2 x n).",
      "The prefix ends at the first column where any word differs or runs out. Scanning column by column across all words stops there, O(total characters), with no extra structure.",
      "Handle an empty word in strs, or a single word, which is its own prefix.",
    ],
    hints: [
      "Line the words up vertically. At what column does the answer stop growing?",
      "Use the first word as a reference and compare characters vertically across all of strs.",
      "For index i over strs[0], if any word has length <= i or a different char at i, return strs[0].substring(0, i). If the loop finishes, return strs[0].",
    ],
  },
  // heap
  "kth-largest-element-in-a-stream": {
    approach: [
      "After each add(val), return the k-th largest of everything seen, including the initial nums. With k = 3 and [4,5,8,2], add(3) returns 4.",
      "Re-sorting all numbers on each add costs O(n log n) per call, and a sorted list insert is O(n).",
      "Only the k largest values ever matter; anything smaller can never become the k-th largest again. Keep those k in a structure whose smallest is instantly visible: O(log k) per add.",
    ],
    hints: [
      "Once the stream has more than k numbers, can a number below the current k-th largest ever matter again?",
      "Keep exactly k values in a heap; think about which end of those k you need to see quickly.",
      "Use a min-heap: offer val, and if size exceeds k, poll the minimum. The heap top is the answer. Initialize by adding nums the same way.",
    ],
  },
  "last-stone-weight": {
    approach: [
      "Repeatedly smash the two heaviest stones in stones; equal ones vanish, otherwise y - x goes back. Return the last weight or 0, as [3,3] shows.",
      "Sorting after every smash is O(n log n) per turn, O(n^2 log n) total.",
      "You only ever need the two current maxima, and one new value is inserted per turn. A max-ordered priority queue supports exactly that in O(log n) each, O(n log n) total.",
    ],
    hints: [
      "Each turn needs only two numbers from the collection, and then adds back at most one. Which ones?",
      "A heap that hands you the largest element each time.",
      "Push all stones into a max-heap. While size > 1, poll y then x; if y != x offer y - x. Return the top or 0 if empty.",
    ],
  },
  "k-closest-points-to-origin": {
    approach: [
      "Return the k points from points closest to (0, 0), any order. In example 1, [3,3] and [-2,4] have squared distances 18 and 20, beating [5,-1] at 26.",
      "Sorting all points by distance is O(n log n), more than needed when k is small.",
      "You just need the k smallest distances. Keeping a bounded collection where the farthest kept point is easy to evict gives O(n log k). Compare x*x + y*y; square roots are unnecessary.",
    ],
    hints: [
      "Do you need the actual distance, or only to compare distances? Does the order beyond the closest k matter?",
      "Keep a heap of size k, ordered so that the worst point currently kept is on top.",
      "Use a max-heap by x*x + y*y. Offer each point; if size exceeds k, poll the farthest. The remaining k points are the answer. Quickselect gives average O(n).",
    ],
  },
  "kth-largest-element-in-an-array": {
    approach: [
      "Return the value at index k - 1 of nums sorted descending; duplicates count, so [7,7,7,1] with k = 3 gives 7.",
      "Sorting works in O(n log n) but does far more ordering than needed.",
      "Only the top k values matter. A min-heap holding the k largest seen so far leaves the answer on top, O(n log k). Quickselect partitions around a pivot and recurses on one side for average O(n).",
      "Do not deduplicate; the k-th largest counts repeated values separately.",
    ],
    hints: [
      "After processing all of nums, which k values must you have kept, and which one of them is the answer?",
      "A min-heap capped at size k, or a partition-based selection like quicksort that only recurses on one side.",
      "Heap: offer each number, poll when size > k, return the top. Quickselect: target index n - k in ascending order; partition and recurse only into the side containing it, using a random pivot.",
    ],
  },
  "task-scheduler": {
    approach: [
      "Find the minimum time units to run all tasks when equal letters need at least n units between them. A,A,A,B,B,B with n = 2 gives 8: AB_AB_AB.",
      "Simulating unit by unit with a heap of counts and a cooldown queue works but is fiddly and scales with total time.",
      "The most frequent letter dictates the layout: its copies split time into maxCount - 1 frames of length n + 1, plus a final partial frame for letters tied at maxCount. Others fill gaps. The answer is O(n) from counts.",
      "When there are enough distinct tasks, there is no idle time and the answer is just tasks.length, like example 2.",
    ],
    hints: [
      "In example 1, why must there be at least 2 slots between each A? How does the most common letter shape the whole schedule?",
      "Count letter frequencies; only the maximum count and how many letters share it matter.",
      "Answer = max(tasks.length, (maxCount - 1) * (n + 1) + numberOfLettersWithMaxCount). The max covers the case where all idle slots are filled.",
    ],
  },
  "find-median-from-data-stream": {
    approach: [
      "Support addNum and findMedian over all numbers so far; with 1 and 2 the median is 1.5, after adding 3 it is 2.0.",
      "Keeping a sorted list costs O(n) per insert; sorting on each query is O(n log n).",
      "The median only depends on the boundary between the smaller half and the larger half. Keep each half in a heap exposing that boundary, sizes within one, giving O(log n) add and O(1) median.",
      "Return a double, and average the two tops when sizes are equal.",
    ],
    hints: [
      "To find the median, do you need the full sorted order, or just the largest of the lower half and smallest of the upper half?",
      "Two heaps: one for the lower half that exposes its maximum, one for the upper half that exposes its minimum.",
      "Add to the max-heap, move its top to the min-heap, and if the min-heap is larger move its top back. Median is the max-heap top if sizes differ, else the average of both tops.",
    ],
  },
  "top-k-frequent-words": {
    approach: [
      "Return the k most frequent words, highest count first, ties broken alphabetically. In example 1, \"a\" and \"aa\" both appear twice, so \"a\" comes first.",
      "Counting then sorting all distinct words with a two-key comparator is O(m log m); fine, but you can do O(m log k) when k is small.",
      "Count with a hash map, then keep only k candidates in a heap whose top is the worst one: lower count, or alphabetically later on a tie. Popping yields worst-first, so reverse at the end.",
      "Getting the tie order backwards inside the heap is the classic bug; test with example 1.",
    ],
    hints: [
      "Two words with equal counts: which one should be evicted first if you can only keep k?",
      "A frequency map, then a size-k heap with a comparator using count first and the word second.",
      "Min-heap ordering: lower count first; if counts tie, the lexicographically larger word first. Offer each word, poll when size > k, then pop all and reverse.",
    ],
  },
  "furthest-building-you-can-reach": {
    approach: [
      "Go as far right in heights as possible; each upward step of d costs d bricks or one ladder. Return the last reachable index, 4 in example 1.",
      "Trying every assignment of ladders to climbs is exponential; deciding greedily at each climb without hindsight can waste a ladder on a small step.",
      "Ladders are best spent on the biggest climbs so far. Tentatively use ladders, and once you have more climbs than ladders, pay bricks for the smallest one. O(n log ladders).",
      "Down or level steps cost nothing; return i as soon as bricks would go negative going to i + 1.",
    ],
    hints: [
      "If you have one ladder and climbs of 5, 2, and 3, which climb should the ladder cover in hindsight?",
      "A min-heap of climbs currently covered by ladders, capped at the number of ladders.",
      "For each climb d > 0, push d; if heap size > ladders, subtract the polled minimum from bricks. If bricks < 0 return i, else continue. If you finish, return the last index.",
    ],
  },
  "ipo": {
    approach: [
      "Starting with capital w, pick at most k projects in sequence; each needs capital[i] and adds profits[i]. Maximize the final capital, 4 in example 1.",
      "Scanning all projects each round for the best affordable one is O(k x n).",
      "Capital only grows, so a project once affordable stays affordable. Among affordable projects, always take the most profitable. Sort by capital, unlock with a pointer, and use a max-heap of profits: O(n log n + k log n).",
      "Stop early when nothing is affordable, as in example 2 where w = 0 cannot start any project.",
    ],
    hints: [
      "As w grows, does the set of projects you can start ever shrink? Among the startable ones, which should you take?",
      "Sort projects by required capital and keep a heap of profits for the ones you can currently afford.",
      "Each round, advance a pointer adding profits of projects with capital <= w to a max-heap; if it is empty, stop; otherwise w += poll(). Repeat up to k times.",
    ],
  },

  // intervals-greedy
  "maximum-subarray": {
    approach: [
      "You need the largest sum of any contiguous, non-empty slice of nums. In [3,-4,5,-1,2,-6] the answer 6 comes from [5,-1,2].",
      "Trying every start and end pair is O(n^2), or O(n^3) if you re-add each slice. With prefix sums it is still quadratic, which is too slow for large arrays.",
      "A run ending at index i is either nums[i] alone or the best run ending at i-1 plus nums[i]. A negative running sum can only hurt what follows, so drop it. One pass, O(n) time, O(1) space.",
      "If every number is negative, like [-7], the answer is the largest single element, not 0. Do not initialise the best to 0.",
    ],
    hints: [
      "In [3,-4,5,-1,2,-6], why does the best slice not include the 3? What does the running sum look like just before the 5?",
      "Scan left to right keeping one number: the best sum of a slice that must end at the current index. Keep a separate overall best.",
      "Set cur to the larger of nums[i] and cur + nums[i], then update best with cur. Start both from nums[0] so all-negative arrays work.",
    ],
  },
  "jump-game": {
    approach: [
      "Starting at index 0, each nums[i] is a maximum jump length. Decide whether some sequence of jumps lands on the last index.",
      "Trying every jump choice recursively explodes exponentially, and even memoised DP checking every reachable target is O(n^2).",
      "You never need to know which path you took, only how far right you can possibly get. Reachable indices always form a prefix, so one running maximum of i + nums[i] decides everything in O(n).",
      "Zeros are the trap: in [1,0,2] you reach index 1 but its 0 strands you before index 2.",
    ],
    hints: [
      "If you can reach index 5, can you also reach index 3? What does that say about the shape of the set of reachable indices?",
      "Walk left to right maintaining one number: the farthest index reachable using any index you have already confirmed reachable.",
      "For each i, if i is greater than farthest, return false; otherwise set farthest to max(farthest, i + nums[i]). Return true once farthest reaches the last index.",
    ],
  },
  "merge-intervals": {
    approach: [
      "Collapse every chain of overlapping or touching intervals into one, and return the result ordered by start. [[4,7],[1,4]] becomes [[1,7]] because 4 touches 4.",
      "Comparing every pair and merging repeatedly until nothing changes is O(n^2) or worse, since one merge can create a new overlap.",
      "Once sorted by start, any interval that overlaps an earlier group must overlap the most recent merged interval. So one linear scan after an O(n log n) sort suffices.",
      "When extending, take the max of the two ends: [1,10] followed by [2,3] must stay [1,10], not shrink to [1,3].",
    ],
    hints: [
      "The first example is given out of order. Would the problem be easier if intervals arrived in some particular order?",
      "Sort by start, then keep an output list and only ever compare the current interval with the last one in that list.",
      "If current start is at most the last merged end (touching counts), set last end to max(last end, current end); otherwise append current as a new interval.",
    ],
  },
  "insert-interval": {
    approach: [
      "intervals is already sorted and disjoint; add newInterval and merge whatever it overlaps so the list stays sorted and disjoint.",
      "Appending newInterval and re-running a full sort-and-merge works but costs O(n log n) and ignores that the input is already sorted.",
      "Because the list is sorted and disjoint, the intervals newInterval touches form one consecutive block. Everything before ends earlier, everything after starts later, so a single O(n) pass handles it.",
      "newInterval may sit entirely before all intervals, as in [[3,5]] with [1,2], or after all of them; make sure it still gets added.",
    ],
    hints: [
      "Given the list is sorted and non-overlapping, which existing intervals can newInterval possibly touch? Are they scattered or grouped together?",
      "Walk once with an index, splitting the work into intervals strictly left of newInterval, overlapping it, and strictly right of it.",
      "Copy while end is less than newInterval's start; then while start is at most newInterval's end, widen it with min starts and max ends; append it, then copy the rest.",
    ],
  },
  "non-overlapping-intervals": {
    approach: [
      "Remove as few intervals as possible so the rest are pairwise non-overlapping; touching endpoints like [1,2] and [2,3] are fine. Equivalently, keep as many as possible.",
      "Trying every subset to keep is exponential, and a DP over intervals sorted by start is O(n^2).",
      "This is activity selection: among conflicting intervals, the one that ends earliest leaves the most room for the rest. Sorting by end and greedily keeping gives the maximum kept set in O(n log n).",
      "Sorting by start instead fails: a long early interval like [1,100] would block many short ones.",
    ],
    hints: [
      "In [[1,2],[2,3],[3,4],[1,3]], which interval would you throw away and why? What is special about it compared with [1,2]?",
      "Flip the question to maximising intervals kept, then sort by one endpoint and decide keep or drop in a single pass.",
      "Sort by end, track lastEnd of the last kept interval. If start is less than lastEnd, count a removal; otherwise keep it and set lastEnd to its end.",
    ],
  },
  "gas-station": {
    approach: [
      "Find the station index from which, starting empty and adding gas[i] then spending cost[i] at each step, the tank never goes negative for a full loop. Return -1 if none works.",
      "Simulating a full lap from every start is O(n^2), which is too slow when there are many stations.",
      "If sum(gas) is at least sum(cost) a start always exists. And if starting at s fails first at k, every start between s and k also fails at k, so you can jump the candidate to k + 1. One O(n) pass.",
    ],
    hints: [
      "Before searching for a start, can you tell from the totals alone whether any start could possibly work, as in gas = [4], cost = [5]?",
      "Keep a running tank of gas[i] - cost[i] from a candidate start, and think about what a negative tank says about the stations you skipped over.",
      "If total gas minus total cost is negative, return -1. Otherwise, whenever tank drops below 0 at i, set start to i + 1 and reset tank to 0; return start.",
    ],
  },
  "jump-game-ii": {
    approach: [
      "The last index is guaranteed reachable; you want the minimum number of jumps from index 0, where nums[i] caps the jump length from i.",
      "A DP where each index relaxes all indices it can reach is O(n^2), and exploring jump sequences directly is exponential.",
      "Indices reachable in exactly j jumps form a contiguous window, and the next window extends to the farthest i + nums[i] within it. Counting how many windows you cross is a BFS without a queue, O(n).",
      "Do not count a jump when you are already standing on the last index; loop only up to n - 2.",
    ],
    hints: [
      "In [2,3,1,1,4], list every index you can reach with one jump, then with two. What shape do those groups have?",
      "Treat each group as a BFS level over a range of indices, tracking where the current level ends and how far the next level can reach.",
      "For i from 0 to n - 2, update farthest with i + nums[i]; when i equals currentEnd, increment jumps and set currentEnd to farthest.",
    ],
  },
  "meeting-rooms": {
    approach: [
      "One person must attend every meeting in intervals, so you are checking whether any two meetings overlap. A meeting ending at 5 and one starting at 5 is fine.",
      "Comparing every pair of meetings is O(n^2), which is wasteful when only neighbouring meetings in time can clash first.",
      "After sorting by start, if any overlap exists then some meeting overlaps the one just before it. So check adjacent pairs only, O(n log n) total.",
      "Use strict comparison: a clash means next start is less than previous end, not less than or equal.",
    ],
    hints: [
      "In [[0,30],[5,10],[15,20]], which pair causes the conflict? Would you notice it faster if the meetings were in time order?",
      "Sort the meetings by start time and compare each one only with the meeting immediately before it.",
      "Return false as soon as intervals[i][0] is less than intervals[i-1][1]; if no adjacent pair clashes, return true.",
    ],
  },
  "meeting-rooms-ii": {
    approach: [
      "Find the minimum number of rooms so no two meetings in the same room overlap. That equals the maximum number of meetings running at any instant, with a room freed at 5 reusable at 5.",
      "Checking each time point or comparing every meeting against all others is O(n^2) or depends on the time range.",
      "Process meetings by start time; at each start you only need to know which busy room frees up earliest. A min-heap of end times gives that in O(log n), so O(n log n) overall.",
      "The tie rule matters: free a room when its end is at most the new start, otherwise [[1,5],[5,8]] wrongly needs 2 rooms.",
    ],
    hints: [
      "In [[0,30],[5,10],[15,20]], at what moment are the most meetings happening at once? How does that relate to the answer 2?",
      "Sort by start and keep the end times of rooms currently in use in a structure that quickly gives the smallest end.",
      "For each meeting, if the heap's minimum end is at most its start, pop it; then push its end. The answer is the heap's largest size.",
    ],
  },
  // backtracking
  "subsets": {
    approach: [
      "Produce the power set of nums: all 2^n subsets of the distinct values, including [] and the full set, each exactly once.",
      "Building subsets by adding elements in every order generates the same set many times, like [2,4] and [4,2], and then you must deduplicate.",
      "Each element is independently in or out, so a decision per index in a fixed order creates every subset exactly once. Output size forces O(n * 2^n) time.",
      "Add a copy of the current path to the result, not the path itself, or later changes will overwrite saved subsets.",
    ],
    hints: [
      "For nums = [2,4], there are 4 subsets. Where does the number 4 come from, in terms of a choice made for each element?",
      "Recurse over indices in order, carrying a current path, and only ever add elements that come after the last one you added.",
      "At index i either skip or take nums[i] and recurse to i + 1, undoing the take afterwards; when i equals n, record a copy of the path.",
    ],
  },
  "combination-sum": {
    approach: [
      "From distinct candidates, list every multiset that sums to target, where a value may repeat. [2,2,3] and [3,2,2] count as the same combination.",
      "Trying sequences in any order finds [2,2,3], [2,3,2] and [3,2,2] separately, then needs deduplication, and wastes huge amounts of work.",
      "Fix an order: only choose candidates at or after the index of the last one picked. Staying on the same index allows reuse, moving forward prevents duplicates.",
      "Stop a branch once the remaining sum goes negative; sorting candidates lets you break out of the loop early.",
    ],
    hints: [
      "For candidates = [2,3,6,7], target = 7, how would you avoid listing both [2,2,3] and [3,2,2] without comparing results afterwards?",
      "Backtrack with a remaining amount and a start index, choosing the next number only from candidates[start] onward.",
      "Loop i from start; if candidates[i] is at most remaining, add it and recurse with remaining minus it and the same i, then remove it. Record when remaining is 0.",
    ],
  },
  "permutations": {
    approach: [
      "List all n! orderings of the distinct values in nums; for [0,1] that is [0,1] and [1,0].",
      "Generating every length-n sequence with repetition and filtering those that use each value once costs n^n, far more than n!.",
      "Fill positions one at a time, choosing any value not yet used. Tracking a used flag per index makes each choice O(1), giving O(n * n!) overall, which is the output size.",
      "Unlike subsets, there is no start index here: every unused value is allowed at every position.",
    ],
    hints: [
      "For the first slot you have n options, then n - 1 for the next. What must you remember at each step to know your options?",
      "Recurse by position, keeping a boolean array of which indices of nums are already in the current path.",
      "For each unused i: mark it, append nums[i], recurse, then pop and unmark. When the path length equals n, save a copy.",
    ],
  },
  "subsets-ii": {
    approach: [
      "Like the power set, but nums may contain repeats, so [1,2] built from either of the two 2s in [1,2,2] must appear only once.",
      "Generating all 2^n index subsets and deduplicating with a set of sorted lists works, but it does wasted work and needs extra memory for the hash set.",
      "Sort nums so equal values sit together. Then duplicates arise only when, at the same recursion level, you start a branch with a value equal to the one just tried, so skip those.",
      "Skip only at the same level (i greater than start), not deeper; otherwise [2,2] and [4,4,4] are lost.",
    ],
    hints: [
      "With [4,4,4] the answer has 4 subsets, not 8. What distinguishes the subsets you keep: which 4s are chosen, or how many?",
      "Sort first, then use the loop-over-next-choice style of recursion with a start index, and decide when an equal value should be skipped.",
      "Record the path at every call. In the loop, skip i when i is greater than start and nums[i] equals nums[i-1]; otherwise add, recurse with i + 1, and remove.",
    ],
  },
  "word-search": {
    approach: [
      "Decide whether word can be traced through adjacent cells of board, moving up, down, left or right, never reusing a cell within one path.",
      "Enumerating all simple paths in the grid is hopeless; even all paths of length len(word) blow up without early pruning.",
      "Match word one character at a time with DFS from every cell, abandoning a branch as soon as a character mismatches. Mark cells as visited while on the current path and unmark on return. Roughly O(m * n * 3^L).",
      "Forgetting to restore a cell after backtracking blocks other paths. In the examples \"abcd\" fails because b and c are diagonal, not adjacent.",
    ],
    hints: [
      "In the 2x2 example, why is \"abdc\" possible but \"abcd\" not? Which move does the second word require that the grid does not allow?",
      "Use depth-first search from each cell, carrying the index in word you are trying to match next, and track which cells the current path uses.",
      "dfs(r, c, k) fails if out of bounds or board[r][c] is not word[k]; succeeds if k is the last index. Temporarily overwrite the cell, try four neighbours, then restore.",
    ],
  },
  "n-queens": {
    approach: [
      "Return every arrangement of n queens on an n x n board with no shared row, column or diagonal, each drawn as strings of 'Q' and '.'. For n = 2 there are none.",
      "Trying all ways to place n queens on n^2 squares is astronomically large, and checking validity by scanning the board each time adds more cost.",
      "Exactly one queen per row, so recurse by row and choose a column. Squares on the same diagonal share r - c, and anti-diagonal r + c, so three sets give O(1) conflict checks.",
      "Offset r - c (for example add n - 1) if you use arrays instead of sets, since it can be negative.",
    ],
    hints: [
      "Since no two queens may share a row, how many queens end up in each row? How does that shrink the choices?",
      "Recurse row by row, and keep track of which columns and which diagonals are already attacked so you can test a square instantly.",
      "Square (r, c) is safe if c, r - c and r + c are all unused. Place, add to the three sets, recurse to r + 1, then remove. At r equal to n, build the strings.",
    ],
  },
  "combination-sum-ii": {
    approach: [
      "Find every distinct combination summing to target, using each array position at most once, while candidates can contain repeats like the three 2s in [2,5,2,1,2].",
      "Generating all subsets and deduplicating with a set is O(2^n) with extra hashing, and does not prune sums that already exceed target.",
      "Sort so equal values are adjacent. Moving to i + 1 after a pick enforces single use, and skipping a value equal to its predecessor at the same level removes duplicate combinations. Sorting also lets you break once a value exceeds the remainder.",
      "[3,3,3] with target 6 should give [3,3] once; skip only same-level repeats, not deeper ones.",
    ],
    hints: [
      "In [2,5,2,1,2], there are three ways to pick two of the 2s for [1,2,2]. How could you make sure only one of those is explored?",
      "Sort the array, then backtrack with a start index and remaining sum, and add a rule that skips some equal values in the loop.",
      "Loop i from start: skip if i is greater than start and candidates[i] equals candidates[i-1]; break if it exceeds remaining; otherwise pick it, recurse with i + 1, and unpick.",
    ],
  },
  "letter-combinations-of-a-phone-number": {
    approach: [
      "Each digit in digits maps to 3 or 4 letters; return every string formed by picking one letter per digit, in digit order. An empty digits gives [], not [\"\"].",
      "Nested loops work for a fixed length but you cannot write a variable number of loops, which is exactly what recursion replaces.",
      "Treat each digit as one level of a decision tree whose branches are its letters. Depth-first building of a string visits every leaf once, O(4^n * n).",
      "Handle the empty input explicitly, or you will return a list containing one empty string.",
    ],
    hints: [
      "For \"23\" you need \"ad\", \"ae\" ... \"cf\". How would you write it with loops, and why does that break when the length of digits varies?",
      "Recurse with the index of the current digit and a partial string, branching over that digit's letters from a fixed mapping table.",
      "At index i, for each letter of map[digits[i]], append it, recurse to i + 1, then remove it. When i equals the length, add the string. Return [] early for empty input.",
    ],
  },
  "palindrome-partitioning": {
    approach: [
      "Cut s into consecutive pieces so every piece reads the same backwards, and list every such way. \"aba\" gives [a,b,a] and [aba].",
      "Trying all 2^(n-1) cut patterns and then checking each piece wastes work on partitions whose first piece is already not a palindrome.",
      "Choose the first piece only among palindromic prefixes, then solve the rest recursively. Precomputing a palindrome table with DP makes each check O(1); output size still makes it O(n * 2^n).",
    ],
    hints: [
      "For \"aba\", what are all the possible first pieces? Which of them are palindromes, and what is left to split after each?",
      "Backtrack over the starting position, trying each end position for the next piece and only continuing when that piece is a palindrome.",
      "From start i, for each j from i to n - 1 where s[i..j] is a palindrome (isPal[i][j] true when ends match and the inside is a palindrome), add it, recurse from j + 1, remove it.",
    ],
  },

// graphs-grids
  "number-of-islands": {
    approach: [
      "You are counting groups of \"1\" cells in grid that touch up, down, left or right. Diagonal touches do not merge islands, which is why the first example has 5 islands, not 1.",
      "Comparing every land cell with every other to decide grouping is quadratic in cells and awkward to merge. You want each cell handled a constant number of times.",
      "An island is fully discovered the moment you explore outward from any one of its cells. So scan cells; each unvisited land cell starts a new island, and you explore and mark all of it. O(rows * cols).",
      "Mark cells visited as soon as you push or enter them, or you will revisit them and may overflow the stack on large grids.",
    ],
    hints: [
      "In the first example, why are the corner 1s separate islands even though they look close? What makes two land cells part of the same island?",
      "Use a DFS or BFS flood from each land cell you find, marking visited cells (or overwriting them with \"0\") so they are never counted again.",
      "Loop over all cells; when grid[r][c] is \"1\", increment the count and flood the four directions, turning every reached \"1\" into \"0\". The count at the end is the answer.",
    ],
  },
  "max-area-of-island": {
    approach: [
      "Among all groups of 1s connected in four directions, return the size of the biggest one, or 0 when grid has no 1s at all, as in the second example.",
      "Recomputing an island's size from each of its cells repeats the same work many times. Each cell should belong to exactly one size computation.",
      "Exploring an island from any cell reaches all of it, so the exploration itself can count cells. Take the maximum count over all explorations. O(rows * cols).",
    ],
    hints: [
      "If you start from one land cell and visit everything connected to it, how many cells did you touch? That number is the island's area.",
      "Use a flood fill (DFS or BFS) that marks cells visited and returns how many cells it visited.",
      "dfs(r, c) returns 0 if out of bounds or not 1; otherwise set grid[r][c] = 0 and return 1 plus dfs of the four neighbours. Track max over all starting cells.",
    ],
  },
  "clone-graph": {
    approach: [
      "Given one node, build a separate graph with new nodes that have the same val values and the same neighbor connections. No new node may point back into the original graph.",
      "Copying neighbors naively by recursing on each one loops forever, because the graph is undirected: node 1 lists 2, and 2 lists 1.",
      "Every original node must map to exactly one copy. Remembering original-to-copy lets you reuse a copy when you meet a node again, which both wires edges correctly and stops cycles. O(V + E).",
      "The second example is a single node with no neighbors; also handle a null input by returning null.",
    ],
    hints: [
      "When you reach node 2 from node 1, then reach node 1 again from node 2, how do you know a copy of node 1 already exists?",
      "Keep a hash map from original node to its clone, and traverse the graph with DFS or BFS.",
      "On visiting a node: if it is in the map, return its clone. Otherwise create the clone, store it in the map first, then append clone(neighbor) for every neighbor.",
    ],
  },
  "rotting-oranges": {
    approach: [
      "Return the number of minutes until no fresh orange (1) remains, given rot spreads one step per minute from every rotten orange (2) at once. Return -1 if some fresh orange can never rot, as in the second example.",
      "Simulating minute by minute with a full grid scan each time costs O((rows * cols)^2) in the worst case, because you re-scan cells that have not changed.",
      "All rotten oranges spread in parallel, so the rot front is a breadth-first wave starting from all of them together. The number of wave layers is the minutes. O(rows * cols).",
      "If there are no fresh oranges at the start the answer is 0, even with no rotten ones.",
    ],
    hints: [
      "If two rotten oranges start in different corners, do they spread one after the other or at the same time? How should that affect where you start?",
      "Use BFS seeded with every rotten orange at once, and count fresh oranges up front so you can tell at the end whether any are left.",
      "Process the queue one level at a time; each level that rots at least one new orange adds a minute. Decrement the fresh count on every rot; return minutes if fresh is 0, else -1.",
    ],
  },
  "pacific-atlantic-water-flow": {
    approach: [
      "Return every cell [r, c] in heights from which rain can reach both the Pacific (top or left edge) and the Atlantic (bottom or right edge), flowing only to neighbours of equal or lower height.",
      "Running a search downhill from every cell to see which oceans it reaches is O((rows * cols)^2) and repeats the same exploration for neighbouring cells.",
      "Reverse the flow: the cells that can drain into an ocean are exactly those reachable from that ocean's edge by climbing to equal or higher neighbours. Do one such search per ocean and intersect. O(rows * cols).",
      "The moves are \"at least as high\" while climbing, so equal heights are allowed; with heights = [[1]] the single cell touches both oceans.",
    ],
    hints: [
      "Instead of asking where water from each cell goes, can you ask which cells the ocean can be reached from, starting at the ocean side?",
      "Run two DFS or BFS searches, one seeded with all Pacific edge cells and one with all Atlantic edge cells, each with its own visited grid.",
      "From a cell, move to a neighbour only if its height is greater than or equal to the current cell's. Answer: cells marked in both visited grids.",
    ],
  },
  "surrounded-regions": {
    approach: [
      "Change to 'X' every region of 'O' cells that does not touch the edge of board; regions connected to the border stay 'O'. You modify board in place.",
      "Checking each region by exploring it and then deciding whether it touched the border works but needs a second pass to flip it, and is easy to get wrong when you stop early.",
      "Only one thing saves a region: a connection to a border 'O'. So find the safe cells directly by exploring from border 'O's, and every other 'O' must be enclosed. O(rows * cols).",
    ],
    hints: [
      "Which 'O' cells can never be flipped, no matter what the rest of the board looks like? Start your thinking from them.",
      "Flood fill from every 'O' on the four borders, temporarily marking reached cells with a placeholder such as '#'.",
      "After marking, sweep the board: remaining 'O' becomes 'X' (enclosed) and '#' goes back to 'O'. Every cell is touched a constant number of times.",
    ],
  },
  "flood-fill": {
    approach: [
      "Repaint image[sr][sc] and every pixel connected to it in four directions that shares its original colour with color, then return image.",
      "There is no real slow brute force here; the risk is getting the stopping rule wrong, which leads to infinite recursion.",
      "Record the original colour first. A pixel belongs to the region only if it still has that colour, so painting it acts as the visited mark. O(rows * cols).",
      "If color already equals the original colour, as in the second example, return immediately; otherwise painted cells still match and the search never ends.",
    ],
    hints: [
      "Look at the second example where the new colour is 5 and the pixel is already 5. What goes wrong if you search anyway?",
      "Use DFS or BFS from (sr, sc), moving only to in-bounds neighbours whose value equals the original colour.",
      "Save orig = image[sr][sc]; if orig == color return. Otherwise paint each visited cell with color before exploring its four neighbours; the new colour prevents revisits.",
    ],
  },
  "01-matrix": {
    approach: [
      "For each cell of mat, output how many four-direction steps it is from the closest 0. Cells that are 0 get 0.",
      "Running a BFS from every 1 to find its nearest 0 costs O((rows * cols)^2) on a mostly-1 matrix.",
      "Flip the direction: start from all 0s together and expand outward. The first time the wave reaches a cell, it arrived from its nearest 0, so that distance is final. O(rows * cols).",
    ],
    hints: [
      "Distances are measured to the nearest 0. What if all the 0s started searching at the same moment instead of each 1 searching on its own?",
      "Use a multi-source BFS: put every 0 in the queue first with distance 0, and mark 1s as unknown (for example -1 or infinity).",
      "Pop a cell; for each neighbour still unknown, set dist = current dist + 1 and push it. Each cell is assigned once, which is its shortest distance.",
    ],
  },
  "shortest-path-in-binary-matrix": {
    approach: [
      "Find the fewest cells on a path from (0, 0) to (n - 1, n - 1) through 0 cells, where each step can go to any of the 8 surrounding cells. Return -1 if impossible.",
      "Trying all paths with DFS is exponential, and DFS does not find the shortest path first.",
      "Every step costs the same, so BFS reaches each cell first along a shortest route. Count cells, not moves, so the start counts as 1. O(n^2).",
      "If grid[0][0] or grid[n - 1][n - 1] is 1 the answer is -1 immediately; a 1 by 1 grid with a 0 returns 1.",
    ],
    hints: [
      "In the first example the answer is 2 for a diagonal move. What is being counted, and which moves are allowed that you normally exclude?",
      "Use BFS from (0, 0) with all 8 direction offsets, storing the path length (in cells) for each visited cell.",
      "Start with length 1; when you pop a cell, push each unvisited open neighbour with length + 1 and mark it visited at push time. Return the length when the target is popped.",
    ],
  },
// topo-union-find
  "course-schedule": {
    approach: [
      "With numCourses courses and pairs [a, b] meaning b must come before a, decide whether some order takes every course. The second example fails because 0 and 1 require each other.",
      "Trying orderings of the courses is factorial. You need to recognise impossibility directly from the dependencies.",
      "Finishing everything is impossible exactly when the dependency graph contains a cycle. A course with no remaining prerequisites can always be taken next, so repeatedly taking such courses detects whether all can be taken. O(V + E).",
    ],
    hints: [
      "Which course can you definitely take first? What does it mean if at some point no remaining course is free of prerequisites?",
      "Build an adjacency list b to a and count each course's unmet prerequisites (in-degree); process courses with in-degree 0 using a queue.",
      "Pop a course, count it taken, and decrement in-degree of courses that depend on it, enqueueing any that hit 0. Return taken == numCourses.",
    ],
  },
  "course-schedule-ii": {
    approach: [
      "Same rules as Course Schedule, but return an actual valid order of all numCourses courses, or an empty array when a cycle makes it impossible.",
      "Generating permutations and checking each against prerequisites is factorial time.",
      "The order in which you can take prerequisite-free courses one by one is itself a valid order. If the process stalls before all courses come out, a cycle exists. O(V + E).",
      "Courses with no prerequisites at all still need to appear in the output; seed them all at the start.",
    ],
    hints: [
      "In the first example, course 2 has no prerequisites. After taking it, which course becomes available, and what does that suggest about building the order?",
      "Use in-degree counts and a queue of courses with in-degree 0 (Kahn's algorithm), appending each popped course to the result.",
      "Pop a course, append it, decrement its dependents' in-degrees and enqueue those reaching 0. If the result length is less than numCourses, return an empty array.",
    ],
  },
  "number-of-connected-components-in-an-undirected-graph": {
    approach: [
      "Given n nodes and undirected edges, count how many separate groups of nodes there are. Isolated nodes count as their own group, as the second example with no edges shows.",
      "Checking reachability between every pair of nodes is at least O(n^2) and repeats work.",
      "Each node starts alone, and each edge either joins two different groups (reducing the count by one) or lands inside one group (no change). Tracking group membership gives the answer in near O(n + E).",
    ],
    hints: [
      "With no edges you have n components. What happens to that count each time you add an edge?",
      "Use union-find over the n nodes (or DFS from each unvisited node), starting with a count of n.",
      "For each edge [u, v], find both roots; if they differ, union them and decrement the count. Path compression and union by rank keep finds near constant.",
    ],
  },
  "redundant-connection": {
    approach: [
      "A tree on nodes 1 to n got one extra edge, creating exactly one cycle. Return the edge from edges to remove, picking the one that appears last in the input if several would work.",
      "Removing each edge in turn and checking if the rest is a tree is O(n^2).",
      "Add edges in input order while tracking which nodes are already connected. The first edge connecting two already-connected nodes closes the cycle, and because it is processed latest among the cycle edges it is the one to return. Near O(n).",
    ],
    hints: [
      "Building the graph one edge at a time, at what exact moment does a cycle first appear?",
      "Use union-find over nodes 1 to n, processing edges in the given order.",
      "For each [u, v], if find(u) == find(v) return [u, v]; otherwise union them. The first such edge is the latest-listed cycle edge, as required.",
    ],
  },
  "graph-valid-tree": {
    approach: [
      "Decide whether n nodes with the given undirected edges form one connected graph with no cycles. The second example has no cycle but is split into two parts, so it is false.",
      "Running a separate cycle check and a separate connectivity check with full traversals is fine, but you can decide it more simply.",
      "A tree on n nodes has exactly n - 1 edges. With that edge count, having no cycle forces the graph to be connected, so you only need to check the count and cycles. Near O(n).",
    ],
    hints: [
      "How many edges does any tree with n nodes have? What can you conclude immediately if edges has a different length?",
      "First check edges.length == n - 1, then use union-find to look for an edge that joins two nodes already connected.",
      "If the count is wrong return false. Otherwise for each edge, if both ends share a root return false, else union. If you finish, return true.",
    ],
  },
  "alien-dictionary": {
    approach: [
      "words is sorted by an unknown letter order. Return a string with every letter that appears in words, in an order consistent with that sorting, or \"\" if the input is contradictory.",
      "Trying every permutation of the letters and checking that words is sorted is factorial.",
      "Only adjacent words give information, and only at their first differing letter: that letter in the first word comes before the one in the second. That yields precedence edges to topologically sort. O(total characters).",
      "If a word is followed by its own proper prefix, as in [\"abc\", \"ab\"], the input is invalid; return \"\". Letters with no edges must still appear.",
    ],
    hints: [
      "In [\"z\", \"x\"], what does the ordering tell you about z and x? Which positions in a pair of adjacent words carry information?",
      "Build a directed graph on letters from each adjacent pair's first difference, then topologically sort it with in-degrees.",
      "Add every seen letter as a node. For each adjacent pair, add one edge at the first differing index, or return \"\" on the prefix case. If Kahn's output misses letters, return \"\".",
    ],
  },
  "number-of-provinces": {
    approach: [
      "isConnected is an n by n matrix where 1 means two cities are directly linked. Count groups of cities linked directly or through other cities.",
      "Building an explicit edge list first is unnecessary; the matrix already is the graph, and checking reachability for each pair separately is wasteful.",
      "This is connected components counting. Since the matrix is symmetric, scanning one triangle gives every edge once. Total O(n^2), which is the input size.",
    ],
    hints: [
      "If city 0 links to 1 and 1 links to 2, are 0 and 2 in the same province? What process groups them together?",
      "Use DFS from each unvisited city, or union-find over the cities using the matrix entries as edges.",
      "Start with n provinces; for every i < j with isConnected[i][j] == 1, union them and decrement on a successful merge. Or count how many DFS starts you make.",
    ],
  },
  "find-eventual-safe-states": {
    approach: [
      "graph[i] lists node i's outgoing edges. A node is safe if every path from it ends at a node with no outgoing edges. Return the safe nodes in increasing order.",
      "Enumerating every path from each node to check where it ends can blow up exponentially.",
      "A node is safe when all its targets are safe, and nodes with no outgoing edges are safe. Working backwards from those terminals, a node becomes safe once all its out-edges are accounted for; cycle nodes never get there. O(V + E).",
      "A self-loop like graph = [[0]] makes that node unsafe.",
    ],
    hints: [
      "Which nodes are obviously safe? Once you know them, which other nodes become safe as a result?",
      "Reverse the edges and run Kahn's algorithm, using each node's out-degree in the original graph as its counter.",
      "Queue nodes with out-degree 0. Pop one, mark it safe, and for each original predecessor decrement its out-degree, queueing it at 0. Return the safe nodes sorted.",
    ],
  },
  "minimum-height-trees": {
    approach: [
      "edges form a tree on nodes 0 to n - 1. Return all nodes that, used as the root, give the smallest height. There are always one or two such nodes.",
      "Running a BFS from every node to measure height is O(n^2), too slow for large n.",
      "The best roots sit in the middle of the tree's longest path. Repeatedly removing all current leaves shrinks every long path from both ends equally, so the last one or two nodes left are the centres. O(n).",
      "When n is 1 the answer is [0]; with n = 2 both nodes are answers, as the example shows.",
    ],
    hints: [
      "Rooting at a leaf usually gives a tall tree. If you trimmed the leaves off, would the best root change?",
      "Track each node's degree and remove all degree-1 nodes layer by layer with a queue, like Kahn's algorithm on an undirected tree.",
      "While more than 2 nodes remain, remove the whole current leaf layer, decrementing neighbours' degrees and collecting those that become 1 as the next layer. The remaining nodes are the answer.",
    ],
  },
// shortest-paths
  "network-delay-time": {
    approach: [
      "A signal starts at node k and travels along directed weighted edges in times. Return how long until all n nodes have received it, or -1 if some never do.",
      "Exploring all paths from k to find each node's earliest arrival is exponential, and plain BFS ignores the weights.",
      "Each node receives the signal at its shortest-path distance from k, and all nodes are reached when the furthest one is. Weights are non-negative, so Dijkstra gives every distance; the answer is the maximum. O(E log V).",
    ],
    hints: [
      "When does a particular node first hear the signal? Once you know that for every node, what single number is the answer?",
      "Use Dijkstra from k with a min-heap ordered by arrival time, over an adjacency list built from times.",
      "Pop the smallest (time, node); skip it if already finalised. Relax each edge to dist + w. At the end, if fewer than n nodes are finalised return -1, else the largest distance.",
    ],
  },
  "cheapest-flights-within-k-stops": {
    approach: [
      "Find the cheapest price from src to dst using at most k intermediate stops, which means at most k + 1 flights. With k = 0 the example must take the direct 500 flight.",
      "Plain Dijkstra on price can lock in a cheap route with too many stops and discard a slightly pricier route that fits the limit.",
      "The limit is on the number of flights, so build costs by flight count: after round i you know the cheapest price using at most i flights. Run k + 1 rounds. O(k * E).",
      "Each round must read prices from the previous round only, or one round could chain several flights.",
    ],
    hints: [
      "In the example, why is 200 right for k = 1 but 500 right for k = 0? What quantity besides price must you keep track of?",
      "Use a Bellman-Ford style relaxation over all flights, repeated exactly k + 1 times.",
      "Each round, copy prices into temp; for every [u, v, p] with prices[u] finite, set temp[v] = min(temp[v], prices[u] + p). Then prices = temp. Answer prices[dst] or -1.",
    ],
  },
  "path-with-minimum-effort": {
    approach: [
      "Choose a route from top-left to bottom-right through heights so that the largest absolute height difference between consecutive cells is as small as possible. Return that value.",
      "Trying all routes is exponential, and summing the differences, as normal shortest path does, measures the wrong thing.",
      "A route's cost is its single worst step, and extending a route never lowers that worst step. That monotonic cost lets you expand cells in order of smallest effort so far. O(rows * cols * log). Binary search on effort with BFS also works.",
    ],
    hints: [
      "In heights = [[1,10]] the answer is 9. If a route has steps 1, 5 and 2, what is its effort?",
      "Use Dijkstra on cells with a min-heap, where a cell's cost is the best maximum step seen on a path to it.",
      "Pop the lowest-effort cell; for each neighbour compute max(effort, abs(height difference)) and push it if that improves the neighbour's best. Return the effort when the bottom-right cell is popped.",
    ],
  },
  "min-cost-to-connect-all-points": {
    approach: [
      "Connect all points so every point is reachable from every other, where a link costs the Manhattan distance between its endpoints. Return the minimum total cost; one point costs 0.",
      "Trying every set of n - 1 links is exponential, and even listing all n^2 possible links for sorting costs O(n^2 log n) time and O(n^2) memory.",
      "This is a minimum spanning tree on a complete graph. Growing the tree from one point and always attaching the closest outside point works, and with a plain array of best distances it costs O(n^2) with no edge list.",
    ],
    hints: [
      "Every pair of points could be linked. Do you need cycles? How many links does the cheapest connected result have?",
      "Use Prim's algorithm, keeping for each point not yet in the tree its cheapest distance to any point in the tree.",
      "Repeatedly pick the outside point with the smallest best distance, add that distance to the total, then update every other outside point's best with its distance to the new point.",
    ],
  },
  "swim-in-rising-water": {
    approach: [
      "At time t you can swim through any cell with height at most t. Return the earliest time you can go from the top-left to the bottom-right of grid.",
      "Trying each time t and checking reachability with BFS is O(n^4) if you test every t from 0 upward.",
      "The time needed for a route equals the highest cell on it, including the start and end. So you want the route minimising its maximum cell, found by always expanding the lowest reachable cell next. O(n^2 log n). Binary search on t also works.",
      "The start cell's own height counts; in the second example grid[0][0] = 3 forces the answer to at least 3.",
    ],
    hints: [
      "For any fixed route, at what time can you swim it? What single value along the route decides that?",
      "Use a min-heap keyed by cell height, flooding outward from (0, 0), and keep the highest height you have popped so far.",
      "Pop the lowest cell, set best = max(best, its height); if it is the bottom-right, return best. Otherwise push its unvisited neighbours, marking them visited on push.",
    ],
  },
  "find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance": {
    approach: [
      "For each city, count how many other cities are within distanceThreshold by shortest path. Return the city with the smallest count, breaking ties by choosing the largest city number.",
      "You need shortest distances between all pairs, not from one source, so a single Dijkstra is not enough.",
      "n is small (around 100), so computing every pair's shortest distance with Floyd-Warshall in O(n^3) is simple and fast enough. Then counting per city is O(n^2).",
      "The tie rule favours the larger index, so use <= when updating the best city while scanning upward.",
    ],
    hints: [
      "To count a city's reachable neighbours you need its distance to every other city. How many such distances do you need overall?",
      "Use an all-pairs shortest path table, filled with Floyd-Warshall, initialised from the two-way edges.",
      "dist[i][i] = 0, edges set both directions, then for k, i, j: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]), k outermost. Count dist <= threshold per city; keep the lowest count, later city on ties.",
    ],
  },
  "number-of-ways-to-arrive-at-destination": {
    approach: [
      "Count the routes from intersection 0 to n - 1 whose total time equals the shortest possible time, modulo 10^9 + 7. The first example has two equally short routes.",
      "Listing every route and keeping the shortest ones is exponential.",
      "Shortest routes to a node extend only shortest routes to its predecessors. When Dijkstra finalises nodes in distance order, the count for each node is complete before it is used. O(E log V).",
      "Path times can exceed 32-bit range, so use 64-bit distances, and take the count modulo at each addition.",
    ],
    hints: [
      "If two different shortest routes reach node u, and u to v is on a shortest route to v, how many shortest routes reach v through u?",
      "Run Dijkstra from 0 while keeping a ways array next to the distance array, with ways[0] = 1.",
      "Relaxing u to v: if dist[u] + t < dist[v], set dist[v] and ways[v] = ways[u]; if equal, ways[v] += ways[u] mod 10^9 + 7. Skip stale heap entries.",
    ],
  },
  "minimum-obstacle-removal-to-reach-corner": {
    approach: [
      "Move from top-left to bottom-right of grid and return the fewest 1 cells (obstacles) you must pass through. In the second example a clear path exists, so the answer is 0.",
      "Trying combinations of obstacles to remove is exponential, and plain BFS counts steps rather than obstacles.",
      "Treat entering a cell as costing that cell's value, so every edge weighs 0 or 1. Shortest paths with only 0 and 1 weights can be found with a deque instead of a heap. O(rows * cols).",
    ],
    hints: [
      "Is a long route through empty cells better or worse than a short one through an obstacle? What is a step's real cost here?",
      "Use 0-1 BFS: a deque of cells with a distance grid, where the cost of moving into a cell is grid value 0 or 1.",
      "Pop from the front; for each neighbour with d + grid[nr][nc] < dist, update it and push to the front if the cost is 0, else to the back. Return dist at the corner.",
    ],
  },
// arrays-hashing (top k)
  "top-k-frequent-elements": {
    approach: [
      "Return the k values in nums that occur most often, in any order. In the first example 5 appears 3 times and 2 twice, so the answer is [5, 2].",
      "Counting then sorting all distinct values by count is O(n log n), which works but is more than needed.",
      "Every count lies between 1 and n, so values can be grouped by their count in an array of n + 1 lists and read from the highest count down. O(n). A size-k min-heap gives O(n log k).",
    ],
    hints: [
      "What is the largest possible frequency of any value in nums? Could that bound let you avoid a full sort?",
      "Count with a hash map, then place each value into a bucket indexed by its count.",
      "Make buckets[0..n]; for each (value, count) append value to buckets[count]. Walk from n down to 1, collecting values until you have k.",
    ],
  },
// dp-1d
  "pascals-triangle": {
    approach: [
      "Build and return the first numRows rows of Pascal's triangle as a list of lists, where row i has i + 1 values, as the numRows = 4 example shows.",
      "Computing each entry independently with the binomial formula works but risks overflow and repeats multiplication; the rows are easier to build from each other.",
      "Each row depends only on the row above, so build rows in order: ends are 1 and every inner value adds the two neighbours above. O(numRows^2), which is the output size.",
    ],
    hints: [
      "Look at row [1,3,3,1]. How is each inner 3 related to the row [1,2,1] above it?",
      "Build the rows one by one, keeping the previous row so you can read from it.",
      "Row i has length i + 1 with row[0] = row[i] = 1, and row[j] = prev[j - 1] + prev[j] for 0 < j < i.",
    ],
  },

};
