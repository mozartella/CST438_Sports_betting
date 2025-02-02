import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Text, View,ScrollView} from 'react-native';


// Using template from tutorial https://reactnative.dev/docs/network?language=javascript

const App = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [jsonResponse, setJsonResponse] = useState(null);

  const getNBAStats = async () => {
    try {
      const response = await fetch('https://api-nba-v1.p.rapidapi.com/teams', {
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
    getNBAStats(); 
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
