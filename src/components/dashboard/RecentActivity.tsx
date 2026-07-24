import React from 'react';
import { RotateCcw, CheckCircle2, ArrowRight, ExternalLink, Star } from 'lucide-react';
import { useTrackerStore } from '../../store/useTrackerStore';
import { getTodayDateString } from '../../utils/dateUtils';

export const RecentActivity: React.FC = () => {
  const { problems, setActiveTab, toggleProblemFavorite } = useTrackerStore();

  const problemList = Object.values(problems);

  const recentlySolved = problemList
    .filter(p => p.completed && p.completedAt)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
    .slice(0, 5);

  const today = getTodayDateString();
  const upcomingRevisions = problemList.filter(p => {
    if (!p.completed || !p.revisionDates || p.revisionDates.length === 0) return false;
    return p.revisionDates.some((date, idx) => {
      const isCompleted = p.revisionCompleted && p.revisionCompleted[idx];
      return !isCompleted && date <= today;
    });
  }).slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Recently Solved
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('library')}
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentlySolved.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl">
            <p className="text-xs text-slate-400">No problems solved yet today!</p>
            <button
              onClick={() => setActiveTab('roadmap')}
              className="mt-3 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-500/20"
            >
              Start Day 1 Challenge
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentlySolved.map(prob => (
              <div
                key={prob.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/60 hover:border-slate-700/80 transition-all"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                    prob.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
                    prob.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-rose-500/20 text-rose-400'
                  }`}>
                    {prob.difficulty}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-slate-200 truncate">
                      Day {prob.day}: {prob.title}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {prob.pattern} • {prob.companyTags.slice(0, 2).join(', ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleProblemFavorite(prob.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      prob.favorite ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </button>
                  <a
                    href={prob.leetcodeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <RotateCcw className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Revision Due Today
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('revision')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center space-x-1"
          >
            <span>Revision Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {upcomingRevisions.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl">
            <p className="text-xs text-slate-400">No revisions scheduled for today. Great job keeping up!</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {upcomingRevisions.map(prob => (
              <div
                key={prob.id}
                className="flex items-center justify-between p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 hover:border-amber-500/40 transition-all"
              >
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-slate-100 truncate">
                    {prob.title}
                  </h4>
                  <span className="text-[10px] text-amber-400">
                    Spaced repetition interval due • {prob.pattern}
                  </span>
                </div>

                <a
                  href={prob.leetcodeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 text-[11px] font-semibold hover:bg-amber-500/30 transition-colors"
                >
                  Review Now
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
