import json
import os
import re

# Comprehensive mapping of raw descriptive titles to canonical LeetCode Titles and Slugs
LEETCODE_MAPPING = {
    "Reverse the array": ("Reverse String", "reverse-string", 344),
    "Find the maximum and minimum element in an array": ("Third Maximum Number", "third-maximum-number", 414),
    "Find the Kth max and min element of an array": ("Kth Largest Element in an Array", "kth-largest-element-in-an-array", 215),
    "Sort an array of 0s, 1s and 2s (Dutch National Flag)": ("Sort Colors", "sort-colors", 75),
    "Move all negative elements to one side of the array": ("Move Zeroes", "move-zeroes", 283),
    "Find the Union and Intersection of two sorted arrays": ("Intersection of Two Arrays", "intersection-of-two-arrays", 349),
    "Cyclically rotate an array by one": ("Rotate Array", "rotate-array", 189),
    "Kadane's Algorithm (Largest Sum Contiguous Subarray)": ("Maximum Subarray", "maximum-subarray", 53),
    "Minimize the Maximum Difference between Heights": ("Smallest Range II", "smallest-range-ii", 910),
    "Minimum number of Jumps to reach end of an array": ("Jump Game II", "jump-game-ii", 45),
    "Find duplicate in an array of N+1 Integers": ("Find the Duplicate Number", "find-the-duplicate-number", 287),
    "Merge 2 sorted arrays without extra space": ("Merge Sorted Array", "merge-sorted-array", 88),
    "Merge Overlapping Intervals": ("Merge Intervals", "merge-intervals", 56),
    "Next Permutation": ("Next Permutation", "next-permutation", 31),
    "Count Inversions in an array": ("Reverse Pairs", "reverse-pairs", 493),
    "Best Time to Buy and Sell Stock": ("Best Time to Buy and Sell Stock", "best-time-to-buy-and-sell-stock", 121),
    "Find all pairs on integer array whose sum equals K": ("Two Sum", "two-sum", 1),
    "Find common elements in 3 sorted arrays": ("Intersection of Three Sorted Arrays", "intersection-of-three-sorted-arrays", 1213),
    "Rearrange array in alternating positive and negative items": ("Rearrange Array Elements by Sign", "rearrange-array-elements-by-sign", 2149),
    "Find if there is any subarray with sum equal to 0": ("Subarray Sum Equals K", "subarray-sum-equals-k", 560),
    "Find Factorial of a Large Number": ("Multiply Strings", "multiply-strings", 43),
    "Find Maximum Product Subarray": ("Maximum Product Subarray", "maximum-product-subarray", 152),
    "Find Longest Consecutive Subsequence": ("Longest Consecutive Sequence", "longest-consecutive-sequence", 128),
    "Find all elements appearing more than n/k times": ("Majority Element II", "majority-element-ii", 229),
    "Maximum profit by buying and selling a share at most twice": ("Best Time to Buy and Sell Stock III", "best-time-to-buy-and-sell-stock-iii", 123),
    "Find whether an array is a subset of another array": ("Intersection of Two Arrays II", "intersection-of-two-arrays-ii", 350),
    "Triplet Sum to a given value (3Sum)": ("3Sum", "3sum", 15),
    "Trapping Rain Water": ("Trapping Rain Water", "trapping-rain-water", 42),
    "Chocolate Distribution Problem": ("Height Checker", "height-checker", 1051),
    "Smallest Subarray with sum greater than given value": ("Minimum Size Subarray Sum", "minimum-size-subarray-sum", 209),
    "Three way partitioning around a given value": ("Sort Colors", "sort-colors", 75),
    "Minimum swaps required bring elements <= K together": ("Minimum Swaps to Group All 1s Together", "minimum-swaps-to-group-all-1s-together", 1151),
    "Minimum operations to make an array Palindrome": ("Most Frequent Even Element", "most-frequent-even-element", 2404),
    "Median of 2 sorted arrays of equal size": ("Median of Two Sorted Arrays", "median-of-two-sorted-arrays", 4),
    "Median of 2 sorted arrays of different size": ("Median of Two Sorted Arrays", "median-of-two-sorted-arrays", 4),
    "Spiral Traversal on a Matrix": ("Spiral Matrix", "spiral-matrix", 54),
    "Search an element in a Matrix (Row and Col sorted)": ("Search a 2D Matrix", "search-a-2d-matrix", 74),
    "Find Median in a row-wise sorted Matrix": ("Kth Smallest Element in a Sorted Matrix", "kth-smallest-element-in-a-sorted-matrix", 378),
    "Find row with maximum number of 1s": ("Leftmost Column with at Least a One", "leftmost-column-with-at-least-a-one", 1428),
    "Print elements in sorted order from row-col sorted matrix": ("Kth Smallest Element in a Sorted Matrix", "kth-smallest-element-in-a-sorted-matrix", 378),
    "Maximum size Rectangle of 1s in Matrix": ("Maximal Rectangle", "maximal-rectangle", 85),
    "Rotate Matrix by 90 degrees clockwise": ("Rotate Image", "rotate-image", 48),
    "Kth smallest element in a row-col sorted matrix": ("Kth Smallest Element in a Sorted Matrix", "kth-smallest-element-in-a-sorted-matrix", 378),
    "Reverse a String": ("Reverse String", "reverse-string", 344),
    "Check whether a String is Palindrome or not": ("Valid Palindrome", "valid-palindrome", 125),
    "Find Duplicate characters in a string": ("First Unique Character in a String", "first-unique-character-in-a-string", 387),
    "Check whether one string is rotation of another": ("Rotate String", "rotate-string", 796),
    "Count and Say Problem": ("Count and Say", "count-and-say", 38),
    "Longest Palindromic Substring": ("Longest Palindromic Substring", "longest-palindromic-substring", 5),
    "Longest Repeating Subsequence in String": ("Longest Common Subsequence", "longest-common-subsequence", 1143),
    "Print all Subsequences of a String": ("Subsets", "subsets", 78),
    "Print all Permutations of a String": ("Permutations", "permutations", 46),
    "Split Binary String with equal 0s and 1s": ("Split a String in Balanced Strings", "split-a-string-in-balanced-strings", 1221),
    "Word Wrap Problem (Text Justification)": ("Text Justification", "text-justification", 68),
    "Edit Distance (Levenshtein Distance)": ("Edit Distance", "edit-distance", 72),
    "Balanced Parenthesis Problem": ("Valid Parentheses", "valid-parentheses", 20),
    "Word Break Problem": ("Word Break", "word-break", 139),
    "Rabin Karp Algorithm for Pattern Searching": ("Find the Index of the First Occurrence in a String", "find-the-index-of-the-first-occurrence-in-a-string", 28),
    "KMP Algorithm for Pattern Searching": ("Find the Index of the First Occurrence in a String", "find-the-index-of-the-first-occurrence-in-a-string", 28),
    "Longest Common Prefix": ("Longest Common Prefix", "longest-common-prefix", 14),
    "Minimum Swaps for Bracket Balancing": ("Minimum Number of Swaps to Make the String Balanced", "minimum-number-of-swaps-to-make-the-string-balanced", 1963),
    "Longest Common Subsequence": ("Longest Common Subsequence", "longest-common-subsequence", 1143),
    "Smallest Window containing all characters of string itself": ("Minimum Window Substring", "minimum-window-substring", 76),
    "Rearrange characters such that no two adjacent are same": ("Reorganize String", "reorganize-string", 767),
    "Group Anagrams": ("Group Anagrams", "group-anagrams", 49),
    "Isomorphic Strings": ("Isomorphic Strings", "isomorphic-strings", 205),
    "First and Last Position of Element in Sorted Array": ("Find First and Last Position of Element in Sorted Array", "find-first-and-last-position-of-element-in-sorted-array", 34),
    "Search in Rotated Sorted Array": ("Search in Rotated Sorted Array", "search-in-rotated-sorted-array", 33),
    "Square Root of an Integer": ("Sqrt(x)", "sqrtx", 69),
    "Find Repeating and Missing Element": ("Set Mismatch", "set-mismatch", 645),
    "Find Majority Element": ("Majority Element", "majority-element", 169),
    "Find Four Elements that sum to given value (4Sum)": ("4Sum", "4sum", 18),
    "Maximum sum such that no two elements are adjacent": ("House Robber", "house-robber", 198),
    "Count triplets with sum smaller than given value": ("3Sum Smaller", "3sum-smaller", 259),
    "Merge 2 Sorted Arrays in O(1) space": ("Merge Sorted Array", "merge-sorted-array", 88),
    "Product Array Puzzle (Except Self)": ("Product of Array Except Self", "product-of-array-except-self", 238),
    "K-th Element of Two Sorted Arrays": ("Median of Two Sorted Arrays", "median-of-two-sorted-arrays", 4),
    "Aggressive Cows (Capacity To Ship Packages)": ("Capacity To Ship Packages Within D Days", "capacity-to-ship-packages-within-d-days", 1011),
    "Book Allocation Problem (Split Array Largest Sum)": ("Split Array Largest Sum", "split-array-largest-sum", 410),
    "Painters Partition Problem": ("Split Array Largest Sum", "split-array-largest-sum", 410),
    "Reverse a Linked List": ("Reverse Linked List", "reverse-linked-list", 206),
    "Reverse a Linked List in Groups of Given Size K": ("Reverse Nodes in k-Group", "reverse-nodes-in-k-group", 25),
    "Detect Loop in a Linked List": ("Linked List Cycle", "linked-list-cycle", 141),
    "Find Starting Point of Loop in Linked List": ("Linked List Cycle II", "linked-list-cycle-ii", 142),
    "Remove Duplicates in a Sorted Linked List": ("Remove Duplicates from Sorted List", "remove-duplicates-from-sorted-list", 83),
    "Remove Duplicates in an Unsorted Linked List": ("Remove Duplicates From an Unsorted Linked List", "remove-duplicates-from-an-unsorted-linked-list", 1836),
    "Add 1 to a number represented as Linked List": ("Plus One Linked List", "plus-one-linked-list", 369),
    "Add Two Numbers represented by Linked Lists": ("Add Two Numbers", "add-two-numbers", 2),
    "Intersection Point of Two Linked Lists": ("Intersection of Two Linked Lists", "intersection-of-two-linked-lists", 160),
    "Merge Sort for Linked Lists": ("Sort List", "sort-list", 148),
    "Find the Middle Element of a Linked List": ("Middle of the Linked List", "middle-of-the-linked-list", 876),
    "Check if a Linked List is Palindrome": ("Palindrome Linked List", "palindrome-linked-list", 234),
    "Flatten a Multi-level Linked List": ("Flatten a Multilevel Doubly Linked List", "flatten-a-multilevel-doubly-linked-list", 430),
    "Sort a Linked List of 0s, 1s, and 2s": ("Partition List", "partition-list", 86),
    "Clone a Linked List with Next and Random Pointer": ("Copy List with Random Pointer", "copy-list-with-random-pointer", 138),
    "Merge K Sorted Linked Lists": ("Merge k Sorted Lists", "merge-k-sorted-lists", 23),
    "Nth Node from End of Linked List": ("Remove Nth Node From End of List", "remove-nth-node-from-end-of-list", 19),
    "Level Order Traversal of Binary Tree": ("Binary Tree Level Order Traversal", "binary-tree-level-order-traversal", 102),
    "Height / Maximum Depth of Binary Tree": ("Maximum Depth of Binary Tree", "maximum-depth-of-binary-tree", 104),
    "Diameter of Binary Tree": ("Diameter of Binary Tree", "diameter-of-binary-tree", 543),
    "Inorder Traversal (Iterative & Recursive)": ("Binary Tree Inorder Traversal", "binary-tree-inorder-traversal", 94),
    "Preorder Traversal (Iterative & Recursive)": ("Binary Tree Preorder Traversal", "binary-tree-preorder-traversal", 144),
    "Postorder Traversal (Iterative & Recursive)": ("Binary Tree Postorder Traversal", "binary-tree-postorder-traversal", 145),
    "Left View of Binary Tree": ("Binary Tree Right Side View", "binary-tree-right-side-view", 199),
    "Right View of Binary Tree": ("Binary Tree Right Side View", "binary-tree-right-side-view", 199),
    "Zig-Zag Level Order Traversal": ("Binary Tree Zigzag Level Order Traversal", "binary-tree-zigzag-level-order-traversal", 103),
    "Check if Binary Tree is Balanced": ("Balanced Binary Tree", "balanced-binary-tree", 110),
    "Lowest Common Ancestor (LCA) in Binary Tree": ("Lowest Common Ancestor of a Binary Tree", "lowest-common-ancestor-of-a-binary-tree", 236),
    "Construct Tree from Preorder and Inorder Traversal": ("Construct Binary Tree from Preorder and Inorder Traversal", "construct-binary-tree-from-preorder-and-inorder-traversal", 105),
    "Search in a Binary Search Tree": ("Search in a Binary Search Tree", "search-in-a-binary-search-tree", 700),
    "Delete Node in a BST": ("Delete Node in a BST", "delete-node-in-a-bst", 450),
    "Validate Binary Search Tree": ("Validate Binary Search Tree", "validate-binary-search-tree", 98),
    "Find Lowest Common Ancestor in BST": ("Lowest Common Ancestor of a Binary Search Tree", "lowest-common-ancestor-of-a-binary-search-tree", 235),
    "Kth Smallest Element in a BST": ("Kth Smallest Element in a BST", "kth-smallest-element-in-a-bst", 230),
    "Convert Sorted Array to Binary Search Tree": ("Convert Sorted Array to Binary Search Tree", "convert-sorted-array-to-binary-search-tree", 108),
    "Implement Stack using Queue": ("Implement Stack using Queues", "implement-stack-using-queues", 225),
    "Implement Queue using Stack": ("Implement Queue using Stacks", "implement-queue-using-stacks", 232),
    "Next Greater Element": ("Next Greater Element II", "next-greater-element-ii", 503),
    "The Celebrity Problem": ("Find the Celebrity", "find-the-celebrity", 277),
    "Largest Rectangular Area in Histogram": ("Largest Rectangle in Histogram", "largest-rectangle-in-histogram", 84),
    "LRU Cache Implementation": ("LRU Cache", "lru-cache", 146),
    "Rotting Oranges": ("Rotting Oranges", "rotting-oranges", 994),
    "Sliding Window Maximum": ("Sliding Window Maximum", "sliding-window-maximum", 239),
    "Number of Islands": ("Number of Islands", "number-of-islands", 200),
    "Clone Graph": ("Clone Graph", "clone-graph", 133),
    "Course Schedule (Topological Sort / Cycle Detection)": ("Course Schedule", "course-schedule", 207),
    "Word Ladder": ("Word Ladder", "word-ladder", 127),
    "Dijkstra's Algorithm (Shortest Path)": ("Network Delay Time", "network-delay-time", 743),
    "Network Delay Time": ("Network Delay Time", "network-delay-time", 743),
    "Climbing Stairs": ("Climbing Stairs", "climbing-stairs", 70),
    "Coin Change Problem": ("Coin Change", "coin-change", 322),
    "0/1 Knapsack Problem": ("Partition Equal Subset Sum", "partition-equal-subset-sum", 416),
    "Longest Increasing Subsequence": ("Longest Increasing Subsequence", "longest-increasing-subsequence", 300),
    "Partition Equal Subset Sum": ("Partition Equal Subset Sum", "partition-equal-subset-sum", 416),
    "Palindromic Substrings": ("Palindromic Substrings", "palindromic-substrings", 647),
    "Subsets": ("Subsets", "subsets", 78),
    "Permutations": ("Permutations", "permutations", 46),
    "N-Queens": ("N-Queens", "n-queens", 51),
    "Sudoku Solver": ("Sudoku Solver", "sudoku-solver", 37),
    "Non-overlapping Intervals": ("Non-overlapping Intervals", "non-overlapping-intervals", 435),
    "Single Number": ("Single Number", "single-number", 136),
    "Number of 1 Bits": ("Number of 1 Bits", "number-of-1-bits", 191),
    "Counting Bits": ("Counting Bits", "counting-bits", 338)
}

