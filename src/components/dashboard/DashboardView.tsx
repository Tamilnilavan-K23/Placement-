import React from 'react';
import { StatCards } from './StatCards';
import { ContributionHeatmap } from './ContributionHeatmap';
import { RecentActivity } from './RecentActivity';
import { useTrackerStore } from '../../store/useTrackerStore';
import { Sparkles, CalendarDays, ArrowRight } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { problems, setActiveTab } = useTrackerStore();

  const problemList = Object.values(problems);

  const nextUnsolved = problemList.find(p => !p.completed);
  const activeDay = nextUnsolved ? nextUnsolved.day : 30;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-900 border border-brand-500/20 p-6 md:p-8 shadow-2xl shadow-brand-950/50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Placement Preparation Hub • Love Babbar 450 + OA Top Questions</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              30-Day Placement DSA Challenge
            </h1>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Tailored for product company placements (Amazon, Microsoft, Google, Adobe, Meta, Uber, Atlassian, Oracle, Goldman Sachs, Walmart). 
              Target: <span className="text-brand-300 font-bold">10 problems per day</span> (4 Easy, 4 Medium, 2 Hard).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('roadmap')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-400 hover:to-accent-400 text-white font-bold text-xs shadow-xl shadow-brand-500/30 transition-all transform active:scale-95"
            >
              <CalendarDays className="w-4 h-4" />
              <span>Resume Day {activeDay} Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <StatCards />
      <ContributionHeatmap />
      <RecentActivity />
    </div>
  );
};
