import axios from "@/axios-config/commonInstance";

export const postGoogleLoginAPI = async (payload) => {
  try {
    const { data } = await axios.post(`/api/v1/users/google_auth`, payload);
    return data?.payload;
  } catch (error) {
    // throw new Error("Couldn't get top projects");
    console.log("Error google login");
  }
};
