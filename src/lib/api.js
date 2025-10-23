// src/lib/api.js
import { Platform } from 'react-native';

// Default base URL by platform; env var can override
const defaultBase =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8080'   // Android emulator -> host machine
    : 'http://localhost:8080'; // iOS simulator / web on same machine

export const API_BASE = process.env.EXPO_PUBLIC_API_BASE || defaultBase;

// Fetch wrapper that throws on non-2xx and returns JSON
async function toJson(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

// Include credentials on web so cookies flow with requests
const fetchWithCreds = (url, opts = {}) =>
  fetch(url, {
    credentials: 'include',
    ...opts,
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
  });

export const API = {
  BASE: API_BASE,
  LOGIN: `${API_BASE}/oauth2/authorization/github`,
  LOGOUT: `${API_BASE}/logout`,
  ME: `${API_BASE}/api/me`,

  // ---- sample endpoints (keep/edit as your API provides) ----
  events: async () => toJson(await fetchWithCreds(`${API_BASE}/api/events`)),
  event: async (id) => toJson(await fetchWithCreds(`${API_BASE}/api/events/${id}`)),
  eventOdds: async (id) => toJson(await fetchWithCreds(`${API_BASE}/api/events/${id}/odds`)),
  placeBet: async ({ userId, eventId, selection, stakeCents }) =>
    toJson(
      await fetchWithCreds(`${API_BASE}/api/bets`, {
        method: 'POST',
        body: JSON.stringify({ userId, eventId, selection, stakeCents }),
      })
    ),
  myBets: async (userId) => toJson(await fetchWithCreds(`${API_BASE}/api/users/${userId}/bets`)),
};
