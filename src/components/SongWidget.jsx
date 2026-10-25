import { WidgetFrame } from './WidgetFrame';

export function SongWidget({ src, alt, position = 'center', spotifyUrl = '', linksEnabled = false, style, isEditing = false, onLongPress, onDelete, onMove, onEditLink }) {
  const image = <img src={src} alt={alt} style={{ objectPosition: position }} draggable="false" />;
  return (
    <WidgetFrame as="figure" className="song-widget" style={style} isEditing={isEditing} onLongPress={onLongPress} onDelete={onDelete} onMove={onMove} onEditLink={onEditLink} hasSpotifyLink={Boolean(spotifyUrl)} deleteLabel={alt}>
      {linksEnabled && spotifyUrl && !isEditing
        ? <a className="song-spotify-link" href={spotifyUrl} draggable="false" aria-label={`Open ${alt} on Spotify`}>{image}</a>
        : image}
    </WidgetFrame>
  );
}
