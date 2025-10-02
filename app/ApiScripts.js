// app/ApiScripts.js
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
  }
  return res.json();
}

/** BACKEND CALLS **/

export async function getEvents() {
  const res = await fetch(`${API_BASE}/api/events`);
  return toJson(res);
}

export async function getEvent(id) {
  const res = await fetch(`${API_BASE}/api/events/${id}`);
  return toJson(res);
}

export async function getEventOdds(id) {
  const res = await fetch(`${API_BASE}/api/events/${id}/odds`);
  return toJson(res);
}

export async function placeBet({ userId, eventId, selection, stakeCents }) {
  const res = await fetch(`${API_BASE}/api/bets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, eventId, selection, stakeCents }),
  });
  return toJson(res);
}

export async function getUserBets(userId) {
  const res = await fetch(`${API_BASE}/api/users/${userId}/bets`);
  return toJson(res);
}

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
