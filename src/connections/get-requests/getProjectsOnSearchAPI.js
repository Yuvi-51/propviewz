const apiUrl = process.env.NEXT_PUBLIC_API_HOST;

export const getProjectsOnSearchAPI = async (type, query, cityId) => {
  if (query) {
    try {
      const url = `${apiUrl}/api/v1/${type}/search?q=${query}&city_id=${cityId}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const responseData = await response.json();
      return responseData?.payload;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
};
