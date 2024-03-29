import axios from "@/axios-config/commonInstance";

export const postCounterOfferAPI = async (payload, token) => {
  try {
    const { data } = await axios.post(
      `api/v1/counter_offer_requests`,
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
