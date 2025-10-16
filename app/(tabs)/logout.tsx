import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navagation/types";
import Ionicons from "@expo/vector-icons/Ionicons";

// Define the type for navigation in LogoutScreen
type LogoutScreenNavigationProp = StackNavigationProp<RootStackParamList, "Logout">;

const LogoutScreen = () => {
  const navigation = useNavigation<LogoutScreenNavigationProp>();

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      console.log("AsyncStorage cleared");

      // Navigate to Home screen after logout (ok for some reason u have to go to file name not component name)
      navigation.navigate("index");
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons
        name="log-out-outline"
        size={120}
        color="#FF3B30"
        style={styles.watermarkIcon}
      />
      <View style={styles.banner}>
        <Ionicons
          name="log-out-outline"
          size={40}
          color="#FF3B30"
          />
          <Text style={styles.bannerText}>Leaving Your Account</Text>
      </View>

      <Text style={styles.text}>You're About to Sign Out. Ready to Continue?</Text>
      <Button title="Logout" onPress={handleLogout} color="#FF3B30" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(155, 216, 243, 1)",
    paddingHorizontal: 16,
    position: "relative",
  },
  watermarkIcon: {
    position: "absolute",
    top: "100%",
    right: "20%",
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  bannerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#25292e",
    marginLeft: 12,
  },
  text: {
    fontSize: 20,
    marginBottom: 24,
    color: "#25292e",
    textAlign: "center",
    fontWeight: "600",
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "80%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonWrapper: {
    width: "60%",
    borderRadius: 8,
    overflow: "hidden",
  },
});

export default LogoutScreen;


