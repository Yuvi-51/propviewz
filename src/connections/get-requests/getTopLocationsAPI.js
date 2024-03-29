const apiUrl = process.env.NEXT_PUBLIC_API_HOST;

export const getTopLocationsAPI = async (cityId) => {
  try {
    const response = await fetch(
      `${apiUrl}/api/v1/locations/top_locations?city_id=${cityId}`
    );

    if (!response.ok) {
      throw new Error("Couldn't get top locations");
    }

    const data = await response.json();
    return data?.payload?.locations;
  } catch (error) {
    console.log("Couldn't get top locations", error);
  }
};
