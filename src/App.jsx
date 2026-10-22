import { useState } from 'react';
import { Header } from './components/Header';
import { Moodboard } from './components/Moodboard';
import { BottomNavigation } from './components/BottomNavigation';
import { HomePage } from './components/HomePage';
import { AllMoodboardsPage } from './components/AllMoodboardsPage';
import { moodboards, profile, navigationItems, recentMoodboard } from './data/sampleContent';

export function App() {
  const [selectedTab, setSelectedTab] = useState('home');
  const [showAllMoodboards, setShowAllMoodboards] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(recentMoodboard);
  const isMoodboard = !showAllMoodboards && selectedTab === 'moodboards';
  const pageTitle = showAllMoodboards
    ? 'All Moodboards'
    : isMoodboard
      ? 'Moodboard'
      : navigationItems.find((item) => item.id === selectedTab).label;

  function openMoodboard(board) {
    setSelectedBoard(board);
    setSelectedTab('moodboards');
    setShowAllMoodboards(false);
  }

  function selectTab(id) {
    setSelectedTab(id);
    setShowAllMoodboards(false);
  }

  return (
    <div className="app-shell">
      <Header
        profile={profile}
        title={pageTitle}
        showBoardTools={isMoodboard}
        onBack={showAllMoodboards ? () => setShowAllMoodboards(false) : undefined}
      />
      <main className="board-stage" aria-label={isMoodboard ? 'Your moodboard' : pageTitle}>
        {showAllMoodboards && <AllMoodboardsPage boards={moodboards} onOpenMoodboard={openMoodboard} />}
        {!showAllMoodboards && selectedTab === 'home' && (
          <HomePage
            board={recentMoodboard}
            onOpenMoodboard={() => openMoodboard(recentMoodboard)}
            onOpenAllMoodboards={() => setShowAllMoodboards(true)}
          />
        )}
        {isMoodboard && <Moodboard items={selectedBoard.items} />}
      </main>
      <BottomNavigation items={navigationItems} selectedId={selectedTab} onSelect={selectTab} />
    </div>
  );
}
