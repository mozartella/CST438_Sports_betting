import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Text, View,ScrollView} from 'react-native';


// Using template from tutorial https://reactnative.dev/docs/network?language=javascript

const App = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [jsonResponse, setJsonResponse] = useState(null);
  const [scheduleData, setScheduleData] = useState([]);

  const apiCall = async (endpoint) => {
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': 'f48a5921f5msh580809ba8c9e6cfp181a8ajsn545d715d6844',
          'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com',
        },
      });
      const json = await response.json();
     //setData(json.response); 
     setJsonResponse(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); 
    }
  };

  // Working on this function
  const getTeamSchedule = async (teamId) => {
    setLoading(true);

    // Attempting to gather a teams schedule by Date
    const todaysDate = new Date().toISOString().split('T')[0]; 
    const endpointSchedule = `https://api-nba-v1.p.rapidapi.com/games?team=${teamId}&date=${todaysDate}`;
    const scheduleJson = await apiCall(endpointSchedule);

    //Had to add these conditions because of errors
    if (scheduleJson && scheduleJson.response) {
      setScheduleData(scheduleJson.response); // Set the team's schedule
    }
    //stops the dang loading spinner from going forever
    setLoading(false);
  };



  useEffect(() => {
    // Teams Endpoint (Where I started)
    const endpointTeams = 'https://api-nba-v1.p.rapidapi.com/teams';

    //-------------------------Useful Endpoints --------------------------------------

    // API Documentation = https://api-sports.io/documentation/nba/v2

    // Endpoint to show the current standings of Nba Teams
    const endpointStandings = 'https://api-nba-v1.p.rapidapi.com/standings?league=standard&season=2024';

    // Schedule Endpoint (A LOT OF GOOD INFORMATION)
    const endpointSchedule = 'https://api-nba-v1.p.rapidapi.com/games?season=2024&team=1' ;

    //endpoint for games betewen teams
    const endpointGamesBetweenTeams = 'https://api-nba-v1.p.rapidapi.com/games?h2h=1-2';

    //endpoint for Searching Team
    const endpointSearchTeams = 'https://api-nba-v1.p.rapidapi.com/teams?search=atl';

    //endpoint for Games per Date (Note the format of date)

    const endpointGamesByDate = 'https://api-nba-v2.p.rapidapi.com/games?date=2022-02-12';

    //endpoint for Teams by ID (If we log all team ID's that would be helpful)
    const endpointTeamsByID = 'https://api-nba-v2.p.rapidapi.com/teams?id=1';

    //endpoint for team stats
    const endpointTeamStats = "https://v2.nba.api-sports.io/teams/statistics?season=2024&id=1"

    //--------------------------------------------------------------------------------

    // endpoint for sampling (Working on crafting the perfect endpoint)
    const endpoint = 'https://api-nba-v2.p.rapidapi.com/games?date=2025-02-05';



    apiCall(endpoint); 
  
  }, []);

  return (
    <View style={{ flex: 1, padding: 24 }}>
    {isLoading ? (
      <ActivityIndicator /> 
    ) : (
      <ScrollView>
        <Text>{JSON.stringify(jsonResponse, null, 2)}</Text> 
      </ScrollView>
    )}
  </View>
  );
};

export default App;
