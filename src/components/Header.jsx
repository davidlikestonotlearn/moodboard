import { Icon } from './Icon';

export function Header({ profile }) {
  return (
    <header className="header">
      <h1>Moodboard</h1>
      <div className="header-actions">
        <div className="board-tools" role="group" aria-label="Board tools">
          <button type="button" className="tool-button" aria-label="Add or organize widgets"><Icon name="organize" /></button>
          <button type="button" className="tool-button" aria-label="More board options"><Icon name="more" /></button>
        </div>
        <button type="button" className="profile-button" aria-label={`${profile.name}'s profile`}>
          <img src={profile.image} alt="" width="40" height="40" />
        </button>
      </div>
    </header>
  );
}
