import axios from "@/axios-config/commonInstance";

export const postProjectClaimAPI = async (payload, token) => {
  try {
    const res = await axios.post(`/api/v1/claim_requests`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const responseData = res?.data;
    return responseData;
  } catch (error) {
    console.error("Error claim post:", error);
  }
};
