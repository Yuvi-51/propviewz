import axios from "@/axios-config/commonInstance";

export const postProjectErrorReportAPI = async (payload, token) => {
  try {
    const res = await axios.post(`/api/v1/report_errors`, payload, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const responseData = res?.data;
    return responseData;
  } catch (error) {
    throw new Error("gallery image report:", error);
  }
};
