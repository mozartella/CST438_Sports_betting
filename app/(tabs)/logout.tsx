// app/(tabs)/logout.tsx
import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
<<<<<<< Updated upstream
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navagation/types";

// Define the type for navigation in LogoutScreen
type LogoutScreenNavigationProp = StackNavigationProp<RootStackParamList, "Logout">;
=======
import Ionicons from "@expo/vector-icons/Ionicons";
import { API } from "../../src/lib/api";
>>>>>>> Stashed changes

const LogoutScreen = () => {
  const navigation = useNavigation<any>();
  const [msg, setMsg] = useState("");

  const handleLogout = async () => {
    try {
      // Trigger server-side session logout (we allowed GET /logout in Spring)
      await Linking.openURL(API.LOGOUT);

      await AsyncStorage.clear();
      setMsg("Logged out. Returning to home...");
      // Navigate back to your home/index (same behavior you had)
      navigation.navigate("index");
    } catch (error) {
      console.error("Logout error:", error);
      setMsg("Failed to logout. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
<<<<<<< Updated upstream
      <Text style={styles.text}>Are you sure you want to log out?</Text>
      <Button title="Logout" onPress={handleLogout} color="red" />
=======
      <Ionicons
        name="log-out-outline"
        size={120}
        color="#FF3B30"
        style={styles.watermarkIcon}
      />
      <View style={styles.banner}>
        <Ionicons name="log-out-outline" size={40} color="#FF3B30" />
        <Text style={styles.bannerText}>Leaving Your Account</Text>
      </View>

      <Text style={styles.text}>You're About to Sign Out. Ready to Continue?</Text>
      <Button title="Logout" onPress={handleLogout} color="#FF3B30" />
      {msg ? <Text style={{ marginTop: 12 }}>{msg}</Text> : null}
>>>>>>> Stashed changes
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default LogoutScreen;
