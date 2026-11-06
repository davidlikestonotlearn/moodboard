import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';
import { mkdir, readFile } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';
import { createGuestStore } from './guestStore.js';
import { createAccountStore, hashPassword, verifyPassword } from './accountStore.js';

const root = resolve(import.meta.dirname, '..');
const dataDirectory = process.env.MUDO_DATA_DIR ? resolve(process.env.MUDO_DATA_DIR) : join(root, 'data');
const distDirectory = join(root, 'dist');
const production = process.argv.includes('--production');
const port = Number(process.env.PORT || 5173);
const cookieName = 'mudo_guest';
const maxBodyBytes = 64 * 1024 * 1024;

await mkdir(dataDirectory, { recursive: true });
const store = createGuestStore(join(dataDirectory, 'moodboards.sqlite'));
const accounts = createAccountStore(join(dataDirectory, 'moodboards.sqlite'));
const sessionCookieName = 'mudo_session';
const loginAttempts = new Map();
let vite;

function sendJson(response, status, value) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  response.end(JSON.stringify(value));
}

function guestIdFromCookie(request) {
  const cookie = request.headers.cookie?.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${cookieName}=`));
  const id = cookie?.slice(cookieName.length + 1);
  return id && /^[a-f0-9]{64}$/.test(id) && store.has(id) ? id : null;
}

function cookieValue(request, name) {
  const cookie = request.headers.cookie?.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return cookie?.slice(name.length + 1) || '';
}

function sessionCookie(request, token, maxAge = 2592000) {
  return `${sessionCookieName}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${request.socket.encrypted ? '; Secure' : ''}`;
}

function publicAccount(account) {
  return { id: account.id, email: account.email, name: account.name, image: account.image, bio: account.bio, state: JSON.parse(account.state) };
}

function accountFromRequest(request) {
  return accounts.accountForSession(cookieValue(request, sessionCookieName));
}

function allowedAttempt(key) {
  const now = Date.now();
  const entry = loginAttempts.get(key);
  if (!entry || entry.until < now) {
    loginAttempts.set(key, { count: 1, until: now + 15 * 60 * 1000 });
    return true;
  }
  entry.count++;
  return entry.count <= 10;
}

function validEmailPassword(email, password) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254
    && typeof password === 'string' && password.length >= 8 && password.length <= 1024;
}

function validProfileImage(image, maxLength) {
  return typeof image === 'string' && image.length <= maxLength
    && (!image || image === '/images/chrome-heart-avatar.png' || /^data:image\/(png|jpeg|webp);base64,/.test(image));
}

async function handleAccountApi(request, response) {
  const path = request.url;
  if (path === '/api/auth/session' && request.method === 'GET') {
    const account = accountFromRequest(request);
    return sendJson(response, 200, { account: account ? publicAccount(account) : null });
  }
  if (path === '/api/auth/logout' && request.method === 'POST') {
    accounts.deleteSession(cookieValue(request, sessionCookieName));
    response.setHeader('Set-Cookie', sessionCookie(request, '', 0));
    return sendJson(response, 200, { ok: true });
  }
  if ((path === '/api/auth/email' || path === '/api/auth/register') && request.method === 'POST') {
    if (!request.headers['content-type']?.startsWith('application/json')) return sendJson(response, 415, { error: 'Expected JSON.' });
    let body;
    try { body = await readJson(request); } catch { return sendJson(response, 400, { error: 'Invalid request.' }); }
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const { password } = body;
    if (!validEmailPassword(email, password)) return sendJson(response, 400, { error: 'Enter a valid email and a password of at least 8 characters.' });
    if (!allowedAttempt(`${request.socket.remoteAddress}:${email}`)) return sendJson(response, 429, { error: 'Too many attempts. Try again later.' });
    const existing = accounts.findByEmail(email);
    if (path === '/api/auth/email') {
      if (!existing) return sendJson(response, 200, { needsProfile: true });
      if (!(await verifyPassword(password, existing.password_hash))) return sendJson(response, 401, { error: 'Wrong password for this email.' });
      const token = accounts.createSession(existing.id);
      response.setHeader('Set-Cookie', sessionCookie(request, token));
      return sendJson(response, 200, { account: publicAccount(existing) });
    }
    if (existing) return sendJson(response, 409, { error: 'That email already has an account. Sign in instead.' });
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const image = typeof body.image === 'string' ? body.image : '';
    if (!name || name.length > 60 || !validProfileImage(image, 3_000_000)) {
      return sendJson(response, 400, { error: 'Enter a name and choose an image under 2 MB.' });
    }
    const id = randomBytes(16).toString('hex');
    const passwordHash = await hashPassword(password);
    try { accounts.create({ id, email, passwordHash, name, image }); }
    catch { return sendJson(response, 409, { error: 'That email already has an account. Sign in instead.' }); }
    const token = accounts.createSession(id);
    response.setHeader('Set-Cookie', sessionCookie(request, token));
    return sendJson(response, 201, { account: publicAccount(accounts.findById(id)) });
  }
  if (path === '/api/account' && request.method === 'PUT') {
    const account = accountFromRequest(request);
    if (!account) return sendJson(response, 401, { error: 'Sign in again.' });
    if (!request.headers['content-type']?.startsWith('application/json')) return sendJson(response, 415, { error: 'Expected JSON.' });
    try {
      const body = await readJson(request);
      if (body.state) {
        if (!validState(body.state)) return sendJson(response, 400, { error: 'Invalid moodboard data.' });
        accounts.saveState(account.id, body.state);
      } else if (body.profile) {
        const { name, image, bio } = body.profile;
        if (typeof name !== 'string' || !name.trim() || name.length > 60 || !validProfileImage(image, 15_000_000) || typeof bio !== 'string' || bio.length > 160) return sendJson(response, 400, { error: 'Invalid profile.' });
        accounts.saveProfile(account.id, name.trim(), image, bio);
      } else return sendJson(response, 400, { error: 'Nothing to save.' });
      return sendJson(response, 200, { saved: true });
    } catch { return sendJson(response, 400, { error: 'Invalid request.' }); }
  }
  return sendJson(response, 404, { error: 'Not found.' });
}

async function readJson(request) {
  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxBodyBytes) {
      const error = new Error('Moodboard data is too large.');
      error.status = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function validState(value) {
  return value && Array.isArray(value.boards) && value.boards.length <= 100
    && value.boards.every((board) => board && typeof board.id === 'string' && typeof board.title === 'string'
      && Array.isArray(board.items) && board.items.length <= 8)
    && (value.recentBoardId === null || typeof value.recentBoardId === 'string');
}

async function handleApi(request, response) {
  if (request.url !== '/api/guest') return sendJson(response, 404, { error: 'Not found.' });

  if (request.method === 'GET') {
    let id = guestIdFromCookie(request);
    if (!id) {
      id = randomBytes(32).toString('hex');
      store.create(id);
      response.setHeader('Set-Cookie', `${cookieName}=${id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000${request.socket.encrypted ? '; Secure' : ''}`);
    }
    return sendJson(response, 200, { state: store.load(id) });
  }

  if (request.method === 'PUT') {
    const id = guestIdFromCookie(request);
    if (!id) return sendJson(response, 401, { error: 'Guest session expired. Continue as guest again.' });
    if (!request.headers['content-type']?.startsWith('application/json')) return sendJson(response, 415, { error: 'Expected JSON.' });
    try {
      const state = await readJson(request);
      if (!validState(state)) return sendJson(response, 400, { error: 'Invalid moodboard data.' });
      store.save(id, state);
      return sendJson(response, 200, { saved: true });
    } catch (error) {
      return sendJson(response, error.status || 400, { error: error.status ? error.message : 'Invalid JSON.' });
    }
  }

  return sendJson(response, 405, { error: 'Method not allowed.' });
}

const mimeTypes = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ttf': 'font/ttf', '.ico': 'image/x-icon' };
async function serveBuiltApp(request, response) {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const file = resolve(distDirectory, `.${pathname === '/' ? '/index.html' : pathname}`);
  if (file !== distDirectory && !file.startsWith(`${distDirectory}${sep}`)) return sendJson(response, 404, { error: 'Not found.' });
  try {
    const contents = await readFile(file);
    response.writeHead(200, { 'Content-Type': mimeTypes[extname(file)] || 'application/octet-stream' });
    response.end(contents);
  } catch {
    const contents = await readFile(join(distDirectory, 'index.html'));
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(contents);
  }
}

const server = createServer(async (request, response) => {
  try {
    if (request.url === '/api/guest') return await handleApi(request, response);
    if (request.url?.startsWith('/api/')) return await handleAccountApi(request, response);
    if (vite) return vite.middlewares(request, response, () => sendJson(response, 404, { error: 'Not found.' }));
    return await serveBuiltApp(request, response);
  } catch (error) {
    console.error(error);
    if (!response.headersSent) sendJson(response, 500, { error: 'Server error.' });
  }
});

if (!production) {
  const { createServer: createViteServer } = await import('vite');
  vite = await createViteServer({ server: { middlewareMode: { server }, hmr: { server } }, appType: 'spa' });
}

server.listen(port, '127.0.0.1', () => console.log(`MUDO is running at http://127.0.0.1:${port}/`));

export async function stop() {
  await new Promise((resolve) => server.close(resolve));
  await vite?.close();
  store.close();
  accounts.close();
}
process.once('SIGINT', () => { stop(); });
process.once('SIGTERM', () => { stop(); });
