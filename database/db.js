import * as SQLite from 'expo-sqlite';

let db; // Declare db variable

// Reference Documentation = https://docs.expo.dev/versions/latest/sdk/sqlite/

// I was having issues when all the files were separated so I put everything in one
// Willing to separate out again
// Initialize database and create tables
export async function initializeDatabase() {

    // Prevent opening the database multiple times (THIS WAS A PROBLEM)
    if (!db) { 
        db = await SQLite.openDatabaseAsync('database.db');
        
        // This part can be commented out. Was to test to see if users were being added
        // SQLite extension can't see the contents of a database stored on the emulator in react
        // try {
        //     const users = await db.getAllAsync('SELECT * FROM user');
        //     console.log('Current users in database:', users);
        // } catch (error) {
        //     console.error('Error fetching users:', error);
        // }

        await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS user (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS team (
                team_id INTEGER PRIMARY KEY,
                team_name TEXT NOT NULL,
                nickname TEXT NOT NULL,
                logo_url TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS favorite (
                team_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                PRIMARY KEY (user_id, team_id),
                FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
                FOREIGN KEY (team_id) REFERENCES team(team_id) ON DELETE CASCADE
            );
        `);
    }
}
// -------------------------------- userTableFunctions ------------------------------------------
// Insert a new user into the database
export async function insertUser(username, password) {
    await initializeDatabase();  
    await db.runAsync(
        `INSERT INTO user (username, password) VALUES (?, ?);`,
        username,
        password
    );
}

// Verify login info
export async function verifyUserLogin(username, password) {
    await initializeDatabase();  // Ensure database is initialized
    try {
        const user = await db.getFirstAsync(
            'SELECT password FROM user WHERE username = $username', 
            { $username: username }
        );

        console.log('User from verifyUserLogin:', user);

        if (user) {
            if (user.password === password) {
                console.log('Login successful');
                return true;
            } else {
                console.log('Invalid password');
                return false;
            }
        } else {
            console.log('User not found');
            return false;
        }
    } catch (error) {
        console.error("Login verification failed:", error);
        return false;
    }
}

// For account recovery
export async function updatePassword(username, oldPassword, newPassword) {
    await initializeDatabase();  // Ensure database is initialized
    await db.runAsync(
        `UPDATE user SET password = ? WHERE username = ? AND password = ?;`,
        newPassword,
        username,
        oldPassword
    );
}

// For ensuring usernames are unique
export async function isUsernameAvailable(username) {
    await initializeDatabase();  // Ensure database is initialized
    const user = await db.getFirstAsync(
        `SELECT username FROM user WHERE username = ?;`,
        username
    );
    return !user;
}

// Remove a user from the database
export async function removeUser(username) {
    await initializeDatabase();  // Ensure database is initialized
    await db.runAsync(`DELETE FROM user WHERE username = ?;`, username);
}

// Get user ID based on username
export async function getUserID(username) {
    await initializeDatabase();  // Ensure database is initialized
    const user = await db.getFirstAsync(
        `SELECT id FROM user WHERE username = ?;`,
        username
    );
    return user ? user.id : null;
}

// Call initializeDatabase() when app is loaded
initializeDatabase();

// -------------------------------- userTableFunctions END ------------------------------------------

// ---------------------------------- Team DB Functions ---------------------------------------------
// Insert a team manually

export async function insertTeamManually(team_id, team_name, nickname, logo_url) {
    await db.runAsync(
        `INSERT INTO team (team_id, team_name, nickname, logo_url) VALUES (?, ?, ?, ?);`,
        team_id,
        team_name,
        nickname,
        logo_url
    );
}

// Insert a team using an array
export async function insertTeam([team_id, team_name, nickname, logo_url]) {
    await db.runAsync(
        `INSERT INTO team (team_id, team_name, nickname, logo_url) VALUES (?, ?, ?, ?);`,
        team_id,
        team_name,
        nickname,
        logo_url
    );
}

// Add a team to a user's favorites
export async function addTeamToFavs(username, team_name) {
    const userID = await getUserID(username);
    const teamID = await getTeamID(team_name);

    if (userID && teamID) {
        await db.runAsync(
            `INSERT INTO favorite (team_id, user_id) VALUES (?, ?);`,
            teamID,
            userID
        );
    }
}

// Get all favorite team IDs of a user
export async function getFavTeamID(username) {
    const userID = await getUserID(username);
    const teams = await db.getAllAsync(
        `SELECT team_id FROM favorite WHERE user_id = ?;`,
        userID
    );
    return teams.map(team => team.team_id);
}

// Get favorite team names of a user
export async function getFavTeamNames(username) {
    const team_ids = await getFavTeamID(username);
    let names = [];

    for (const team_id of team_ids) {
        const team = await db.getFirstAsync(
            `SELECT team_name FROM team WHERE team_id = ?;`,
            team_id
        );
        if (team) {
            names.push(team.team_name);
        }
    }
    return names;
}

// Get all favorite team information of a user
export async function getAllFavTeamInfo(username) {
    const team_ids = await getFavTeamID(username);
    let teamInfo = [];

    for (const team_id of team_ids) {
        const team = await db.getFirstAsync(
            `SELECT team_id, team_name, nickname, logo_url FROM team WHERE team_id = ?;`,
            team_id
        );
        if (team) {
            teamInfo.push([team.team_id, team.team_name, team.nickname, team.logo_url]);
        }
    }
    return teamInfo;
}

// Get a team's ID 
export async function getTeamID(team_name) {
    const team = await db.getFirstAsync(
        `SELECT team_id FROM team WHERE team_name = ?;`,
        team_name
    );
    return team ? team.team_id : null;
}

// Remove selected team from favorites 
export async function removeTeamFromFav(username, team_name) {
    const user_id = await getUserID(username);
    const team_id = await getTeamID(team_name);

    if (user_id && team_id) {
        await db.runAsync(
            `DELETE FROM favorite WHERE user_id = ? AND team_id = ?;`,
            user_id,
            team_id
        );
    }
}

// ---------------------------------- Team DB Functions END ---------------------------------------------