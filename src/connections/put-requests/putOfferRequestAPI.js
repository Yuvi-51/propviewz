import axios from "@/axios-config/commonInstance";

export const putOfferRequestAPI = async (payload, token) => {
  try {
    const { data } = await axios.put(
      `/api/v1/transaction_requests/action_on_offer_request`,
      payload,
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

