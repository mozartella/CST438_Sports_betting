import { Platform } from 'react-native';

// Choose a sensible default per platform,
// and let EXPO_PUBLIC_API_BASE override it if set.
const defaultBase =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8080'       // Android emulator -> host
    : 'http://localhost:8080';     // iOS simulator / web on same machine

export const API_BASE = process.env.EXPO_PUBLIC_API_BASE || defaultBase;

async function json(res){
  if(!res.ok){
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

export const api = {
  events: async () => json(await fetch(`${API_BASE}/api/events`)),
  event: async (id) => json(await fetch(`${API_BASE}/api/events/${id}`)),
  eventOdds: async (id) => json(await fetch(`${API_BASE}/api/events/${id}/odds`)),
  placeBet: async ({ userId, eventId, selection, stakeCents }) =>
    json(await fetch(`${API_BASE}/api/bets`,{
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ userId, eventId, selection, stakeCents })
    })),
  myBets: async (userId) => json(await fetch(`${API_BASE}/api/users/${userId}/bets`)),
};
