// app/event/[id].tsx
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import API, { API as NamedAPI } from '../../src/lib/api';

type Side = 'HOME' | 'AWAY' | 'DRAW';
type Bet = {
  id: number;
  eventId: number;
  userId: number;
  selection: Side;
  oddsDecimal: number;
  stake: number;
  bettorRef?: string | null;
  status?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

const Api = NamedAPI ?? API;
// keep in sync with API.placeBet default
const CURRENT_USER_ID = 1;

export default function EventDetail() {
  const { id, event: eventJson } = useLocalSearchParams<{ id: string, event?: string }>();
  const eventId = Number(id);

  const event = useMemo(() => {
    try { return eventJson ? JSON.parse(eventJson) : null; } catch { return null; }
  }, [eventJson]);

  const [selection, setSelection] = useState<Side | null>(null);
  const [stakeStr, setStakeStr] = useState('10');
  const [placing, setPlacing] = useState(false);

  const [bets, setBets] = useState<Bet[]>([]);
  const [loadingBets, setLoadingBets] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const homeLabel = event?.home_team ?? 'Home';
  const awayLabel = event?.away_team ?? 'Away';

  // ---- Load bets for this event (and current user) ----
  const loadBets = useCallback(async () => {
    try {
      const all = await Api.bets(); // array
      const filtered = (Array.isArray(all) ? all : []).filter(
        (b: Bet) => Number(b.eventId) === eventId && Number(b.userId) === CURRENT_USER_ID
      );
      // newest first
      filtered.sort((a, b) => {
        const ta = a.createdAt ? Date.parse(a.createdAt) : 0;
        const tb = b.createdAt ? Date.parse(b.createdAt) : 0;
        return tb - ta;
      });
      setBets(filtered);
    } catch (e) {
      // surface silently here; the main action is placing a bet
      console.warn('Failed to load bets:', e);
    } finally {
      setLoadingBets(false);
      setRefreshing(false);
    }
  }, [eventId]);

  useEffect(() => {
    loadBets();
  }, [loadBets]);

  async function placeBet() {
    if (!selection) return Alert.alert('Pick a side', 'Choose Home or Away');
    const stake = Number(stakeStr);
    if (!Number.isFinite(stake) || stake <= 0)
      return Alert.alert('Invalid stake', 'Enter a positive number');

    try {
      setPlacing(true);
      await Api.placeBet({
        eventId,
        selection,                 // "HOME" | "AWAY"
        stake,
        // oddsDecimal defaults to 2.00; userId defaults to 1
        bettorRef: `${selection}-${homeLabel}-vs-${awayLabel}`,
      });
      Alert.alert('Bet placed', `You bet $${stake.toFixed(2)} on ${selection}.`);
      setSelection(null);
      setStakeStr('10');
      // refresh "Your Bets" list
      setRefreshing(true);
      await loadBets();
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to place bet');
    } finally {
      setPlacing(false);
    }
  }

  const renderBet = ({ item }: { item: Bet }) => (
    <View style={styles.betRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.betMain}>
          #{item.id} • {item.selection} • ${item.stake.toFixed(2)} @ {item.oddsDecimal.toFixed(2)}
        </Text>
        <Text style={styles.betSub}>
          {item.status ?? 'PENDING'}{item.createdAt ? ` • ${new Date(item.createdAt).toLocaleString()}` : ''}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>{homeLabel} vs {awayLabel}</Text>
      <Text style={styles.meta}>
        {event?.league ? `${event.league} • ` : ''}{event?.start_time ? new Date(event.start_time).toLocaleString() : ''}
      </Text>

      <View style={{ height: 14 }} />

      <Text style={styles.h2}>Pick a side</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.pill, selection === 'HOME' && styles.pillActive]}
          onPress={() => setSelection('HOME')}
        >
          <Text style={styles.pillText}>{homeLabel}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.pill, selection === 'AWAY' && styles.pillActive]}
          onPress={() => setSelection('AWAY')}
        >
          <Text style={styles.pillText}>{awayLabel}</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 10 }} />
      <Text style={styles.h2}>Stake (USD)</Text>
      <TextInput
        value={stakeStr}
        onChangeText={setStakeStr}
        keyboardType="decimal-pad"
        style={styles.input}
        placeholder="10"
      />

      <View style={{ height: 16 }} />
      <Button title={placing ? 'Placing…' : 'PLACE BET'} onPress={placeBet} disabled={placing} />

      <View style={{ height: 22 }} />
      <Text style={styles.h2}>Your Bets</Text>

      <FlatList
        data={bets}
        keyExtractor={(b) => String(b.id)}
        renderItem={renderBet}
        ListEmptyComponent={
          loadingBets
            ? <Text style={styles.muted}>Loading…</Text>
            : <Text style={styles.muted}>No bets yet for this event.</Text>
        }
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadBets(); }} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fafafa' },
  h1: { fontSize: 20, fontWeight: '800' },
  meta: { opacity: 0.7, marginTop: 4 },
  h2: { fontSize: 15, fontWeight: '700', marginTop: 12, marginBottom: 6 },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  pill: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, backgroundColor: '#eee' },
  pillActive: { backgroundColor: '#cfe8ff' },
  pillText: { fontWeight: '700' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, width: 160, marginBottom: 8 },
  betRow: { backgroundColor: '#fff', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#eee' },
  betMain: { fontWeight: '700' },
  betSub: { opacity: 0.7, marginTop: 2 },
  muted: { opacity: 0.6, paddingVertical: 8 },
});
