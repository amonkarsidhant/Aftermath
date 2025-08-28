import sqlite3 from 'sqlite3';

sqlite3.verbose();

export const db = new sqlite3.Database('postmortems.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS postmortems (
    id INTEGER PRIMARY KEY,
    incidentId TEXT,
    title TEXT,
    summary TEXT,
    tags TEXT
  )`);

  db.get('SELECT COUNT(*) as count FROM postmortems', (err: Error | null, row: { count: number } | undefined) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to count postmortems', err);
      return;
    }
    if (!row?.count) {
      const stmt = db.prepare('INSERT INTO postmortems (incidentId, title, summary, tags) VALUES (?, ?, ?, ?)');
      stmt.run('1', 'Database outage', 'Resolved database outage', 'database,outage');
      stmt.run('2', 'Kafka scaling issue', 'Incident involving Kafka scaling', 'kafka,scaling');
      stmt.finalize();
    }
  });
});
