const apiUrl = process.env.NEXT_PUBLIC_API_HOST;

export const getRecentTransactionsAPI = async (cityId) => {
  try {
    const response = await fetch(
      `${apiUrl}/api/v1/transactions/recent_transaction?transaction_type=sale&page=1&city_id=${cityId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    return data?.payload?.project_cards;
  } catch (error) {
    throw new Error("Failed to fetch", error);
  }
};

export const getRecentTransactionsOnProjectAPI = async (
  projectName,
  type,
  unitCategory,
  currentPage,
  villageName,
  token
) => {
  if (projectName && type && unitCategory && currentPage) {
    try {
      const headers = token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {};

      const response = await fetch(
        `${apiUrl}/api/v1/transactions?project_name=${projectName}&transaction_type=${type}&unit_category=${unitCategory}&page=${currentPage}&village=${villageName}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      return {
        data: data?.payload?.transactions,
        count: data?.meta?.count,
        requested: data?.meta?.requested,
      };
    } catch (error) {
      console.log("Failed to fetch", error);
    }
  }
};

export const getRecentTransactionsCountAPI = async (
  projectName,
  villageName,
  token
) => {
  if (projectName) {
    try {
      const headers = token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {};

      const response = await fetch(
        `${apiUrl}/api/v1/projects/total_txn_count?project_name=${projectName}&village=${villageName}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      return data?.payload;
    } catch (error) {
      console.log("Failed to fetch", error);
    }
  }
};
