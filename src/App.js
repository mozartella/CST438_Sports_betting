import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EventsList from './screens/EventsList';
import EventDetail from './screens/EventDetail';
import MyBets from './screens/MyBets';

const Stack = createNativeStackNavigator();

export default function App(){
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Events" component={EventsList} />
        <Stack.Screen name="EventDetail" component={EventDetail} options={{ title: 'Event' }} />
        <Stack.Screen name="MyBets" component={MyBets} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
