const apiUrl = process.env.NEXT_PUBLIC_API_HOST;

export const getViewedTransactionsAPI = async (currentPage, token) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(
      `${apiUrl}/api/v1/transactions/viewed_transaction?page=${currentPage}`,
      { headers }
    );

    if (!response.ok) {
      throw new Error("Error getting viewed_transaction");
    }

    const data = await response.json();
    return { data: data?.payload?.transactions, count: data?.meta?.count };
  } catch (error) {
    console.log("Error getting viewed_transaction", error);
  }
};
