import { Icon } from './Icon';

export function SettingsPage({ theme, profile, onThemeChange, onEditProfile, onLogOut }) {
  return (
    <div className="settings-page">
      <button type="button" className="settings-profile-button" onClick={onEditProfile}>
        <img src={profile.image} alt="" width="44" height="44" />
        <span>Edit profile</span>
        <Icon name="chevronRight" />
      </button>
      <section className="settings-section" aria-labelledby="appearance-heading">
        <h2 id="appearance-heading">Appearance</h2>
        <div className="theme-options" role="group" aria-label="Color theme">
          <button type="button" className={`theme-option${theme === 'dark' ? ' is-selected' : ''}`} aria-pressed={theme === 'dark'} onClick={() => onThemeChange('dark')}>
            <Icon name="moon" />
            <span>Dark</span>
          </button>
          <button type="button" className={`theme-option${theme === 'light' ? ' is-selected' : ''}`} aria-pressed={theme === 'light'} onClick={() => onThemeChange('light')}>
            <Icon name="sun" />
            <span>Light</span>
          </button>
        </div>
      </section>
      <button type="button" className="settings-link-button">
        <Icon name="privacy" />
        <span>Privacy</span>
        <Icon name="chevronRight" />
      </button>
      <button type="button" className="settings-link-button">
        <Icon name="help" />
        <span>Help</span>
        <Icon name="chevronRight" />
      </button>
      <button type="button" className="logout-button" onClick={onLogOut}>
        <Icon name="logout" />
        <span>Log out</span>
      </button>
    </div>
  );
}
