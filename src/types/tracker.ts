export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type ProblemStatus = 'pending' | 'started' | 'in_progress' | 'solved' | 'need_revision' | 'skipped';

export type PatternName =
  | 'Arrays'
  | 'Strings'
  | 'Hash Map'
  | 'Two Pointer'
  | 'Sliding Window'
  | 'Binary Search'
  | 'Stack'
  | 'Queue'
  | 'Heap'
  | 'Linked List'
  | 'Tree'
  | 'BST'
  | 'Trie'
  | 'Graph'
  | 'Backtracking'
  | 'Greedy'
  | 'DP'
  | 'Bit Manipulation'
  | 'Math'
  | 'Matrix'
  | 'Union Find'
  | 'Topological Sort'
  | 'Monotonic Stack'
  | 'Binary Search on Answer';

export type TargetCompany =
  | 'Amazon'
  | 'Microsoft'
  | 'Adobe'
  | 'Google'
  | 'Atlassian'
  | 'Walmart'
  | 'Oracle'
  | 'Goldman Sachs'
  | 'Uber'
  | 'Meta';

export interface Problem {
  id: string; // e.g. "p-101"
  day: number; // 1 to 30
  leetcodeNumber?: number;
  title: string;
  topic: string; // Original topic from Babbar sheet
  pattern: PatternName;
  difficulty: Difficulty;
  leetcodeUrl: string;
  solutionVideoUrl?: string;
  companyTags: TargetCompany[];
  recognitionHint: string;
  commonMistakes?: string[];
  timeComplexity?: string;
  spaceComplexity?: string;
  estimatedTimeMin: number;
  
  // User state fields
  status: ProblemStatus;
  completed: boolean;
  completedAt?: string; // ISO string date
  favorite: boolean;
  notes: string;
  timeSpentSec: number;
  revisionDates: string[]; // Scheduled ISO dates: [1d, 7d, 21d]
  revisionCompleted?: boolean[];
}

export interface DayPlan {
  day: number;
  title: string;
  description: string;
  targetFocus: string;
  problemIds: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  requirement: string;
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  count: number;
  timeSpentMin: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: 'google' | 'github' | 'email' | 'guest';
}

export interface TrackerStoreState {
  problems: Record<string, Problem>;
  theme: 'dark' | 'light';
  currentDay: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  dailyActivities: Record<string, DailyActivity>;

  searchQuery: string;
  selectedDifficultyFilter: Difficulty | 'All';
  selectedStatusFilter: ProblemStatus | 'All';
  selectedCompanyFilter: TargetCompany | 'All';
  selectedPatternFilter: PatternName | 'All';
  onlyFavorites: boolean;
  activeTab: 'dashboard' | 'roadmap' | 'library' | 'revision' | 'patterns' | 'stats' | 'achievements' | 'settings';

  // Auth state
  user: UserProfile | null;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;

  // Notification state
  notificationsEnabled: boolean;
  reminderTime: string; // e.g. "20:00"
  lastNotificationSentDate: string | null;

  // Cloud Sync state
  syncCode: string | null;
  lastSyncedAt: string | null;
  isSyncing: boolean;

  // Customizable Timer state
  activeTimerProblemId: string | null;
  timerSeconds: number;
  timerTargetMinutes: number; // e.g. 15, 20, 30, 40 min
  isTimerRunning: boolean;

  toggleProblemCompleted: (id: string) => void;
  updateProblemStatus: (id: string, status: ProblemStatus) => void;
  toggleProblemFavorite: (id: string) => void;
  updateProblemNotes: (id: string, notes: string) => void;
  addTimeSpent: (id: string, seconds: number) => void;
  markRevisionComplete: (id: string, intervalIndex: number) => void;
  
  setSearchQuery: (query: string) => void;
  setDifficultyFilter: (diff: Difficulty | 'All') => void;
  setStatusFilter: (status: ProblemStatus | 'All') => void;
  setCompanyFilter: (comp: TargetCompany | 'All') => void;
  setPatternFilter: (pattern: PatternName | 'All') => void;
  setOnlyFavorites: (fav: boolean) => void;
  setActiveTab: (tab: TrackerStoreState['activeTab']) => void;
  setTheme: (theme: 'dark' | 'light') => void;

  // Auth actions
  login: (provider: UserProfile['provider'], email?: string, name?: string) => void;
  logout: () => void;
  setAuthModalOpen: (open: boolean) => void;

  // Notification actions
  setNotificationsEnabled: (enabled: boolean) => Promise<boolean>;
  setReminderTime: (time: string) => void;
  sendTestNotification: () => Promise<boolean>;

  // Cloud Sync actions
  generateNewSyncCode: () => string;
  setSyncCode: (code: string) => void;
  pushCloudSync: () => Promise<boolean>;
  pullCloudSync: (code?: string) => Promise<boolean>;
  
  // Timer actions
  setTimerTargetMinutes: (minutes: number) => void;
  startTimer: (problemId: string, durationMinutes?: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: (saveToProblem?: boolean) => void;
  tickTimer: () => void;

  exportUserData: () => string;
  importUserData: (jsonData: string) => boolean;
  resetAllProgress: () => void;
}
