import axios from "@/axios-config/commonInstance";

export const postSendLoginOtpAPI = async (phone) => {
  try {
    const res = await axios.post(`/api/v1/users/send_otp?phone=${phone}`);
    const responseData = res?.data?.payload;
    return responseData;
  } catch (error) {
    console.error("Error postSendLoginOtpAPI:", error);
  }
};

export const postSendEmailOtpAPI = async (email, token) => {
  try {
    const res = await axios.post(
      `/api/v1/users/send_otp`,
      {
        email: email,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return res;
  } catch (error) {}
};
