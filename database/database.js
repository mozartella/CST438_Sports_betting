import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('gambleApp.db');

const initializeDatabase = () => {
    db.transaction(tx => {
        tx.executeSql('PRAGMA foreign_keys = ON;');

        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            );`
        );

        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS teams (
                team_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                team_name TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );`
        );

        //  inserting a dummy user with a team for testing
        tx.executeSql(
            `INSERT INTO users (username, password) VALUES (?, ?);`,
            ['testUser1', '1234']
        );

        tx.executeSql(
            `INSERT INTO teams (user_id, team_name) 
                VALUES ((SELECT id FROM users WHERE username = ?), ?);`,
            ['testUser1', 'Atlanta Hawks']
        );

    });

};

initializeDatabase();

export default db;