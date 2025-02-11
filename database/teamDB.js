const { db } = require('./db');
const { getUserID } = require('./userDB');

// insert a team manually
function insertTeamManually(team_id, team_name, nickname, logo_url) {
    const sql = `
        INSERT INTO team(team_id, team_name, nickname, logo_url)
        VALUES(?, ?, ?, ?);
    `;
    db.prepare(sql).run(team_id, team_name, nickname, logo_url);
}

// insert a team using an array
function insertTeam([team_id, team_name, nickname, logo_url]) {
    const sql = `
        INSERT INTO team(team_id, team_name, nickname, logo_url)
        VALUES(?, ?, ?, ?);
    `;
    db.prepare(sql).run(team_id, team_name, nickname, logo_url);
}

// add a team to a users favorites
function addTeamToFavs(username, team_name) {
    const userID = getUserID(username);
    const teamID = getTeamID(team_name);
    const sql = `
        INSERT INTO favorite (team_id, user_id)
        VALUES(?, ?);
    `;
    db.prepare(sql).run(teamID, userID);
}

// get all favorite team IDs of a user
function getFavTeamID(username) {
    const userID = getUserID(username);
    const sql = `
        SELECT team_id
        FROM favorite
        WHERE user_id = ?;
    `;
    return db.prepare(sql).all(userID).map(team => team.team_id);
}

// get favorite team names of a user
function getFavTeamNames(username) {
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
}

// get all favorite team information of a user
function getAllFavTeamInfo(username) {
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
    return teamInfo;
}

// get a teams id 
function getTeamID(team_name) {
    const sql = `
        SELECT team_id
        FROM team
        WHERE team_name = ?
    `;
    const team = db.prepare(sql).get(team_name);
    if (team) {
        return team.team_id;
    } else {
        return null;
    }
}

// remove selected team from favorite 
function removeTeamFromFav(username, team_name) {
    let user_id = getUserID(username);
    let team_id = getTeamID(team_name);
    const sql = `
        DELETE FROM favorite
        WHERE user_id = ? AND team_id = ?
    `;
    db.prepare(sql).run(user_id, team_id);
}

module.exports = {
    insertTeamManually,
    insertTeam,
    addTeamToFavs,
    getFavTeamID,
    getFavTeamNames,
    getAllFavTeamInfo,
    getTeamID,
    removeTeamFromFav
};
