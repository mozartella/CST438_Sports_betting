export const fetchNbaData = async (endpoint) => {
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY || "",
          "x-rapidapi-host": "api-nba-v1.p.rapidapi.com",
        },
      });
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      return null;
    }
  };
  
  // Fetch all NBA teams
  export const callTeams = async () => {
    const data = await fetchNbaData("https://api-nba-v1.p.rapidapi.com/teams?league=standard");
    if (!data || !data.response) return [];
    
    return data.response
      .filter((team) => team.nbaFranchise === true)
      .map((team) => ({
        id: team.id,
        name: team.name,
        nickname: team.nickname,
        logo: team.logo,
      }));
  };
  
  // Fetch games for selected team
  export const callGamesByDate = async (startDate, endDate, teamID) => {
    const data = await fetchNbaData(`https://api-nba-v1.p.rapidapi.com/games?league=standard&season=2024&team=${teamID}`);
    if (!data || !data.response) return [];
  
    return data.response
      .filter((game) => {
        const gameDate = new Date(game.date.start);
        return gameDate >= new Date(startDate) && gameDate <= new Date(endDate);
      })
      .map((game) => ({
        id: game.id,
        date: new Date(game.date.start),
        homeTeam: {
          name: game.teams.home.name,
          nickname: game.teams.home.nickname,
          logo: game.teams.home.logo,
        },
        awayTeam: {
          name: game.teams.visitors.name,
          nickname: game.teams.visitors.nickname,
          logo: game.teams.visitors.logo,
        },
      }));
  };
  