// database/database.js
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('diseases.db');

export const createTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS diseases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        imageUri TEXT,
        timestamp TEXT
      );`
    );
  });
};

export const insertDisease = (name, description, imageUri) => {
  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO diseases (name, description, imageUri, timestamp) VALUES (?, ?, ?, ?);`,
      [name, description, imageUri, new Date().toISOString()]
    );
  });
};

export const getDiseases = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM diseases;`,
      [],
      (_, { rows: { _array } }) => {
        callback(_array);
      }
    );
  });
};
