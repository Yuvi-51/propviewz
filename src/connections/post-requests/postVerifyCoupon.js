import axios from "@/axios-config/commonInstance";

export const postVerifyCoupon = async (coupon, id, token) => {
  try {
    const res = await axios.post(
      `/api/v1/coupons/verify`,
      {
        plan_id: id,
        coupon_code: coupon,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const responseData = res.data;
    return responseData;
  } catch (error) {
    console.error("Error postVerifyCoupon:", error.response.data); // Log the detailed error response
    throw error;
  }
};

export const postCreateCart = async (data, token) => {
  try {
    const res = await axios.post(
      `/api/v1/orders/create_cart`,
      {
        plan_id: data.id,
        coupon_id: data?.coupons[0]?.id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const responseData = res.data;
    return responseData;
  } catch (error) {
    console.error("Error postVerifyCoupon:", error.response.data); // Log the detailed error response
    throw error;
  }
};

export const updateCart = async (orderId, couponId, token) => {
  try {
    const res = await axios.post(
      `/api/v1/orders/update_cart`,
      {
        order_id: orderId,
        coupon_id: couponId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const responseData = res.data;
    return responseData;
  } catch (error) {
    console.error("Error postVerifyCoupon:", error.response.data); // Log the detailed error response
    throw error;
  }
};

export const couponRemoveAPI = async (orderId, couponId, token) => {
  try {
    const res = await axios.post(
      `/api/v1/orders/remove_coupon`,
      {
        order_id: orderId,
        coupon_id: couponId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const responseData = res.data;
    return responseData;
  } catch (error) {
    console.error("Error postVerifyCoupon:", error.response.data); // Log the detailed error response
    throw error;
  }
};
