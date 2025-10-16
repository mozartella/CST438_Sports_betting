// app/(tabs)/index.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import UpcomingGames from "../UpcomingGames"; // <-- if UpcomingGames.tsx lives at app/UpcomingGames.tsx
export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upcoming Events</Text>
      <UpcomingGames />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(155, 216, 243, 1)",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#25292e",
    marginBottom: 16,
    textAlign: "center",
  },
});
