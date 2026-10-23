import { Icon } from './Icon';

export function SettingsPage() {
  return (
    <div className="settings-page">
      <button type="button" className="logout-button">
        <Icon name="logout" />
        <span>Log out</span>
      </button>
    </div>
  );
}
