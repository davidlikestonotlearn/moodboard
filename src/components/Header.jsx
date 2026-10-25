import { Icon } from './Icon';

export function Header({ profile, title = 'Moodboard', showBoardTools = true, isEditing = false, onEdit, onAdd, onDoneEditing, onBack }) {
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
        ) : <div className="board-tools" role="group" aria-label="Board tools">
          <button type="button" className="tool-button" aria-label="Edit moodboard" onClick={onEdit}><Icon name="organize" /></button>
          <button type="button" className="tool-button" aria-label="More board options"><Icon name="more" /></button>
        </div>)}
        {!isEditing && <button type="button" className="profile-button" aria-label={`${profile.name}'s profile`}>
          <img src={profile.image} alt="" width="40" height="40" />
        </button>}
      </div>
    </header>
  );
}
