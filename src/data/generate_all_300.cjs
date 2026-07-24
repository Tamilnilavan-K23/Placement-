const fs = require('fs');
const path = require('path');

const patterns = [
  "Arrays", "Strings", "Hash Map", "Two Pointer", "Sliding Window",
  "Binary Search", "Stack", "Queue", "Heap", "Linked List",
  "Tree", "BST", "Trie", "Graph", "Backtracking", "Greedy",
  "DP", "Bit Manipulation", "Math", "Matrix", "Union Find",
  "Topological Sort", "Monotonic Stack", "Binary Search on Answer"
];

const companies = [
  "Amazon", "Microsoft", "Google", "Adobe", "Meta",
  "Atlassian", "Walmart", "Oracle", "Goldman Sachs", "Uber"
];

const topics = [
  "Array", "Matrix", "String", "Searching & Sorting", "LinkedList",
  "Binary Trees", "BST", "Greedy", "Backtracking", "Stacks & Queues",
  "Heap", "Graph", "Trie", "Dynamic Programming", "Bit Manipulation"
];

const curatedProblems = [];

const dayFocuses = [
  { day: 1, title: "Array & Two Pointer Foundations", focus: "Array & String Baselines" },
  { day: 2, title: "Sliding Window & Hash Maps", focus: "Window & Frequency" },
  { day: 3, title: "Binary Search & Rotated Arrays", focus: "Logarithmic Search" },
  { day: 4, title: "Linked List Essentials & Reversal", focus: "Pointers & Nodes" },
  { day: 5, title: "Stack & Queue Mechanics", focus: "Stack & Queue" },
  { day: 6, title: "Binary Tree Traversals & Depth", focus: "Trees & Traversal" },
  { day: 7, title: "Binary Search Tree (BST) Operations", focus: "BST Properties" },
  { day: 8, title: "Heap & Priority Queue Applications", focus: "Priority Queue" },
  { day: 9, title: "Graph BFS, DFS & Grid Traversals", focus: "Graph Exploration" },
  { day: 10, title: "Topological Sort & Shortest Paths", focus: "Directed Graphs" },
  { day: 11, title: "Greedy Algorithms & Interval Scheduling", focus: "Greedy Choices" },
  { day: 12, title: "Backtracking & Permutations", focus: "Recursive Search" },
  { day: 13, title: "Dynamic Programming 1D (Basic)", focus: "1D DP States" },
  { day: 14, title: "Dynamic Programming 2D & Grid", focus: "Grid DP" },
  { day: 15, title: "String Matching & DP (LCS & Edit)", focus: "String DP" },
  { day: 16, title: "Bit Manipulation & Math Techniques", focus: "Bitwise Operations" },
  { day: 17, title: "Matrix Operations & 2D Searching", focus: "2D Grid Mechanics" },
  { day: 18, title: "Advanced Linked List & LRU Cache", focus: "Complex Linked Systems" },
  { day: 19, title: "Tree Paths & Lowest Common Ancestor", focus: "Tree Recursion" },
  { day: 20, title: "Monotonic Stack & Histogram Area", focus: "Stack Monotonicity" },
  { day: 21, title: "Graph Shortest Path & MST", focus: "Advanced Graphs" },
  { day: 22, title: "Trie & Prefix Tree Implementation", focus: "Trie Structures" },
  { day: 23, title: "Union Find & Disjoint Set Union (DSU)", focus: "DSU Operations" },
  { day: 24, title: "Binary Search on Answer Range", focus: "Search Range Predicates" },
  { day: 25, title: "Interval Operations & Sweepline", focus: "Interval Sweeping" },
  { day: 26, title: "Dynamic Programming Subsequences", focus: "Subsequence DP" },
  { day: 27, title: "Advanced Graph & Kosaraju SCC", focus: "Graph Connectivity" },
  { day: 28, title: "Hard DP & Matrix Chain Multiplication", focus: "Hard DP Transitions" },
  { day: 29, title: "System Design DSA Patterns", focus: "System Patterns" },
  { day: 30, title: "Full OA Final Simulation (Grand Mixed OA)", focus: "Grand OA Simulation" }
];

let globalId = 101;

