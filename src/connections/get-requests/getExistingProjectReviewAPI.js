const apiUrl = process.env.NEXT_PUBLIC_API_HOST;

export const getExistingProjectReviewAPI = async (project_id, token) => {
  if (project_id && token) {
    try {
      const url = `${apiUrl}/api/v1/project_reviews/existing_project_review?project_id=${project_id}`;
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
      return responseData?.payload;
    } catch (error) {
      console.error("Error getting reviews:", error);
    }
  }
};
