import { ImageWidget } from './ImageWidget';
import { PlaylistWidget } from './PlaylistWidget';

export function Moodboard({ items }) {
  return (
    <div className="moodboard">
      {items.map(({ id, type, placement, ...content }) => {
        const style = {
          gridColumn: `${placement.column} / span ${placement.columns}`,
          gridRow: `${placement.row} / span ${placement.rows}`,
        };
        return type === 'playlist'
          ? <PlaylistWidget key={id} {...content} style={style} />
          : <ImageWidget key={id} {...content} style={style} />;
      })}
    </div>
  );
}