from raw_items import raw_data

def slugify(text):
    clean = re.sub(r'\(.*?\)', '', text)
    clean = re.sub(r'[^a-zA-Z0-9\s-]', '', clean)
    clean = clean.strip().lower()
    clean = re.sub(r'[\s-]+', '-', clean)
    return clean

formatted_base = []
for item in raw_data:
    orig_title = item["title"]
    if orig_title in LEETCODE_MAPPING:
        real_title, slug, lc_num = LEETCODE_MAPPING[orig_title]
    else:
        real_title = orig_title
        slug = slugify(orig_title)
        lc_num = item.get("lcNum", 1)

    lc_url = f"https://leetcode.com/problems/{slug}/"

    formatted_base.append({
        "title": real_title,
        "difficulty": item.get("difficulty", "Medium"),
        "pattern": item.get("pattern", "Arrays"),
        "topic": item.get("topic", "Array"),
        "lcNum": lc_num,
        "lcUrl": lc_url,
        "companies": item.get("companies", ["Amazon", "Google"]),
        "hint": item.get("hint", f"Apply standard {item.get('pattern', 'DSA')} pattern techniques.")
    })

# 30 Days x 10 Problems/Day
day_plans = []
for day in range(1, 31):
    day_plans.append({
        "day": day,
        "title": "Random Problems",
        "description": f"Day {day} placement preparation module featuring a random mix of 4 Easy, 4 Medium, and 2 Hard OA questions.",
        "targetFocus": "Random Practice",
        "problemIds": [f"p-{100 + (day - 1) * 10 + i}" for i in range(1, 11)]
    })

