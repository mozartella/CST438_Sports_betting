// src/lib/api.js
import { Platform } from 'react-native';

const defaultAuthBase =
  Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';

const defaultHerokuBase =
  'https://sportsbook-api-lester-efa829183023.herokuapp.com';

export const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE || defaultAuthBase;

export const EVENTS_BASE =
  process.env.EXPO_PUBLIC_EVENTS_BASE || defaultHerokuBase;

export const BETS_BASE =
  process.env.EXPO_PUBLIC_BETS_BASE || defaultHerokuBase;

async function toJsonSafe(res) {
  if (!res.ok) {
    let msg = res.statusText;
    try { msg = await res.text(); } catch {}
    const err = new Error(`HTTP ${res.status} — ${msg}`);
    if (res.status === 401) err.name = 'Unauthorized';
    throw err;
  }
  try { return await res.json(); } catch { return null; }
}

export const API = {
  // bases (back-compat)
  BASE: API_BASE,
  EVENTS_BASE,
  BETS_BASE,

  // Events
  events: async () =>
    toJsonSafe(await fetch(`${EVENTS_BASE}/api/events`, { credentials: 'omit' })),

  // Not used for now (your API 500s on /api/events/:id)
  event: async (id) =>
    toJsonSafe(await fetch(`${EVENTS_BASE}/api/events/${id}`, { credentials: 'omit' })),

  // ---- NEW: list bets ----
  bets: async () =>
    toJsonSafe(await fetch(`${BETS_BASE}/api/bets`, { credentials: 'omit' })),

  // Place bet (defaults so API accepts it today)
  placeBet: async ({
    eventId,
    selection,           // "HOME" | "AWAY" | "DRAW"
    stake,
    oddsDecimal = 2.00,  // temporary default
    userId = 1,          // temporary default user
    bettorRef,
  }) =>
    toJsonSafe(
      await fetch(`${BETS_BASE}/api/bets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'omit',
        body: JSON.stringify({
          eventId,
          userId,
          selection,
          oddsDecimal,
          stake,
          ...(bettorRef ? { bettorRef } : {}),
        }),
      })
    ),
};

export default API;
