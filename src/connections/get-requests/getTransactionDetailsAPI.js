// const apiUrl = process.env.NEXT_PUBLIC_API_HOST;
// export const getTransactionDetailsAPI = async (id, encryptedText, token) => {
//   try {
//     const headers = {
//       Authorization: `Bearer ${token}`,
//     };
//     const url = token
//       ? `${apiUrl}/api/v1/transactions/view?id=${id}`
//       : `${apiUrl}/api/v1/transactions/view?id=${id}&saes=${encryptedText}`;

//     const response = await fetch(url, {
//       headers,
//     });
//     if (!response.ok) {
//       throw new Error("Error getting transactions");
//     }

//     const data = await response.json();
//     return data?.payload;
//   } catch (error) {
//     console.log("Error getting transactions", error);
//   }
// };

// const apiUrl = process.env.NEXT_PUBLIC_API_HOST;

// export const getTransactionDetailsAPI = async (id, encryptedText, token) => {
//   try {
//     const requestOptions = {
//       method: "GET", // or any other HTTP method you're using
//     };

//     if (token) {
//       requestOptions.headers = {
//         Authorization: `Bearer ${token}`,
//       };
//     }

//     const url = token
//       ? `${apiUrl}/api/v1/transactions/view?id=${id}`
//       : `${apiUrl}/api/v1/transactions/view?id=${id}&saes=${encryptedText}`;

//     const response = await fetch(url, requestOptions);

//     if (!response.ok) {
//       throw new Error("Error getting transactions");
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.log("await response.json()", response);
//     console.log("Error getting transactions", error);
//   }
// };

const apiUrl = process.env.NEXT_PUBLIC_API_HOST;

export const getTransactionDetailsAPI = async (id, ipAddress, token) => {
  try {
    const requestOptions = {
      method: "GET",
    };

    if (token) {
      requestOptions.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    const url = token
      ? `${apiUrl}/api/v1/transactions/view?id=${id}`
      : `${apiUrl}/api/v1/transactions/view?id=${id}&sip=${ipAddress}`;

    const response = await fetch(url, requestOptions);

    if (response.status === 200) {
      const data = await response.json();
      return data;
    } else if (response.status === 404) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Error getting transactions");
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
