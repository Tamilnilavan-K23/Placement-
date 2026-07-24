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

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PrepForge • Forge your Dream Offer</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              30-Day DSA Placement Challenge
            </h1>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Forge your coding mastery for Tier-1 companies (Amazon, Microsoft, Google, Meta, Adobe, Uber, Atlassian, Goldman Sachs). 
              Target: <span className="text-brand-300 font-bold">10 problems per day</span> (4 Easy, 4 Medium, 2 Hard).
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setActiveTab('roadmap')}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-400 hover:to-accent-400 text-white font-bold text-xs shadow-xl shadow-brand-500/30 transition-all transform active:scale-95 cursor-pointer"
              >
                <CalendarDays className="w-4 h-4" />
                <span>Resume Day {activeDay} Roadmap</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-slate-900/60 p-4 rounded-2xl border border-brand-500/20 shadow-lg flex-shrink-0">
            <img 
              src="/assets/mascot-forgebot.png" 
              alt="ForgeBot" 
              className="w-24 h-36 object-contain drop-shadow-[0_0_15px_rgba(12,148,235,0.4)] transition-transform hover:scale-105" 
            />
            <div className="max-w-[140px] space-y-1">
              <span className="text-[10px] font-extrabold text-brand-400 uppercase tracking-wider block">
                🤖 ForgeBot Assistant
              </span>
              <p className="text-xs text-slate-200 font-medium leading-snug">
                "Keep forging! Complete today's 10 questions to maintain your streak."
              </p>
            </div>
          </div>
        </div>
      </div>

      <StatCards />
      <ContributionHeatmap />
      <RecentActivity />
    </div>
  );
};
