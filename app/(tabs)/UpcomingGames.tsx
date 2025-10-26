// app/(tabs)/UpcomingGames.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import API, { API as NamedAPI } from '../../src/lib/api';
import { router } from 'expo-router';

type EventItem = {
  id: number | string;
  league?: string;
  home_team?: string;
  away_team?: string;
  start_time?: string;
  status?: string;
};

const Api = NamedAPI ?? API;

export default function UpcomingGames() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const list = await Api.events();
        setEvents(Array.isArray(list) ? list : []);
      } catch (e: any) {
        setError(e?.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;
  if (error)   return <Text style={{ color: 'red', padding: 16 }}>{error}</Text>;
  if (!events.length) return <Text style={{ padding: 16 }}>No events available.</Text>;

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={{ padding: 12 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            router.push({
              pathname: `/event/${item.id}`,
              params: { event: JSON.stringify(item) }, // pass the whole event
            })
          }
        >
          <Text style={styles.title}>
            {(item.home_team ?? 'Home')} vs {(item.away_team ?? 'Away')}
          </Text>
          <Text style={styles.sub}>
            {(item.league ?? '')}  {item.start_time ? new Date(item.start_time).toLocaleString() : ''}
          </Text>
        </TouchableOpacity>
      )}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
    />
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, elevation: 2 },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  sub: { opacity: 0.7 },
});
