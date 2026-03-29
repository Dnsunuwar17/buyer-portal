const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '..', 'portal.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    email      TEXT    NOT NULL UNIQUE,
    password   TEXT    NOT NULL,
    role       TEXT    NOT NULL DEFAULT 'buyer',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS properties (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    title   TEXT    NOT NULL,
    address TEXT    NOT NULL,
    price   INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS favourites (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL,
    property_id INTEGER NOT NULL,
    FOREIGN KEY (user_id)     REFERENCES users(id),
    FOREIGN KEY (property_id) REFERENCES properties(id),
    UNIQUE(user_id, property_id)
  );
`);

const count = db.prepare('SELECT COUNT(*) as c FROM properties').get();
if (count.c === 0) {
  db.prepare('INSERT INTO properties (title, address, price) VALUES (?, ?, ?)').run('Modern Apartment', '12 Oak Street, Cape Town', 1850000);
  db.prepare('INSERT INTO properties (title, address, price) VALUES (?, ?, ?)').run('Family Home', '7 Elm Avenue, Johannesburg', 3200000);
  db.prepare('INSERT INTO properties (title, address, price) VALUES (?, ?, ?)').run('Studio Flat', '33 Beach Road, Durban', 950000);
  db.prepare('INSERT INTO properties (title, address, price) VALUES (?, ?, ?)').run('Luxury Villa', '5 Vineyard Lane, Stellenbosch', 6500000);
}

module.exports = db;