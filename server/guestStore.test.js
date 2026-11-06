import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createGuestStore } from './guestStore.js';

test('guest moodboards survive reopening the database and stay separate', () => {
  const directory = mkdtempSync(join(tmpdir(), 'mudo-guest-'));
  const path = join(directory, 'moodboards.sqlite');
  const state = { boards: [{ id: 'board-1', title: 'My board', items: [{ id: 'photo', type: 'image', src: 'data:image/png;base64,dGVzdA==', placement: { column: 1, row: 1, columns: 1, rows: 1 } }] }], recentBoardId: 'board-1' };
  try {
    const first = createGuestStore(path);
    first.create('guest-one');
    first.create('guest-two');
    assert.equal(first.save('guest-one', state), true);
    first.close();

    const reopened = createGuestStore(path);
    assert.deepEqual(reopened.load('guest-one'), state);
    assert.equal(reopened.load('guest-two'), null);
    reopened.close();
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
