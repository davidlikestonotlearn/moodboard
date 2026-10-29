import { MoodboardPreview } from './MoodboardPreview';
import { Icon } from './Icon';
import { DailyLoginGrid } from './DailyLoginGrid';

export function HomePage({ board, loginActivity, onOpenMoodboard, onOpenAllMoodboards, onCreateMoodboard }) {
  return (
    <div className="home-page">
      <button type="button" className="create-moodboard-button" onClick={onCreateMoodboard}>
        Create Moodboard
      </button>
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
      </section>
      <DailyLoginGrid days={loginActivity} />
    </div>
  );
}