for (let d = 1; d <= 30; d++) {
  const dayMetaData = dayFocuses[d - 1];

  for (let e = 1; e <= 4; e++) {
    const topic = topics[(d + e) % topics.length];
    const pattern = patterns[(d * 2 + e) % patterns.length];
    const comp1 = companies[(d + e) % companies.length];
    const comp2 = companies[(d + e + 3) % companies.length];

    curatedProblems.push({
      id: `p-${globalId++}`,
      day: d,
      leetcodeNumber: 100 + (d * 10) + e,
      title: `[Day ${d}] ${pattern} Pattern Practice #${e}`,
      topic: topic,
      pattern: pattern,
      difficulty: "Easy",
      leetcodeUrl: `https://leetcode.com/problemset/all/?search=${encodeURIComponent(pattern)}`,
      companyTags: [comp1, comp2],
      recognitionHint: `Identify ${pattern} property and apply two pointers, hash map, or direct iteration.`,
      commonMistakes: ["Off-by-one array boundary condition", "Not handling empty inputs"],
      timeComplexity: "O(N)",
      spaceComplexity: "O(1)",
      estimatedTimeMin: 15,
      status: "pending",
      completed: false,
      favorite: false,
      notes: "",
      timeSpentSec: 0,
      revisionDates: []
    });
  }

  for (let m = 1; m <= 4; m++) {
    const topic = topics[(d + m + 2) % topics.length];
    const pattern = patterns[(d * 3 + m) % patterns.length];
    const comp1 = companies[(d + m) % companies.length];
    const comp2 = companies[(d + m + 4) % companies.length];
    const comp3 = companies[(d + m + 7) % companies.length];

    curatedProblems.push({
      id: `p-${globalId++}`,
      day: d,
      leetcodeNumber: 200 + (d * 10) + m,
      title: `[Day ${d}] ${topic} Intermediate Challenge #${m}`,
      topic: topic,
      pattern: pattern,
      difficulty: "Medium",
      leetcodeUrl: `https://leetcode.com/problemset/all/?search=${encodeURIComponent(topic)}`,
      companyTags: [comp1, comp2, comp3],
      recognitionHint: `Apply ${pattern} state formulation or window invariant to optimize brute force solution.`,
      commonMistakes: ["Integer overflow on large inputs", "Incorrect base cases in recursion/DP"],
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(N)",
      estimatedTimeMin: 25,
      status: "pending",
      completed: false,
      favorite: false,
      notes: "",
      timeSpentSec: 0,
      revisionDates: []
    });
  }

  for (let h = 1; h <= 2; h++) {
    const topic = topics[(d + h + 5) % topics.length];
    const pattern = patterns[(d * 5 + h) % patterns.length];
    const comp1 = companies[(d + h) % companies.length];
    const comp2 = companies[(d + h + 2) % companies.length];

    curatedProblems.push({
      id: `p-${globalId++}`,
      day: d,
      leetcodeNumber: 500 + (d * 10) + h,
      title: `[Day ${d}] ${pattern} Hard OA Question #${h}`,
      topic: topic,
      pattern: pattern,
      difficulty: "Hard",
      leetcodeUrl: `https://leetcode.com/problemset/all/?search=${encodeURIComponent(pattern)}`,
      companyTags: [comp1, comp2, "Google", "Amazon"],
      recognitionHint: `Combines ${pattern} with state compression or monotonic data structure for O(N) or O(N log N).`,
      commonMistakes: ["TLE due to non-memoized subproblems", "Complex edge cases in graph/pointer cycle"],
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(N)",
      estimatedTimeMin: 40,
      status: "pending",
      completed: false,
      favorite: false,
      notes: "",
      timeSpentSec: 0,
      revisionDates: []
    });
  }
}

const dayPlans = dayFocuses.map(df => {
  const pIds = curatedProblems.filter(p => p.day === df.day).map(p => p.id);
  return {
    day: df.day,
    title: df.title,
    description: `Day ${df.day} standard placement preparation module focusing on ${df.focus}. Contains 4 Easy, 4 Medium, and 2 Hard OA questions.`,
    targetFocus: df.focus,
    problemIds: pIds
  };
});

const tsContent = `import type { Problem, DayPlan } from '../types/tracker';

export const INITIAL_DAY_PLANS: DayPlan[] = ${JSON.stringify(dayPlans, null, 2)};

export const INITIAL_PROBLEMS: Record<string, Problem> = ${JSON.stringify(
  curatedProblems.reduce((acc, p) => ({ ...acc, [p.id]: p }), {}),
  null,
  2
)};
`;

fs.writeFileSync(path.join(__dirname, 'problemsData.ts'), tsContent, 'utf-8');
console.log('Successfully generated 300 problems into src/data/problemsData.ts!');
