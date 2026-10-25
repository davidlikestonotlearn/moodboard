import { useState } from 'react';
import { normalizeSpotifyUrl } from '../spotifyLinks';

export function SpotifyLinkEditor({ item, onClose, onSave }) {
  const [widgetUrl, setWidgetUrl] = useState(item.spotifyUrl || '');
  const [trackUrls, setTrackUrls] = useState(() => Object.fromEntries((item.tracks || []).map((track) => [track.id, track.spotifyUrl || ''])));
  const [error, setError] = useState('');

  function save(event) {
    event.preventDefault();
    try {
      const url = normalizeSpotifyUrl(widgetUrl, item.type === 'playlist' ? new Set(['playlist']) : new Set(['track', 'album', 'playlist']));
      const tracks = Object.fromEntries((item.tracks || []).map((track) => [track.id, normalizeSpotifyUrl(trackUrls[track.id] || '', new Set(['track']))]));
      onSave({ url, tracks });
    } catch (cause) {
      setError(cause.message);
    }
  }

  return (
    <div className="link-editor-backdrop" onClick={onClose}>
      <form
        className="link-editor"
        role="dialog"
        aria-modal="true"
        aria-labelledby="link-editor-title"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => { if (event.key === 'Escape') onClose(); }}
        onSubmit={save}
      >
        <div className="link-editor-header">
          <h2 id="link-editor-title">Spotify links</h2>
          <button type="button" className="link-editor-close" aria-label="Close link editor" onClick={onClose}>×</button>
        </div>
        <p className="link-editor-help">Paste links copied from Spotify. Leave a field empty to remove its link.</p>
        <label className="link-field" htmlFor="widget-spotify-url">
          <span>{item.type === 'playlist' ? 'Playlist' : 'Album or song'} link</span>
          <input
            id="widget-spotify-url"
            type="url"
            inputMode="url"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
            placeholder={`https://open.spotify.com/${item.type === 'playlist' ? 'playlist' : 'album'}/...`}
            value={widgetUrl}
            onChange={(event) => { setWidgetUrl(event.target.value); setError(''); }}
          />
        </label>
        {item.tracks?.map((track) => (
          <label className="link-field" htmlFor={`track-spotify-${track.id}`} key={track.id}>
            <span>{track.title} · {track.artist}</span>
            <input
              id={`track-spotify-${track.id}`}
              type="url"
              inputMode="url"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
              placeholder="https://open.spotify.com/track/..."
              value={trackUrls[track.id] || ''}
              onChange={(event) => { setTrackUrls((previous) => ({ ...previous, [track.id]: event.target.value })); setError(''); }}
            />
          </label>
        ))}
        {error && <p className="link-editor-error" role="alert">{error}</p>}
        <div className="link-editor-actions">
          <button type="button" className="link-editor-cancel" onClick={onClose}>Cancel</button>
          <button type="submit" className="link-editor-save">Save links</button>
        </div>
      </form>
    </div>
  );
}
