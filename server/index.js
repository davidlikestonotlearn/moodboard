import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';
import { mkdir, readFile } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';
import { createGuestStore } from './guestStore.js';

const root = resolve(import.meta.dirname, '..');
const dataDirectory = join(root, 'data');
const distDirectory = join(root, 'dist');
const production = process.argv.includes('--production');
const port = Number(process.env.PORT || 5173);
const cookieName = 'mudo_guest';
const maxBodyBytes = 64 * 1024 * 1024;

await mkdir(dataDirectory, { recursive: true });
const store = createGuestStore(join(dataDirectory, 'moodboards.sqlite'));
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
    if (request.url?.startsWith('/api/')) return await handleApi(request, response);
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

function stop() {
  server.close();
  vite?.close();
  store.close();
}
process.once('SIGINT', stop);
process.once('SIGTERM', stop);
