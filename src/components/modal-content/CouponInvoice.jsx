"use client";
import {
  couponRemoveAPI,
  postCreateCart,
  postVerifyCoupon,
  updateCart,
} from "@/connections/post-requests/postVerifyCoupon";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import ModalWrapper from "../wrappers/ModalWrapper";

export default function CouponInvoice({
  modalState,
  setModalState,
  data,
  setOpenRazorPay,
  setAppliedCoupon,
}) {
  const token = useSelector((state) => state.auth.token);
  const [coupon, setCoupon] = useState("");
  const [isCoupon, setIsCoupon] = useState(false);
  const [response, setResponse] = useState("");
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState(false);

  const handleCoupon = async (e) => {
    try {
      const res = await postVerifyCoupon(coupon, data.id, token);

      if (res?.status?.code === "001") {
        setResponse(res?.payload);
        setAppliedCoupon(res?.payload);
        setIsCoupon(false);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    }
  };
  useEffect(() => {
    if (!modalState) {
      setIsCoupon(false);
      setCoupon("");
      setError(false);

      setResponse("");
    }
    if (modalState) {
      const fetchData = async () => {
        try {
          const res = await postCreateCart(data, token);
          // console.log(res);
          setOrderId(res.payload);
        } catch (error) {
          console.error("Error in postCreateCart:", error);
        }
      };

      fetchData();
    }
  }, [modalState]);

  const handleUpdateCart = async () => {
    try {
      const res = await updateCart(orderId.id, response.id, token);
      console.log(res?.status?.code);

      if (res?.status?.code === "001") {
        setOpenRazorPay(true);
      }
    } catch (error) {}
  };

  const removeCouponHandler = async () => {
    try {
      const res = await couponRemoveAPI(orderId.id, response.id, token);
      if (res.status.code === "001") {
        setResponse("");
        setCoupon("");
        setAppliedCoupon("");
      }
    } catch (error) {}
  };
  return (
    <ModalWrapper open={modalState} setOpen={setModalState}>
      <div className="flex flex-col gap-2 p-4">
        <div className="grid gap-2">
          <div className="flex items-center gap-4">
            <div className="grid gap-1">
              <h2 className="font-semibold text-base">Amount</h2>
            </div>
            <div className="ml-auto grid gap-1 text-right">
              <h3 className="font-semibold text-sm">₹{data?.amount}</h3>
            </div>
          </div>
          <br />
          <hr />
          <div className="flex items-center gap-4">
            <div className="grid gap-1">
              <h2 className="font-semibold text-base">Discount</h2>
              {data?.coupons?.length >= 1 ? (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {data?.coupons && data?.coupons[0]?.value}{" "}
                    {data?.coupons[0].mode === "flat" ? "rs." : "%"}
                  </p>
                  <p className="text-sm text-green-500 dark:text-gray-400">
                    Coupon Applied
                  </p>
                </div>
              ) : (
                <div className="flex flex-col">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {data?.id === response?.plan_id ? response?.value : 0}{" "}
                    {response?.mode === "flat" ? "rs." : "%"}
                  </p>
                  {data?.id === response?.plan_id ? (
                    <p className="w-full gap-5 flex items-center justify-between text-sm text-green-500 dark:text-gray-400">
                      <span>Coupon Applied </span>
                      <span onClick={removeCouponHandler}>
                        <X size={15} color="red" className="cursor-pointer" />
                      </span>
                    </p>
                  ) : (
                    <p
                      onClick={() => setIsCoupon(!isCoupon)}
                      className="flex items-center justify-start gap-2 text-sm text-blue-500 dark:text-gray-400 cursor-pointer"
                    >
                      <span>Apply Coupon </span>
                      <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping shadow-md border border-gray-200" />
                    </p>
                  )}
                  {isCoupon && (
                    <div className="flex items-center gap-2 justify-center w-full mt-3">
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded"
                        placeholder="Enter coupon code here"
                        onChange={(e) => {
                          setCoupon(e.target.value);
                          setError(false);
                        }}
                      />

                      <Button onClick={handleCoupon}>Apply</Button>
                    </div>
                  )}
                  {error && (
                    <span className="text-red-500">Invalid Coupon</span>
                  )}
                </div>
              )}
            </div>
            <div className="ml-auto grid gap-1 text-right">
              {data?.coupons?.length >= 1 ? (
                <h3 className="font-semibold text-red-500 text-sm">
                  - ₹{data?.coupons && data?.coupons[0]?.discounted_value}
                </h3>
              ) : (
                <h3 className="font-semibold text-red-500 text-sm">
                  - ₹{" "}
                  {data?.id === response?.plan_id
                    ? response?.discounted_value
                    : 0}
                </h3>
              )}
            </div>
          </div>
          <br />
          <hr />
          <div className="flex items-center gap-4">
            <div className="grid gap-1">
              <h2 className="font-semibold text-base">Subtotal</h2>
            </div>
            <div className="ml-auto grid gap-1 text-right">
              <h3 className="font-semibold text-sm">Total</h3>
              {data?.coupons?.length >= 1 ? (
                <h3 className="font-semibold text-sm">
                  ₹{data?.coupons && data?.coupons[0]?.new_amount}
                </h3>
              ) : (
                <h3>
                  {" "}
                  ₹{" "}
                  {data?.id === response?.plan_id
                    ? response?.new_amount
                    : data?.amount}
                </h3>
              )}
            </div>
          </div>
          <br />
          <hr />
          <Button
            onClick={() => {
              setModalState(false);
              handleUpdateCart();

              setIsCoupon(false);
            }}
          >
            Confirm & Pay
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
}
