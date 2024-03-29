export const getAllProjectsAPI = async (category, page, cityId) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_HOST}/api/v1/projects/show_all_projects?type=${category}&page=${page}&city_id=${cityId}`;

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
