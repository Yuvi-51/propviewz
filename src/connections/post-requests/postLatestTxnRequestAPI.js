import axios from "@/axios-config/commonInstance";

export const postLatestTxnRequestAPI = async (payload, token) => {
  try {
    const { data } = await axios.post(`/api/v1/transaction_requests`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
