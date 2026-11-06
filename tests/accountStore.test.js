import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createAccountStore, hashPassword, verifyPassword } from '../server/accountStore.js';

test('passwords are hashed and account sessions keep boards separate', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'mudo-account-'));
  const path = join(directory, 'accounts.sqlite');
  try {
    const passwordHash = await hashPassword('sample-password-123');
    assert.equal(passwordHash.includes('sample-password-123'), false);
    assert.equal(await verifyPassword('sample-password-123', passwordHash), true);
    assert.equal(await verifyPassword('wrong-password', passwordHash), false);

    const first = createAccountStore(path);
    first.create({ id: 'account-a', email: 'a@example.com', passwordHash, name: 'A', image: '' });
    first.create({ id: 'account-b', email: 'b@example.com', passwordHash, name: 'B', image: '' });
    const token = first.createSession('account-a');
    const state = { boards: [{ id: 'private-board', title: 'Private', items: [] }], recentBoardId: 'private-board' };
    first.saveState('account-a', state);
    assert.equal(first.accountForSession(token).id, 'account-a');
    assert.deepEqual(JSON.parse(first.findById('account-b').state).boards, []);
    first.close();

    const reopened = createAccountStore(path);
    assert.deepEqual(JSON.parse(reopened.accountForSession(token).state), state);
    reopened.deleteSession(token);
    assert.equal(reopened.accountForSession(token), null);
    reopened.close();
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
