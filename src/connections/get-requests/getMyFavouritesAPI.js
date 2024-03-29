const apiUrl = process.env.NEXT_PUBLIC_API_HOST;

export const getMyFavouritesAPI = async (page, token) => {
  try {
    const url = `${apiUrl}/api/v1/favourites/favourite_project_list?page=${page}`;
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
    return responseData;
  } catch (error) {
    console.error("Error getting activity logs:", error);
  }
};
