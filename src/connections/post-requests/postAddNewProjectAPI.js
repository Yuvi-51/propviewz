import axios from "@/axios-config/commonInstance";

export const postAddNewProjectAPI = async (payload, token) => {
  try {
    const { data } = await axios.post(
      `/api/v1/project_requests`,
      {
        project_request: payload,
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
    console.log("Error post add new project");
  }
};