easy_base = [item for item in formatted_base if item["difficulty"] == "Easy"]
medium_base = [item for item in formatted_base if item["difficulty"] == "Medium"]
hard_base = [item for item in formatted_base if item["difficulty"] == "Hard"]

if not easy_base: easy_base = formatted_base
if not medium_base: medium_base = formatted_base
if not hard_base: hard_base = formatted_base

problems_dict = {}
global_id = 101

for day in range(1, 31):
    # 4 Easy
    for e in range(4):
        item = easy_base[(day * 4 + e) % len(easy_base)]
        pid = f"p-{global_id}"
        problems_dict[pid] = {
            "id": pid,
            "day": day,
            "leetcodeNumber": item["lcNum"],
            "title": item["title"],
            "topic": item["topic"],
            "pattern": item["pattern"],
            "difficulty": "Easy",
            "leetcodeUrl": item["lcUrl"],
            "companyTags": item["companies"],
            "recognitionHint": item["hint"],
            "commonMistakes": ["Boundary condition off-by-one check", "Handling empty or null input edge cases"],
            "timeComplexity": "O(N)",
            "spaceComplexity": "O(1)",
            "estimatedTimeMin": 15,
            "status": "pending",
            "completed": False,
            "favorite": False,
            "notes": "",
            "timeSpentSec": 0,
            "revisionDates": []
        }
        global_id += 1

    # 4 Medium
    for m in range(4):
        item = medium_base[(day * 4 + m) % len(medium_base)]
        pid = f"p-{global_id}"
        problems_dict[pid] = {
            "id": pid,
            "day": day,
            "leetcodeNumber": item["lcNum"],
            "title": item["title"],
            "topic": item["topic"],
            "pattern": item["pattern"],
            "difficulty": "Medium",
            "leetcodeUrl": item["lcUrl"],
            "companyTags": item["companies"],
            "recognitionHint": item["hint"],
            "commonMistakes": ["State overflow/underflow", "Mismanaging pointer index references"],
            "timeComplexity": "O(N log N)",
            "spaceComplexity": "O(N)",
            "estimatedTimeMin": 25,
            "status": "pending",
            "completed": False,
            "favorite": False,
            "notes": "",
            "timeSpentSec": 0,
            "revisionDates": []
        }
        global_id += 1

    # 2 Hard
    for h in range(2):
        item = hard_base[(day * 2 + h) % len(hard_base)]
        pid = f"p-{global_id}"
        problems_dict[pid] = {
            "id": pid,
            "day": day,
            "leetcodeNumber": item["lcNum"],
            "title": item["title"],
            "topic": item["topic"],
            "pattern": item["pattern"],
            "difficulty": "Hard",
            "leetcodeUrl": item["lcUrl"],
            "companyTags": item["companies"],
            "recognitionHint": item["hint"],
            "commonMistakes": ["Complex recursion base case missing", "Time limit exceeded without optimal pruning"],
            "timeComplexity": "O(N^2) or O(N log N)",
            "spaceComplexity": "O(N)",
            "estimatedTimeMin": 40,
            "status": "pending",
            "completed": False,
            "favorite": False,
            "notes": "",
            "timeSpentSec": 0,
            "revisionDates": []
        }
        global_id += 1

ts_content = f"""import type {{ Problem, DayPlan }} from '../types/tracker';

export const INITIAL_DAY_PLANS: DayPlan[] = {json.dumps(day_plans, indent=2)};

export const INITIAL_PROBLEMS: Record<string, Problem> = {json.dumps(problems_dict, indent=2)};
"""

output_path = os.path.join(os.path.dirname(__file__), "problemsData.ts")
with open(output_path, "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Successfully generated {len(problems_dict)} canonical problems into {output_path}")
