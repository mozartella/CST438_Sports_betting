import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

export default function Button({ title, onPress, disabled }){
  return (
    <Pressable onPress={onPress} disabled={disabled} style={[styles.btn, disabled && styles.disabled]}>
      <Text style={styles.txt}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn:{ backgroundColor:'#1e40af', padding:12, borderRadius:8, alignItems:'center', marginVertical:8 },
  txt:{ color:'#fff', fontWeight:'600' },
  disabled:{ opacity:0.5 }
});
