import { MudoRecentCard } from './MudoRecentCard';

const navigation = ['Home', 'MUDO', 'Explore', 'Settings'];

export function MudoHomePage({ profile, board, onExplore, children }) {
  return (
    <div className="mudo-home-page">
      <header className="mudo-home-header">
        <nav className="mudo-home-navigation" aria-label="MUDO navigation">
          {navigation.map((label) => (
            <button
              key={label}
              className={`mudo-home-nav-button mudo-offset${label === 'Home' ? ' is-current' : ''}`}
              type="button"
              onClick={label === 'Explore' ? onExplore : undefined}
              disabled={label !== 'Explore'}
              aria-current={label === 'Home' ? 'page' : undefined}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="mudo-home-profile" aria-label={`${profile.name}'s profile`}>
          <span className="mudo-home-avatar" aria-hidden="true" />
          <span className="mudo-home-profile-copy">
            <strong>{profile.name}</strong>
            <span>View profile</span>
          </span>
        </div>
      </header>
      <main className="mudo-home-main">
        {board && <MudoRecentCard board={board} />}
        <button className="mudo-home-action" type="button" disabled><span>Create MUDO</span></button>
        <button className="mudo-home-action" type="button" disabled><span>All MUDOs</span></button>
        {children}
      </main>
    </div>
  );
}
