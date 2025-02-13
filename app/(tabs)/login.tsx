import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../navagation/types"; 
import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Text, View, TextInput, StyleSheet, Button, Alert, Dimensions, ImageBackground } from 'react-native';
import loginPic from '../../assets/images/loginPic2.jpg';


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

    <ImageBackground source={loginPic} style={styles.container} resizeMode="cover">
      <View style={styles.formContainer}>
        <Text style={styles.label}>Username:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          onChangeText={setUsername}
          value={username}
        />
        <Text style={styles.label}>Password:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry={true}
          onChangeText={setPassword}
          value={password}
        />

        {message ? <Text style={styles.message}>{message}</Text> : null}

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title="LOGIN" onPress={handleLogin} color="green" />
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  formContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent background for the form
    padding: 20,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    width: "80%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  message: { fontSize: 14, color: "red", marginBottom: 10 },
});

export default LoginScreen;
