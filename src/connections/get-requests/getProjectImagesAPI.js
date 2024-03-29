const apiUrl = process.env.NEXT_PUBLIC_API_HOST;

export const getProjectImagesAPI = async (projectId, givenBy) => {
  if (projectId) {
    try {
      let url = `${apiUrl}/api/v1/project_medias?project_id=${projectId}`;

      if (givenBy) {
        url += `&given_by=${givenBy}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {},
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
};
