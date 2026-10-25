import { WidgetFrame } from './WidgetFrame';

export function PlaylistWidget({ tracks, label, style, isEditing = false, onLongPress, onDelete, onMove }) {
  return (
    <WidgetFrame as="section" className="playlist-widget" aria-label={label} style={style} isEditing={isEditing} onLongPress={onLongPress} onDelete={onDelete} onMove={onMove} deleteLabel={label}>
      <ol className="track-list">
        {tracks.map((track) => (
          <li className="track" key={track.id}>
            <img className="track-artwork" src={track.artwork} alt="" width="36" height="36" draggable="false" />
            <div className="track-copy">
              <p className="track-title">{track.title}</p>
              <p className="track-artist">{track.artist}</p>
            </div>
          </li>
        ))}
      </ol>
    </WidgetFrame>
  );
}
