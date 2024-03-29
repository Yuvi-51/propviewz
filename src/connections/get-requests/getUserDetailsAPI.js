const apiUrl = process.env.NEXT_PUBLIC_API_HOST;

export const getUserDetailsAPI = async (token) => {
  if (token) {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(`${apiUrl}/api/v1/users/profile`, {
        headers,
      });

      if (!response.ok) {
        throw new Error("Error getting user details");
      }

      const data = await response.json();
      return data?.payload;
    } catch (error) {
      console.log("Error getting user details", error);
    }
  }
};
