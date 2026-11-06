import { DatabaseSync } from 'node:sqlite';

export function createGuestStore(path) {
  const database = new DatabaseSync(path);
  database.exec(`
    CREATE TABLE IF NOT EXISTS guests (
      id TEXT PRIMARY KEY,
      state TEXT,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const findGuest = database.prepare('SELECT state FROM guests WHERE id = ?');
  const insertGuest = database.prepare('INSERT INTO guests (id) VALUES (?)');
  const saveGuest = database.prepare('UPDATE guests SET state = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');

  return {
    has(id) {
      return Boolean(findGuest.get(id));
    },
    create(id) {
      insertGuest.run(id);
    },
    load(id) {
      const row = findGuest.get(id);
      return row?.state ? JSON.parse(row.state) : null;
    },
    save(id, state) {
      return saveGuest.run(JSON.stringify(state), id).changes === 1;
    },
    close() {
      database.close();
    },
  };
}
