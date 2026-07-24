import json
import random

# We will generate all 300 problems across 30 days based on Love Babbar 450 & Top OA Questions
# Day structure: 4 Easy, 4 Medium, 2 Hard per day = 10 problems per day

company_pools = [
  ["Amazon", "Microsoft", "Adobe"],
  ["Google", "Meta", "Amazon"],
  ["Amazon", "Microsoft", "Uber"],
  ["Google", "Atlassian", "Walmart"],
  ["Microsoft", "Oracle", "Goldman Sachs"],
  ["Amazon", "Google", "Meta", "Adobe"],
  ["Microsoft", "Atlassian", "Amazon"],
  ["Goldman Sachs", "Uber", "Google"],
  ["Walmart", "Oracle", "Amazon"],
  ["Meta", "Google", "Microsoft"]
]

days_metadata = [
    ("Array & Two Pointer Foundations", "Master fundamental array manipulations, Dutch National Flag, and two pointer traversals.", "Array & String Baselines"),
    ("Sliding Window & Hash Maps", "Build intuition for contiguous subarrays, frequency maps, and sliding window boundaries.", "Window & Frequency"),
    ("Binary Search & Rotated Arrays", "Explore search space reduction, rotated array pivots, and binary search on answer.", "Logarithmic Search"),
    ("Linked List Essentials & Reversal", "Pointers, fast-slow techniques, cycle detection, and K-group reversals.", "Pointers & Nodes"),
    ("Stack & Queue Mechanics", "Parentheses matching, Next Greater Element, Monotonic Stacks, and sliding window max.", "Stack & Queue"),
    ("Binary Tree Traversals & Depth", "Preorder, Inorder, Level Order, Height, Diameter, and Left/Right Views.", "Trees & Traversal"),
    ("Binary Search Tree (BST) Operations", "Search, Insert, Delete, Validate BST, LCA, and Kth Smallest Element.", "BST Properties"),
    ("Heap & Priority Queue Applications", "Kth Largest, Merge K Sorted Lists, Top K Frequent, and Median in Data Stream.", "Priority Queue"),
    ("Graph BFS, DFS & Grid Traversals", "Connected components, Number of Islands, Flood Fill, and Cycle Detection.", "Graph Exploration"),
    ("Topological Sort & Shortest Paths", "Course Schedule, Kahn's algorithm, Dijkstra, and Bellman-Ford shortest paths.", "Directed Graphs"),
    ("Greedy Algorithms & Interval Scheduling", "Merge Intervals, Non-overlapping Intervals, Activity Selection, and Gas Station.", "Greedy Choices"),
    ("Backtracking & Permutations", "Subsets, Permutations, Combinations, N-Queens, and Sudoku Solver.", "Recursive Search"),
    ("Dynamic Programming 1D (Basic)", "Climbing Stairs, House Robber, Min Cost Climbing Stairs, and Frog Jump.", "1D DP States"),
    ("Dynamic Programming 2D & Grid", "Unique Paths, Minimum Path Sum, 0/1 Knapsack, and Subset Sum.", "Grid DP"),
    ("String Matching & DP (LCS & Edit)", "Longest Common Subsequence, Edit Distance, Word Break, and KMP Algorithm.", "String DP"),
    ("Bit Manipulation & Math Techniques", "Set bits counting, Single Number, Power of Two, Bitwise XOR pairs.", "Bitwise Operations"),
    ("Matrix Operations & 2D Searching", "Spiral Matrix, Rotate 90 degrees clockwise, Search 2D Matrix, Maximal Rectangle.", "2D Grid Mechanics"),
    ("Advanced Linked List & LRU Cache", "LRU Cache, Flatten Multilevel Doubly LL, Clone LL with Random Pointer.", "Complex Linked Systems"),
    ("Tree Paths & Lowest Common Ancestor", "LCA in Binary Tree, Path Sum I/II/III, Tree Diameter, Maximum Path Sum.", "Tree Recursion"),
    ("Monotonic Stack & Histogram Area", "Largest Rectangle in Histogram, Daily Temperatures, Trapping Rain Water.", "Stack Monotonicity"),
    ("Graph Shortest Path & Minimum Spanning Tree", "Network Delay Time, Cheapest Flights within K Stops, Prim's and Kruskal's MST.", "Advanced Graphs"),
    ("Trie & Prefix Tree Implementation", "Implement Trie, Design Add/Search Words, Word Search II, Phone Directory.", "Trie Structures"),
    ("Union Find & Disjoint Set Union (DSU)", "Redundant Connection, Number of Provinces, Accounts Merge, Graph Connectivity.", "DSU Operations"),
    ("Binary Search on Answer Range", "Book Allocation, Aggressive Cows, Koko Eating Bananas, Capacity To Ship.", "Search Range Predicates"),
    ("Interval Operations & Sweepline", "Insert Interval, Meeting Rooms I/II, Employee Free Time, Interval List Intersections.", "Interval Sweeping"),
    ("Dynamic Programming Subsequences", "Longest Increasing Subsequence, Partition Equal Subset Sum, Target Sum.", "Subsequence DP"),
    ("Advanced Graph & Kosaraju SCC", "Strongly Connected Components, Critical Connections (Bridges), Bipartite Check.", "Graph Connectivity"),
    ("Hard DP & Matrix Chain Multiplication", "Burst Balloons, Palindrome Partitioning II, Regular Expression Matching.", "Hard DP Transitions"),
    ("System Design DSA Patterns", "LFU Cache, Design Twitter, Find Median from Data Stream, Subarray Sum K.", "System Patterns"),
    ("FullOA Final Simulation (Grand Mixed OA)", "Comprehensive mix of top hard/medium interview questions across all 24 patterns.", "Grand OA Simulation")
]

# We will generate a python script that outputs `src/data/problemsData.ts` with 300 problems!
print(f"Total days: {len(days_metadata)}")
