const SPOTIFY_TYPES = new Set(['track', 'album', 'playlist']);

export function normalizeSpotifyUrl(value, allowedTypes = SPOTIFY_TYPES) {
  const input = value.trim();
  if (!input) return '';

  let url;
  try {
    url = new URL(input);
  } catch {
    throw new Error('Paste a full open.spotify.com share link.');
  }

  const parts = url.pathname.split('/').filter(Boolean);
  if (/^intl-[a-z]{2}$/i.test(parts[0] || '')) parts.shift();
  if (
    url.protocol !== 'https:' ||
    url.hostname !== 'open.spotify.com' ||
    url.username || url.password || url.port ||
    parts.length !== 2 ||
    !allowedTypes.has(parts[0]) ||
    !/^[a-zA-Z0-9]{22}$/.test(parts[1])
  ) {
    throw new Error('Use a Spotify song, album, or playlist share link from open.spotify.com.');
  }

  return `https://open.spotify.com/${parts[0]}/${parts[1]}`;
}

export function safeSpotifyUrl(value) {
  if (typeof value !== 'string') return '';
  try {
    return normalizeSpotifyUrl(value);
  } catch {
    return '';
  }
}
