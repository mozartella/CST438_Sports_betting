// app/(tabs)/login.tsx
import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  Alert,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import loginPic from "../../assets/images/loginPic2.jpg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API } from "../../src/lib/api";
import { router } from "expo-router";

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);
  const [me, setMe] = useState<any>(null);

  const fetchMe = async () => {
    try {
      setLoading(true);
      const res = await fetch(API.ME, { credentials: "include" as any });
      const data = await res.json();
      setMe(data);
      setLoading(false);

      if (data && (data.authenticated === true || data.login)) {
        if (data.login) await AsyncStorage.setItem("username", String(data.login));
        navigation.navigate("favoriteTeams", { username: data.login || data.name });
      }
    } catch (e: any) {
      setLoading(false);
      setMe({ authenticated: false });
    }
  };

  useEffect(() => {
    // Try to pick up an existing session on mount
    fetchMe();
  }, []);

  const handleLogin = () => {
    // Opens the hidden WebView screen we moved to app/login-web.tsx
    router.push("/login-web");
    Alert.alert("GitHub Login", "Authorize in the web view, then return and tap Refresh.");
  };

  if (loading && !me) {
    return <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1 }} />;
  }

  return (
    <ImageBackground source={loginPic} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Button title="Login with GitHub" onPress={handleLogin} />
        <View style={{ height: 12 }} />
        <Button title="Refresh status" onPress={fetchMe} />
        <View style={{ height: 16 }} />
        <Text style={styles.statusText}>Me: {JSON.stringify(me)}</Text>
        <Text style={styles.helpText}>
          If nothing happens after pressing Login, you may already be signed in.
          Press "Refresh status".
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
  },
  statusText: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 6,
    width: "85%",
  },
  helpText: {
    marginTop: 8,
    opacity: 0.7,
    textAlign: "center",
    paddingHorizontal: 24,
  },
});
