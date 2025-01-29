import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('gambleApp.db');

db.transaction(transaction => {
    transaction.executeSql(
        `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password TEXT NOT NULL
        );`
    );
});

export default db;

//  For future use
/*
CREATE TABLE data (
    data_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    data TEXT NOT NULL,
   FOREIGN KEY (user_id) REFERENCES users (id)
);
*/