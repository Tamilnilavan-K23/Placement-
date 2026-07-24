import React from 'react';
import { Flame, Zap } from 'lucide-react';
import { useTrackerStore } from '../../store/useTrackerStore';
import { formatTimeSpent } from '../../utils/dateUtils';

export const StatisticsView: React.FC = () => {
  const { problems, currentStreak, longestStreak } = useTrackerStore();

  const problemList = Object.values(problems);
  const total = problemList.length;
  const solved = problemList.filter(p => p.completed);
  const solvedCount = solved.length;

  const easySolved = problemList.filter(p => p.difficulty === 'Easy' && p.completed).length;
  const easyTotal = problemList.filter(p => p.difficulty === 'Easy').length;

  const medSolved = problemList.filter(p => p.difficulty === 'Medium' && p.completed).length;
  const medTotal = problemList.filter(p => p.difficulty === 'Medium').length;

  const hardSolved = problemList.filter(p => p.difficulty === 'Hard' && p.completed).length;
  const hardTotal = problemList.filter(p => p.difficulty === 'Hard').length;

  const totalSec = problemList.reduce((acc, p) => acc + (p.timeSpentSec || 0), 0);
  const avgTimeSec = solvedCount > 0 ? Math.round(totalSec / solvedCount) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Performance Analytics & Statistics
        </h1>
        <p className="text-xs text-slate-400">
          In-depth insights on solving speeds, difficulty distribution, and daily momentum.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Total Problems Solved</span>
          <div className="text-3xl font-extrabold text-white">{solvedCount} / {total}</div>
          <p className="text-xs text-brand-400 font-bold">{Math.round((solvedCount / total) * 100)}% Complete</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Average Solve Time</span>
          <div className="text-3xl font-extrabold text-white">{formatTimeSpent(avgTimeSec)}</div>
          <p className="text-xs text-slate-400">Per solved problem</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Current Streak</span>
          <div className="text-3xl font-extrabold text-amber-400 flex items-center space-x-2">
            <Flame className="w-6 h-6 text-amber-500 animate-pulse" />
            <span>{currentStreak} Days</span>
          </div>
          <p className="text-xs text-slate-400">Longest: {longestStreak} Days</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Time Dedicated</span>
          <div className="text-3xl font-extrabold text-white">{formatTimeSpent(totalSec)}</div>
          <p className="text-xs text-slate-400">Integrated timer tracking</p>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 space-y-6">
        <h2 className="text-base font-extrabold text-white flex items-center space-x-2">
          <Zap className="w-5 h-5 text-brand-400" />
          <span>Difficulty Distribution</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-emerald-400">Easy Problems</span>
              <span className="text-slate-300">{easySolved} / {easyTotal}</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${(easySolved / easyTotal) * 100}%` }} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-amber-400">Medium Problems</span>
              <span className="text-slate-300">{medSolved} / {medTotal}</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full transition-all duration-500" style={{ width: `${(medSolved / medTotal) * 100}%` }} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-rose-400">Hard Problems</span>
              <span className="text-slate-300">{hardSolved} / {hardTotal}</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div className="bg-rose-400 h-full rounded-full transition-all duration-500" style={{ width: `${(hardSolved / hardTotal) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
