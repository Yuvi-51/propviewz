const apiUrl = process.env.NEXT_PUBLIC_API_HOST;
export const getTopProjectsAPI = async (cityId) => {
  try {
    const response = await fetch(
      `${apiUrl}/api/v1/projects/top_projects?city_id=${cityId}`
    );

    if (!response.ok) {
      throw new Error("Error getting top projects");
    }

    const data = await response.json();
    return data?.payload?.projects;
  } catch (error) {
    console.log("Error getting top projects", error);
  }
};
