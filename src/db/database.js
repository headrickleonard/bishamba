import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('diseases.db');

export const createTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS diseases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        confidence REAL,
        detections INTEGER,
        symptoms TEXT,
        effects TEXT,
        medication TEXT,
        imageUri TEXT,
        timestamp TEXT
      );`
    );
  });
};

export const insertDisease = (name, confidence, detections, symptoms, effects, medication, imageUri) => {
  const symptomsJson = JSON.stringify(symptoms);
  const effectsJson = JSON.stringify(effects);

  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO diseases (name, confidence, detections, symptoms, effects, medication, imageUri, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [name, confidence, detections, symptomsJson, effectsJson, medication, imageUri, new Date().toISOString()]
    );
  });
};

export const getDiseases = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM diseases;`,
      [],
      (_, { rows: { _array } }) => {
        const diseases = _array.map(disease => ({
          ...disease,
          symptoms: JSON.parse(disease.symptoms),
          effects: JSON.parse(disease.effects)
        }));
        callback(diseases);
      }
    );
  });
};
