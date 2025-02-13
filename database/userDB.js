const express = require('express');
const cors = require('cors');
const { db } = require('./db'); 

const app = express();
app.use(express.json());
app.use(cors());


function insertUser(username, password) {
    const sql = `INSERT INTO user (username, password) VALUES (?, ?);`;
    db.prepare(sql).run(username, password);
}


function verifyUserLogin(username, password) {
    const sql = `SELECT password FROM user WHERE username = ?;`;
    const user = db.prepare(sql).get(username);
    return user && user.password === password;
}


function updatePassword(username, oldPassword, newPassword) {
    const sql = `UPDATE user SET password = ? WHERE username = ? AND password = ?;`;
    db.prepare(sql).run(newPassword, username, oldPassword);
}


function isUsernameAvailable(username) {
    const sql = `SELECT username FROM user WHERE username = ?;`;
    const user = db.prepare(sql).get(username);
    return user == null;
}


function removeUser(username) {
    const sql = `DELETE FROM user WHERE username = ?;`;
    db.prepare(sql).run(username);
}


function getUserID(username) {
    const sql = `SELECT id FROM user WHERE username = ?;`;
    return db.prepare(sql).get(username)?.id;
}


app.post('/register', (req, res) => {
    console.log(" Incoming registration request:", req.body);
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    if (!isUsernameAvailable(username)) {
        return res.status(400).json({ error: "Username already exists" });
    }

    try {
        insertUser(username, password);
        console.log(` User ${username} registered successfully!`);
        res.json({ success: true });
    } catch (error) {
        console.error(" Error inserting user:", error);
        res.status(500).json({ error: "Server error" });
    }
});

/* 🔹 API: User Login */
app.post('/login', (req, res) => {
    console.log(" Checking login for:", req.body);
    const { username, password } = req.body;

    if (verifyUserLogin(username, password)) {
        console.log(`Login successful for ${username}`);
        res.json({ success: true });
    } else {
        console.log(" Invalid username or password");
        res.status(401).json({ error: "Invalid username or password" });
    }
});

/* 🔹 Start the Server */
const PORT = 8082;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


module.exports = {
    insertUser,
    verifyUserLogin,
    updatePassword,
    isUsernameAvailable,
    removeUser,
    getUserID
};
