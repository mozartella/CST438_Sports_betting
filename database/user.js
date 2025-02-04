import db from './database.js';

export const insertUser = (username, password) => {
    db.transaction(tx => {
        tx.executeSql(
            `INSERT INTO users (username, password) VALUES (?, ?);`,
            [username, password]
        );
    });
};