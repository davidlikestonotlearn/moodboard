import { Icon } from './Icon';

export function SettingsPage({ theme, onThemeChange }) {
  return (
    <div className="settings-page">
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
      <button type="button" className="logout-button">
        <Icon name="logout" />
        <span>Log out</span>
      </button>
    </div>
  );
}
