import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Star, 
  ExternalLink, 
  Lightbulb, 
  Clock 
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
  const [showTimerPicker, setShowTimerPicker] = useState(false);

  const handleStartTimerWithDuration = (mins: number) => {
    startTimer(problem.id, mins);
    setShowTimerPicker(false);
  };

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

        <div className="flex items-center space-x-2 relative">
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
            title="Toggle Favorite"
          >
            <Star className="w-4 h-4 fill-current" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowTimerPicker(!showTimerPicker)}
              className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-white flex items-center space-x-1"
              title="Set Customizable Timer (15m, 20m, 30m, 40m)"
            >
              <Clock className="w-4 h-4" />
            </button>

            {showTimerPicker && (
              <div className="absolute right-0 top-11 z-30 p-2 bg-slate-900 border border-slate-700 rounded-xl shadow-xl space-y-1 w-32">
                <p className="text-[10px] font-bold text-slate-400 px-2 py-0.5 border-b border-slate-800">
                  Select Duration:
                </p>
                {[15, 20, 30, 40].map(mins => (
                  <button
                    key={mins}
                    onClick={() => handleStartTimerWithDuration(mins)}
                    className="w-full text-left px-2.5 py-1 text-xs font-semibold text-slate-200 hover:bg-brand-600 hover:text-white rounded-lg transition-colors"
                  >
                    ⏱ {mins} Minutes
                  </button>
                ))}
              </div>
            )}
          </div>

          <a
            href={problem.leetcodeUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-brand-600/20 text-brand-300 hover:bg-brand-600/40 border border-brand-500/30 text-xs font-bold transition-colors"
            title="Solve directly on LeetCode"
          >
            <span>Solve</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
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
