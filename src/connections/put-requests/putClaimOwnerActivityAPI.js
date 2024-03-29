import axios from "@/axios-config/commonInstance";

export const putClaimOwnerActivityAPI = async (editData, token) => {
  try {
    const { data } = await axios.put(
      `/api/v1/projects/claimed_owner_actions`,
      editData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    // throw new Error("Couldn't get top projects");
    console.log("Error post review");
  }
};
