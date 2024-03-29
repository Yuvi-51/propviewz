export const getIndexAllProjectsAPI = async (city_id) => {
  if (city_id) {
    try {
      const url = `/api/v1/projects/all_project_index?city_id=${city_id}`;
      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      return responseData?.payload?.projects;
    } catch (error) {
      console.error("Error getting project index:", error);
    }
  } else {
    return [];
  }
};
