//  npm install better-sqlite3

const db = require('better-sqlite3')('database.db');

const createTable = () => {
    const sql1 = `
        CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        );
    `;
    
    const sql2 = `
        CREATE TABLE team (
            team_id INTEGER PRIMARY KEY,
            team_name TEXT NOT NULL,
            nickname TEXT NOT NULL,
            logo_url TEXT NOT NULL
        );
    `;
    
    const sql3 = `
        CREATE TABLE favorite (
            team_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            PRIMARY KEY (user_id, team_id),
            FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
            FOREIGN KEY (team_id) REFERENCES team(team_id) ON DELETE CASCADE
        );
    `;

    db.prepare(sql1).run();
    db.prepare(sql2).run();
    db.prepare(sql3).run();
};

const insertUser = (username, password) => {
    const sql = `
        INSERT INTO user (username, password)
        VALUES (?, ?)
    `
    db.prepare(sql).run(username, password);
}

const insertTeam = (team_id, team_name, nickname, logo_url) => {
    const sql = `
        INSERT INTO team(team_id, team_name, nickname, logo_url)
        VALUES(?, ?, ?, ?);
    `
    db.prepare(sql).run(team_id, team_name, nickname, logo_url);
}

const addTeamToFavs = (username, team_name) => {
    const sql1 = `
        SELECT id
        FROM user
        WHERE username = ?;
    `
    const sql2 = `
        SELECT team_id
        FROM team
        WHERE team_name = ?;
    `
    const sql3 = `
        INSERT INTO favorite (team_id, user_id)
        VALUES(?, ?)
    `

    const user = db.prepare(sql1).get(username);
    const team = db.prepare(sql2).get(team_name);
    db.prepare(sql3).run(team.team_id, user.id)
}

const removeUser = (username) => {
    const sql = `
        DELETE FROM user
        WHERE username = ?;
    `
    db.prepare(sql).run(username)
}

createTable();  //  may or may not have to call manually 