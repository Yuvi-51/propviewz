import axios from "@/axios-config/commonInstance";

export const postVerifyLoginOtpAPI = async (
  { otp, phone, first_name, last_name },
  otp_session
) => {
  try {
    const res = await axios.post(`/api/v1/users/verify_otp`, {
      otp_session,
      otp,
      user: {
        phone,
        first_name,
        last_name,
      },
    });
    const responseData = res?.data?.payload?.user;
    return responseData;
  } catch (error) {
    console.error("Error postVerifyLoginOtpAPI", error);
  }
};
export const postVerifyPhoneOtpAPI = async (otp, otp_session, phone, token) => {
  try {
    const res = await axios.post(
      `/api/v1/users/verify_phone_otp`,
      {
        otp_session,
        otp,
        user: {
          phone,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const responseData = res?.data;
    return responseData;
  } catch (error) {
    console.error("Error postVerifyLoginOtpAPI", error);
  }
};
export const postVerifyEmailOtpAPI = async (otp, token) => {
  try {
    const res = await axios.post(
      `/api/v1/users/verify_email_otp`,
      {
        otp: otp,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const responseData = res?.data;
    return responseData;
  } catch (error) {
    console.error("Error postVerifyEmailOtpAPI", error);
  }
};
