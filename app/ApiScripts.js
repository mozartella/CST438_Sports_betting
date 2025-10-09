// app/ApiScripts.js
<<<<<<< HEAD
import { Platform } from "react-native";

// Default base URL by platform; EXPO_PUBLIC_API_BASE can override
const defaultBase =
  Platform.OS === "android"
    ? "http://10.0.2.2:8080"   // Android emulator -> host machine
    : "http://localhost:8080"; // iOS simulator / web on same machine

export const API_BASE = process.env.EXPO_PUBLIC_API_BASE || defaultBase;

async function toJson(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
=======

// 1) Base URL
// - Uses EXPO_PUBLIC_API_BASE if you set it when starting Metro
// - Otherwise falls back to your *working* Heroku URL
const ENV_BASE = (process.env.EXPO_PUBLIC_API_BASE || "").replace(/\/+$/, "");
const DEFAULT_BASE = "https://sportsbook-api-lester-efa829183023.herokuapp.com";
const API_BASE = ENV_BASE || DEFAULT_BASE;

// 2) Shared JSON helper (nice error messages on non-2xx)
async function toJson(res) {
  if (!res.ok) {
    let msg = res.statusText;
    try { msg = await res.text(); } catch {}
    throw new Error(`HTTP ${res.status}: ${msg}`);
>>>>>>> Heroku-Set-Up
  }
  return res.json();
}

<<<<<<< HEAD
/** BACKEND CALLS **/

export async function getEvents() {
=======
// 3) Core API calls to your Spring Boot backend (Heroku)
async function getEvents() {
>>>>>>> Heroku-Set-Up
  const res = await fetch(`${API_BASE}/api/events`);
  return toJson(res);
}

<<<<<<< HEAD
export async function getEvent(id) {
=======
async function getEvent(id) {
>>>>>>> Heroku-Set-Up
  const res = await fetch(`${API_BASE}/api/events/${id}`);
  return toJson(res);
}

<<<<<<< HEAD
export async function getEventOdds(id) {
=======
async function getEventOdds(id) {
>>>>>>> Heroku-Set-Up
  const res = await fetch(`${API_BASE}/api/events/${id}/odds`);
  return toJson(res);
}

<<<<<<< HEAD
export async function placeBet({ userId, eventId, selection, stakeCents }) {
=======
async function placeBet({ userId, eventId, selection, stakeCents }) {
>>>>>>> Heroku-Set-Up
  const res = await fetch(`${API_BASE}/api/bets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, eventId, selection, stakeCents }),
  });
  return toJson(res);
}

<<<<<<< HEAD
export async function getUserBets(userId) {
=======
async function getUserBets(userId) {
>>>>>>> Heroku-Set-Up
  const res = await fetch(`${API_BASE}/api/users/${userId}/bets`);
  return toJson(res);
}

<<<<<<< HEAD
/** OPTIONAL COMPAT SHIMS (so existing imports don’t explode) **/

// If the template calls this, map it to your /api/events and filter by date string (YYYY-MM-DD).
export async function callGamesByDate(dateStr) {
  const events = await getEvents();
  // Filter by date (assuming start_time is ISO string)
  return events.filter(e => new Date(e.start_time).toISOString().slice(0, 10) === dateStr)
               .map(e => ({
                 id: String(e.id),
                 date: new Date(e.start_time),
                 homeTeam: { name: e.home_team },
                 awayTeam: { name: e.away_team },
               }));
}

// If favoriteTeams still imports callTeams from ApiScripts, you can either:
//  1) keep its current SQLite flow, or
//  2) return [] here and let the screen fall back.
// We'll return [] to avoid hitting RapidAPI.
export async function callTeams() {
  return [];
}
=======
function getBase() { return API_BASE; }

// 4) Compatibility shims for template code
// Some screens from the template call these names:
async function callTeams() {
  // Map to your events feed so template list pages still render
  return getEvents();
}
async function callOdds(eventId) {
  return getEventOdds(eventId);
}

// 5) Exports (default + named)
const api = {
  getBase, getEvents, getEvent, getEventOdds, placeBet, getUserBets,
  callTeams, callOdds
};
export default api;
export {
  getBase, getEvents, getEvent, getEventOdds, placeBet, getUserBets,
  callTeams, callOdds
};

>>>>>>> Heroku-Set-Up
