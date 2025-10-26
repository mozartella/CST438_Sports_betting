// app/login-web.tsx
import React, { useState } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import { API } from "../src/lib/api";

export default function LoginWebView() {
  const nav = useNavigation<any>();
  const [busy, setBusy] = useState(false);

  const onNav = (event: any) => {
    const url: string = event.url || "";
    // When Spring finishes OAuth it will redirect to /api/me (or /)
    if (
      url.startsWith(`${API.BASE}/api/me`) ||
      url === `${API.BASE}/` ||
      url === `${API.BASE}`
    ) {
      setBusy(true);
      setTimeout(() => {
        setBusy(false);
        Alert.alert("Logged in", "Session created. Returning to the app.");
        nav.goBack(); // back to Login screen; user can tap "Refresh status"
      }, 300);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {busy ? <ActivityIndicator size="large" style={{ marginTop: 20 }} /> : null}
      <WebView
        source={{ uri: API.LOGIN }}
        onNavigationStateChange={onNav}
        startInLoadingState
        renderLoading={() => <ActivityIndicator style={{ marginTop: 20 }} />}
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
      />
    </View>
  );
}
