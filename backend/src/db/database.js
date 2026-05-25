const Database = require('better-sqlite3');
const path = require('path');

const db = process.env.NODE_ENV === 'test'
    ? new Database(':memory:')
    : new Database(path.join(__dirname, '../../salary.db'));

db.pragma('journal_mode = WAL');

if (process.env.NODE_ENV === 'test') {
    db.exec(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      job_title TEXT NOT NULL,
      country TEXT NOT NULL,
      salary REAL NOT NULL,
      department TEXT,
      email TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

module.exports = db;