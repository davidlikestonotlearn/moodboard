import { useEffect, useRef, useState } from 'react';
import { Header } from './components/Header';
import { Moodboard } from './components/Moodboard';
import { BottomNavigation } from './components/BottomNavigation';
import { HomePage } from './components/HomePage';
import { AllMoodboardsPage } from './components/AllMoodboardsPage';
import { SettingsPage } from './components/SettingsPage';
import { moodboards, profile, navigationItems, recentMoodboard } from './data/sampleContent';

export function App() {
  const [selectedTab, setSelectedTab] = useState('home');
  const [showAllMoodboards, setShowAllMoodboards] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(recentMoodboard);
  const [isEditing, setIsEditing] = useState(false);
  const [boardItemsById, setBoardItemsById] = useState({});
  const mainContentRef = useRef(null);
  const isMoodboard = !showAllMoodboards && selectedTab === 'moodboards';
  const boards = moodboards.map((board) => ({ ...board, items: boardItemsById[board.id] ?? board.items }));
  const currentBoard = boards.find((board) => board.id === selectedBoard.id) ?? selectedBoard;
  const homeBoard = boards.find((board) => board.id === recentMoodboard.id) ?? recentMoodboard;
  const pageTitle = showAllMoodboards
    ? 'All Moodboards'
    : isMoodboard
      ? 'Moodboard'
      : navigationItems.find((item) => item.id === selectedTab).label;

  useEffect(() => {
    if (isMoodboard) mainContentRef.current?.focus();
  }, [isMoodboard, selectedBoard]);

  function openMoodboard(board) {
    setIsEditing(false);
    setSelectedBoard(board);
    setSelectedTab('moodboards');
    setShowAllMoodboards(false);
  }

  function selectTab(id) {
    setIsEditing(false);
    setSelectedTab(id);
    setShowAllMoodboards(false);
  }

  function deleteImage(id) {
    setBoardItemsById((previous) => ({
      ...previous,
      [currentBoard.id]: (previous[currentBoard.id] ?? currentBoard.items).filter((item) => item.id !== id),
    }));
  }

  return (
    <div className="app-shell">
      <Header
        profile={profile}
        title={pageTitle}
        showBoardTools={isMoodboard}
        isEditing={isEditing}
        onDoneEditing={() => setIsEditing(false)}
        onBack={showAllMoodboards ? () => setShowAllMoodboards(false) : undefined}
      />
      <main ref={mainContentRef} tabIndex={-1} className="board-stage" aria-label={isMoodboard ? 'Your moodboard' : pageTitle}>
        {showAllMoodboards && <AllMoodboardsPage boards={boards} onOpenMoodboard={openMoodboard} />}
        {!showAllMoodboards && selectedTab === 'home' && (
          <HomePage
            board={homeBoard}
            onOpenMoodboard={openMoodboard}
            onOpenAllMoodboards={() => setShowAllMoodboards(true)}
          />
        )}
        {isMoodboard && <Moodboard items={currentBoard.items} isEditing={isEditing} onImageLongPress={() => setIsEditing(true)} onDeleteImage={deleteImage} />}
        {!showAllMoodboards && selectedTab === 'settings' && <SettingsPage />}
      </main>
      <BottomNavigation items={navigationItems} selectedId={selectedTab} onSelect={selectTab} />
    </div>
  );
}
