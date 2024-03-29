const apiUrl = process.env.NEXT_PUBLIC_API_HOST;

export const getMyOrdersAPI = async (trackable_type, token) => {
  try {
    const url = `${apiUrl}/api/v1/users/fetch_activity_logs?trackable_type=${trackable_type}`;
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
    return responseData?.payload?.activity_logs;
  } catch (error) {
    console.error("Error getting activity logs:", error);
  }
};
