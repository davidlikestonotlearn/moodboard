import { Moodboard } from './Moodboard';

export function MoodboardPreview({ items }) {
  return (
    <div className="moodboard-preview" aria-hidden="true">
      <Moodboard items={items} />
    </div>
  );
}
