const apiUrl = process.env.NEXT_PUBLIC_API_HOST;

export const getCountryStateAPI = async (token) => {
  try {
    const url = `${apiUrl}/api/v1/states`;
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
    return responseData?.payload?.states;
  } catch (error) {
    console.error("Error fetching state:", error);
  }
};

export const getCountryCityAPI = async (state_id, token) => {
  if (state_id) {
    try {
      const url = `${apiUrl}/api/v1/state_cities?state_id=${state_id}`;
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
      return responseData?.payload?.cities;
    } catch (error) {
      console.error("Error fetching city:", error);
    }
  }
};
