import axios from "@/axios-config/commonInstance";

export const postProjectPictureAPI = async (payload, token) => {
  try {
    const { data } = await axios.post(
      `/api/v1/project_medias?project_review_id=${payload?.project_id}`,
      {
        project_id: payload?.project_id,
        project_name: payload?.project_name,
        project_media: payload?.project_media,
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
    console.log("Error post picture");
  }
};
