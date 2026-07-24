import React, { useState } from 'react';
import { INITIAL_DAY_PLANS } from '../../data/problemsData';
import { useTrackerStore } from '../../store/useTrackerStore';
import { DayCard } from './DayCard';
import { ProblemDetailModal } from './ProblemDetailModal';
import type { Problem, TargetCompany } from '../../types/tracker';
import { Filter } from 'lucide-react';

export const RoadmapView: React.FC = () => {
  const { 
    problems, 
    searchQuery, 
    selectedDifficultyFilter, 
    setDifficultyFilter, 
    selectedCompanyFilter, 
    setCompanyFilter, 
    selectedPatternFilter, 
    setPatternFilter, 
    onlyFavorites, 
    setOnlyFavorites 
  } = useTrackerStore();

  const [selectedModalProblem, setSelectedModalProblem] = useState<Problem | null>(null);
  const [selectedDayFilter, setSelectedDayFilter] = useState<number | 'All'>('All');

  const problemList = Object.values(problems);

  const filteredProblems = problemList.filter(p => {
    if (selectedDayFilter !== 'All' && p.day !== selectedDayFilter) return false;
    if (selectedDifficultyFilter !== 'All' && p.difficulty !== selectedDifficultyFilter) return false;
    if (selectedCompanyFilter !== 'All' && !p.companyTags.includes(selectedCompanyFilter as TargetCompany)) return false;
    if (selectedPatternFilter !== 'All' && p.pattern !== selectedPatternFilter) return false;
    if (onlyFavorites && !p.favorite) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchPattern = p.pattern.toLowerCase().includes(q);
      const matchTopic = p.topic.toLowerCase().includes(q);
      const matchCompany = p.companyTags.some(c => c.toLowerCase().includes(q));
      return matchTitle || matchPattern || matchTopic || matchCompany;
    }

    return true;
  });

  const totalSolved = problemList.filter(p => p.completed).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            30-Day Placement DSA Roadmap
          </h1>
          <p className="text-xs text-slate-400">
            300 Problems • 10 Problems/Day (4 Easy, 4 Medium, 2 Hard)
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200">
            Progress: <span className="text-brand-400">{totalSolved}/300</span> Solved
          </div>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
          <Filter className="w-4 h-4 text-brand-400" />
          <span>Filters & Constraints</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <select
            value={selectedDifficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value as any)}
            className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy Only</option>
            <option value="Medium">Medium Only</option>
            <option value="Hard">Hard Only</option>
          </select>

          <select
            value={selectedCompanyFilter}
            onChange={(e) => setCompanyFilter(e.target.value as any)}
            className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="All">All Companies</option>
            <option value="Amazon">Amazon</option>
            <option value="Microsoft">Microsoft</option>
            <option value="Google">Google</option>
            <option value="Adobe">Adobe</option>
            <option value="Meta">Meta</option>
            <option value="Atlassian">Atlassian</option>
            <option value="Walmart">Walmart</option>
            <option value="Oracle">Oracle</option>
            <option value="Goldman Sachs">Goldman Sachs</option>
            <option value="Uber">Uber</option>
          </select>

          <select
            value={selectedPatternFilter}
            onChange={(e) => setPatternFilter(e.target.value as any)}
            className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="All">All Patterns (24)</option>
            <option value="Arrays">Arrays</option>
            <option value="Strings">Strings</option>
            <option value="Hash Map">Hash Map</option>
            <option value="Two Pointer">Two Pointer</option>
            <option value="Sliding Window">Sliding Window</option>
            <option value="Binary Search">Binary Search</option>
            <option value="Stack">Stack</option>
            <option value="Queue">Queue</option>
            <option value="Heap">Heap</option>
            <option value="Linked List">Linked List</option>
            <option value="Tree">Tree</option>
            <option value="BST">BST</option>
            <option value="Graph">Graph</option>
            <option value="DP">DP</option>
            <option value="Backtracking">Backtracking</option>
            <option value="Greedy">Greedy</option>
          </select>

          <select
            value={selectedDayFilter}
            onChange={(e) => setSelectedDayFilter(e.target.value === 'All' ? 'All' : Number(e.target.value))}
            className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="All">All 30 Days</option>
            {INITIAL_DAY_PLANS.map(d => (
              <option key={d.day} value={d.day}>Day {d.day}: {d.targetFocus}</option>
            ))}
          </select>

          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
              onlyFavorites
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {onlyFavorites ? '★ Favorites Only' : '☆ Show Favorites'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {INITIAL_DAY_PLANS.filter(dp => selectedDayFilter === 'All' || dp.day === selectedDayFilter).map((dayPlan) => {
          const dayProblems = filteredProblems.filter(p => p.day === dayPlan.day);
          if (dayProblems.length === 0 && (searchQuery || selectedDifficultyFilter !== 'All' || selectedCompanyFilter !== 'All')) {
            return null;
          }

          return (
            <DayCard
              key={dayPlan.day}
              dayPlan={dayPlan}
              problems={dayProblems.length > 0 ? dayProblems : problemList.filter(p => p.day === dayPlan.day)}
              isInitiallyExpanded={dayPlan.day === 1}
              onOpenDetail={(problem) => setSelectedModalProblem(problem)}
            />
          );
        })}
      </div>

      <ProblemDetailModal
        problem={selectedModalProblem}
        onClose={() => setSelectedModalProblem(null)}
      />
    </div>
  );
};
