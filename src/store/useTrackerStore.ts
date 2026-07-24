import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import confetti from 'canvas-confetti';
import type { TrackerStoreState, ProblemStatus, Difficulty, TargetCompany, PatternName, Problem } from '../types/tracker';
import { INITIAL_PROBLEMS } from '../data/problemsData';
import { getTodayDateString, calculateRevisionSchedule, calculateStreak } from '../utils/dateUtils';

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

      activeTimerProblemId: null,
      timerSeconds: 0,
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

      startTimer: (problemId: string) => {
        set({
          activeTimerProblemId: problemId,
          timerSeconds: 0,
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
      name: 'placement-tracker-storage-v1',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
