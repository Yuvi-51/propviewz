"use client";
import ProtectedRouteWrapper from "@/components/wrappers/ProtectedRouteWrapper";
import { getPlansAPI } from "@/connections/get-requests/getPlansAPI";
import useAsync from "@/custom/useAsync";
import { displayRazorpay } from "@/logic/razorpay-request/razorPayPaymentAPI";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./BuyNowCards.scss";
import { SliderProvider } from "@/app/providers";
import CouponInvoice from "@/components/modal-content/CouponInvoice";
import SuccessInfoModal from "@/components/modal-content/SuccessInfoModal";
import ReactGA from "react-ga";

const BuyNowCards = () => {
  const { user } = useSelector((state) => state.user);
  const token = useSelector((state) => state.auth.token);
  const [purchaseSuccess, setPurchaseSuccess] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [invoiceModal, setInvoiceModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState([]);
  const [openRazorPay, setOpenRazorPay] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const contactNumber = user?.phone;

  const {
    loading,
    error,
    value: paymentPlans,
  } = useAsync(getPlansAPI, [], [token, "view_transaction"]);

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
      action: "User Clicked on Buy Now",
      label: "Button Click",
    });
    setOpenRazorPay(false);

    // setModalState(false);
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
    }
  };

  return (
    <div className="buy_now">
      <div className="carousal-heading">
        <div className="p-heading">
          <h3>Choose your Pricing Plan</h3>
          <div className="trend-line" />
        </div>
      </div>
      <SliderProvider>
        {paymentPlans?.map((data, i) => (
          <div key={i}>
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
                width="106"
                height="106"
                viewBox="0 0 98 106"
                fill="none"
                className="svg_circle"
              >
                <circle
                  cx="49"
                  cy="49"
                  r="53"
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
                <circle cx="49" cy="49" r="47" fill="white" />
                <text
                  x="50%"
                  y="30%"
                  fontSize="16"
                  fontWeight="500"
                  fill="black"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  Rs
                </text>
                <text
                  x="35%"
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
                        y="55%"
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
                    <tspan x="50%" y="60%">
                      {data?.amount}
                    </tspan>
                  )}
                </text>
              </svg>
              {/* 
        {expandedIndex === i && ( */}
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
                      // size={28}
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
                      // size={28}
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
                      // size={28}
                    />

                    <p>{data?.description[2][2]}</p>
                  </div>
                </div>
                <ProtectedRouteWrapper
                  triggerElement={
                    <div className="btn_div ">
                      <div className="buy_now_btn">
                        <span>BUY NOW </span>
                      </div>
                    </div>
                  }
                  callback={() => invoiceHandler(data, token)}
                >
                  <div className="btn_div ">
                    <div
                      className="buy_now_btn"
                      onClick={() => invoiceHandler(data, token)}
                    >
                      <span>BUY NOW </span>
                    </div>
                  </div>
                </ProtectedRouteWrapper>
              </>
              {/* )} */}
            </div>
          </div>
        ))}
      </SliderProvider>
      <SuccessInfoModal
        modalState={showSuccessModal}
        setModalState={setShowSuccessModal}
        // onMountComplete={onClose}
      >
        <div className="text-center">
          <img src="/images/review added.svg" alt="img" className="m-auto" />
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
          <p className="text-[13px]">Please refresh the page for updated views</p>
        </div>
      </SuccessInfoModal>
      <CouponInvoice
        modalState={invoiceModal}
        setModalState={setInvoiceModal}
        data={selectedPlan}
        setOpenRazorPay={setOpenRazorPay}
        setAppliedCoupon={setAppliedCoupon}
      />
    </div>
  );
};

export default BuyNowCards;
