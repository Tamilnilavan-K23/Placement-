import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { AuthModal } from '../auth/AuthModal';
import { SplashScreen } from './SplashScreen';
import { useTrackerStore } from '../../store/useTrackerStore';
import { parseQrSyncData } from '../../utils/qrSyncUtils';
import confetti from 'canvas-confetti';
import { CheckCircle2, X } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const { isTimerRunning, tickTimer } = useTrackerStore();

  // Integrated timer tick effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        tickTimer();
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, tickTimer]);

  // Handle QR Code URL Auto-Sync Hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('#qrSync=')) {
      const base64Data = hash.replace('#qrSync=', '');
      const qrData = parseQrSyncData(base64Data);
      if (qrData && qrData.problems) {
        const store = useTrackerStore.getState();
        const mergedProblems = { ...store.problems };

        let importedCount = 0;
        Object.keys(qrData.problems).forEach(pid => {
          const item = qrData.problems[pid];
          if (mergedProblems[pid]) {
            const isCompleted = item.c === 1;
            mergedProblems[pid] = {
              ...mergedProblems[pid],
              completed: isCompleted,
              favorite: item.f === 1,
              status: (item.s as any) || (isCompleted ? 'solved' : 'pending'),
              notes: item.n || mergedProblems[pid].notes
            };
            if (isCompleted) importedCount++;
          }
        });

        useTrackerStore.setState({
          problems: mergedProblems,
          currentStreak: Math.max(store.currentStreak, qrData.streak || 0),
          longestStreak: Math.max(store.longestStreak, qrData.longestStreak || 0),
          dailyActivities: { ...store.dailyActivities, ...qrData.dailyActivities }
        });

        confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
        setSyncNotice(`🎉 QR Code Sync Successful! Imported ${importedCount} solved questions and progress.`);
        
        // Clean hash from URL without page refresh
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased">
      <SplashScreen />

      {/* Sidebar Overlay for Mobile */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/80 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <Navbar onToggleMobileSidebar={() => setMobileSidebarOpen(true)} />
        
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {syncNotice && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-lg animate-fade-in">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>{syncNotice}</span>
              </div>
              <button
                onClick={() => setSyncNotice(null)}
                className="p-1 rounded-lg hover:bg-emerald-500/20 text-emerald-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {children}
        </main>
      </div>

      <AuthModal />
    </div>
  );
};
