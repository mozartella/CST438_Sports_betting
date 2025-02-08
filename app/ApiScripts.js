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
export default apiCall;
