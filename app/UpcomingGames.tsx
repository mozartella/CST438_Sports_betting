// app/UpcomingGames.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import api from "./ApiScripts";
import Ionicons from "@expo/vector-icons/Ionicons";

type Event = {
  id: number;
  league: string;
  home_team: string;
  away_team: string;
  start_time: string;
  status: string;
};

export default function UpcomingGames() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      const base = api.getBase();
      console.log("API base in app:", base);

      // Timeout guard
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 12000);

      try {
        // Use the same code as ApiScripts.getEvents, but with extra logging
        const url = `${base.replace(/\/+$/, "")}/api/events`;
        console.log("Fetching:", url);
        const res = await fetch(url, { signal: ctrl.signal });

        console.log("Fetch status:", res.status);
        const text = await res.text(); // read once
        console.log("Fetch body (first 200):", text.slice(0, 200));

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${text}`);
        }
        const data: Event[] = JSON.parse(text);

        if (!cancelled) setEvents(data);
      } catch (err: any) {
        if (!cancelled) {
          const msg =
            err?.name === "AbortError"
              ? "Request timed out. Check your network and API base."
              : err?.message ?? "Failed to fetch events";
          console.error("Events fetch failed:", err);
          setError(msg);
        }
      } finally {
        clearTimeout(t);
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" />;
  }

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {events.length === 0 ? (
        <View style={{ alignItems: "center", marginTop: 32 }}>
    <Ionicons
      name="basketball-outline"
      size={70}
      color="#00BFFF"
      style={{ marginBottom: 8 }}
    />
        <Text style={styles.empty}>No Upcoming Events</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => String(item.id)}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.league}>{item.league}</Text>
              <Text style={styles.matchup}>
                {item.home_team} vs {item.away_team}
              </Text>
              <Text style={styles.meta}>
                {new Date(item.start_time).toLocaleString()} • {item.status}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 4 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { color: "red", marginBottom: 8 },
  empty: { 
    fontSize: 18,
    textAlign: "center",
    marginTop: 32,
    paddingHorizontal: 16,
    color: "#000BFFF",
    backgroundColor: "#f0f8ff",
    borderRadius: 12,
    paddingVertical: 12,
    fontWeight: "bold",
   },
  card: {
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    backgroundColor: "#fafafa",
  },
  league: { fontSize: 12, color: "#6b7280", marginBottom: 4 },
  matchup: { fontSize: 18, fontWeight: "600" },
  meta: { fontSize: 12, color: "#6b7280", marginTop: 4 },
});
