import axios from "@/axios-config/commonInstance";

export const postContactUsAPI = async (payload) => {
  try {
    const { data } = await axios.post(`/api/v1/contact_forms`, payload);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
