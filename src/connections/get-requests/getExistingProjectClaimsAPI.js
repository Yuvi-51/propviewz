const apiUrl = process.env.NEXT_PUBLIC_API_HOST;

export const getExistingProjectClaimsAPI = async (project_id, token) => {
  if (project_id && token) {
    try {
      const url = `${apiUrl}/api/v1/claim_requests/existing_claim_request?project_id=${project_id}`;
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
      return responseData?.payload?.status;
    } catch (error) {
      console.error("Error getting claim requests:", error);
    }
  }
};
