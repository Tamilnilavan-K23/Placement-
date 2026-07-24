import React, { useState, useEffect } from 'react';
import { Menu, Search, Timer, Download, X, LogIn, Cloud } from 'lucide-react';
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
    timerTargetMinutes,
    activeTimerProblemId, 
    problems, 
    stopTimer, 
    pauseTimer, 
    resumeTimer,
    user,
    isLoggedIn,
    setAuthModalOpen,
    syncCode,
    pushCloudSync,
    isSyncing,
    lastSyncedAt
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
          <p className="text-[11px] text-brand-400 font-semibold">
            PrepForge • Forge your Dream Offer
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
            <div className="flex flex-col text-left leading-none">
              <span className="font-bold">{formatTimeSpent(timerSeconds)}</span>
              <span className="text-[9px] opacity-80">({timerTargetMinutes}m target)</span>
            </div>
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
          onClick={() => pushCloudSync()}
          disabled={isSyncing}
          className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
          title={syncCode ? `Cloud Pair Code: ${syncCode} (${lastSyncedAt ? `Synced ${lastSyncedAt}` : 'Not synced yet'})` : 'Click to sync progress across devices'}
        >
          <Cloud className={`w-3.5 h-3.5 ${isSyncing ? 'animate-bounce text-brand-400' : 'text-slate-400'}`} />
          <span>{isSyncing ? 'Syncing...' : syncCode ? `Sync (${syncCode})` : 'Cloud Sync'}</span>
        </button>

        {isLoggedIn && user ? (
          <button
            onClick={() => setAuthModalOpen(true)}
            className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-750 transition-colors"
            title="User Profile"
          >
            <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full object-cover" />
            <span className="text-xs font-semibold text-slate-200 hidden md:inline truncate max-w-[100px]">
              {user.name}
            </span>
          </button>
        ) : (
          <button
            onClick={() => setAuthModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <LogIn className="w-3.5 h-3.5 text-brand-400" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
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
