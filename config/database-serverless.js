const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

// Use in-memory SQLite database for serverless environments
const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error('Could not connect to in-memory database', err);
  } else {
    console.log('Connected to in-memory SQLite database');
  }
});

// Function to initialize database and create table if not exists
function connect() {
  return new Promise((resolve, reject) => {
    // Create schools table
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
      
      // Add sample data for demo purposes in serverless environment
      db.run(`
        INSERT INTO schools (name, address, latitude, longitude)
        VALUES 
        ('Central High School', '123 Education Street, City', 34.0522, -118.2437),
        ('Lincoln Elementary', '456 Learning Avenue, City', 34.0550, -118.2500),
        ('Washington Middle School', '789 Knowledge Road, City', 34.0480, -118.2350)
      `, (err) => {
        if (err) {
          console.error('Error adding sample data:', err);
          // Don't reject here, as the table might already have data
        }
        
        console.log('Schools table and sample data ready');
        resolve(true);
      });
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
