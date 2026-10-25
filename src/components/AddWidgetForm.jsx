import { useState } from 'react';
import { availablePlacements, playlistTrackLimit, WIDGET_SIZES } from '../boardSpace';
import { normalizeSpotifyUrl } from '../spotifyLinks';
import { fetchSpotifyPreview } from '../spotifyPreview';

const TYPES = [
  { id: 'image', label: 'Image', description: 'A photo without a link' },
  { id: 'song', label: 'Song', description: 'Artwork linked to Spotify' },
  { id: 'playlist', label: 'Playlist', description: 'A playlist linked to Spotify' },
];

export function AddWidgetForm({ items, onAdd, onClose }) {
  const [step, setStep] = useState('size');
  const [size, setSize] = useState(null);
  const [type, setType] = useState(null);
  const [title, setTitle] = useState('');
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [image, setImage] = useState('');
  const [imageName, setImageName] = useState('');
  const [tracks, setTracks] = useState(Array.from({ length: 6 }, () => ({ title: '', artist: '' })));
  const [error, setError] = useState('');
  const [loadingPreview, setLoadingPreview] = useState(false);
  const maxTracks = playlistTrackLimit(size);

  function uploadImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) {
      setError('Choose an image smaller than 10 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(String(reader.result));
      setImageName(file.name.replace(/\.[^.]+$/, ''));
      setError('');
    };
    reader.onerror = () => setError('The image could not be read. Try another file.');
    reader.readAsDataURL(file);
  }

  function updateTrack(index, field, value) {
    setTracks((previous) => previous.map((track, trackIndex) => trackIndex === index ? { ...track, [field]: value } : track));
  }

  async function loadSpotifyArt() {
    setLoadingPreview(true);
    setError('');
    try {
      const normalized = normalizeSpotifyUrl(spotifyUrl, new Set(type === 'playlist' ? ['playlist'] : ['track', 'album']));
      if (!normalized) throw new Error('Paste a Spotify link first.');
      const preview = await fetchSpotifyPreview(normalized);
      if (preview.title) setTitle((previous) => previous || preview.title);
      if (preview.image) setImage(preview.image);
      if (!preview.image) setError('Spotify did not return artwork. You can upload an image instead.');
    } catch {
      setError('Could not fetch Spotify artwork. Check the link or upload an image instead.');
    } finally {
      setLoadingPreview(false);
    }
  }

  function save(event) {
    event.preventDefault();
    const placement = availablePlacements(items, size)[0];
    if (!placement) {
      setError('That size no longer fits on the board. Choose another size.');
      setStep('size');
      return;
    }

    try {
      const id = crypto.randomUUID();
      if (type === 'image' || type === 'song') {
        if (!image) throw new Error('Upload an image first.');
        const widget = { id, type, src: image, alt: title.trim() || imageName || 'Uploaded image', placement };
        if (type === 'song') {
          if (!spotifyUrl.trim()) throw new Error('Paste a Spotify song or album link.');
          widget.spotifyUrl = normalizeSpotifyUrl(spotifyUrl, new Set(['track', 'album']));
        }
        onAdd(widget);
        return;
      }

      if (!title.trim()) throw new Error('Give the playlist a title.');
      if (!spotifyUrl.trim()) throw new Error('Paste a Spotify playlist link.');
      if (!maxTracks) throw new Error('Playlists need a wide or large widget.');
      onAdd({
        id,
        type: 'playlist',
        label: title.trim(),
        cover: image,
        spotifyUrl: normalizeSpotifyUrl(spotifyUrl, new Set(['playlist'])),
        tracks: tracks.slice(0, maxTracks).filter((track) => track.title.trim()).map((track, index) => ({
          id: `${id}-track-${index}`,
          title: track.title.trim(),
          artist: track.artist.trim() || 'Unknown artist',
          artwork: image,
        })),
        placement,
      });
    } catch (cause) {
      setError(cause.message);
    }
  }

  return (
    <div className="link-editor-backdrop" onClick={onClose}>
      <form className="link-editor add-widget-dialog" role="dialog" aria-modal="true" aria-labelledby="add-widget-title" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => { if (event.key === 'Escape') onClose(); }} onSubmit={save}>
        <div className="link-editor-header">
          <h2 id="add-widget-title">Add widget</h2>
          <button type="button" className="link-editor-close" aria-label="Close add widget form" onClick={onClose}>×</button>
        </div>
        <p className="add-widget-step">{step === 'size' ? '1 of 3 · Choose a size' : step === 'type' ? '2 of 3 · Choose a type' : '3 of 3 · Add content'}</p>

        {step === 'size' && (
          <div className="add-widget-options">
            {WIDGET_SIZES.map((option) => {
              const fits = availablePlacements(items, option).length > 0;
              return <button key={option.id} type="button" className="add-widget-option" disabled={!fits} onClick={() => { setSize(option); setStep('type'); }}>
                <strong>{option.id}</strong><span>{option.label}</span><small>{fits ? 'Available' : 'No space'}</small>
              </button>;
            })}
            {!WIDGET_SIZES.some((option) => availablePlacements(items, option).length) && <p className="add-widget-empty">The board is full. Delete a widget to make space.</p>}
          </div>
        )}

        {step === 'type' && (
          <div className="add-widget-options">
            {TYPES.map((option) => <button key={option.id} type="button" className="add-widget-option" disabled={option.id === 'playlist' && !maxTracks} onClick={() => { setType(option.id); setStep('details'); }}>
              <strong>{option.label}</strong><span>{option.description}</span>{option.id === 'playlist' && !maxTracks && <small>Wide or large only</small>}
            </button>)}
          </div>
        )}

        {step === 'details' && (
          <>
            <label className="link-field" htmlFor="new-widget-title">
              <span>{type === 'playlist' ? 'Playlist title' : 'Image label (optional)'}</span>
              <input id="new-widget-title" type="text" value={title} onChange={(event) => setTitle(event.target.value)} placeholder={type === 'playlist' ? 'My playlist' : 'Describe the image'} />
            </label>
            <label className="link-field" htmlFor="new-widget-image">
              <span>{type === 'playlist' ? 'Cover image (optional)' : 'Upload image'}</span>
              <input id="new-widget-image" type="file" accept="image/*" onChange={uploadImage} />
            </label>
            {image && <img className="add-widget-image-preview" src={image} alt="Upload preview" />}
            {type !== 'image' && <label className="link-field" htmlFor="new-widget-spotify-url">
              <span>Spotify {type === 'playlist' ? 'playlist' : 'song or album'} link</span>
              <input id="new-widget-spotify-url" type="url" inputMode="url" autoCapitalize="off" autoCorrect="off" spellCheck="false" value={spotifyUrl} onChange={(event) => setSpotifyUrl(event.target.value)} placeholder={`https://open.spotify.com/${type === 'playlist' ? 'playlist' : 'track'}/...`} />
            </label>}
            {type !== 'image' && <button type="button" className="fetch-spotify-art" disabled={loadingPreview} onClick={loadSpotifyArt}>{loadingPreview ? 'Loading Spotify art…' : 'Fetch Spotify art'}</button>}
            {type === 'playlist' && <>
              <p className="link-editor-help add-widget-track-help">Spotify does not send the track list to this prototype. Enter up to {maxTracks} songs to display.</p>
              {tracks.slice(0, maxTracks).map((track, index) => <div className="add-widget-track-fields" key={index}>
                <label className="link-field" htmlFor={`new-track-title-${index}`}><span>Song {index + 1}</span><input id={`new-track-title-${index}`} type="text" value={track.title} onChange={(event) => updateTrack(index, 'title', event.target.value)} placeholder="Song title" /></label>
                <label className="link-field" htmlFor={`new-track-artist-${index}`}><span>Artist</span><input id={`new-track-artist-${index}`} type="text" value={track.artist} onChange={(event) => updateTrack(index, 'artist', event.target.value)} placeholder="Artist name" /></label>
              </div>)}
            </>}
          </>
        )}

        {error && <p className="link-editor-error" role="alert">{error}</p>}
        <div className="link-editor-actions">
          {step !== 'size' && <button type="button" className="link-editor-cancel" onClick={() => { setError(''); setStep(step === 'details' ? 'type' : 'size'); }}>Back</button>}
          {step === 'details' && <button type="submit" className="link-editor-save">Add widget</button>}
        </div>
      </form>
    </div>
  );
}
