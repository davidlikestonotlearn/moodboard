import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Header } from './components/Header';
import { Moodboard } from './components/Moodboard';
import { BottomNavigation } from './components/BottomNavigation';
import { HomePage } from './components/HomePage';
import { AllMoodboardsPage } from './components/AllMoodboardsPage';
import { SettingsPage } from './components/SettingsPage';
import { SpotifyLinkEditor } from './components/SpotifyLinkEditor';
import { AddWidgetForm } from './components/AddWidgetForm';
import { MoodboardNameForm } from './components/MoodboardNameForm';
import { DeleteMoodboardDialog } from './components/DeleteMoodboardDialog';
import { ProfilePanel } from './components/ProfilePanel';
import { WelcomePage } from './components/WelcomePage';
import { EmailAuthPage } from './components/EmailAuthPage';
import { moodboards, emptyMoodboardTemplate, profile, navigationItems, recentMoodboard, dailyLoginActivity } from './data/sampleContent';
import { moveWidget } from './moveWidget';
import { loadGuestState, saveGuestState } from './guestApi';
import { currentSession, emailSignIn, registerAccount, signOut, saveAccountState, saveAccountProfile } from './accountApi';

export function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [authPage, setAuthPage] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [activeMode, setActiveMode] = useState(null);
  const [guestLoading, setGuestLoading] = useState(false);
  const [guestError, setGuestError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [selectedTab, setSelectedTab] = useState('home');
  const [showAllMoodboards, setShowAllMoodboards] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(recentMoodboard);
  const [recentBoardId, setRecentBoardId] = useState(recentMoodboard.id);
  const [createdBoards, setCreatedBoards] = useState([]);
  const [boardTitlesById, setBoardTitlesById] = useState({});
  const [deletedBoardIds, setDeletedBoardIds] = useState([]);
  const [nameFormMode, setNameFormMode] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [boardItemsById, setBoardItemsById] = useState({});
  const [editingLinkId, setEditingLinkId] = useState(null);
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [userProfile, setUserProfile] = useState(profile);
  const [profilePanelMode, setProfilePanelMode] = useState(null);
  const mainContentRef = useRef(null);
  const saveChainRef = useRef(Promise.resolve());
  const isMoodboard = !showAllMoodboards && selectedTab === 'moodboards';
  const boards = [...createdBoards, ...moodboards]
    .filter((board) => !deletedBoardIds.includes(board.id))
    .map((board) => ({ ...board, title: boardTitlesById[board.id] ?? board.title, items: boardItemsById[board.id] ?? board.items }));
  const currentBoard = boards.find((board) => board.id === selectedBoard?.id) ?? boards[0] ?? null;
  const homeBoard = boards.find((board) => board.id === recentBoardId) ?? boards[0];
  const boardStateJson = JSON.stringify({ boards, recentBoardId });
  const editingLinkItem = isMoodboard ? currentBoard?.items.find((item) => item.id === editingLinkId) : null;
  const pageTitle = showAllMoodboards
    ? 'All Moodboards'
    : isMoodboard
      ? currentBoard?.title ?? 'Moodboards'
      : navigationItems.find((item) => item.id === selectedTab).label;

  useEffect(() => {
    if (isMoodboard) mainContentRef.current?.focus();
  }, [isMoodboard, selectedBoard]);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = showWelcome ? 'light' : theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', showWelcome ? '#f7f5ef' : theme === 'dark' ? '#101114' : '#ffffff');
  }, [theme, showWelcome]);

  useEffect(() => {
    currentSession().then(({ account }) => {
      if (account) openAccount(account);
    }).catch(() => {}).finally(() => setSessionLoading(false));
  }, []);

  useEffect(() => {
    if (!activeMode || showWelcome) return;
    const state = JSON.parse(boardStateJson);
    saveChainRef.current = saveChainRef.current.catch(() => {}).then(() => activeMode === 'guest' ? saveGuestState(state) : saveAccountState(state));
    saveChainRef.current.then(() => setSaveError(''), () => setSaveError('Could not save your moodboards. Check that the server is running.'));
  }, [boardStateJson, activeMode, showWelcome]);

  function useSavedBoards(state) {
    const savedBoards = state?.boards ?? [];
    setCreatedBoards(savedBoards);
    setDeletedBoardIds(moodboards.map((board) => board.id));
    setBoardTitlesById({});
    setBoardItemsById({});
    setRecentBoardId(state?.recentBoardId ?? null);
    setSelectedBoard(savedBoards.find((board) => board.id === state?.recentBoardId) ?? savedBoards[0] ?? null);
    setSelectedTab('home');
    setShowAllMoodboards(false);
    setSaveError('');
  }

  function openAccount(account) {
    useSavedBoards(account.state);
    setUserProfile({ name: account.name, image: account.image || profile.image, bio: account.bio || '' });
    setActiveMode('account');
    setAuthPage(false);
    setShowWelcome(false);
  }

  async function submitEmail(email, password) {
    const result = await emailSignIn(email, password);
    if (result.account) openAccount(result.account);
    return result;
  }

  async function submitRegistration(details) {
    const result = await registerAccount(details);
    openAccount(result.account);
  }

  async function enterGuest() {
    setGuestLoading(true);
    setGuestError('');
    try {
      await saveChainRef.current.catch(() => {});
      const savedState = await loadGuestState();
      if (savedState) {
        useSavedBoards(savedState);
      } else {
        setCreatedBoards([]);
        setDeletedBoardIds([]);
        setBoardTitlesById({});
        setBoardItemsById({});
        setRecentBoardId(recentMoodboard.id);
        setSelectedBoard(recentMoodboard);
      }
      setUserProfile(profile);
      setActiveMode('guest');
      setShowWelcome(false);
    } catch {
      setGuestError('Could not open your guest moodboards. Check that the server is running.');
    } finally {
      setGuestLoading(false);
    }
  }

  function openMoodboard(board) {
    setIsEditing(false);
    setEditingLinkId(null);
    setShowAddWidget(false);
    setSelectedBoard(board);
    setRecentBoardId(board.id);
    setSelectedTab('moodboards');
    setShowAllMoodboards(false);
  }

  function createMoodboard(title) {
    const board = { ...emptyMoodboardTemplate, id: crypto.randomUUID(), title, items: [] };
    setCreatedBoards((previous) => [board, ...previous]);
    setNameFormMode(null);
    openMoodboard(board);
  }

  function renameMoodboard(title) {
    setBoardTitlesById((previous) => ({ ...previous, [currentBoard.id]: title }));
    setNameFormMode(null);
  }

  function deleteMoodboard() {
    const remaining = boards.filter((board) => board.id !== currentBoard.id);
    setDeletedBoardIds((previous) => [...previous, currentBoard.id]);
    setSelectedBoard(remaining[0] ?? null);
    setRecentBoardId(remaining[0]?.id ?? null);
    setShowDeleteDialog(false);
    setIsEditing(false);
    setEditingLinkId(null);
    setShowAddWidget(false);
    setSelectedTab('home');
  }

  function selectTab(id) {
    setIsEditing(false);
    setEditingLinkId(null);
    setShowAddWidget(false);
    setSelectedTab(id);
    setShowAllMoodboards(false);
  }

  async function logOut() {
    try {
      await saveChainRef.current;
      if (activeMode === 'account') await signOut();
    } catch {
      setSaveError('Could not log out. Check that the server is running.');
      return;
    }
    setIsEditing(false);
    setEditingLinkId(null);
    setShowAddWidget(false);
    setNameFormMode(null);
    setShowDeleteDialog(false);
    setProfilePanelMode(null);
    setShowAllMoodboards(false);
    setSelectedTab('home');
    setActiveMode(null);
    setShowWelcome(true);
  }

  function saveProfile(nextProfile) {
    setUserProfile(nextProfile);
    if (activeMode === 'account') {
      saveAccountProfile(nextProfile).catch(() => setSaveError('Could not save your profile. Try again.'));
    }
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

  function saveSpotifyLinks(url) {
    setBoardItemsById((previous) => ({
      ...previous,
      [currentBoard.id]: (previous[currentBoard.id] ?? currentBoard.items).map((item) => item.id === editingLinkId ? { ...item, spotifyUrl: url } : item),
    }));
    setEditingLinkId(null);
    setIsEditing(false);
  }

  function addWidget(widget) {
    setBoardItemsById((previous) => ({
      ...previous,
      [currentBoard.id]: [...(previous[currentBoard.id] ?? currentBoard.items), widget],
    }));
    setShowAddWidget(false);
  }

  if (sessionLoading) return <main className="welcome-page" aria-label="Loading"><p className="session-loading">Loading…</p></main>;
  if (showWelcome) return authPage
    ? <EmailAuthPage onBack={() => setAuthPage(false)} onSignIn={submitEmail} onRegister={submitRegistration} />
    : <WelcomePage onContinueAsGuest={enterGuest} onEmail={() => setAuthPage(true)} loading={guestLoading} error={guestError} />;

  return (
    <div className="app-shell">
      <Header
        profile={userProfile}
        title={pageTitle}
        showBoardTools={isMoodboard && Boolean(currentBoard)}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onAdd={() => setShowAddWidget(true)}
        onDoneEditing={() => { setIsEditing(false); setEditingLinkId(null); setShowAddWidget(false); }}
        onRename={() => setNameFormMode('rename')}
        onDelete={() => setShowDeleteDialog(true)}
        onProfile={() => setProfilePanelMode('view')}
        onBack={showAllMoodboards ? () => setShowAllMoodboards(false) : undefined}
      />
      <main ref={mainContentRef} tabIndex={-1} className="board-stage" aria-label={isMoodboard ? 'Your moodboard' : pageTitle}>
        {saveError && <p className="guest-save-error" role="alert">{saveError}</p>}
        {showAllMoodboards && <AllMoodboardsPage boards={boards} onOpenMoodboard={openMoodboard} />}
        {!showAllMoodboards && selectedTab === 'home' && (
          <HomePage
            board={homeBoard}
            loginActivity={dailyLoginActivity}
            onOpenMoodboard={openMoodboard}
            onOpenAllMoodboards={() => setShowAllMoodboards(true)}
            onCreateMoodboard={() => setNameFormMode('create')}
          />
        )}
        {isMoodboard && currentBoard && <Moodboard items={currentBoard.items} isEditing={isEditing} linksEnabled onWidgetLongPress={() => setIsEditing(true)} onAddWidget={() => setShowAddWidget(true)} onDeleteWidget={deleteWidget} onMoveWidget={moveBoardWidget} onEditWidgetLink={setEditingLinkId} />}
        {isMoodboard && !currentBoard && <p className="no-moodboards-message">No moodboards yet. Create one from Home.</p>}
        {!showAllMoodboards && selectedTab === 'settings' && <SettingsPage theme={theme} profile={userProfile} onThemeChange={setTheme} onEditProfile={() => setProfilePanelMode('edit')} onLogOut={logOut} />}
      </main>
      <BottomNavigation items={navigationItems} selectedId={selectedTab} onSelect={selectTab} />
      {editingLinkItem && <SpotifyLinkEditor key={editingLinkItem.id} item={editingLinkItem} onClose={() => setEditingLinkId(null)} onSave={saveSpotifyLinks} />}
      {showAddWidget && <AddWidgetForm items={currentBoard.items} onClose={() => setShowAddWidget(false)} onAdd={addWidget} />}
      {nameFormMode && <MoodboardNameForm mode={nameFormMode} initialTitle={nameFormMode === 'rename' ? currentBoard?.title : ''} onClose={() => setNameFormMode(null)} onSave={nameFormMode === 'create' ? createMoodboard : renameMoodboard} />}
      {showDeleteDialog && currentBoard && <DeleteMoodboardDialog title={currentBoard.title} onClose={() => setShowDeleteDialog(false)} onDelete={deleteMoodboard} />}
      {profilePanelMode && <ProfilePanel profile={userProfile} boards={boards} initialEditing={profilePanelMode === 'edit'} onSaveProfile={saveProfile} onClose={() => setProfilePanelMode(null)} onOpenMoodboard={(board) => { setProfilePanelMode(null); openMoodboard(board); }} />}
    </div>
  );
}
