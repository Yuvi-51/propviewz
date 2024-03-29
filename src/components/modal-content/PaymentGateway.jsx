"use client";
import { getPlansAPI } from "@/connections/get-requests/getPlansAPI";
import useAsync from "@/custom/useAsync";
import { displayRazorpay } from "@/logic/razorpay-request/razorPayPaymentAPI";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ModalWrapper from "../wrappers/ModalWrapper";
import ProtectedRouteWrapper from "../wrappers/ProtectedRouteWrapper";
import "./PaymentGateway.scss";

import ReactGA from "react-ga";
import CouponInvoice from "./CouponInvoice";
import SuccessInfoModal from "./SuccessInfoModal";

export default function PaymentGateway({
  triggerElement,
  triggerAction,
  setUpdateData,
}) {
  const [modalState, setModalState] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [invoiceModal, setInvoiceModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState([]);
  const [openRazorPay, setOpenRazorPay] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const token = useSelector((state) => state.auth.token);

  const { user } = useSelector((state) => state.user);
  const contactNumber = user?.phone;
  <SuccessInfoModal
    modalState={showSuccessModal}
    setModalState={setShowSuccessModal}
  >
    <div className="text-center">
      <img src="/images/review added.svg" alt="img" className="m-auto" />
      <h5 className="text-[20px] font-bold">
        Congratulations You Got{" "}
        {purchaseSuccess?.data?.payload?.plan_id === 1
          ? "100"
          : purchaseSuccess?.data?.payload?.plan_id === 2
          ? "300"
          : purchaseSuccess?.data?.payload?.plan_id === 2
          ? "300"
          : null}
        Views
      </h5>
    </div>
  </SuccessInfoModal>;
  const {
    loading,
    error,
    value: paymentPlans,
  } = useAsync(getPlansAPI, [], [token, "view_transaction"]);

  useEffect(() => {
    if (triggerAction === true) {
      setModalState(true);
    }
  }, [triggerAction]);
  const invoiceHandler = (data, token) => {
    setSelectedPlan(data);
    setInvoiceModal(true);
  };
  useEffect(() => {
    if (openRazorPay) {
      razorPayHandler(selectedPlan, token, appliedCoupon);
    }
  }, [openRazorPay]);
  const razorPayHandler = (data, token, appliedCoupon) => {
    ReactGA.event({
      category: "User",
      action: "User Clicked on BUY NOW",
      label: "Button Click",
    });
    setModalState(false);
    setOpenRazorPay(false);
    displayRazorpay(
      data,
      token,
      handleRazorpayResponse,
      contactNumber,
      appliedCoupon
    );
  };
  const handleRazorpayResponse = (response) => {
    setPurchaseSuccess(response);
    if (response.status === 200) {
      setShowSuccessModal(true);
      setUpdateData(true);
    }
  };

  return (
    <ProtectedRouteWrapper triggerElement={triggerElement}>
      <ModalWrapper
        open={modalState}
        setOpen={setModalState}
        trigger={triggerElement}
        title={
          <div className="text-center flex justify-center gap-2 items-center">
            <hr className="border-[#f1592a] border-2 w-[57px]"></hr>
            <div className="text-[20px]">Choose Your Pricing Plan</div>
            <hr className="border-[#f1592a] border-2 w-[57px]"></hr>
          </div>
        }
      >
        <div className="Payment_cards_div">
          {paymentPlans?.map((data, i) => (
            <div
              className={
                data?.id === 1
                  ? "card_main_div_orange"
                  : data.id === 2
                  ? "card_main_div_green"
                  : data.id === 3
                  ? "card_main_div_blue"
                  : ""
              }
              key={data.id}
            >
              <div className="card_header">
                <span>{data?.quantity}</span> TRANSACTIONS
              </div>
              <div className="hr_line"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="98"
                height="98"
                viewBox="0 0 98 98"
                fill="none"
                className="svg_circle"
              >
                <circle
                  cx="49"
                  cy="49"
                  r="49"
                  fill={
                    data.id === 1
                      ? "#F2BC69"
                      : data.id === 2
                      ? "#98E8A1"
                      : data.id === 3
                      ? "#9FD2FF"
                      : ""
                  }
                />
                <circle cx="49" cy="49" r="41" fill="white" />
                <text
                  x="50%"
                  y="35%"
                  fontSize="16"
                  fontWeight="500"
                  fill="black"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  Rs
                </text>
                <text
                  x="50%"
                  y="60%"
                  fontSize="20"
                  fontWeight="600"
                  fill={"black"}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {data?.coupons?.length > 0 ? (
                    <>
                      <tspan
                        x="50%"
                        y="60%"
                        style={{
                          textDecoration: "line-through",
                          fill: "red",
                        }}
                      >
                        {data?.amount}
                      </tspan>
                      <tspan x="50%" dy="1em">
                        {data?.coupons[0]?.new_amount}
                      </tspan>
                    </>
                  ) : (
                    <tspan x="50%" y="70%">
                      {data?.amount}
                    </tspan>
                  )}
                </text>
              </svg>
              <>
                <div className="card_content">
                  <div className="check_icon">
                    <Check
                      style={{
                        color: `${
                          data.id === 1
                            ? "#F2BC69"
                            : data.id === 2
                            ? "#98E8A1"
                            : data.id === 3
                            ? "#9FD2FF"
                            : ""
                        }`,
                        fontSize: "28px",
                      }}
                    />
                    <p>{data?.description[0][0]}</p>
                  </div>
                  <div className="check_icon">
                    <Check
                      style={{
                        color: `${
                          data.id === 1
                            ? "#F2BC69"
                            : data.id === 2
                            ? "#98E8A1"
                            : data.id === 3
                            ? "#9FD2FF"
                            : ""
                        }`,
                        fontSize: "28px",
                      }}
                    />
                    <p>{data?.description[1][1]}</p>
                  </div>
                  <div className="check_icon">
                    <Check
                      style={{
                        color: `${
                          data.id === 1
                            ? "#F2BC69"
                            : data.id === 2
                            ? "#98E8A1"
                            : data.id === 3
                            ? "#9FD2FF"
                            : ""
                        }`,
                        fontSize: "28px",
                      }}
                    />

                    <p>{data?.description[2][2]}</p>
                  </div>
                </div>
                <div className="btn_div">
                  <div
                    className="buy_now_btn"
                    onClick={() => invoiceHandler(data, token)}
                  >
                    <span>BUY NOW </span>
                  </div>
                </div>
              </>
            </div>
          ))}
          <SuccessInfoModal
            modalState={showSuccessModal}
            setModalState={setShowSuccessModal}
          >
            <div className="text-center">
              <img
                src="/images/review added.svg"
                alt="img"
                className="m-auto"
              />
              <h5 className="text-[20px] font-bold">
                Congratulations You Got{" "}
                <span style={{ color: "#f1592a" }}>
                  {" "}
                  {purchaseSuccess?.data?.payload?.plan_id === 1
                    ? "10"
                    : purchaseSuccess?.data?.payload?.plan_id === 2
                    ? "50"
                    : purchaseSuccess?.data?.payload?.plan_id === 3
                    ? "100"
                    : null}
                </span>{" "}
                Views
              </h5>
              <p className="text-[13px]">
                Please refresh the page for updated views
              </p>
            </div>
          </SuccessInfoModal>
        </div>
      </ModalWrapper>
      <CouponInvoice
        modalState={invoiceModal}
        setModalState={setInvoiceModal}
        data={selectedPlan}
        setOpenRazorPay={setOpenRazorPay}
        setAppliedCoupon={setAppliedCoupon}
      />
    </ProtectedRouteWrapper>
  );
}
