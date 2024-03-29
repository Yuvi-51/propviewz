import axios from "@/axios-config/commonInstance";

export const postReviewsVoteAPI = async (payload, token) => {
  try {
    const { data } = await axios.post(`/api/v1/review_votes`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data?.payload?.status;
  } catch (error) {
    // throw new Error("Couldn't get top projects");
    console.log("Error post review vote");
  }
};
