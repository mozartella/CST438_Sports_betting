import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../navagation/types";
import loginPic from "../../assets/images/loginPic2.jpg";
import { verifyUserLogin, getUserID, initializeDatabase } from "../../database/db"; 
import AsyncStorage from "@react-native-async-storage/async-storage"; 

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // I deleted this but then was having some issues... so back in for now
  const [dbInitialized, setDbInitialized] = useState(false); 
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    // Initialize the database 
    const initializeDb = async () => {
      try {
        // Call the function to initialize database and wait for it to finish
        await initializeDatabase();

        // Set the DB initialized to true
        setDbInitialized(true);
      } catch (error) {
        console.error("Database initialization error: ", error);
        Alert.alert("Error", "An error occurred while initializing the database.");
      }
    };

    initializeDb();
  }, []);

  // Handle user not filling out username or password
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password.");
      return;
    }

    setLoading(true);

    try {
      // First, verify the login credentials (e.g., check if password matches)
      const isValidUser = await verifyUserLogin(username, password);
      setLoading(false);

      if (isValidUser) {
       // get the userID based on the username
        const userID = await getUserID(username);

        if (userID) {
          // Save userID and username to AsyncStorage
          await AsyncStorage.setItem("userID", userID.toString()); // in case we need
          await AsyncStorage.setItem("username", username); // Store the username (definitely need)

          Alert.alert("Welcome", "You are now logged in!");
          setTimeout(() => navigation.navigate("FavoriteTeams"), 500);
        } else {
          Alert.alert("Error", "User not found.");
        }
      } else {
        Alert.alert("Error", "Incorrect username or password.");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "An error occurred while verifying login.");
      console.error(error);
    }
  };

  if (!dbInitialized) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ImageBackground source={loginPic} style={styles.backgroundImage}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title="Login" onPress={handleLogin} />
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    width: "80%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: "#fff",
    width: "80%",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
  },
});




