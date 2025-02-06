// App.tsx (or wherever your navigation is set up)
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Index from '../app/(tabs)/index'; // Your main screen
import AccountCreation from './AccountCreation'; // The account creation screen
import { RootStackParamList } from '../app/navagation/types'; // Navigation types

const Stack = createStackNavigator<RootStackParamList>(); // Typing the navigator

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Index} />
        <Stack.Screen name="AccountCreation" component={AccountCreation} /> {/* Ensure this is the correct screen name */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
