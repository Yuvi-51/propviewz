const apiUrl = process.env.NEXT_PUBLIC_API_HOST;

export const getOfferRequestsAPI = async (token, role) => {
  try {
    const url = `${apiUrl}/api/v1/deals?role=${role}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData?.payload?.deals;
  } catch (error) {
    console.error("Error getting activity logs:", error);
  }
};

export const getDealDetailAPI = async (selectedId, token) => {
  if (selectedId) {
    try {
      const url = `${apiUrl}/api/v1/deals/${selectedId}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      return responseData?.payload;
    } catch (error) {
      console.error("Error getting activity logs:", error);
    }
  }
};
// export const getOfferRequestsAPI = async (role, token) => {
//   try {
//     const url = `${apiUrl}/api/v1/transaction_requests/offer_request_index?role=${role}`;
//     const response = await fetch(url, {
//       method: "GET",
//       headers: {
//         Authorization: "Bearer " + token,
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const responseData = await response.json();
//     return responseData?.payload?.transaction_requests;
//   } catch (error) {
//     console.error("Error getting activity logs:", error);
//   }
// };
