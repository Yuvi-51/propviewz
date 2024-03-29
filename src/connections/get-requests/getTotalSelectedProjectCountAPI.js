const apiUrl = process.env.NEXT_PUBLIC_API_HOST;
export const getTotalSelectedProjectCountAPI = async (ids, token) => {
  try {
    const headers = token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {};

    const response = await fetch(
      `${apiUrl}/api/v1/projects/calculate_total_cost_for_selected_projects?selected_project_ids=${ids}`,
      { headers }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    return data?.payload;
  } catch (error) {
    console.log("Failed to fetch", error);
  }
};
