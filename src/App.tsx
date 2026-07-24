import React from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardView } from './components/dashboard/DashboardView';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { PatternProgressView } from './components/patterns/PatternProgressView';
import { RevisionView } from './components/revision/RevisionView';
import { StatisticsView } from './components/stats/StatisticsView';
import { AchievementsView } from './components/achievements/AchievementsView';
import { SettingsView } from './components/settings/SettingsView';
import { useTrackerStore } from './store/useTrackerStore';

export const App: React.FC = () => {
  const { activeTab, theme } = useTrackerStore();

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <MainLayout>
        {activeTab === 'dashboard' && <DashboardView />}
        {(activeTab === 'roadmap' || activeTab === 'library') && <RoadmapView />}
        {activeTab === 'patterns' && <PatternProgressView />}
        {activeTab === 'revision' && <RevisionView />}
        {activeTab === 'stats' && <StatisticsView />}
        {activeTab === 'achievements' && <AchievementsView />}
        {activeTab === 'settings' && <SettingsView />}
      </MainLayout>
    </div>
  );
};

export default App;
