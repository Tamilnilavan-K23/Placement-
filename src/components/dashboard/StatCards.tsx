import React from 'react';
import { 
  CheckCircle2, 
  Flame, 
  Clock, 
  Zap
} from 'lucide-react';
import { useTrackerStore } from '../../store/useTrackerStore';
import { formatTimeSpent } from '../../utils/dateUtils';

export const StatCards: React.FC = () => {
  const { problems, currentStreak, longestStreak } = useTrackerStore();

  const problemList = Object.values(problems);
  const total = problemList.length;
  const solved = problemList.filter(p => p.completed);
  const solvedCount = solved.length;
  const remainingCount = total - solvedCount;
  const completionPercentage = Math.round((solvedCount / total) * 100);

  const easySolved = problemList.filter(p => p.difficulty === 'Easy' && p.completed).length;
  const easyTotal = problemList.filter(p => p.difficulty === 'Easy').length;

  const medSolved = problemList.filter(p => p.difficulty === 'Medium' && p.completed).length;
  const medTotal = problemList.filter(p => p.difficulty === 'Medium').length;

  const hardSolved = problemList.filter(p => p.difficulty === 'Hard' && p.completed).length;
  const hardTotal = problemList.filter(p => p.difficulty === 'Hard').length;

  const totalTimeSpentSec = problemList.reduce((sum, p) => sum + (p.timeSpentSec || 0), 0);

  const stats = [
    {
      title: 'Overall Progress',
      value: `${completionPercentage}%`,
      subtitle: `${solvedCount} / ${total} Problems Solved`,
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/10',
      badge: `${remainingCount} Remaining`
    },
    {
      title: 'Current Streak',
      value: `${currentStreak} Days`,
      subtitle: `Longest Streak: ${longestStreak} Days`,
      icon: Flame,
      color: 'from-amber-500 to-orange-600',
      shadow: 'shadow-amber-500/10',
      badge: currentStreak >= 5 ? 'Streak Active!' : 'Min 5/day needed'
    },
    {
      title: 'Time Dedicated',
      value: formatTimeSpent(totalTimeSpentSec),
      subtitle: 'Total timer tracking time',
      icon: Clock,
      color: 'from-brand-500 to-accent-600',
      shadow: 'shadow-brand-500/10',
      badge: 'Active Tracker'
    },
    {
      title: 'Difficulty Distribution',
      value: `${easySolved}E / ${medSolved}M / ${hardSolved}H`,
      subtitle: `Easy ${easySolved}/${easyTotal} • Med ${medSolved}/${medTotal} • Hard ${hardSolved}/${hardTotal}`,
      icon: Zap,
      color: 'from-indigo-500 to-purple-600',
      shadow: 'shadow-indigo-500/10',
      badge: 'Target 4E/4M/2H'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700/80 transition-all duration-300 shadow-xl ${stat.shadow} relative overflow-hidden group`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 tracking-wide">
                {stat.title}
              </span>
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${stat.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3">
              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                {stat.value}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {stat.subtitle}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800/90 text-slate-300 border border-slate-700/60">
                {stat.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
