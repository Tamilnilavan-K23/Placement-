import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import confetti from 'canvas-confetti';
import type { TrackerStoreState, ProblemStatus, Difficulty, TargetCompany, PatternName, Problem } from '../types/tracker';
import { INITIAL_PROBLEMS } from '../data/problemsData';
import { getTodayDateString, calculateRevisionSchedule, calculateStreak } from '../utils/dateUtils';
import { requestNotificationPermission, sendTestPushNotification } from '../utils/notificationUtils';
import { generateDevicePairCode, pushProgressToCloud, pullProgressFromCloud } from '../utils/cloudSyncUtils';

export const useTrackerStore = create<TrackerStoreState>()(
  persist(
    (set, get) => ({
      problems: INITIAL_PROBLEMS,
      theme: 'dark',
      currentDay: 1,
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
      dailyActivities: {},

      searchQuery: '',
      selectedDifficultyFilter: 'All',
      selectedStatusFilter: 'All',
      selectedCompanyFilter: 'All',
      selectedPatternFilter: 'All',
      onlyFavorites: false,
      activeTab: 'dashboard',

      user: null,
      isLoggedIn: false,
      isAuthModalOpen: false,

      notificationsEnabled: false,
      reminderTime: '20:00',
      lastNotificationSentDate: null,

      syncCode: null,
      lastSyncedAt: null,
      isSyncing: false,

      activeTimerProblemId: null,
      timerSeconds: 0,
      timerTargetMinutes: 20,
      isTimerRunning: false,

      toggleProblemCompleted: (id: string) => {
        const state = get();
        const problem = state.problems[id];
        if (!problem) return;

        const isNowCompleted = !problem.completed;
        const today = getTodayDateString();

        const updatedProblem: Problem = {
          ...problem,
          completed: isNowCompleted,
          status: isNowCompleted ? 'solved' : 'pending',
          completedAt: isNowCompleted ? new Date().toISOString() : undefined,
          revisionDates: isNowCompleted ? calculateRevisionSchedule(new Date().toISOString()) : problem.revisionDates,
          revisionCompleted: isNowCompleted ? [false, false, false] : problem.revisionCompleted
        };

        const updatedProblems = {
          ...state.problems,
          [id]: updatedProblem
        };

        const currentActivity = state.dailyActivities[today] || { date: today, count: 0, timeSpentMin: 0 };
        const newCount = Math.max(0, currentActivity.count + (isNowCompleted ? 1 : -1));
        
        const updatedActivities = {
          ...state.dailyActivities,
          [today]: {
            ...currentActivity,
            count: newCount
          }
        };

        const dailyCountsMap: Record<string, number> = {};
        Object.keys(updatedActivities).forEach(d => {
          dailyCountsMap[d] = updatedActivities[d].count;
        });

        const { currentStreak, longestStreak } = calculateStreak(dailyCountsMap);

        if (isNowCompleted) {
          const totalSolved = Object.values(updatedProblems).filter(p => p.completed).length;
          if ([1, 10, 50, 100, 200, 300].includes(totalSolved) || currentStreak === 7 || currentStreak === 30) {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          }
        }

        set({
          problems: updatedProblems,
          dailyActivities: updatedActivities,
          currentStreak,
          longestStreak: Math.max(state.longestStreak, longestStreak),
          lastActiveDate: today
        });

        // Auto background cloud sync
        if (state.syncCode) {
          get().pushCloudSync().catch(() => {});
        }
      },

      updateProblemStatus: (id: string, status: ProblemStatus) => {
        const state = get();
        const problem = state.problems[id];
        if (!problem) return;

        const isSolved = status === 'solved';
        const updatedProblem: Problem = {
          ...problem,
          status,
          completed: isSolved,
          completedAt: isSolved ? new Date().toISOString() : problem.completedAt
        };

        set({
          problems: {
            ...state.problems,
            [id]: updatedProblem
          }
        });
      },

      toggleProblemFavorite: (id: string) => {
        const state = get();
        const problem = state.problems[id];
        if (!problem) return;

        set({
          problems: {
            ...state.problems,
            [id]: {
              ...problem,
              favorite: !problem.favorite
            }
          }
        });
      },

      updateProblemNotes: (id: string, notes: string) => {
        const state = get();
        const problem = state.problems[id];
        if (!problem) return;

        set({
          problems: {
            ...state.problems,
            [id]: {
              ...problem,
              notes
            }
          }
        });
      },

      addTimeSpent: (id: string, seconds: number) => {
        const state = get();
        const problem = state.problems[id];
        if (!problem) return;

        const updatedTime = (problem.timeSpentSec || 0) + seconds;
        set({
          problems: {
            ...state.problems,
            [id]: {
              ...problem,
              timeSpentSec: updatedTime
            }
          }
        });
      },

      markRevisionComplete: (id: string, intervalIndex: number) => {
        const state = get();
        const problem = state.problems[id];
        if (!problem) return;

        const revCompleted = problem.revisionCompleted ? [...problem.revisionCompleted] : [false, false, false];
        revCompleted[intervalIndex] = true;

        set({
          problems: {
            ...state.problems,
            [id]: {
              ...problem,
              revisionCompleted: revCompleted
            }
          }
        });
      },

      setSearchQuery: (query: string) => set({ searchQuery: query }),
      setDifficultyFilter: (diff: Difficulty | 'All') => set({ selectedDifficultyFilter: diff }),
      setStatusFilter: (status: ProblemStatus | 'All') => set({ selectedStatusFilter: status }),
      setCompanyFilter: (comp: TargetCompany | 'All') => set({ selectedCompanyFilter: comp }),
      setPatternFilter: (pattern: PatternName | 'All') => set({ selectedPatternFilter: pattern }),
      setOnlyFavorites: (fav: boolean) => set({ onlyFavorites: fav }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setTheme: (theme: 'dark' | 'light') => set({ theme }),

      login: (provider, email, name) => {
        const userName = name || (email ? email.split('@')[0] : 'Placement Candidate');
        const userEmail = email || `${userName.toLowerCase().replace(/\s+/g, '')}@placement.io`;
        const avatar = provider === 'google' 
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : provider === 'github'
          ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80';

        set({
          user: {
            id: `user-${Date.now()}`,
            name: userName,
            email: userEmail,
            avatar,
            provider
          },
          isLoggedIn: true,
          isAuthModalOpen: false
        });
      },

      logout: () => set({ user: null, isLoggedIn: false }),
      setAuthModalOpen: (open) => set({ isAuthModalOpen: open }),

      setNotificationsEnabled: async (enabled: boolean) => {
        if (enabled) {
          const granted = await requestNotificationPermission();
          set({ notificationsEnabled: granted });
          return granted;
        } else {
          set({ notificationsEnabled: false });
          return false;
        }
      },

      setReminderTime: (time: string) => set({ reminderTime: time }),

      sendTestNotification: async () => {
        return await sendTestPushNotification();
      },

      generateNewSyncCode: () => {
        const code = generateDevicePairCode();
        set({ syncCode: code });
        return code;
      },

      setSyncCode: (code: string) => set({ syncCode: code.trim().toUpperCase() }),

      pushCloudSync: async () => {
        const state = get();
        const code = state.syncCode || state.generateNewSyncCode();
        set({ isSyncing: true });

        const success = await pushProgressToCloud(code, {
          problems: state.problems,
          dailyActivities: state.dailyActivities,
          currentStreak: state.currentStreak,
          longestStreak: state.longestStreak,
          lastActiveDate: state.lastActiveDate,
          user: state.user
        });

        set({
          isSyncing: false,
          lastSyncedAt: success ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : state.lastSyncedAt
        });

        return success;
      },

      pullCloudSync: async (customCode?: string) => {
        const state = get();
        const code = customCode || state.syncCode;
        if (!code) return false;

        set({ isSyncing: true });
        const cloudData = await pullProgressFromCloud(code);

        if (cloudData && cloudData.problems) {
          set({
            problems: { ...INITIAL_PROBLEMS, ...cloudData.problems },
            dailyActivities: cloudData.dailyActivities || state.dailyActivities,
            currentStreak: cloudData.currentStreak ?? state.currentStreak,
            longestStreak: cloudData.longestStreak ?? state.longestStreak,
            lastActiveDate: cloudData.lastActiveDate || state.lastActiveDate,
            user: cloudData.user || state.user,
            syncCode: code.toUpperCase(),
            isSyncing: false,
            lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
          return true;
        }

        set({ isSyncing: false });
        return false;
      },

      setTimerTargetMinutes: (minutes: number) => set({ timerTargetMinutes: minutes }),

      startTimer: (problemId: string, durationMinutes?: number) => {
        const state = get();
        set({
          activeTimerProblemId: problemId,
          timerSeconds: 0,
          timerTargetMinutes: durationMinutes || state.timerTargetMinutes || 20,
          isTimerRunning: true
        });
      },

      pauseTimer: () => set({ isTimerRunning: false }),
      resumeTimer: () => set({ isTimerRunning: true }),

      stopTimer: (saveToProblem: boolean = true) => {
        const state = get();
        if (saveToProblem && state.activeTimerProblemId && state.timerSeconds > 0) {
          state.addTimeSpent(state.activeTimerProblemId, state.timerSeconds);
        }
        set({
          activeTimerProblemId: null,
          timerSeconds: 0,
          isTimerRunning: false
        });
      },

      tickTimer: () => {
        const state = get();
        if (state.isTimerRunning) {
          set({ timerSeconds: state.timerSeconds + 1 });
        }
      },

      exportUserData: () => {
        const state = get();
        const exportObj = {
          problems: state.problems,
          dailyActivities: state.dailyActivities,
          currentStreak: state.currentStreak,
          longestStreak: state.longestStreak,
          lastActiveDate: state.lastActiveDate,
          theme: state.theme,
          exportedAt: new Date().toISOString()
        };
        return JSON.stringify(exportObj, null, 2);
      },

      importUserData: (jsonData: string) => {
        try {
          const parsed = JSON.parse(jsonData);
          if (parsed && parsed.problems) {
            set({
              problems: { ...INITIAL_PROBLEMS, ...parsed.problems },
              dailyActivities: parsed.dailyActivities || {},
              currentStreak: parsed.currentStreak || 0,
              longestStreak: parsed.longestStreak || 0,
              lastActiveDate: parsed.lastActiveDate || null,
              theme: parsed.theme || 'dark'
            });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },

      resetAllProgress: () => {
        set({
          problems: INITIAL_PROBLEMS,
          dailyActivities: {},
          currentStreak: 0,
          longestStreak: 0,
          lastActiveDate: null
        });
      }
    }),
    {
      name: 'placement-tracker-storage-v5',
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState: any, currentState: TrackerStoreState) => {
        if (!persistedState) return currentState;

        const mergedProblems: Record<string, Problem> = { ...INITIAL_PROBLEMS };

        // Preserve user progress (status, completed, favorite, notes, timeSpentSec) while taking canonical title, leetcodeUrl, etc.
        if (persistedState.problems) {
          Object.keys(INITIAL_PROBLEMS).forEach(pid => {
            const canonical = INITIAL_PROBLEMS[pid];
            const stored = persistedState.problems[pid];

            if (stored) {
              mergedProblems[pid] = {
                ...canonical,
                status: stored.status || canonical.status,
                completed: stored.completed ?? canonical.completed,
                completedAt: stored.completedAt,
                favorite: stored.favorite ?? canonical.favorite,
                notes: stored.notes || canonical.notes,
                timeSpentSec: stored.timeSpentSec || canonical.timeSpentSec,
                revisionDates: stored.revisionDates || canonical.revisionDates,
                revisionCompleted: stored.revisionCompleted || canonical.revisionCompleted
              };
            }
          });
        }

        return {
          ...currentState,
          ...persistedState,
          problems: mergedProblems
        };
      }
    }
  )
);
