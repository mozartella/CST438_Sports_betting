// navigation/types.ts
export type RootStackParamList = {
    Home: undefined; // This is the Index screen
    Login: undefined;
    CreateAccount: undefined; // This is the AccountCreation screen
    FavoriteTeams: undefined; // This is the FavoriteTeams screen
    UpcomingGames: { selectedTeams: string[] }; // This is the UpcomingGames
    Login: undefined; // This is the Login screen

  };
  