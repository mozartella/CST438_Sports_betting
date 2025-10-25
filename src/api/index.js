// src/api/index.js
import { Platform } from "react-native";

/** ---------- Bases ---------- **/
const LOCAL_BASE =
  Platform.OS === "android" ? "http://10.0.2.2:8080" : "http://localhost:8080";

const HEROKU_BASE =
  "https://sportsbook-api-lester-efa829183023.herokuapp.com";

/**
 * Some older screens in your app log/use `API.BASE`.
 * We keep it for compatibility (points to LOCAL unless overridden).
 * New code should use EVENTS_BASE / BETS_BASE which point at Heroku.
 */
export const BASE = process.env.EXPO_PUBLIC_API_BASE || LOCAL_BASE;
export const EVENTS_BASE = HEROKU_BASE;
export const BETS_BASE = HEROKU_BASE;

async function toJson(res) {
  if (!res.ok) {
    let msg = res.statusText;
    try { msg = await res.text(); } catch {}
    throw new Error(`HTTP ${res.status} — ${msg}`);
  }
  // some endpoints may return 204
  try { return await res.json(); } catch { return null; }
}

/** ---------- Events (named exports) ---------- **/
export async function events() {
  // GET /api/events (Heroku)
  return toJson(await fetch(`${EVENTS_BASE}/api/events`));
}

export async function getEvent(eventId) {
  return toJson(await fetch(`${EVENTS_BASE}/api/events/${eventId}`));
}

export async function getEventOdds(eventId) {
  // Optional endpoint; if not present on backend, you can remove this call.
  return toJson(await fetch(`${EVENTS_BASE}/api/events/${eventId}/odds`));
}

/** ---------- Bets (named export) ---------- **/
export async function placeBet(input) {
  // Expected shape:
  // { eventId: number, selection: 'HOME'|'AWAY'|'DRAW', oddsDecimal: number, stake: number, bettorRef?: string, userId?: number }
  const res = await fetch(`${BETS_BASE}/api/bets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Add Authorization header if your API needs it:
    // headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify(input),
  });
  return toJson(res);
}

/** ---------- Default export for legacy imports ---------- **/
const API = {
  // keep legacy BASE so code like `API.BASE` won’t crash
  BASE,
  // new bases
  EVENTS_BASE,
  BETS_BASE,
  // funcs
  events,
  getEvent,
  getEventOdds,
  placeBet,
};

export default API;
