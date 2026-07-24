import React, { useState, useEffect } from 'react';
import { Menu, Search, Timer, Download, X } from 'lucide-react';
import { useTrackerStore } from '../../store/useTrackerStore';
import { formatTimeSpent } from '../../utils/dateUtils';

interface NavbarProps {
  onToggleMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileSidebar }) => {
  const { 
    activeTab, 
    searchQuery, 
    setSearchQuery, 
    isTimerRunning, 
    timerSeconds, 
    activeTimerProblemId, 
    problems, 
    stopTimer, 
    pauseTimer, 
    resumeTimer 
  } = useTrackerStore();

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallPWA = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          setDeferredPrompt(null);
        }
      });
    } else {
      alert('PWA installation ready! Click your browser options menu (3 dots or share icon) and select "Add to Home Screen" or "Install Placement Tracker".');
    }
  };

  const timerProblem = activeTimerProblemId ? problems[activeTimerProblemId] : null;

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <h2 className="text-sm font-bold text-slate-100 capitalize">
            {activeTab.replace('-', ' ')}
          </h2>
          <p className="text-[11px] text-slate-400">
            30-Day Placement DSA Roadmap
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems by name, pattern, company (Amazon, Google...)"
            className="w-full pl-9 pr-9 py-1.5 text-xs bg-slate-800/60 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {activeTimerProblemId && timerProblem && (
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono animate-pulse">
            <Timer className="w-3.5 h-3.5" />
            <span>{formatTimeSpent(timerSeconds)}</span>
            <button
              onClick={() => (isTimerRunning ? pauseTimer() : resumeTimer())}
              className="ml-1 text-[10px] underline font-bold"
            >
              {isTimerRunning ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={() => stopTimer(true)}
              className="text-[10px] text-rose-400 hover:text-rose-300 underline font-bold"
            >
              Save
            </button>
          </div>
        )}

        <button
          onClick={handleInstallPWA}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition-all transform active:scale-95"
          title="Install app to desktop or mobile"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Install App</span>
        </button>
      </div>
    </header>
  );
};
