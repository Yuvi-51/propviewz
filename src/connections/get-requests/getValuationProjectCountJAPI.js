const apiUrl = process.env.NEXT_PUBLIC_API_HOST;

export const getValuationProjectCountAPI = async (payload, token) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(
      `${apiUrl}/api/v1/projects/project_counts_within_range?${payload}`,
      { headers }
    );

    // if (!response.ok) {
    //   throw new Error("Failed to fetch data");
    // }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return error;
  }
};
