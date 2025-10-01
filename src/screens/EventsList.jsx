import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, SafeAreaView, StyleSheet } from 'react-native';
import { api } from '../lib/api';
import Button from '../components/Button';

export default function EventsList({ navigation }){
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = 1; // TEMP: until auth is added

  useEffect(() => {
    api.events().then(setEvents).catch(setError).finally(()=>setLoading(false));
  },[]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Upcoming Events</Text>
        <Button title="My Bets" onPress={()=> navigation.navigate('MyBets', { userId })} />
      </View>
      {loading && <Text>Loading…</Text>}
      {error && <Text style={{color:'red'}}>{String(error.message || error)}</Text>}
      <FlatList
        data={events}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => (
          <Pressable onPress={()=> navigation.navigate('EventDetail',{ id:item.id, userId })} style={styles.card}>
            <Text style={styles.league}>{item.league}</Text>
            <Text style={styles.matchup}>{item.home_team} vs {item.away_team}</Text>
            <Text style={styles.meta}>{new Date(item.start_time).toLocaleString()} • {item.status}</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:16 },
  header:{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:8 },
  title:{ fontSize:24, fontWeight:'700' },
  card:{ padding:12, borderWidth:1, borderColor:'#e5e7eb', borderRadius:8, marginBottom:10 },
  league:{ fontWeight:'700', marginBottom:4 },
  matchup:{ fontSize:16 },
  meta:{ color:'#6b7280', marginTop:4 }
});
