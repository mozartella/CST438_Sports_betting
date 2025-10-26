// app/(tabs)/logout.tsx
import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { WebView } from "react-native-webview";
import { API } from "../../src/lib/api";

const LogoutScreen = () => {
  const navigation = useNavigation<any>();
  const [msg, setMsg] = useState("");
  const [useWebFallback, setUseWebFallback] = useState(false);

  const finish = async () => {
    try { await AsyncStorage.clear(); } catch {}
    setMsg("Logged out. Returning to home…");
    navigation.navigate("index");
  };

  const handleLogout = async () => {
    setMsg("Logging out…");
    try {
      await fetch(API.LOGOUT, { method: "GET", credentials: "include" as any });
      await finish();
    } catch {
      setMsg("Finalizing logout…");
      setUseWebFallback(true);
    }
  };

  const onWebNav = async (event: any) => {
    const url: string = event?.url || "";
    if (url === `${API.BASE}/` || url === `${API.BASE}` || url.startsWith(`${API.BASE}/api/me`)) {
      setUseWebFallback(false);
      await finish();
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name="log-out-outline" size={120} color="#FF3B30" style={styles.watermarkIcon} />
      <View style={styles.banner}>
        <Ionicons name="log-out-outline" size={40} color="#FF3B30" />
        <Text style={styles.bannerText}>Leaving Your Account</Text>
      </View>
      <Text style={styles.text}>You're About to Sign Out. Ready to Continue?</Text>
      <View style={styles.buttonWrapper}><Button title="Logout" onPress={handleLogout} color="#FF3B30" /></View>
      {msg ? <Text style={{ marginTop: 12 }}>{msg}</Text> : null}
      {useWebFallback && (
        <View style={{ width: 1, height: 1, overflow: "hidden" }}>
          <WebView
            source={{ uri: API.LOGOUT }}
            onNavigationStateChange={onWebNav}
            sharedCookiesEnabled
            thirdPartyCookiesEnabled
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(155, 216, 243, 1)", paddingHorizontal: 16, position: "relative" },
  watermarkIcon: { position: "absolute", top: "100%", right: "20%" },
  banner: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 12, borderRadius: 12, marginTop: 20, marginBottom: 24, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  bannerText: { fontSize: 18, fontWeight: "600", color: "#25292e", marginLeft: 12 },
  text: { fontSize: 20, marginBottom: 24, color: "#25292e", textAlign: "center", fontWeight: "600", paddingHorizontal: 24, paddingVertical: 20, backgroundColor: "#fff", borderRadius: 12, width: "80%", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  buttonWrapper: { width: "60%", borderRadius: 8, overflow: "hidden" },
});

export default LogoutScreen;
