import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('diseases.db');

export const createTable = () => {
  db.transaction(tx => {
    tx.executeSql('DROP TABLE IF EXISTS diseases', [], (tx, results) => {
      console.log('Table dropped successfully');
      
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS diseases (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          diseaseId TEXT,
          diseasesCode TEXT,
          commonName TEXT,
          scientificName TEXT,
          cause TEXT,
          category TEXT,
          symptoms TEXT,
          comment TEXT,
          management TEXT,
          recommendedTreatment TEXT,
          imageUri TEXT
        )`,
        [],
        (tx, results) => {
          console.log('Diseases table created successfully:', results);
        },
        (tx, error) => {
          console.error('Diseases table creation failed:', error);
        }
      );
  
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          term TEXT
        )`,
        [],
        (tx, results) => {
          console.log('History table created successfully:', results);
        },
        (tx, error) => {
          console.error('History table creation failed:', error);
        }
      );
  
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          text TEXT,
          sender TEXT,
          timestamp TEXT
        )`,
        [],
        (tx, results) => {
          console.log('Messages table created successfully:', results);
        },
        (tx, error) => {
          console.error('Messages table creation failed:', error);
        }
      );
    });
  });
}

// export const createTable = () => {
//   db.transaction(tx => {
//     tx.executeSql('DROP TABLE IF EXISTS diseases;', [], (tx, results) => {
//       console.log('Table dropped successfully');
//       tx.executeSql(`
//          CREATE TABLE IF NOT EXISTS diseases (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     diseaseId TEXT,
//     diseasesCode TEXT,
//     commonName TEXT,
//     scientificName TEXT,
//     cause TEXT,
//     category TEXT,
//     symptoms TEXT,
//     comment TEXT,
//     management TEXT,
//     recommendedTreatment TEXT,
//     imageUri TEXT
// );
//         `, [], (tx, results) => {
//         console.log('Table created successfully');
//       }, (tx, error) => {
//         console.error('Failed to create table:', error);
//       });
//     }, (tx, error) => {
//       console.error('Failed to drop table:', error);
//     });


//     tx.executeSql(
//       `CREATE TABLE IF NOT EXISTS history (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         term TEXT
//       )`,
//       [],
//       (tx, results) => {
//         console.log('History table created successfully:', results);
//       },
//       (tx, error) => {
//         console.error('History table creation failed:', error);
//       }
//     );

//     tx.executeSql(
//       `CREATE TABLE IF NOT EXISTS messages (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         text TEXT,
//         sender TEXT,
//         timestamp TEXT
//       )`,
//       [],
//       (tx, results) => {
//         console.log('Messages table created successfully:', results);
//       },
//       (tx, error) => {
//         console.error('Messages table creation failed:', error);
//       }
//     );
//   });
// };


export const insertDisease = (diseaseData) => {
  const {
    diseaseId, diseasesCode, commonName, scientificName, cause,
    category, symptoms, comment, management, recommendedTreatment,
    imageUri
  } = diseaseData;

  const symptomsJson = JSON.stringify(symptoms);
  const recommendedTreatmentJson = JSON.stringify(recommendedTreatment);

  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO diseases (
        diseaseId, diseasesCode, commonName, scientificName, cause,
        category, symptoms, comment, management, recommendedTreatment,
        imageUri, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        diseaseId, diseasesCode, commonName, scientificName, cause,
        category, symptomsJson, comment, management, recommendedTreatmentJson,
        imageUri, new Date().toISOString()
      ],
      (tx, results) => {
        console.log('Insert successful:', results);
      },
      (tx, error) => {
        console.error('Insert failed:', error);
      }
    );
  }, (error) => {
    console.error('Transaction error:', error);
  }, () => {
    console.log('Transaction successful');
  });
};
// export const getDiseases = (callback) => {
//   db.transaction(tx => {
//     tx.executeSql(
//       `SELECT * FROM diseases;`,
//       [],
//       (_, { rows: { _array } }) => {
//         const diseases = _array.map(disease => ({
//           ...disease,
//           symptoms: JSON.parse(disease.symptoms),
//           effects: JSON.parse(disease.effects)
//         }));
//         callback(diseases);
//       }
//     );
//   });
// };

export const getDiseases = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM diseases;`,
      [],
      (_, { rows: { _array } }) => {
        console.log("Fetched diseases:", _array); // Log the raw fetched data
        const diseases = _array.map(disease => ({
          ...disease,
          symptoms: JSON.parse(disease.symptoms),
          effects: JSON.parse(disease.effects)
        }));
        callback(diseases);
      },
      (_, error) => {
        console.error("SQL Error:", error); // Log any SQL errors
        return false; // Indicate that the transaction failed
      }
    );
  });
};

export const insertSearchTerm = (term) => {
  db.transaction(tx => {
    tx.executeSql('INSERT INTO history (term) VALUES (?);', [term]);
  });
};
export const getSearchHistory = (callback) => {
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM history;', [], (_, { rows: { _array } }) => {
      callback(_array);
    });
  });
};
export const getMessages = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM messages;',
      [],
      (_, { rows: { _array } }) => {
        callback(_array);
      }
    );
  });
};
export const insertMessage = (text, sender, timestamp) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO messages (text, sender, timestamp) VALUES (?, ?, ?);',
      [text, sender, timestamp]
    );
  });
};
export const logDiseases = () => {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM diseases;`,
      [],
      (_, { rows: { _array } }) => {
        console.log("Diseases:", _array);
      },
      (_, error) => {
        console.error("Fetch Error:", error);
        return false;
      }
    );
  });
};
export const getTableSchema = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      "PRAGMA table_info(diseases);",
      [],
      (_, { rows: { _array } }) => {
        callback(_array);
      }
    );
  });
};