const apiUrl = process.env.NEXT_PUBLIC_API_HOST;

export const getCategoryProjectsAPI = async (projectCategory, cityId) => {
  try {
    const url = `${apiUrl}/api/v1/projects/limited_projects_by_type?type=${projectCategory}&city_id=${cityId}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseData = await response.json();
    return responseData?.payload?.project_cards;
  } catch (error) {
    return "Error fetching data:", error;
  }
};

export const getSimilarProjectsAPI = async (
  projectSlug,
  currentPage,
  cityId
) => {
  try {
    const url = `${apiUrl}/api/v1/projects/${projectSlug}/similar_projects?city_id=${cityId}${
      currentPage ? "&page=" + currentPage : null
    }`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    return {
      data: responseData?.payload?.project_cards,
      count: responseData?.meta?.count,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
