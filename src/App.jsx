import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Header } from './components/Header';
import { Moodboard } from './components/Moodboard';
import { BottomNavigation } from './components/BottomNavigation';
import { HomePage } from './components/HomePage';
import { AllMoodboardsPage } from './components/AllMoodboardsPage';
import { SettingsPage } from './components/SettingsPage';
import { moodboards, profile, navigationItems, recentMoodboard } from './data/sampleContent';
import { moveWidget } from './moveWidget';

export function App() {
  const [selectedTab, setSelectedTab] = useState('home');
  const [showAllMoodboards, setShowAllMoodboards] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(recentMoodboard);
  const [isEditing, setIsEditing] = useState(false);
  const [boardItemsById, setBoardItemsById] = useState({});
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('moodboard-theme') === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });
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

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#101114' : '#ffffff');
    try {
      localStorage.setItem('moodboard-theme', theme);
    } catch {
      // The theme still works for this session when browser storage is unavailable.
    }
  }, [theme]);

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

  function deleteWidget(id) {
    setBoardItemsById((previous) => ({
      ...previous,
      [currentBoard.id]: (previous[currentBoard.id] ?? currentBoard.items).filter((item) => item.id !== id),
    }));
  }

  function moveBoardWidget(id, column, row) {
    setBoardItemsById((previous) => ({
      ...previous,
      [currentBoard.id]: moveWidget(previous[currentBoard.id] ?? currentBoard.items, id, column, row),
    }));
  }

  return (
    <div className="app-shell">
      <Header
        profile={profile}
        title={pageTitle}
        showBoardTools={isMoodboard}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
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
        {isMoodboard && <Moodboard items={currentBoard.items} isEditing={isEditing} onWidgetLongPress={() => setIsEditing(true)} onDeleteWidget={deleteWidget} onMoveWidget={moveBoardWidget} />}
        {!showAllMoodboards && selectedTab === 'settings' && <SettingsPage theme={theme} onThemeChange={setTheme} />}
      </main>
      <BottomNavigation items={navigationItems} selectedId={selectedTab} onSelect={selectTab} />
    </div>
  );
}
