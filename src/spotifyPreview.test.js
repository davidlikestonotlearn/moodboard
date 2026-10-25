import assert from 'node:assert/strict';
import test from 'node:test';
import { fetchSpotifyPreview } from './spotifyPreview.js';

test('uses Spotify title and image from oEmbed', async () => {
  const id = '4iV5W9uYEdYUVa79Axb7Rh';
  const result = await fetchSpotifyPreview(`https://open.spotify.com/track/${id}`, async (url) => {
    assert.ok(url.includes(encodeURIComponent(`https://open.spotify.com/track/${id}`)));
    return { ok: true, json: async () => ({ provider_name: 'Spotify', title: 'Example song', thumbnail_url: 'https://i.scdn.co/image/example' }) };
  });
  assert.deepEqual(result, { title: 'Example song', image: 'https://i.scdn.co/image/example' });
});

test('ignores thumbnails outside Spotify image hosts', async () => {
  const result = await fetchSpotifyPreview('https://open.spotify.com/playlist/3cEYpjA9oz9GiPac4AsH4n', async () => ({
    ok: true,
    json: async () => ({ provider_name: 'Spotify', title: 'Example playlist', thumbnail_url: 'https://example.com/image' }),
  }));
  assert.equal(result.image, '');
});
