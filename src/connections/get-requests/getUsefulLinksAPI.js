const apiUrl = process.env.NEXT_PUBLIC_API_HOST;

export const getUsefulLinksAPI = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/useful_links`);

    if (!response.ok) {
      throw new Error("Error getting useful links");
    }

    const data = await response.json();
    return data?.payload?.static_pages;
  } catch (error) {
    console.log("Error getting useful links", error);
  }
};
