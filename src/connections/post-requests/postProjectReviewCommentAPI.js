import axios from "@/axios-config/commonInstance";

export const postProjectReviewCommentAPI = async (payload, token) => {
  try {
    const { data } = await axios.post(`/api/v1/comments`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    return error;
  }
};
