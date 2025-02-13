import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../navagation/types"; 

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); 
  const [loading, setLoading] = useState(false); // Add loading state
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); 

  const handleLogin = async () => {
    setMessage("");
    setLoading(true); // Show loading indicator

    //"http://10.0.2.2:8082"; // Android emulator
    //"http://localhost:8082/login";
    
    try {
      const response = await fetch("http://10.0.2.2:8082/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage(` Welcome back, ${username}!`);
        
        setTimeout(() => {
          setLoading(false); // Hide loading indicator
          navigation.navigate("Home"); 
        }, 500);

      } else {
        setMessage(` Error: ${data.error}`);
        setLoading(false); // Hide loading indicator
      }
    } catch (error) {
      setMessage(" Network error. Try again.");
      setLoading(false); // Hide loading indicator
      console.error("Login error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username:</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Enter username"
        style={styles.input}
      />

      <Text style={styles.label}>Password:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Enter password"
        secureTextEntry
        style={styles.input}
      />

      {message ? <Text style={styles.message}>{message}</Text> : null}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="LOGIN" onPress={handleLogin} color="green" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", alignItems: "center" },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  input: {
    width: "80%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  message: { fontSize: 14, color: "red", marginBottom: 10 },
});

export default LoginScreen;
