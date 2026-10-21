import { useState } from 'react';
import { Header } from './components/Header';
import { Moodboard } from './components/Moodboard';
import { BottomNavigation } from './components/BottomNavigation';
import { boardItems, profile, navigationItems } from './data/sampleContent';

export function App() {
  const [selectedTab, setSelectedTab] = useState('moodboards');
  const isMoodboard = selectedTab === 'moodboards';
  const pageTitle = isMoodboard
    ? 'Moodboard'
    : navigationItems.find((item) => item.id === selectedTab).label;

  return (
    <div className="app-shell">
      <Header profile={profile} title={pageTitle} showBoardTools={isMoodboard} />
      <main className="board-stage" aria-label={isMoodboard ? 'Your moodboard' : pageTitle}>
        {isMoodboard && <Moodboard items={boardItems} />}
      </main>
      <BottomNavigation items={navigationItems} selectedId={selectedTab} onSelect={setSelectedTab} />
    </div>
  );
}
