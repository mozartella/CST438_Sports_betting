import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Stack } from "expo-router";

/*https://reactnavigation.org/docs/navigating/ Navigation Documentation*/ 

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
      <Stack.Screen name = "nba-stats-view" options ={{title: "NBA Stats"}} />
    </Stack>
  );
}
