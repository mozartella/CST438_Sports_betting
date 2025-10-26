// app/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Your existing Tabs live here */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Hidden modal screen used only for GitHub login */}
      <Stack.Screen
        name="login-web"
        options={{
          presentation: 'modal',
          headerShown: true,
          title: 'Sign in with GitHub',
        }}
      />
    </Stack>
  );
}
