import { normalizeSpotifyUrl } from './spotifyLinks.js';

export async function fetchSpotifyPreview(value, fetcher = fetch) {
  const url = normalizeSpotifyUrl(value);
  if (!url) throw new Error('Paste a Spotify link first.');
  const response = await fetcher(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`);
  if (!response.ok) throw new Error('Spotify could not load this link.');
  const data = await response.json();
  if (data.provider_name !== 'Spotify') throw new Error('Spotify did not return a preview.');
  const thumbnail = typeof data.thumbnail_url === 'string' ? new URL(data.thumbnail_url) : null;
  const allowedImage = thumbnail?.protocol === 'https:' && (thumbnail.hostname === 'i.scdn.co' || thumbnail.hostname.endsWith('.spotifycdn.com'));
  return {
    title: typeof data.title === 'string' ? data.title : '',
    image: allowedImage ? thumbnail.href : '',
  };
}
