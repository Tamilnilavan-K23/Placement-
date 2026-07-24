import React from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  BookOpen, 
  RotateCcw, 
  Grid2X2, 
  BarChart3, 
  Trophy, 
  Settings, 
  Flame, 
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { useTrackerStore } from '../../store/useTrackerStore';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  id: 'dashboard' | 'roadmap' | 'library' | 'revision' | 'patterns' | 'stats' | 'achievements' | 'settings';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string | null;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCloseMobile }) => {
  const { activeTab, setActiveTab, currentStreak, theme, setTheme, problems } = useTrackerStore();

  const totalProblems = Object.keys(problems).length;
  const solvedCount = Object.values(problems).filter(p => p.completed).length;
  const needRevisionCount = Object.values(problems).filter(p => p.status === 'need_revision').length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'roadmap', label: '30-Day Roadmap', icon: CalendarDays, badge: '30 Days' },
    { id: 'library', label: 'Problem Library', icon: BookOpen, badge: `${totalProblems}` },
    { id: 'revision', label: 'Revision List', icon: RotateCcw, badge: needRevisionCount > 0 ? `${needRevisionCount}` : null, badgeColor: 'bg-amber-500/20 text-amber-400' },
    { id: 'patterns', label: 'Pattern Progress', icon: Grid2X2, badge: '24 Patterns' },
    { id: 'stats', label: 'Statistics', icon: BarChart3, badge: null },
    { id: 'achievements', label: 'Achievements', icon: Trophy, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null }
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-xl border-r border-slate-800/80 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col h-full">
        {/* Header Logo */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-slate-800/80">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-accent-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Placement Tracker
              </h1>
              <span className="text-[10px] font-semibold tracking-wider text-brand-400 uppercase">
                PWA Edition • 300 DSA
              </span>
            </div>
          </div>
        </div>

        {/* Streak Status Pill */}
        <div className="px-4 py-3 border-b border-slate-800/50">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/20">
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-200">Current Streak</span>
            </div>
            <span className="text-sm font-extrabold text-amber-400">{currentStreak} Days</span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-600/90 to-accent-600/80 text-white shadow-md shadow-brand-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-400'
                  }`} />
                  <span>{item.label}</span>
                </div>
                
                {item.badge && (
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400')
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Progress Footer Mini Card */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">30-Day Completion</span>
              <span className="text-brand-400 font-bold">{Math.round((solvedCount / totalProblems) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-brand-500 to-accent-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(solvedCount / totalProblems) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 text-center pt-0.5">
              {solvedCount} of {totalProblems} problems solved
            </p>
          </div>

          {/* Theme Toggle Button */}
          <div className="mt-3 flex items-center justify-between px-2 pt-2">
            <span className="text-xs text-slate-400">Theme</span>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Toggle Light / Dark mode"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
