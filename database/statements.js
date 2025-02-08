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

const insertTeamManually = (team_id, team_name, nickname, logo_url) => {
    const sql = `
        INSERT INTO team(team_id, team_name, nickname, logo_url)
        VALUES(?, ?, ?, ?);
    `
    db.prepare(sql).run(team_id, team_name, nickname, logo_url);
}

const insertTeam = ([team_id, team_name, nickname, logo_url]) => {
    const sql = `
        INSERT INTO team(team_id, team_name, nickname, logo_url)
        VALUES(?, ?, ?, ?);
    `;
    db.prepare(sql).run(team_id, team_name, nickname, logo_url);
};

const addTeamToFavs = (username, team_name) => {
    const sql1 = `
        SELECT team_id
        FROM team
        WHERE team_name = ?;
    `
    const sql2 = `
        INSERT INTO favorite (team_id, user_id)
        VALUES(?, ?)
    `
    const userID = getUserID(username);
    const team = db.prepare(sql1).get(team_name);
    db.prepare(sql2).run(team.team_id, userID)
}

const removeUser = (username) => {
    const sql = `
        DELETE FROM user
        WHERE username = ?;
    `
    db.prepare(sql).run(username)
}

const getUserID = (username) => {
    const sql = `
        SELECT id
        FROM user
        WHERE username = ?;
    `;
    return db.prepare(sql).get(username).id;
};

const getFavTeamID = (username) => {
    const userID = getUserID(username);
    const sql = `
        SELECT team_id
        FROM favorite
        WHERE user_id = ?;
    `;
    return db.prepare(sql).all(userID).map(team => team.team_id);
};

const getFavTeamNames = (username) => {
    const team_ids = getFavTeamID(username);
    let names = [];
    for (let i = 0; i < team_ids.length; ++i) {
        let sql = `
            SELECT team_name
            FROM team
            WHERE team_id = ?;
        `;
        names.push(db.prepare(sql).get(team_ids[i]).team_name);
    }
    return names;
};

const getAllFavTeamInfo = (username) => {
    const team_ids = getFavTeamID(username);
    let teamInfo = [];

    for (let i = 0; i < team_ids.length; ++i) {
        let sql = `
            SELECT team_id, team_name, nickname, logo_url
            FROM team
            WHERE team_id = ?;
        `;
        let team = db.prepare(sql).get(team_ids[i]);

        teamInfo.push([team.team_id, team.team_name, team.nickname, team.logo_url]);
    }
    return teamInfo; // 2D array 
    /*  teamInfo[0] == team_id
        teamInfo[1] == team_name
        teamInfo[2] == nickname
        teamInfo[3] == logo_url
    */
};

