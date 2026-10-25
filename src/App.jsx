import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Header } from './components/Header';
import { Moodboard } from './components/Moodboard';
import { BottomNavigation } from './components/BottomNavigation';
import { HomePage } from './components/HomePage';
import { AllMoodboardsPage } from './components/AllMoodboardsPage';
import { SettingsPage } from './components/SettingsPage';
import { SpotifyLinkEditor } from './components/SpotifyLinkEditor';
import { moodboards, profile, navigationItems, recentMoodboard } from './data/sampleContent';
import { moveWidget } from './moveWidget';
import { safeSpotifyUrl } from './spotifyLinks';

export function App() {
  const [selectedTab, setSelectedTab] = useState('home');
  const [showAllMoodboards, setShowAllMoodboards] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(recentMoodboard);
  const [isEditing, setIsEditing] = useState(false);
  const [boardItemsById, setBoardItemsById] = useState({});
  const [editingLinkId, setEditingLinkId] = useState(null);
  const [spotifyLinks, setSpotifyLinks] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('moodboard-spotify-links') || '{}');
      return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
    } catch {
      return {};
    }
  });
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('moodboard-theme') === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });
  const mainContentRef = useRef(null);
  const isMoodboard = !showAllMoodboards && selectedTab === 'moodboards';
  const boards = moodboards.map((board) => ({
    ...board,
    items: (boardItemsById[board.id] ?? board.items).map((item) => {
      const saved = spotifyLinks[board.id]?.[item.id];
      if (!saved) return item;
      return {
        ...item,
        spotifyUrl: safeSpotifyUrl(saved.url),
        ...(item.tracks && { tracks: item.tracks.map((track) => ({ ...track, spotifyUrl: safeSpotifyUrl(saved.tracks?.[track.id]) })) }),
      };
    }),
  }));
  const currentBoard = boards.find((board) => board.id === selectedBoard.id) ?? selectedBoard;
  const homeBoard = boards.find((board) => board.id === recentMoodboard.id) ?? recentMoodboard;
  const editingLinkItem = isMoodboard ? currentBoard.items.find((item) => item.id === editingLinkId) : null;
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

  useEffect(() => {
    try {
      localStorage.setItem('moodboard-spotify-links', JSON.stringify(spotifyLinks));
    } catch {
      // Links still work until the page reloads when browser storage is unavailable.
    }
  }, [spotifyLinks]);

  function openMoodboard(board) {
    setIsEditing(false);
    setEditingLinkId(null);
    setSelectedBoard(board);
    setSelectedTab('moodboards');
    setShowAllMoodboards(false);
  }

  function selectTab(id) {
    setIsEditing(false);
    setEditingLinkId(null);
    setSelectedTab(id);
    setShowAllMoodboards(false);
  }

  function deleteWidget(id) {
    if (editingLinkId === id) setEditingLinkId(null);
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

  function saveSpotifyLinks(links) {
    setSpotifyLinks((previous) => ({
      ...previous,
      [currentBoard.id]: { ...previous[currentBoard.id], [editingLinkId]: links },
    }));
    setEditingLinkId(null);
    setIsEditing(false);
  }

  return (
    <div className="app-shell">
      <Header
        profile={profile}
        title={pageTitle}
        showBoardTools={isMoodboard}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onDoneEditing={() => { setIsEditing(false); setEditingLinkId(null); }}
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
        {isMoodboard && <Moodboard items={currentBoard.items} isEditing={isEditing} linksEnabled onWidgetLongPress={() => setIsEditing(true)} onDeleteWidget={deleteWidget} onMoveWidget={moveBoardWidget} onEditWidgetLink={setEditingLinkId} />}
        {!showAllMoodboards && selectedTab === 'settings' && <SettingsPage theme={theme} onThemeChange={setTheme} />}
      </main>
      <BottomNavigation items={navigationItems} selectedId={selectedTab} onSelect={selectTab} />
      {editingLinkItem && <SpotifyLinkEditor key={editingLinkItem.id} item={editingLinkItem} onClose={() => setEditingLinkId(null)} onSave={saveSpotifyLinks} />}
    </div>
  );
}
