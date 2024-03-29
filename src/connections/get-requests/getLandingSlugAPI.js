const apiUrl = process.env.NEXT_PUBLIC_API_HOST;

export const getLandingSlugAPI = async (slug, currentPage) => {
  if (slug) {
    try {
      const url = `${apiUrl}/api/v1/${slug}?page=${currentPage} `;
      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();

      return responseData;
    } catch (error) {
      console.error("Error getting landing slug details:", error);
    }
  } else {
    return [];
  }
};
