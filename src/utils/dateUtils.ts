export function getTodayDateString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export function formatTimeSpent(seconds: number): string {
  if (!seconds || seconds <= 0) return '0s';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}h ${mins}m ${secs}s`;
  }
  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  return `${secs}s`;
}

export function calculateRevisionSchedule(solvedDateIso: string): string[] {
  const baseDate = new Date(solvedDateIso);
  
  const d1 = new Date(baseDate);
  d1.setDate(d1.getDate() + 1);

  const d7 = new Date(baseDate);
  d7.setDate(d7.getDate() + 7);

  const d21 = new Date(baseDate);
  d21.setDate(d21.getDate() + 21);

  return [
    d1.toISOString().split('T')[0],
    d7.toISOString().split('T')[0],
    d21.toISOString().split('T')[0]
  ];
}

export function calculateStreak(dailyCounts: Record<string, number>): { currentStreak: number; longestStreak: number } {
  const sortedDates = Object.keys(dailyCounts)
    .filter(date => dailyCounts[date] >= 5)
    .sort();

  if (sortedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  let longest = 1;
  let current = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1]);
    const curr = new Date(sortedDates[i]);
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 3600 * 24));

    if (diffDays === 1) {
      current++;
      if (current > longest) longest = current;
    } else if (diffDays > 1) {
      current = 1;
    }
  }

  const today = getTodayDateString();
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().split('T')[0];

  const lastActive = sortedDates[sortedDates.length - 1];
  if (lastActive !== today && lastActive !== yesterday) {
    current = 0;
  }

  return { currentStreak: current, longestStreak: longest };
}

export function generateHeatmapGrid(days: number = 60): { date: string; count: number; level: number }[] {
  const grid = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    grid.push({
      date: dateStr,
      count: 0,
      level: 0
    });
  }

  return grid;
}
