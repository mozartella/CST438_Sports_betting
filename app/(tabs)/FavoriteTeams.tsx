import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image, // ✅ Import Image for displaying logos
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { callTeams } from "../ApiScripts"; 
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../navagation/types";

interface Team {
  id: string;
  name: string;
  nickname: string;
  logo: string;
}

const FavoriteTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        process.env.RAPIDAPI_KEY = "f48a5921f5msh580809ba8c9e6cfp181a8ajsn545d715d6844"; //  Set key before calling API
        console.log(" API Key being used:", process.env.RAPIDAPI_KEY);
  
        const teamData = await callTeams();
        
        if (!teamData || teamData.length === 0) {
          console.error(" No teams received from API. Possible API Key issue.");
        }
  
        setTeams(teamData);
        console.log(" Teams Loaded:", teamData);
      } catch (error) {
        console.error(" Error fetching teams:", error);
      }
      setLoading(false);
    };
  
    fetchTeams();
  }, []);

  const toggleTeamSelection = (teamId: string) => {
    let updatedTeams = [...selectedTeams];
  
    if (updatedTeams.includes(teamId)) {
      updatedTeams = updatedTeams.filter((id) => id !== teamId); // Remove if already selected
    } else {
      if (updatedTeams.length >= 2) {
        alert(" You can only select up to 2 teams.");
        return;
      }
      updatedTeams.push(teamId); // Add new selection
    }
  
    setSelectedTeams(updatedTeams);
    AsyncStorage.setItem("favoriteTeams", JSON.stringify(updatedTeams));
  
    console.log(" Updated favorite teams stored:", updatedTeams);
  };

  if (loading) return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Favorite Teams</Text>
      {teams.length === 0 ? (
        <Text style={styles.errorText}>No teams available. Check API Key.</Text>
      ) : (
        <FlatList
          data={teams}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.teamItem,
                selectedTeams.includes(item.id) ? styles.selectedTeam : {},
              ]}
              onPress={() => toggleTeamSelection(item.id)}
            >
              <View style={styles.teamContainer}>
                {/*  Add Image for Logo */}
                <Image source={{ uri: item.logo }} style={styles.logo} />
                <Text style={styles.teamText}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 16, color: "red", textAlign: "center" },
  teamItem: {
    padding: 15,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    flexDirection: "row", //  Make sure text and logo align properly
    alignItems: "center",
  },
  teamContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: { //  Styling for logos
    width: 40, 
    height: 40, 
    marginRight: 10,
    resizeMode: "contain",
  },
  selectedTeam: { backgroundColor: "#87CEFA" },
  teamText: { fontSize: 18 },
});

export default FavoriteTeams;
