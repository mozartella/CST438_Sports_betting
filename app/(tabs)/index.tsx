// app/(tabs)/index.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import UpcomingGames from "../UpcomingGames";

export default function Home() {
  return (
    <FlatList
      data={[{ key: "header" }]}
      renderItem={null}
      ListHeaderComponent={
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>🏆 BetSmart</Text>
            <Text style={styles.subtitle}>Your Sports Betting Companion</Text>
          </View>

          {/* BANNER */}
          <View style={styles.banner}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
              }}
              style={styles.bannerImage}
            />
            <View style={styles.bannerOverlay}>
              <Text style={styles.bannerText}>Big Match Weekend!</Text>
              <TouchableOpacity style={styles.betNowButton}>
                <Text style={styles.betNowText}>Place Bets</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* UPCOMING GAMES SECTION */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Upcoming Games</Text>
          </View>
          <UpcomingGames />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(155, 216, 243, 1)",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerContainer: {
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "#1E1E1E",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
  },
  subtitle: {
    color: "#B0B0B0",
    marginTop: 4,
  },
  banner: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  bannerImage: {
    width: "100%",
    height: 160,
    borderRadius: 16,
  },
  bannerOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  bannerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  betNowButton: {
    backgroundColor: "#FFD700",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  betNowText: {
    color: "#000",
    fontWeight: "600",
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8,
  },
});

