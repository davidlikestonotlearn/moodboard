import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeSpotifyUrl, safeSpotifyUrl } from './spotifyLinks.js';

const id = '2up3OPMp9Tb4dAKM2erWXQ';

test('accepts direct Spotify share links and removes tracking parameters', () => {
  assert.equal(normalizeSpotifyUrl(`https://open.spotify.com/track/${id}?si=example`), `https://open.spotify.com/track/${id}`);
  assert.equal(normalizeSpotifyUrl(`https://open.spotify.com/intl-de/album/${id}`), `https://open.spotify.com/album/${id}`);
  assert.equal(normalizeSpotifyUrl(`https://open.spotify.com/playlist/${id}`), `https://open.spotify.com/playlist/${id}`);
  assert.equal(normalizeSpotifyUrl('  '), '');
});

test('rejects other sites and unsupported Spotify paths', () => {
  for (const value of [
    `https://open.spotify.com.evil.example/track/${id}`,
    `javascript:alert(1)`,
    `http://open.spotify.com/track/${id}`,
    `https://open.spotify.com/artist/${id}`,
    `https://open.spotify.com/track/not-an-id`,
  ]) {
    assert.throws(() => normalizeSpotifyUrl(value));
    assert.equal(safeSpotifyUrl(value), '');
  }
});

test('song fields only accept track links', () => {
  assert.throws(() => normalizeSpotifyUrl(`https://open.spotify.com/album/${id}`, new Set(['track'])));
});
