import { MoodboardPreview } from './MoodboardPreview';

export function MudoRecentCard({ board }) {
  return (
    <section className="mudo-recent-card" aria-labelledby="mudo-recent-heading">
      <div className="mudo-recent-heading">
        <h2 id="mudo-recent-heading">Recent MUDO</h2>
        <div className="mudo-recent-details">
          <strong>{board.title}</strong>
          <span>Last updated: {board.updatedAt ?? 'Just now'}</span>
        </div>
      </div>
      <div className="mudo-recent-preview">
        <MoodboardPreview items={board.items} />
      </div>
    </section>
  );
}
