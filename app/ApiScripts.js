<<<<<<< Updated upstream
export const apiCall = async (endpoint) => {
  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "x-rapidapi-key": "f48a5921f5msh580809ba8c9e6cfp181a8ajsn545d715d6844",
        "x-rapidapi-host": "api-nba-v1.p.rapidapi.com",
      },
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
    return null;
=======
// app/ApiScripts.js

const API_BASE = (process.env.EXPO_PUBLIC_API_BASE || "http://10.0.2.2:8080").replace(/\/+$/, "");

async function toJson(res) {
  if (!res.ok) {
    let msg = res.statusText;
    try { msg = await res.text(); } catch {}
    throw new Error(`HTTP ${res.status}: ${msg}`);
>>>>>>> Stashed changes
  }
};
export const callTeams = async () => {
  try {
    const json = await apiCall(
      "https://api-nba-v1.p.rapidapi.com/teams?league=standard"
    );
    if (!json || !json.response) {
      throw new Error("Invalid API response");
    }
    // Create the teamData array with below structure
    const teamData = json.response
      // I want to filter out teams that aren't nbaFranchises (you would think I could use the league filter, but it isn't an option)
      // I want to check the nbaFranchise field and return a new array populated only with teams where this field is true
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
      .filter((team) => team.nbaFranchise === true)
      // I also want to sort out specific information.
      // This may change depending on what we need. For now, it will map out the fields we use in our table
      .map((team) => ({
        id: team.id,
        name: team.name,
        nickname: team.nickname,
        logo: team.logo,
      }));

<<<<<<< Updated upstream
    //console.log("teamData:", teamData);
    return teamData;
  } catch (error) {
    console.error("Error fetching teams:", error);
    return [];
  }
};
export const callGamesByDate = async (startDate, endDate, teamID) => {
  try {
    const json = await apiCall(
      `https://api-nba-v1.p.rapidapi.com/games?league=standard&season=2024&team=${teamID}`
    );
    if (!json || !json.response) {
      throw new Error("Invalid API response");
    }
    // Filter games based on the provided date range. It was a lot easier to filter out games outside the range
    // than to select each date in the range and check.
    // this also prevents having to check if there is a game on a specific date
    const gameData = json.response
      .filter((game) => {
        const gameDate = new Date(game.date.start);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return gameDate >= start && gameDate <= end;
      })
      // I think I could make call Teams redundant with this stuff at some point.
      .map((game) => ({
        id: game.id,
        date: new Date(game.date.start),
        homeTeam: {
          id: game.teams.home.id,
          name: game.teams.home.name,
          nickname: game.teams.home.nickname,
          logo: game.teams.home.logo,
        },
        awayTeam: {
          id: game.teams.visitors.id,
          name: game.teams.visitors.name,
          nickname: game.teams.visitors.nickname,
          logo: game.teams.visitors.logo,
        },
      }));
    return gameData; // Return the filtered and mapped game data
  } catch (error) {
    console.error("Error fetching games:", error);
    return [];
  }
};
=======
/* Core helpers */
async function getEvents() {
  const res = await fetch(`${API_BASE}/api/events`);
  return toJson(res);
}

async function getEvent(id) {
  const res = await fetch(`${API_BASE}/api/events/${id}`);
  return toJson(res);
}

async function getEventOdds(id) {
  const res = await fetch(`${API_BASE}/api/events/${id}/odds`);
  return toJson(res);
}

async function placeBet({ userId, eventId, selection, stakeCents }) {
  const res = await fetch(`${API_BASE}/api/bets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, eventId, selection, stakeCents }),
  });
  return toJson(res);
}

async function getUserBets(userId) {
  const res = await fetch(`${API_BASE}/api/users/${userId}/bets`);
  return toJson(res);
}

function getBase() { return API_BASE; }

/* 🔧 Compatibility shims for the template */
async function callTeams() {              // template expects this
  return getEvents();
}
async function callOdds(eventId) {        // if template calls this name
  return getEventOdds(eventId);
}

/* Default + named exports */
const api = { getBase, getEvents, getEvent, getEventOdds, placeBet, getUserBets, callTeams, callOdds };
export default api;
export { getBase, getEvents, getEvent, getEventOdds, placeBet, getUserBets, callTeams, callOdds };

>>>>>>> Stashed changes
