import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { api } from '../lib/api';
import Button from '../components/Button';

export default function EventDetail({ route, navigation }){
  const { id, userId } = route.params;
  const [event, setEvent] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [err, setErr] = useState(null);
  const [placed, setPlaced] = useState(null);

  useEffect(()=>{
    api.event(id).then(setEvent).catch(setErr);
  },[id]);

  async function bet(selection){
    try{
      setPlacing(true);
      const res = await api.placeBet({ userId, eventId:id, selection, stakeCents: 2500 });
      setPlaced(res);
    }catch(e){ setErr(e); }
    finally{ setPlacing(false); }
  }

  if(!event) return <SafeAreaView style={styles.container}><Text>Loading…</Text></SafeAreaView>;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{event.league}</Text>
      <Text style={styles.matchup}>{event.home_team} vs {event.away_team}</Text>
      <Text style={styles.meta}>{new Date(event.start_time).toLocaleString()} • {event.status}</Text>

      <View style={{height:12}} />
      <Text style={{fontWeight:'700'}}>Moneyline</Text>
      {event.odds?.map(o => (
        <View key={o.id} style={styles.oddsRow}>
          <Text style={styles.selection}>{o.selection}</Text>
          <Text>American: {o.american}  •  Decimal: {o.decimal}</Text>
          <Button title={`Bet ${o.selection}`} onPress={()=> bet(o.selection)} disabled={placing || event.status!=='SCHEDULED'} />
        </View>
      ))}

      {err && <Text style={{color:'red', marginTop:8}}>{String(err.message || err)}</Text>}
      {placed && <Text style={{color:'green', marginTop:8}}>Bet placed! id={placed.id} price={placed.priceAmerican}</Text>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:16 },
  title:{ fontSize:22, fontWeight:'700' },
  matchup:{ fontSize:18, marginTop:4 },
  meta:{ color:'#6b7280', marginTop:4 },
  oddsRow:{ paddingVertical:8, borderBottomColor:'#e5e7eb', borderBottomWidth:1 },
  selection:{ fontWeight:'700', marginBottom:4 }
});
