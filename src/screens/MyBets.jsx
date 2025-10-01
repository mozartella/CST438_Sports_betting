import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, StyleSheet } from 'react-native';
import { api } from '../lib/api';

export default function MyBets({ route }){
  const { userId } = route.params;
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{
    api.myBets(userId).then(setBets).catch(setError).finally(()=>setLoading(false));
  },[userId]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Bets</Text>
      {loading && <Text>Loading…</Text>}
      {error && <Text style={{color:'red'}}>{String(error.message || error)}</Text>}
      <FlatList
        data={bets}
        keyExtractor={b => String(b.id)}
        renderItem={({item}) => (
          <View style={styles.card}>
            <Text style={styles.matchup}>{item.league}: {item.home_team} vs {item.away_team}</Text>
            <Text>Pick: {item.selection} • Price: {item.price_american} • Stake: ${(item.stake_cents/100).toFixed(2)}</Text>
            <Text>Status: {item.state} {item.result?`• Result: ${item.result}`:''}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:16 },
  title:{ fontSize:22, fontWeight:'700', marginBottom:8 },
  card:{ padding:12, borderWidth:1, borderColor:'#e5e7eb', borderRadius:8, marginBottom:10 },
  matchup:{ fontWeight:'700', marginBottom:4 }
});
