import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';

interface Game {
  id: string;
  teams: {
    home?: { name: string };
    away?: { name: string };
  };
  date: { start: string };
  odds?: {
    home: number;
    away: number;
  };
}

const UpcomingGames = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]); // To store the selected teams

  useEffect(() => {
    const fetchGames = async () => {
      const url = 'https://api-nba-v1.p.rapidapi.com/games?date=2023-02-02'; // Replace with dynamic API endpoint if needed
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': 'f48a5921f5msh580809ba8c9e6cfp181a8ajsn545d715d6844',
          'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com',
        },
      };

      try {
        const response = await fetch(url, options);
        const data = await response.json();
        console.log(data); // Inspect the structure for odds information
        setGames(data.response || []); // Adjust if data.response contains the games
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleGamePress = (gameId: string, homeTeam: string | undefined, awayTeam: string | undefined) => {
    // Ensure both home and away teams are available before showing the alert
    if (!homeTeam || !awayTeam) {
      Alert.alert('Error', 'Game data is missing team information.');
      return;
    }

    // Show an alert to let the user choose which team to add
    Alert.alert(
      'Choose a team to add',
      `Do you want to add ${homeTeam} or ${awayTeam} to your list?`,
      [
        {
          text: homeTeam,
          onPress: () => addTeamToList(homeTeam),
        },
        {
          text: awayTeam,
          onPress: () => addTeamToList(awayTeam),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const addTeamToList = (teamName: string) => {
    // Add the selected team to the list if not already there
    if (!selectedTeams.includes(teamName)) {
      setSelectedTeams((prevTeams) => [...prevTeams, teamName]);
      Alert.alert('Success', `${teamName} has been added to your list!`);
    } else {
      Alert.alert('Already Added', `${teamName} is already in your list.`);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading upcoming games...</Text>
      </View>
    );
  }

  if (games.length === 0) {
    return (
      <View style={styles.loader}>
        <Text>No upcoming games found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={games}
        keyExtractor={(item) => item.id.toString()} // Ensure 'id' exists and is unique
        renderItem={({ item }) => {
          // Safely handle undefined home or away team data
          const homeTeam = item.teams?.home?.name;
          const awayTeam = item.teams?.away?.name;
          const gameDate = new Date(item.date.start); // Make sure to create a Date object

          // Check if the date is valid
          const formattedDate = gameDate.toLocaleString() !== 'Invalid Date'
            ? gameDate.toLocaleString()
            : 'No Date Available';

          // Assign betting odds based on the home team advantage (50%)
          const homeOdds = 1.5; // Home team always has 50% advantage
          const awayOdds = 2.0; // Away team has slightly higher odds

          return (
            <TouchableOpacity
              style={styles.gameItem}
              onPress={() => handleGamePress(item.id, homeTeam, awayTeam)}
            >
              <Text style={styles.teamText}>
                {homeTeam || 'Home Team'} vs {awayTeam || 'Away Team'}
              </Text>
              <Text style={styles.dateText}>
                {formattedDate || 'No Date Available'}
              </Text>
              {/* Betting odds with fixed 50% home field advantage */}
              <Text style={styles.oddsText}>
                Betting Odds - Home: {homeOdds}, Away: {awayOdds}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
      <View style={styles.selectedTeamsContainer}>
        <Text style={styles.selectedTeamsTitle}>Selected Teams:</Text>
        {selectedTeams.length > 0 ? (
          selectedTeams.map((team, index) => (
            <Text key={index} style={styles.selectedTeamText}>
              {team}
            </Text>
          ))
        ) : (
          <Text>No teams selected yet.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  teamText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 14,
    color: '#555',
  },
  oddsText: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  selectedTeamsContainer: {
    padding: 16,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  selectedTeamsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  selectedTeamText: {
    fontSize: 16,
    color: '#333',
  },
});

export default UpcomingGames;
