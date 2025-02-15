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
import { RootStackParamList } from "../navigation/types";
import loginPic from "../../assets/images/loginPic2.jpg";
import { verifyUserLogin,initializeDatabase } from "../../database/db";  // Import the verifyUserLogin function from db.js


export default function loginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [dbInitialized, setDbInitialized] = useState(false);  // Track if the DB is initialized
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // // We should probably move this over to our home screen because we want the db to load on our first screen
  useEffect(() => {
    // Initialize the database and create tables when the component mounts
    const initializeDb = async () => {
      try {
        // call the function to initialize database and wait for it to finish
        await initializeDatabase(); 

        // this was used for testing purposes
        setDbInitialized(true);  
      } catch (error) {
        console.error("Database initialization error: ", error);
        Alert.alert("Error", "An error occurred while initializing the database.");
      }
    };

    initializeDb();
  }, []);

  // handle user not filling out username or password
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password.");
      return;
    }

    setLoading(true);

    // Check user login asynchronously
    try {
      const success = await verifyUserLogin(username, password);
      setLoading(false);

      if (success) {
        Alert.alert("Welcome", "You are now logged in!");
        setTimeout(() => navigation.navigate("favoriteTeams"), 500);
      } else {
        Alert.alert("Error", "Incorrect username or password.");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "An error occurred while verifying login.");
      console.error(error);
    }
  };

  // Wait until DB initialization is complete (This can probably be removed)
  // Was used during testing
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: "#fff",
    width: "80%",  // Adjust width to make input fields look more consistent with the second example
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.7)", // Semi-transparent background for the form
    padding: 20,
    borderRadius: 10,
    width: "80%",  // Ensure the form is not too wide
  },
  buttonContainer: {
    marginTop: 10,
  },
});