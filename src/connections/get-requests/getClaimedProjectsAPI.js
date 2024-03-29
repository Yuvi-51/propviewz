const apiUrl = process.env.NEXT_PUBLIC_API_HOST;

export const getClaimedProjectsAPI = async (currentPage, token, request) => {
  if (request && token) {
    try {
      const url = `${apiUrl}/api/v1/projects/claimed_project?page=${currentPage}`;
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
      return responseData?.payload?.project_cards;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  } else {
    return [];
  }
};
