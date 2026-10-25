import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';

export function Header({ profile, title = 'Moodboard', showBoardTools = true, isEditing = false, onEdit, onAdd, onDoneEditing, onRename, onDelete, onBack }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => { setMenuOpen(false); }, [title, showBoardTools, isEditing]);

  useEffect(() => {
    if (!menuOpen) return;
    function closeOutside(event) {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false);
    }
    function closeEscape(event) {
      if (event.key === 'Escape') setMenuOpen(false);
    }
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeEscape);
    };
  }, [menuOpen]);

  return (
    <header className="header">
      <div className={`header-title${onBack ? ' has-back' : ''}`}>
        {onBack && <button type="button" className="back-button" aria-label="Back to Home" onClick={onBack}><Icon name="back" /></button>}
        <h1>{title}</h1>
      </div>
      <div className="header-actions">
        {showBoardTools && (isEditing ? (
          <div className="edit-header-actions">
            <button type="button" className="add-button" onClick={onAdd}>Add</button>
            <button type="button" className="done-button" onClick={onDoneEditing}>Done</button>
          </div>
        ) : <div ref={menuRef} className="board-tools" role="group" aria-label="Board tools">
          <button type="button" className="tool-button" aria-label="Edit moodboard" onClick={onEdit}><Icon name="organize" /></button>
          <button type="button" className="tool-button" aria-label="More board options" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><Icon name="more" /></button>
          {menuOpen && <div className="board-options-menu">
            <button type="button" onClick={() => { setMenuOpen(false); onRename(); }}>Rename moodboard</button>
            <button type="button" disabled>Privacy settings</button>
            <button type="button" className="board-option-delete" onClick={() => { setMenuOpen(false); onDelete(); }}>Delete moodboard</button>
          </div>}
        </div>)}
        {!isEditing && <button type="button" className="profile-button" aria-label={`${profile.name}'s profile`}>
          <img src={profile.image} alt="" width="40" height="40" />
        </button>}
      </div>
    </header>
  );
}
