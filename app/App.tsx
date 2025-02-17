
// App.tsx (or wherever your navigation is set up)
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Index from '../app/(tabs)/index'; // Your main screen
import LoginScreen from './(tabs)/login';
import AccountCreation from '../app/(tabs)/AccountCreation'; // The account creation screen
import { RootStackParamList } from '../app/navagation/types'; // Navigation types
import FavoriteTeams from "../app/(tabs)/FavoriteTeams";
import UpcomingGames from "../app/(tabs)/UpcomingGames";

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Index" component={Index} />
      <Tab.Screen name="Login" component={LoginScreen} />
    </Tab.Navigator>
  );
};



const App = () => {
  return (

    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={Tabs} />
        <Stack.Screen name="AccountCreation" component={AccountCreation} /> {/* Ensure this is the correct screen name */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
