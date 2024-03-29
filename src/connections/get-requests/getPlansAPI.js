const apiUrl = process.env.NEXT_PUBLIC_API_HOST;

export const getPlansAPI = async (token, planType) => {
  try {
    const url = `${apiUrl}/api/v1/plans?plan_type=${planType}`;
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
    return responseData?.payload?.plans;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
