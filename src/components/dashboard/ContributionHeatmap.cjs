import React from 'react';
import { Calendar, Flame } from 'lucide-react';
import { useTrackerStore } from '../../store/useTrackerStore';
import { generateHeatmapGrid } from '../../utils/dateUtils';

export const ContributionHeatmap: React.FC = () => {
  const { dailyActivities } = useTrackerStore();

  const grid = generateHeatmapGrid(60);

  const getIntensityColor = (count: number) => {
    if (!count || count === 0) return 'bg-slate-800/60 border-slate-700/40';
    if (count <= 2) return 'bg-emerald-950 border-emerald-800 text-emerald-300';
    if (count <= 4) return 'bg-emerald-700 border-emerald-600 text-emerald-100';
    if (count <= 7) return 'bg-emerald-500 border-emerald-400 text-white font-bold';
    return 'bg-amber-500 border-amber-400 text-slate-950 font-extrabold shadow-md shadow-amber-500/30';
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-brand-400" />
          <h3 className="text-sm font-bold text-slate-100">
            60-Day Problem Solving Heatmap
          </h3>
        </div>
        <div className="flex items-center space-x-2 text-[11px] text-slate-400">
          <span>Less</span>
          <div className="w-3 h-3 rounded bg-slate-800 border border-slate-700" />
          <div className="w-3 h-3 rounded bg-emerald-950 border border-emerald-800" />
          <div className="w-3 h-3 rounded bg-emerald-700 border border-emerald-600" />
          <div className="w-3 h-3 rounded bg-emerald-500 border border-emerald-400" />
          <div className="w-3 h-3 rounded bg-amber-500 border border-amber-400" />
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[600px]">
          {grid.map((item, idx) => {
            const act = dailyActivities[item.date];
            const count = act ? act.count : 0;
            const colorClass = getIntensityColor(count);

            return (
              <div
                key={idx}
                title={`${item.date}: ${count} problems solved`}
                className={`w-4 h-4 rounded-md border text-[8px] flex items-center justify-center transition-transform hover:scale-125 cursor-pointer ${colorClass}`}
              >
                {count > 0 ? count : ''}
              </div>
            );
          })}
        </div>
      </div>
      <p className="text-[11px] text-slate-500 text-right">
        Target: Solve 10 problems daily for 30 consecutive days
      </p>
    </div>
  );
};
