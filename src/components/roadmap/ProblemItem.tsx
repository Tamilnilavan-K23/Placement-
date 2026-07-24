import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Star, 
  ExternalLink, 
  Lightbulb, 
  Clock, 
  ChevronRight 
} from 'lucide-react';
import type { Problem } from '../../types/tracker';
import { useTrackerStore } from '../../store/useTrackerStore';

interface ProblemItemProps {
  problem: Problem;
  onOpenDetail: (problem: Problem) => void;
}

export const ProblemItem: React.FC<ProblemItemProps> = ({ problem, onOpenDetail }) => {
  const { toggleProblemCompleted, toggleProblemFavorite, startTimer } = useTrackerStore();
  const [showInlineHint, setShowInlineHint] = useState(false);

  return (
    <div className={`p-4 rounded-2xl border transition-all duration-200 ${
      problem.completed 
        ? 'bg-slate-900/40 border-emerald-500/30' 
        : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700'
    }`}>
      <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <button
            onClick={() => toggleProblemCompleted(problem.id)}
            className={`p-1 rounded-xl transition-all ${
              problem.completed ? 'text-emerald-400 scale-110' : 'text-slate-600 hover:text-slate-400'
            }`}
          >
            {problem.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
          </button>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="text-[10px] font-extrabold text-slate-400 font-mono">
                #{problem.leetcodeNumber || 'LC'}
              </span>
              
              <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md ${
                problem.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                problem.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                {problem.difficulty}
              </span>

              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {problem.pattern}
              </span>

              <div className="hidden md:flex items-center space-x-1">
                {problem.companyTags.slice(0, 2).map((comp, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-slate-800 text-slate-300">
                    {comp}
                  </span>
                ))}
              </div>
            </div>

            <h4
              onClick={() => onOpenDetail(problem)}
              className={`text-sm font-bold tracking-tight cursor-pointer hover:text-brand-300 transition-colors ${
                problem.completed ? 'text-slate-400 line-through' : 'text-slate-100'
              }`}
            >
              {problem.title}
            </h4>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowInlineHint(!showInlineHint)}
            className={`p-2 rounded-xl border text-xs transition-colors ${
              showInlineHint
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-amber-400'
            }`}
            title="Toggle Recognition Hint"
          >
            <Lightbulb className="w-4 h-4" />
          </button>

          <button
            onClick={() => toggleProblemFavorite(problem.id)}
            className={`p-2 rounded-xl border transition-colors ${
              problem.favorite
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-amber-400'
            }`}
          >
            <Star className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={() => startTimer(problem.id)}
            className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-white"
            title="Start Timer"
          >
            <Clock className="w-4 h-4" />
          </button>

          <a
            href={problem.leetcodeUrl}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-brand-600/20 text-brand-300 hover:bg-brand-600/40 border border-brand-500/30"
            title="Solve on LeetCode"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={() => onOpenDetail(problem)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showInlineHint && (
        <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-200">
          💡 <span className="font-bold">Pattern Hint:</span> {problem.recognitionHint}
        </div>
      )}
    </div>
  );
};
