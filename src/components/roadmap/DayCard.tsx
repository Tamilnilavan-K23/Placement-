import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import type { DayPlan, Problem } from '../../types/tracker';
import { ProblemItem } from './ProblemItem';

interface DayCardProps {
  dayPlan: DayPlan;
  problems: Problem[];
  isInitiallyExpanded?: boolean;
  onOpenDetail: (problem: Problem) => void;
}

export const DayCard: React.FC<DayCardProps> = ({ dayPlan, problems, isInitiallyExpanded = false, onOpenDetail }) => {
  const [expanded, setExpanded] = useState(isInitiallyExpanded);

  const totalCount = problems.length;
  const solvedCount = problems.filter(p => p.completed).length;
  const progressPercent = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  const easyCount = problems.filter(p => p.difficulty === 'Easy').length;
  const medCount = problems.filter(p => p.difficulty === 'Medium').length;
  const hardCount = problems.filter(p => p.difficulty === 'Hard').length;

  return (
    <div className="glass-panel rounded-3xl border border-slate-800/80 overflow-hidden transition-all duration-300">
      <div
        onClick={() => setExpanded(!expanded)}
        className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 transition-colors select-none gap-4"
      >
        <div className="flex items-center space-x-4 min-w-0">
          <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-extrabold shadow-lg ${
            progressPercent === 100
              ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-emerald-500/20'
              : 'bg-gradient-to-tr from-brand-600 to-accent-600 text-white shadow-brand-500/20'
          }`}>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Day</span>
            <span className="text-base leading-none">{dayPlan.day}</span>
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="text-xs font-extrabold text-brand-400">
                {dayPlan.targetFocus}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-800 text-slate-300">
                {easyCount}E / {medCount}M / {hardCount}H
              </span>
            </div>

            <h3 className="text-base font-extrabold text-slate-100 tracking-tight truncate">
              {dayPlan.title}
            </h3>

            <p className="text-xs text-slate-400 truncate hidden sm:block">
              {dayPlan.description}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block min-w-[90px]">
            <div className="flex items-center justify-end space-x-1 text-xs font-bold text-slate-200">
              {progressPercent === 100 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              <span>{solvedCount}/{totalCount} Solved</span>
            </div>
            <div className="w-24 bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  progressPercent === 100 ? 'bg-emerald-400' : 'bg-brand-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <button className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white">
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-5 border-t border-slate-800/80 bg-slate-950/40 space-y-3">
          {problems.map(prob => (
            <ProblemItem
              key={prob.id}
              problem={prob}
              onOpenDetail={onOpenDetail}
            />
          ))}
        </div>
      )}
    </div>
  );
};
