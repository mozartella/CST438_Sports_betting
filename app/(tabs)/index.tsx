// app/(tabs)/index.tsx
import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Text, Pressable } from "react-native";
import { getEvents } from "../ApiScripts"; // NEW
// ... keep your other imports

export default function IndexScreen() {
  const [events, setEvents] = useState<any[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    getEvents()
      .then(data => mounted && setEvents(data))
      .catch(e => mounted && setError(e));
    return () => { mounted = false; };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Events</Text>
      {error && <Text style={{ color: "red" }}>{String(error.message || error)}</Text>}
      <FlatList
        data={events}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => {/* navigate to a detail/view */}}>
            <Text style={styles.matchup}>{item.league}: {item.home_team} vs {item.away_team}</Text>
            <Text style={styles.meta}>{new Date(item.start_time).toLocaleString()} • {item.status}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  card: { padding: 12, borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 8, marginBottom: 10 },
  matchup: { fontWeight: "700", marginBottom: 4 },
  meta: { color: "#6b7280" },
});
