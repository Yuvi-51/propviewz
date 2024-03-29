import axios from "@/axios-config/commonInstance";

export const postNewsletterSubscriptionAPI = async (email) => {
  try {
    const { data } = await axios.post(`/api/v1/subscribers`, {
      email,
    });
    return data;
  } catch (error) {
    return error;
  }
};
