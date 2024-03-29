import axios from "axios";

const razorpayApiKey = process.env.NEXT_PUBLIC_RAZOR_API_KEY;

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export async function displayRazorpay(
  data,
  token,
  callback,
  contactNumber,
  appliedCoupon
) {
  const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
  const HOST = process.env.NEXT_PUBLIC_API_HOST;
  if (!res) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }

  const simulatedResponse = {
    data: {
      amount:
        appliedCoupon?.plan_id === data?.id
          ? appliedCoupon?.new_amount * 100
          : data?.coupons?.length >= 1
          ? data?.coupons[0]?.new_amount * 100
          : data.amount * 100,
      id: data.id,
      currency: "INR",
    },
  };
  const { amount, currency } = simulatedResponse.data;

  const options = {
    key: razorpayApiKey,
    amount: amount.toString(),
    currency: currency,
    name: "Propviewz Technologies pvt. ltd.",
    description: "Test Transaction",
    handler: async function (response) {
      if (data.generateReport === true && callback) {
        callback(response);
      }
      const postData = () => {
        axios
          .post(
            `${HOST}/api/v1/orders/purchase `,
            {
              plan_id: data.id,
              coupon_id:
                appliedCoupon.plan_id === data.id
                  ? appliedCoupon?.id
                  : data.coupons[0]?.id,
              payment_id: response.razorpay_payment_id,
            },
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          )
          .then((data) => {
            console.log(data);
            if (callback) {
              callback(data);
            }
            // Pass the response data to the parent component
          })
          .catch((error) => {
            console.error(error);
          });
      };

      if (data.generateReport !== true) {
        postData();
      }

      const simulatedPaymentResult = {
        data: {
          msg: "Payment successful!",
        },
      };

      // alert(simulatedPaymentResult.data.msg);
    },
    theme: {
      color: "#f1592a",
    },
    prefill: {
      contact: contactNumber && contactNumber,
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
}
