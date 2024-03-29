const apiUrl = process.env.NEXT_PUBLIC_API_HOST;

export const getExistingPostedPictureAPI = async (project_id, token) => {
  if (project_id) {
    try {
      const url = `${apiUrl}/api/v1/project_medias/existing_project_media?project_id=${project_id}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      return responseData?.payload?.project_medias;
    } catch (error) {
      console.error("Error getting pictures:", error);
    }
  }
};
