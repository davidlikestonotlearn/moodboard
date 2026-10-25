import { Icon } from './Icon';

export function MoodboardList({ boards, onOpenMoodboard, emptyMessage = 'No moodboards yet. Create one from Home.' }) {
  if (boards.length === 0) return <p className="no-moodboards-message">{emptyMessage}</p>;

  return (
    <ul className="moodboard-list" aria-label="All moodboards">
      {boards.map((board) => {
        const firstWidget = board.items.find((item) => item.placement.column === 1 && item.placement.row === 1);
        const thumbnail = firstWidget?.poster || firstWidget?.src || firstWidget?.tracks?.[0]?.artwork;

        return (
          <li key={board.id}>
            <button type="button" className="moodboard-list-item" onClick={() => onOpenMoodboard(board)} aria-label={`Open ${board.title} moodboard`}>
              <span className="moodboard-list-thumbnail" aria-hidden="true">
                {thumbnail
                  ? <img src={thumbnail} alt="" style={{ objectPosition: firstWidget.position || 'center' }} />
                  : <Icon name="moodboards" />}
              </span>
              <span className="moodboard-list-title">{board.title}</span>
              <Icon name="chevronRight" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
