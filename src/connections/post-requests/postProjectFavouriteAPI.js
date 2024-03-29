import axios from "@/axios-config/commonInstance";

export const postProjectFavouriteAPI = async (payload, token) => {
  try {
    const res = await axios.post(`/api/v1/favourites`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const responseData = res?.data?.payload;
    return responseData;
  } catch (error) {
    console.error("Error making favourite:", error);
  }
};
