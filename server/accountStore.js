import { randomBytes, createHash, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { DatabaseSync } from 'node:sqlite';

const scrypt = promisify(scryptCallback);
const scryptOptions = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const sessionLifetime = 30 * 24 * 60 * 60 * 1000;

function tokenHash(token) {
  return createHash('sha256').update(token).digest('hex');
}

export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = await scrypt(password, salt, 64, scryptOptions);
  return `${salt}:${hash.toString('hex')}`;
}

export async function verifyPassword(password, stored) {
  const [salt, hex] = stored.split(':');
  if (!salt || !hex || hex.length !== 128) return false;
  const actual = await scrypt(password, salt, 64, scryptOptions);
  return timingSafeEqual(actual, Buffer.from(hex, 'hex'));
}

export function createAccountStore(path) {
  const database = new DatabaseSync(path, { timeout: 5000 });
  database.exec(`
    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      image TEXT NOT NULL DEFAULT '',
      bio TEXT NOT NULL DEFAULT '',
      state TEXT NOT NULL DEFAULT '{"boards":[],"recentBoardId":null}',
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS account_sessions (
      token_hash TEXT PRIMARY KEY,
      account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL
    );
  `);
  const byEmail = database.prepare('SELECT * FROM accounts WHERE email = ?');
  const byId = database.prepare('SELECT * FROM accounts WHERE id = ?');
  const insertAccount = database.prepare('INSERT INTO accounts (id, email, password_hash, name, image) VALUES (?, ?, ?, ?, ?)');
  const insertSession = database.prepare('INSERT INTO account_sessions (token_hash, account_id, expires_at) VALUES (?, ?, ?)');
  const findSession = database.prepare('SELECT account_id FROM account_sessions WHERE token_hash = ? AND expires_at > ?');
  const deleteSession = database.prepare('DELETE FROM account_sessions WHERE token_hash = ?');
  const saveState = database.prepare('UPDATE accounts SET state = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
  const saveProfile = database.prepare('UPDATE accounts SET name = ?, image = ?, bio = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');

  return {
    findByEmail(email) { return byEmail.get(email); },
    findById(id) { return byId.get(id); },
    create({ id, email, passwordHash, name, image }) { insertAccount.run(id, email, passwordHash, name, image); },
    createSession(accountId) {
      const token = randomBytes(32).toString('hex');
      insertSession.run(tokenHash(token), accountId, Date.now() + sessionLifetime);
      return token;
    },
    accountForSession(token) {
      if (!/^[a-f0-9]{64}$/.test(token || '')) return null;
      const session = findSession.get(tokenHash(token), Date.now());
      return session ? byId.get(session.account_id) : null;
    },
    deleteSession(token) {
      if (/^[a-f0-9]{64}$/.test(token || '')) deleteSession.run(tokenHash(token));
    },
    saveState(id, state) { saveState.run(JSON.stringify(state), id); },
    saveProfile(id, name, image, bio) { saveProfile.run(name, image, bio, id); },
    close() { database.close(); },
  };
}
