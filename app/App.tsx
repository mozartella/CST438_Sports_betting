import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../app/(tabs)/login";
import FavoriteTeams from "../app/(tabs)/FavoriteTeams";
import UpcomingGames from "../app/(tabs)/UpcomingGames";
import AccountCreation from "./(tabs)/AccountCreation"; // Ensure correct path

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="FavoriteTeams" component={FavoriteTeams} />
      <Tab.Screen name="UpcomingGames" component={UpcomingGames} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="AcoountCreation" component={AccountCreation} /> 
        <Stack.Screen name="Home" component={Tabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
