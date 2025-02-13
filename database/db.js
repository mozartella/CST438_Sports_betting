const express = require('express');
const path = require('path');
const db = require('better-sqlite3')(path.join(__dirname, 'database.db'));

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Initialize database tables
function createTable() {
    const sql1 = `
        CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        );
    `;
    const sql2 = `
        CREATE TABLE IF NOT EXISTS team (
            team_id INTEGER PRIMARY KEY,
            team_name TEXT NOT NULL,
            nickname TEXT NOT NULL,
            logo_url TEXT NOT NULL
        );
    `; 
    const sql3 = `
        CREATE TABLE IF NOT EXISTS favorite (
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
}

createTable();

// Test route
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

