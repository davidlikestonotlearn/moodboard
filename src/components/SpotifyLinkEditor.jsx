import { useState } from 'react';
import { normalizeSpotifyUrl } from '../spotifyLinks';

export function SpotifyLinkEditor({ item, onClose, onSave }) {
  const [url, setUrl] = useState(item.spotifyUrl || '');
  const [error, setError] = useState('');
  const isPlaylist = item.type === 'playlist';

  function save(event) {
    event.preventDefault();
    try {
      onSave(normalizeSpotifyUrl(url, new Set(isPlaylist ? ['playlist'] : ['track', 'album'])));
    } catch (cause) {
      setError(cause.message);
    }
  }

  return (
    <div className="link-editor-backdrop" onClick={onClose}>
      <form className="link-editor" role="dialog" aria-modal="true" aria-labelledby="link-editor-title" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => { if (event.key === 'Escape') onClose(); }} onSubmit={save}>
        <div className="link-editor-header">
          <h2 id="link-editor-title">Spotify link</h2>
          <button type="button" className="link-editor-close" aria-label="Close link editor" onClick={onClose}>×</button>
        </div>
        <p className="link-editor-help">Paste a Spotify {isPlaylist ? 'playlist' : 'song or album'} share link. Saving closes edit mode so you can tap the widget to open Spotify. Clear the field to remove its link.</p>
        <label className="link-field" htmlFor="widget-spotify-url">
          <span>{isPlaylist ? 'Playlist' : 'Song or album'} link</span>
          <input id="widget-spotify-url" type="url" inputMode="url" autoCapitalize="off" autoCorrect="off" spellCheck="false" placeholder={`https://open.spotify.com/${isPlaylist ? 'playlist' : 'track'}/...`} value={url} onChange={(event) => { setUrl(event.target.value); setError(''); }} />
        </label>
        {error && <p className="link-editor-error" role="alert">{error}</p>}
        <div className="link-editor-actions">
          <button type="button" className="link-editor-cancel" onClick={onClose}>Cancel</button>
          <button type="submit" className="link-editor-save">Save link</button>
        </div>
      </form>
    </div>
  );
}
