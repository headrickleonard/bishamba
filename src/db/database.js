import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('diseases.db');

export const createTable = () => {
  db.transaction(tx => {


    // Updated diseases table to store an array of prediction IDs
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS diseases (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          predictionId  TEXT
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

};

// export const insertDisease = (predictionId) => {
//   db.transaction(tx => {
//     tx.executeSql(
//       `INSERT INTO diseases (
//         predictionId
//       ) VALUES (?)`,
//       [predictionId],
//       (tx, results) => {
//         console.log('Insert successful:', results);
//       },
//       (tx, error) => {
//         console.error('Insert failed:', error);
//       }
//     );
//   }, (error) => {
//     console.error('Transaction error:', error);
//   }, () => {
//     console.log('Transaction successful');
//   });
// };

export const insertDisease = (predictionId) => {
  console.log('insertDisease called with predictionId:', predictionId);

  db.transaction(tx => {
    console.log('Transaction started');
    tx.executeSql(
      `INSERT INTO diseases (predictionId) VALUES (?)`,
      [predictionId],
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
//         console.log("Fetched diseases:", _array); // Log the raw fetched data
//         const diseases = _array.map(disease => ({
//           ...disease,
//           symptoms: JSON.parse(disease.symptoms),
//           effects: JSON.parse(disease.effects)
//         }));
//         callback(diseases);
//       },
//       (_, error) => {
//         console.error("SQL Error:", error); // Log any SQL errors
//         return false; // Indicate that the transaction failed
//       }
//     );
//   });
// };

// export const getDiseases = () => {
//   db.transaction(tx => {
//     tx.executeSql(
//       `SELECT * FROM diseases`,
//       [],
//       (tx, results) => {
//         console.log('Query results:', results.rows._array);
//       },
//       (tx, error) => {
//         console.error('Query failed:', error);
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
        console.log("Fetched disease IDs:", _array); // Log the fetched IDs
        const diseaseIds = _array.map(disease => disease.predictionId); // Extract IDs
        callback(diseaseIds);
      },
      (_, error) => {
        console.error("SQL Error:", error); // Log any SQL errors
        return false; // Indicate that the transaction failed
      }
    );
  });
};

export const getAllPredictionIds = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT predictionId FROM diseases`,
      [],
      (tx, results) => {
        const ids = [];
        for (let i = 0; i < results.rows.length; i++) {
          ids.push(results.rows.item(i).predictionId);
        }
        callback(ids);
      },
      (tx, error) => {
        console.error('Failed to retrieve prediction IDs:', error);
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
// export const getTableSchema = (callback) => {
//   db.transaction(tx => {
//     tx.executeSql(
//       "PRAGMA table_info(diseases);",
//       [],
//       (_, { rows: { _array } }) => {
//         callback(_array);
//       }
//     );
//   });
// };

export const getTableSchema = () => {
  db.transaction(tx => {
    tx.executeSql(
      `PRAGMA table_info(diseases);`,
      [],
      (tx, result) => {
        console.log("Table schema:", result.rows);
      },
      (tx, error) => {
        console.error("Failed to get table schema:", error);
      }
    );
  });
};