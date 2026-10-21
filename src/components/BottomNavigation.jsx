import { Icon } from './Icon';

export function BottomNavigation({ items, selectedId, onSelect }) {
  return (
    <nav className="bottom-navigation" aria-label="Main navigation">
      {items.map(({ id, label, icon }) => (
        <button key={id} type="button" className={`navigation-item${id === selectedId ? ' is-selected' : ''}`} aria-current={id === selectedId ? 'page' : undefined} onClick={() => onSelect(id)}>
          <Icon name={icon} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
