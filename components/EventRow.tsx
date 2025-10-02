// app/components/EventRow.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Pressable, ActivityIndicator } from "react-native";
import { getEventOdds, placeBet } from "../ApiScripts";

type Props = {
  event: {
    id: number;
    league: string;
    home_team: string;
    away_team: string;
    start_time: string;
    status: string; // SCHEDULED / FINISHED...
  };
  userId?: number; // temp until OAuth
};

export default function EventRow({ event, userId = 1 }: Props) {
  const [odds, setOdds] = useState<Array<{ id: number; selection: "HOME" | "AWAY"; american: number; decimal: number }>>([]);
  const [loadingOdds, setLoadingOdds] = useState(true);
  const [placing, setPlacing] = useState<"HOME" | "AWAY" | null>(null);
  const isOpen = event.status?.toUpperCase() === "SCHEDULED";

  useEffect(() => {
    let mounted = true;
    setLoadingOdds(true);
    getEventOdds(event.id)
      .then(data => { if (mounted) setOdds(data); })
      .catch(err => { if (mounted) Alert.alert("Error loading odds", String(err.message || err)); })
      .finally(() => { if (mounted) setLoadingOdds(false); });
    return () => { mounted = false; };
  }, [event.id]);

  async function onBet(selection: "HOME" | "AWAY") {
    try {
      setPlacing(selection);
      const res = await placeBet({
        userId,
        eventId: event.id,
        selection,
        stakeCents: 2500, // $25 fixed for demo — change later to user input
      });
      Alert.alert("Success", `Bet placed! id=${res.id}`);
    } catch (e: any) {
      Alert.alert("Bet failed", String(e?.message || e));
    } finally {
      setPlacing(null);
    }
  }

  return (
    <View style={styles.card}>
      <Text style={styles.matchup}>
        {event.league}: {event.home_team} vs {event.away_team}
      </Text>
      <Text style={styles.meta}>{new Date(event.start_time).toLocaleString()} • {event.status}</Text>

      {loadingOdds ? (
        <View style={styles.row}><ActivityIndicator /></View>
      ) : (
        <View style={styles.row}>
          {odds.map(o => (
            <Pressable
              key={o.id}
              onPress={() => onBet(o.selection)}
              disabled={!isOpen || placing !== null}
              style={[styles.btn, (!isOpen || placing !== null) && styles.btnDisabled]}
            >
              <Text style={styles.btnText}>
                Bet {o.selection} ({o.american >= 0 ? `+${o.american}` : o.american})
              </Text>
            </Pressable>
          ))}
          {odds.length === 0 && <Text style={{ color: "#b91c1c" }}>No odds available</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 12, borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 8, marginBottom: 10 },
  matchup: { fontWeight: "700", marginBottom: 4 },
  meta: { color: "#6b7280", marginBottom: 8 },
  row: { flexDirection: "row", gap: 8, alignItems: "center" },
  btn: { backgroundColor: "#1e40af", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: "#fff", fontWeight: "600" },
});
