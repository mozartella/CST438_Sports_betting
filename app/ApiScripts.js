
// app/ApiScripts.js
// :one: Base URL setup
// - Uses EXPO_PUBLIC_API_BASE if you set it when starting Metro
// - Otherwise falls back to your working Heroku URL
const ENV_BASE = (process.env.EXPO_PUBLIC_API_BASE || "").replace(/\/+$/, "");
const DEFAULT_BASE = "https://sportsbook-api-lester-efa829183023.herokuapp.com";
const API_BASE = ENV_BASE || DEFAULT_BASE;
// :two: JSON helper for nicer error messages
async function toJson(res) {
  if (!res.ok) {
    let msg = res.statusText;
    try { msg = await res.text(); } catch {}
    throw new Error(`HTTP ${res.status}: ${msg}`);
  }
  return res.json();
}
// :three: Core API calls to your Spring Boot backend (Heroku)
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
function getBase() {
  return API_BASE;
}
// :four: Compatibility shims for older template calls
async function callTeams() {
  // Return events so template screens still render
  return getEvents();
}
async function callOdds(eventId) {
  return getEventOdds(eventId);
}
// :five: Exports (default + named)
const api = {
  getBase,
  getEvents,
  getEvent,
  getEventOdds,
  placeBet,
  getUserBets,
  callTeams,
  callOdds,
};
export default api;
export {
  getBase,
  getEvents,
  getEvent,
  getEventOdds,
  placeBet,
  getUserBets,
  callTeams,
  callOdds,
};
