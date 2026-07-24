import React from 'react';
import { RotateCcw } from 'lucide-react';
import { useTrackerStore } from '../../store/useTrackerStore';
import { getTodayDateString } from '../../utils/dateUtils';

export const RevisionView: React.FC = () => {
  const { problems, markRevisionComplete } = useTrackerStore();

  const today = getTodayDateString();
  const problemList = Object.values(problems);

  const revisionQueue = problemList.filter(p => p.completed && p.revisionDates && p.revisionDates.length > 0);

  const dueToday = revisionQueue.filter(p => {
    return p.revisionDates.some((d, idx) => {
      const isCompleted = p.revisionCompleted && p.revisionCompleted[idx];
      return !isCompleted && d <= today;
    });
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Spaced Repetition Revision Hub
        </h1>
        <p className="text-xs text-slate-400">
          Automatically schedules revisions at 1-day, 7-day, and 21-day intervals to lock solutions into long-term memory.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 bg-amber-500/5 space-y-4">
        <div className="flex items-center space-x-2 text-amber-400">
          <RotateCcw className="w-5 h-5 animate-spin-slow" />
          <h2 className="text-base font-extrabold text-slate-100">
            Due For Revision Today ({dueToday.length})
          </h2>
        </div>

        {dueToday.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl">
            <p className="text-xs text-slate-400">No revisions currently due! Keep solving new problems.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dueToday.map(prob => (
              <div
                key={prob.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4 flex-wrap"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-amber-400">Day {prob.day}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-purple-500/20 text-purple-300">
                      {prob.pattern}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-100">{prob.title}</h3>
                </div>

                <div className="flex items-center space-x-2">
                  <a
                    href={prob.leetcodeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-brand-600/20 text-brand-300 border border-brand-500/30 text-xs font-bold hover:bg-brand-600/40"
                  >
                    Solve on LeetCode
                  </a>

                  {prob.revisionDates.map((_, idx) => {
                    const isDone = prob.revisionCompleted && prob.revisionCompleted[idx];
                    return (
                      <button
                        key={idx}
                        onClick={() => markRevisionComplete(prob.id, idx)}
                        disabled={isDone}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isDone
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                            : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                        }`}
                      >
                        {isDone ? `Interval ${idx + 1} ✓` : `Mark Rev ${idx + 1}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
