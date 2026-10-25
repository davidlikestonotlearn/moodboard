import { WidgetFrame } from './WidgetFrame';

export function PlaylistWidget({ tracks = [], label, cover = '', spotifyUrl = '', linksEnabled = false, maxTracks = 3, style, isEditing = false, onLongPress, onDelete, onMove, onEditLink }) {
  const visibleTracks = tracks.slice(0, maxTracks);
  const content = visibleTracks.length > 0 ? (
    <ol className="track-list" style={{ '--track-count': visibleTracks.length }}>
      {visibleTracks.map((track) => (
        <li className="track" key={track.id}>
          <div className="track-content">
            {track.artwork || cover
              ? <img className="track-artwork" src={track.artwork || cover} alt="" width="36" height="36" draggable="false" />
              : <span className="track-artwork-placeholder" aria-hidden="true">♪</span>}
            <div className="track-copy">
              <p className="track-title">{track.title}</p>
              <p className="track-artist">{track.artist}</p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  ) : (
    <div className="playlist-summary">
      {cover && <img src={cover} alt="" draggable="false" />}
      <span>{label}</span>
    </div>
  );

  return (
    <WidgetFrame as="section" className="playlist-widget" aria-label={label} style={style} isEditing={isEditing} onLongPress={onLongPress} onDelete={onDelete} onMove={onMove} onEditLink={onEditLink} hasSpotifyLink={Boolean(spotifyUrl)} deleteLabel={label}>
      {linksEnabled && spotifyUrl && !isEditing
        ? <a className="playlist-content playlist-spotify-link" href={spotifyUrl} draggable="false" aria-label={`Open ${label} on Spotify`}>{content}</a>
        : <div className="playlist-content">{content}</div>}
    </WidgetFrame>
  );
}
