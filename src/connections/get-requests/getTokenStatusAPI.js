const apiUrl = process.env.NEXT_PUBLIC_API_HOST;

export const getTokenStatusAPI = async (token) => {
  if (token) {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(
        `${apiUrl}/api/v1/users/authenticate_user_by_token`,
        {
          headers,
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized access, handle accordingly
          return { status: "unauthorized" };
        }
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      throw error; // Rethrow the error for the higher-level error handling
    }
  }
};
