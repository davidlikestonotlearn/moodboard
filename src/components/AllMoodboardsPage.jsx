import { MoodboardList } from './MoodboardList';

export function AllMoodboardsPage({ boards, onOpenMoodboard }) {
  return (
    <div className="all-moodboards-page">
      <MoodboardList boards={boards} onOpenMoodboard={onOpenMoodboard} />
    </div>
  );
}
