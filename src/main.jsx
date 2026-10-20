import React from 'react';
import { createRoot } from 'react-dom/client';
import { Header } from './components/Header';
import { Moodboard } from './components/Moodboard';
import { BottomNavigation } from './components/BottomNavigation';
import { boardItems, profile, navigationItems } from './data/sampleContent';
import './styles.css';

function App() {
  return (
    <div className="app-shell">
      <Header profile={profile} />
      <main className="board-stage" aria-label="Your moodboard">
        <Moodboard items={boardItems} />
      </main>
      <BottomNavigation items={navigationItems} selectedId="moodboards" />
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>,
);
