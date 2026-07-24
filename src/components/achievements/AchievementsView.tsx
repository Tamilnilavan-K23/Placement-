import React from 'react';
import { Trophy, Lock } from 'lucide-react';
import { useTrackerStore } from '../../store/useTrackerStore';

export const AchievementsView: React.FC = () => {
  const { problems, currentStreak } = useTrackerStore();

  const problemList = Object.values(problems);
  const solvedCount = problemList.filter(p => p.completed).length;

  const dpSolved = problemList.filter(p => p.pattern === 'DP' && p.completed).length;
  const graphSolved = problemList.filter(p => p.pattern === 'Graph' && p.completed).length;
  const treeSolved = problemList.filter(p => p.pattern === 'Tree' && p.completed).length;
  const hashMapSolved = problemList.filter(p => p.pattern === 'Hash Map' && p.completed).length;

  const badges = [
    { id: 'first_step', title: 'First Problem', desc: 'Solved your very first DSA problem', req: '1 Solved', unlocked: solvedCount >= 1 },
    { id: 'starter_10', title: '10 Problems', desc: 'Solved 10 placement problems', req: '10 Solved', unlocked: solvedCount >= 10 },
    { id: 'half_century', title: '50 Problems', desc: 'Half century milestone reached!', req: '50 Solved', unlocked: solvedCount >= 50 },
    { id: 'century_100', title: '100 Problems', desc: 'Mastered 100 DSA questions', req: '100 Solved', unlocked: solvedCount >= 100 },
    { id: 'dsa_expert_200', title: '200 Problems', desc: 'Top tier placement candidate', req: '200 Solved', unlocked: solvedCount >= 200 },
    { id: 'grandmaster_300', title: '300 Problems', desc: 'Completed full 30-day challenge!', req: '300 Solved', unlocked: solvedCount >= 300 },

    { id: 'streak_7', title: '7 Day Streak', desc: 'Consistent 5+ problems/day for a week', req: '7 Day Streak', unlocked: currentStreak >= 7 },
    { id: 'streak_30', title: '30 Day Streak', desc: 'Flawless 30 days placement streak', req: '30 Day Streak', unlocked: currentStreak >= 30 },

    { id: 'dp_master', title: 'DP Master', desc: 'Solved at least 15 Dynamic Programming problems', req: '15 DP Solved', unlocked: dpSolved >= 15 },
    { id: 'graph_master', title: 'Graph Master', desc: 'Solved at least 15 Graph problems', req: '15 Graph Solved', unlocked: graphSolved >= 15 },
    { id: 'tree_master', title: 'Tree Master', desc: 'Solved at least 15 Tree/BST problems', req: '15 Tree Solved', unlocked: treeSolved >= 15 },
    { id: 'hash_master', title: 'HashMap Master', desc: 'Solved at least 15 HashMap/Frequency problems', req: '15 HashMap Solved', unlocked: hashMapSolved >= 15 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Achievements & Badges
        </h1>
        <p className="text-xs text-slate-400">
          Unlock achievements as you solve problems and maintain daily streaks.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {badges.map((b) => (
          <div
            key={b.id}
            className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
              b.unlocked
                ? 'glass-panel border-amber-500/30 bg-amber-500/5 shadow-lg shadow-amber-500/10'
                : 'bg-slate-900/40 border-slate-800/80 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
                b.unlocked ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-500'
              }`}>
                {b.unlocked ? <Trophy className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </div>

              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                b.unlocked ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-500'
              }`}>
                {b.req}
              </span>
            </div>

            <div className="mt-3 space-y-1">
              <h3 className="text-sm font-extrabold text-slate-100">{b.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
