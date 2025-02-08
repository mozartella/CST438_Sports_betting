// apiScripts.js
export const apiCall = async (endpoint, setJsonResponse) => {
  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "x-rapidapi-key": "f48a5921f5msh580809ba8c9e6cfp181a8ajsn545d715d6844",
        "x-rapidapi-host": "api-nba-v1.p.rapidapi.com",
      },
    });
    const json = await response.json();
    setJsonResponse(json); // pass json to the setter (added element to original function) (May get rid of this)
    // json return to make helper functions work/ more dynamic
    return json;
  } catch (error) {
    console.error(error);
  }
};

// I think that my original apiCall function could be simplified. I dont like it using a callback because
// it has been making the rest of my functions confusing to write around. this is my proposed alteration but i need to test some stuff
// export const apiCall = async (endpoint) => {
//   try {
//     const response = await fetch(endpoint, {
//       method: "GET",
//       headers: {
//         "x-rapidapi-key": "f48a5921f5msh580809ba8c9e6cfp181a8ajsn545d715d6844",
//         "x-rapidapi-host": "api-nba-v1.p.rapidapi.com",
//       },
//     });
//     const json = await response.json();
//     return json; 
//   } catch (error) {
//     console.error(error);
//     return null; 
//   }
// };




export const callTeams = async () => {
  try {
    const response = await apiCall(
      "https://api-nba-v1.p.rapidapi.com/teams?league=standard",
      (json) => {
        if (!json || !json.response) {
          throw new Error("Invalid API response");
        }

        // Create the teamData array with below structure
        const teamData = json.response

          // I want filter out teams that aren't nbaFranchises (you would think i could league filter but it isn't an option)
          // I want to check the nbaFranchise field and return a new array populated only teams where this field is true
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
          .filter((team) => team.nbaFranchise === true)

          // I also want to sort out specific information.
          // This may change depending on what we need. For now it will map out the fields we use in our table
          .map((team) => ({
            id: team.id,
            name: team.name,
            nickname: team.nickname,
            logo: team.logo,
          }));
        console.log("teamData:", teamData);
        return teamData;
      }
    );
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
};

export const callGamesByDate = async (startDate, endDate, teamID) => {
  try {
    const response = await apiCall(
      `https://api-nba-v1.p.rapidapi.com/games?league=standard&season=2024&team=${teamID}`,
      (json) => {
        if (!json || !json.response) {
          throw new Error("Invalid API response");
        }

        // Filter games based on the provided date range. It was a lot easier to filter out games outside the range
        // than to select each date in the range and check.
        // this also prevents having to check if there is a game on a specific date
        const gameData = json.response
          .filter((game) => {
            const gameDate = new Date(game.date.start);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return gameDate >= start && gameDate <= end;
          })

          // I think I could make call Teams redundant with this stuff at some point.
          .map((game) => ({
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

        
        return gameData;
      }
    );

  // If i modify apiCall to make it simpler I think i could just get away with this
  //   return gameData;
  // } catch (error) {
  //   console.error("Error fetching games:", error);
  //   return []; 
  // }    
    if (!response) {
      throw new Error("No data returned from apiCall");
    }

    return response; 
  } catch (error) {
    console.error("Error fetching games:", error);
  }
};

export default apiCall;
