import { MoodboardPreview } from './MoodboardPreview';
import { Icon } from './Icon';

export function HomePage({ board, onOpenMoodboard, onOpenAllMoodboards, onCreateMoodboard }) {
  return (
    <div className="home-page">
      {board && <section className="home-section" aria-labelledby="recent-moodboard-heading">
        <h2 id="recent-moodboard-heading">Recent Moodboard</h2>
        <button
          type="button"
          className="recent-moodboard"
          aria-label={`Open ${board.title} moodboard`}
          onClick={() => onOpenMoodboard(board)}
        >
          <MoodboardPreview items={board.items} />
          <span className="recent-moodboard-title">{board.title}</span>
        </button>
      </section>}
      <section className="home-section all-moodboards" aria-labelledby="all-moodboards-heading">
        <h2 id="all-moodboards-heading">
          <button type="button" className="all-moodboards-button" onClick={onOpenAllMoodboards}>
            <span>All Moodboards</span>
            <Icon name="chevronRight" />
          </button>
        </h2>
        <button type="button" className="create-moodboard-button" onClick={onCreateMoodboard}>
          Create Moodboard
        </button>
      </section>
    </div>
  );
}
