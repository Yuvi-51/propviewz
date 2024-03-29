import axios from "@/axios-config/commonInstance";

export const putMyProfileDetailsAPI = async (userId, payload, token) => {
  try {
    const { data } = await axios.put(
      `/api/v1/users/${userId}`,
      {
        user: payload,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    // throw new Error("Couldn't get top projects");
    console.log("Error put user profile ");
  }
};
