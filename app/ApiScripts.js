// apiScripts.js
export const apiCall = async (endpoint, setJsonResponse) => {
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': 'f48a5921f5msh580809ba8c9e6cfp181a8ajsn545d715d6844',
          'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com',
        },
      });
      const json = await response.json();
      setJsonResponse(json); // pass json to the setter (added element to original function)
    } catch (error) {
      console.error(error);
    }
  };

export default apiCall;