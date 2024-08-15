const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'config.db');
const db = new sqlite3.Database(dbPath);

const getEnvVariable = (key) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT value FROM config WHERE key = ?", [key], (err, row) => {
      if (err) {
        return reject(err);
      }
      resolve(row ? row.value : null);
    });
  });
};

module.exports = { getEnvVariable };
