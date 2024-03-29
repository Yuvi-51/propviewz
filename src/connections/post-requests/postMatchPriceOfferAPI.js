import axios from "@/axios-config/commonInstance";

// export const postMatchPriceOfferAPI = async (payload, token) => {
//   try {
//     const { data } = await axios.post(`/api/v1/transaction_requests/offer_request`, payload, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return data;
//   } catch (error) {
//     // throw new Error("Couldn't get top projects");
//     console.log("Error post request transaction");
//   }
// };
export const postMatchPriceOfferAPI = async (payload, token) => {
  try {
    const { data } = await axios.post(`/api/v1/deals`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    // throw new Error("Couldn't get top projects");
    throw new Error("Error post request transaction");
  }
};
export const postActionOnCounterOfferAPI = async (payload, dealId, token) => {
  try {
    const { data } = await axios.put(`/api/v1/deals/${dealId}`, payload, {
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

export const postNewCounterOfferAPI = async (payload, token) => {
  try {
    const { data } = await axios.post(`/api/v1/offer_requests`, payload, {
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
