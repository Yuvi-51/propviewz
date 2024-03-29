import axios from "@/axios-config/commonInstance";

export const postRequestTxnAPI = async (payload, token) => {
  try {
    const { data } = await axios.post(`/api/v1/transaction_requests`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    // throw new Error("Couldn't get top projects");
    console.log("Error post request transaction");
  }
};
