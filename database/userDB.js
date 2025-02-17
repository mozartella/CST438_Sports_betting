const { db } = require('./db');
// insert a new user into the database
function insertUser(username, password) {
    const sql = `
        INSERT INTO user (username, password)
        VALUES (?, ?);
    `;
    db.prepare(sql).run(username, password);
}
// varify login info
function verifyUserLogin(username, password) {
    const sql = `
        SELECT password
        FROM user
        WHERE username = ?;
    `;
    const user = db.prepare(sql).get(username);
    if ((user) && user.password == password) {
        return true;
    } else {
        return false;
    }
}
// for account recovery
function updatePassword(username, oldPassword, newPassword) {
    const sql = `
        UPDATE user
        SET password = ?
        WHERE username = ? AND password = ?;
    `;
    db.prepare(sql).run(newPassword, username, oldPassword);
}
// for ensuring usernames are unique
function isUsernameAvailable(username) {
    const sql = `
        SELECT username
        FROM user
        WHERE username = ?;
    `;
    const user = db.prepare(sql).get(username);
    if (user) {
        return false;
    } else {
        return true;
    }
}
// remove a user from the database
function removeUser(username) {
    const sql = `
        DELETE FROM user
        WHERE username = ?;
    `;
    db.prepare(sql).run(username);
}
// get user ID based on username
function getUserID(username) {
    const sql = `
        SELECT id
        FROM user
        WHERE username = ?;
    `;
    const user = db.prepare(sql).get(username);
    if (user) {
        return user.id;
    } else {
        return null;
    }
}
module.exports = {
    insertUser,
    verifyUserLogin,
    updatePassword,
    isUsernameAvailable,
    removeUser,
    getUserID
};







