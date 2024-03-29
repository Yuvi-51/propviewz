const apiUrl = process.env.NEXT_PUBLIC_API_HOST;

export const getSingleProjectAPI = async (
  city,
  location_slug,
  project_slug,
  token
) => {
  if (city && location_slug && project_slug) {
    try {
      const headers = token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {};

      const response = await fetch(
        `${apiUrl}/api/v1/projects/${project_slug}?project_slug=${project_slug}&location_slug=${location_slug}&city=${city}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch project data");
      }

      const data = await response.json();
      return data?.payload;
    } catch (error) {
      console.log("Couldn't get project data", error);
    }
  } else {
    return {};
  }
};
