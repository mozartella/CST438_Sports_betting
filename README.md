
# Sportsbook Expo Starter

A minimal Expo (React Native) client for your Sports Betting API. It lists events, shows odds, places a bet, and displays a user's bets. It uses a temporary hardcoded user id = 1 (until auth is added).

## Prereqs
- Node 18+
- `npm` or `yarn`
- Expo CLI (`npm i -g expo`), optional—`npx expo` also works
- Backend running locally at `http://localhost:8080`

## Quick start
```bash
npm install
npm start
# or: npx expo start
```

If your API is not on localhost:8080, set an env var:
```bash
# PowerShell
$env:EXPO_PUBLIC_API_BASE="http://192.168.1.10:8080"; npx expo start
# macOS/Linux
EXPO_PUBLIC_API_BASE="http://192.168.1.10:8080" npx expo start
```

## Screens
- **Events**: list upcoming events
- **Event**: event details + moneyline odds + "Bet" buttons
- **My Bets**: shows the current user's bets

## Notes
- CORS must allow your device origin; backend currently allows `*`.
- Replace the hardcoded user id with real auth later (Firebase/JWT).
