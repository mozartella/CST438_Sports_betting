import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { callTeams } from "../ApiScripts";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../navagation/types";
import {
  addTeamToFavs,
  removeTeamFromFav,
  getAllFavTeamInfo,
} from "../../database/db";

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
  const [userID, setUserID] = useState<number | null>(null); // Store userID as a number (THIS IS KEY)
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchUserID = async () => {
      const userID = await AsyncStorage.getItem("userID");
      console.log("Stored User ID:", userID); // Log string
      if (userID) {
        const parsedUserID = parseInt(userID);
        console.log("Parsed User ID:", parsedUserID); // Log the parsed value
        setUserID(parsedUserID); // Set the parsed value
      } else {
        console.warn("No userID found in AsyncStorage");
      }
    };

    const fetchTeams = async () => {
      setLoading(true);
      try {
        process.env.RAPIDAPI_KEY =
          "f48a5921f5msh580809ba8c9e6cfp181a8ajsn545d715d6844";
        const teamData = await callTeams();

        if (!teamData || teamData.length === 0) {
          console.error("No teams received from API. Possible API Key issue.");
        }

        setTeams(teamData);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
      setLoading(false);
    };

    fetchUserID();
    fetchTeams();
  }, []);

  useEffect(() => {
    if (userID !== null) {
      const fetchFavoriteTeams = async () => {
        const favTeams = await getAllFavTeamInfo(userID);
        const favTeamIds = favTeams.map((team) => team[0]); // Extract team_ids from the result
        setSelectedTeams(favTeamIds);
      };

      fetchFavoriteTeams();
    }
  }, [userID]);

  const toggleTeamSelection = async (teamId: string) => {
    if (userID === null) return;

    let updatedTeams = [...selectedTeams];

    if (updatedTeams.includes(teamId)) {
      updatedTeams = updatedTeams.filter((id) => id !== teamId);
      // Remove from DB
      await removeTeamFromFav(userID, teamId);
    } else {
      if (updatedTeams.length >= 2) {
        alert("You can only select up to 2 teams.");
        return;
      }
      updatedTeams.push(teamId);
      // Add team to DB
      await addTeamToFavs(userID, teamId);
      console.log("teamID: ", teamId)
  
    }

    setSelectedTeams(updatedTeams);
    AsyncStorage.setItem("favoriteTeams", JSON.stringify(updatedTeams));

    console.log("Updated favorite teams stored:", updatedTeams);
  };

  if (loading)
    return (
      <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />
    );

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
    flexDirection: "row",
    alignItems: "center",
  },
  teamContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: { width: 40, height: 40, marginRight: 10, resizeMode: "contain" },
  selectedTeam: { backgroundColor: "#87CEFA" },
  teamText: { fontSize: 18 },
});

export default FavoriteTeams;
