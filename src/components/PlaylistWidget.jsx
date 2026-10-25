import { WidgetFrame } from './WidgetFrame';

export function PlaylistWidget({ tracks, label, spotifyUrl = '', linksEnabled = false, style, isEditing = false, onLongPress, onDelete, onMove, onEditLink }) {
  const playlistLink = linksEnabled && spotifyUrl && !isEditing;
  return (
    <WidgetFrame as="section" className="playlist-widget" aria-label={label} style={style} isEditing={isEditing} onLongPress={onLongPress} onDelete={onDelete} onMove={onMove} onEditLink={onEditLink} hasSpotifyLink={Boolean(spotifyUrl || tracks.some((track) => track.spotifyUrl))} deleteLabel={label}>
      {playlistLink && <a className="playlist-spotify-link" href={spotifyUrl} target="_blank" rel="noopener noreferrer" draggable="false" aria-label={`Open ${label} on Spotify`} />}
      <ol className={`track-list${playlistLink ? ' has-playlist-link' : ''}`}>
        {tracks.map((track) => {
          const content = <>
            <img className="track-artwork" src={track.artwork} alt="" width="36" height="36" draggable="false" />
            <div className="track-copy">
              <p className="track-title">{track.title}</p>
              <p className="track-artist">{track.artist}</p>
            </div>
          </>;
          return (
            <li className="track" key={track.id}>
              {linksEnabled && track.spotifyUrl && !isEditing
                ? <a className="track-content track-spotify-link" href={track.spotifyUrl} target="_blank" rel="noopener noreferrer" draggable="false" aria-label={`Open ${track.title} by ${track.artist} on Spotify`}>{content}</a>
                : <div className="track-content">{content}</div>}
            </li>
          );
        })}
      </ol>
    </WidgetFrame>
  );
}
