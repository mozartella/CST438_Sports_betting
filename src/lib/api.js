// src/lib/api.js
import { Platform } from 'react-native';

const defaultBase =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8080'   // Android emulator -> host machine
    : 'http://localhost:8080'; // iOS simulator / web on same machine

export const API_BASE = process.env.EXPO_PUBLIC_API_BASE || defaultBase;

async function toJson(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

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

  // keep/add your other endpoints here as needed
  events: async () => toJson(await fetchWithCreds(`${API_BASE}/api/events`)),
};
