import axios from "@/axios-config/commonInstance";

export const postProjectPlanningReportDataAPI = async (payload, token) => {
  try {
    const { data } = await axios.post(`/api/v1/reports`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error posting project planning report:", error);

    // Re-throw the error to propagate it up the call stack if needed
    throw error;
  }
};