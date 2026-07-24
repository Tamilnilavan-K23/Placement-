import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTrackerStore } from '../../store/useTrackerStore';
import type { PatternName } from '../../types/tracker';

const ALL_PATTERNS: PatternName[] = [
  'Arrays',
  'Strings',
  'Hash Map',
  'Two Pointer',
  'Sliding Window',
  'Binary Search',
  'Stack',
  'Queue',
  'Heap',
  'Linked List',
  'Tree',
  'BST',
  'Trie',
  'Graph',
  'Backtracking',
  'Greedy',
  'DP',
  'Bit Manipulation',
  'Math',
  'Matrix',
  'Union Find',
  'Topological Sort',
  'Monotonic Stack',
  'Binary Search on Answer'
];

export const PatternProgressView: React.FC = () => {
  const { problems, setPatternFilter, setActiveTab } = useTrackerStore();

  const problemList = Object.values(problems);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Pattern Mastery Progress
          </h1>
          <p className="text-xs text-slate-400">
            Track completion across all 24 fundamental DSA interview patterns
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {ALL_PATTERNS.map((pattern, idx) => {
          const patternProblems = problemList.filter(p => p.pattern === pattern);
          const total = patternProblems.length;
          const solved = patternProblems.filter(p => p.completed).length;
          const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;

          return (
            <div
              key={idx}
              className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-brand-500/40 transition-all duration-300 space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-100 group-hover:text-brand-300 transition-colors">
                  {pattern}
                </h3>
                <span className="text-xs font-extrabold text-brand-400">
                  {percentage}%
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Solved: {solved}/{total}</span>
                  <span>{total - solved} Remaining</span>
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      percentage === 100 ? 'bg-emerald-400' : 'bg-gradient-to-r from-brand-500 to-accent-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setPatternFilter(pattern);
                  setActiveTab('roadmap');
                }}
                className="w-full mt-2 py-1.5 px-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center space-x-1"
              >
                <span>Filter {pattern} Problems</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
