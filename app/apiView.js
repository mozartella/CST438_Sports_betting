import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Text, View,ScrollView} from 'react-native';


// Using template from tutorial https://reactnative.dev/docs/network?language=javascript

const App = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [jsonResponse, setJsonResponse] = useState(null);

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

  useEffect(() => {
    // Teams Endpoint (Where I started)
    const endpointTeams = 'https://api-nba-v1.p.rapidapi.com/teams';

    //-------------------------Useful Endpoints --------------------------------------

    // Endpoint to show the current standings of Nba Teams
    const endpointStandings = 'https://api-nba-v1.p.rapidapi.com/standings?league=standard&season=2024';

    // Schedule Endpoint (A LOT OF GOOD INFORMATION)
    const endpointSchedule = 'https://api-nba-v1.p.rapidapi.com/games?season=2024&team=1' ;

    // endpoint for sampling
    const endpoint = 'https://api-nba-v1.p.rapidapi.com/standings?league=standard&season=2024';



    apiCall(endpointSchedule); 
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
