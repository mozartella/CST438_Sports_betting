import React, { useEffect, useMemo, useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

type Team = { id: string; name: string; league: string };

// ⚾️ Add/trim teams here (sample across leagues)
const ALL_TEAMS: Team[] = [
  // NBA
  { id: "NBA-LAL", name: "Los Angeles Lakers", league: "NBA" },
  { id: "NBA-GSW", name: "Golden State Warriors", league: "NBA" },
  { id: "NBA-BOS", name: "Boston Celtics", league: "NBA" },
  { id: "NBA-NYK", name: "New York Knicks", league: "NBA" },
  // NFL
  { id: "NFL-SF", name: "San Francisco 49ers", league: "NFL" },
  { id: "NFL-KC", name: "Kansas City Chiefs", league: "NFL" },
  { id: "NFL-DAL", name: "Dallas Cowboys", league: "NFL" },
  // MLB
  { id: "MLB-LAD", name: "Los Angeles Dodgers", league: "MLB" },
  { id: "MLB-NYY", name: "New York Yankees", league: "MLB" },
  // MLS (example)
  { id: "MLS-LAFC", name: "Los Angeles FC", league: "MLS" },
];

const STORAGE_KEY = "favoriteTeamIds:v1";

export default function FavoriteTeamsScreen() {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // Load saved favorites
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setFavoriteIds(new Set(JSON.parse(raw)));
      } catch {}
    })();
  }, []);

  // Persist on change
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...favoriteIds]));
      } catch {}
    })();
  }, [favoriteIds]);

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  // Sort: favorites first (alphabetical within groups)
  const data = useMemo(() => {
    const arr = [...ALL_TEAMS];
    arr.sort((a, b) => {
      const aFav = favoriteIds.has(a.id) ? 1 : 0;
      const bFav = favoriteIds.has(b.id) ? 1 : 0;
      if (aFav !== bFav) return bFav - aFav; // favorites to top
      // then by league, then name (nice & stable)
      if (a.league !== b.league) return a.league.localeCompare(b.league);
      return a.name.localeCompare(b.name);
    });
    return arr;
  }, [favoriteIds]);

  const renderItem = ({ item }: { item: Team }) => {
    const isFav = favoriteIds.has(item.id);
    return (
      <View style={styles.row}>
        <View style={styles.textWrap}>
          <Text style={styles.team}>{item.name}</Text>
          <Text style={styles.league}>{item.league}</Text>
        </View>

        <TouchableOpacity
          onPress={() => toggleFavorite(item.id)}
          accessibilityRole="button"
          accessibilityLabel={isFav ? "Unfavorite" : "Favorite"}
          style={styles.heartBtn}
        >
          <Ionicons
            name={isFav ? "heart" : "heart-outline"}
            size={24}
            // no custom colors needed; platform default is fine
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Teams</Text>

      {Array.from(favoriteIds).length > 0 && (
        <Text style={styles.helper}>Your favorites are pinned at the top.</Text>
      )}

      <FlatList
        data={data}
        keyExtractor={(t) => t.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        contentContainerStyle={styles.listPad}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 16 },
  title: { fontSize: 22, fontWeight: "700", paddingHorizontal: 16, marginBottom: 6 },
  helper: { fontSize: 13, opacity: 0.6, paddingHorizontal: 16, marginBottom: 8 },
  listPad: { paddingHorizontal: 8, paddingBottom: 24 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  sep: { height: 1, backgroundColor: "rgba(0,0,0,0.06)", marginLeft: 16 },
  textWrap: { flex: 1, paddingRight: 8 },
  team: { fontSize: 16, fontWeight: "600" },
  league: { fontSize: 12, opacity: 0.6, marginTop: 2 },
  heartBtn: { padding: 8, borderRadius: 999 },
});
