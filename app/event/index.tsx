// app/events/index.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as API from "../../src/api"; // adjust if your path is different

export default function EventsList() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const data = await API.events(); // -> Heroku /api/events
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        Alert.alert("Error", e?.message ?? "Failed to load events");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 24 }} />;
  }

  if (!items.length) {
    return (
      <View style={styles.center}>
        <Text>No events found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={{ padding: 12 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push(`/event/${item.id}`)}
        >
          <Text style={styles.title}>
            {(item.home_team ?? "Home")} vs {(item.away_team ?? "Away")}
          </Text>
          {"start_time" in item && item.start_time ? (
            <Text style={styles.sub}>{new Date(item.start_time).toLocaleString()}</Text>
          ) : null}
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  card: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  title: { fontSize: 16, fontWeight: "700" },
  sub: { marginTop: 4, color: "#666" },
});
