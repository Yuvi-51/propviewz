const apiUrl = process.env.NEXT_PUBLIC_API_HOST;

export const getFilteredLocationAPI = async (
  location_ids = "",
  unitType = "",
  maxRange = "",
  minRange = "",
  newConfigurations = "",
  unitCategory = "",
  sortBy = "",
  type = "",
  isWithin = "",
  currentPage = ""
) => {
  if (location_ids.length > 0) {
    try {
      const url = `${apiUrl}/api/v1/projects/location_filter?location_ids=${location_ids}&unit_type=${unitType}&max_price=${maxRange}&min_price=${minRange}&configurations=${
        unitCategory === "Commercial" ? "" : newConfigurations
      }&unit_category=${unitCategory}&sort_by=${sortBy}&transaction_type=${type}&transaction_date=${isWithin}&page=${currentPage}`;
      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      return {
        data: responseData?.payload?.project_cards,
        count: responseData?.meta?.count,
      };
    } catch (error) {
      console.error("Error fetching filtered location data:", error);
    }
  }
};
