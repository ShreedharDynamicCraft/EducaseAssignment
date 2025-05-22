const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbFile = process.env.DB_FILE || './database.sqlite';
const dbPath = path.resolve(dbFile);

// Create a new database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Function to initialize database and create table if not exists
function connect() {
  return new Promise((resolve, reject) => {
    // Create schools table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS schools (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating schools table:', err);
        reject(err);
        return;
      }
      console.log('Schools table checked/created');
      resolve(true);
    });
  });
}

// Helper function to run query with promises
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}

// Helper function to run insert query with promises
function insert(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve({ insertId: this.lastID });
    });
  });
}

module.exports = {
  db,
  connect,
  query,
  insert
};
