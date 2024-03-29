"use client";
import { getUserDetailsAPI } from "@/connections/get-requests/getUserDetailsAPI";
import { postMatchPriceOfferAPI } from "@/connections/post-requests/postMatchPriceOfferAPI";
import { postSendLoginOtpAPI } from "@/connections/post-requests/postSendLoginOtpAPI";
import { formatIndianRupees } from "@/logic/format-transaction-amount";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ReactGA from "react-ga";
import { useSelector } from "react-redux";
import ScaleLoader from "react-spinners/ScaleLoader";
import { useToast } from "../ui/use-toast";
import ModalWrapper from "../wrappers/ModalWrapper";
import ProtectedRouteWrapper from "../wrappers/ProtectedRouteWrapper";
import "./MatchOfferModal.scss";
import VerifyPhoneModal from "./VerifyPhoneModal";
import { setFailureToast, setSuccessToast } from "@/logic/handleToasterMsg";

export default function MatchOfferModal({
  triggerElement,
  txnData,
  projectId,
  txn_id,
  onRefreshChange,
}) {
  const token = useSelector((state) => state.auth.token);
  const [loader, setLoader] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState();
  const [modalState, setModalState] = useState(false);
  const txnRate = txnData?.rate_per_sq_feet;
  const txnValue = txnData?.value;
  const [phoneVerifyModalState, setPhoneVerifyModalState] = useState(false);
  const [otpSession, setOtpSession] = useState(""); //TODO: remove passing session when api resolved
  const [toggleUserProfile, setToggleUserProfile] = useState(false);
  const [otpSubmitted, setOtpSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const { toast } = useToast();
  const { loading, data: userProfileData } = useQuery({
    queryKey: ["getUserDetailsAPI", otpSubmitted],
    queryFn: () => getUserDetailsAPI(token),
  });

  const isPhoneNumber = userProfileData?.phone;
  const offerRequest = async () => {
    ReactGA.event({
      category: "User",
      action: "User Sent a Match Price Offer",
      label: "Button Click",
    });
    if (isPhoneNumber) {
      setLoader(true);
      const payload = {
        project_id: projectId,
        transaction_id: txn_id,
        amount: txnData?.value || txnData?.rent,
      };
      try {
        const res = await postMatchPriceOfferAPI(payload, token);
        setLoader(false);
        if (res?.status?.status === "SUCCESS") {
          toast(setSuccessToast("Great", "Offer request sent successfully"));
          onRefreshChange();
          setModalState(false);
        } else {
          toast(setFailureToast());
        }
      } catch (error) {
        setLoader(false);
        toast(setFailureToast());
      }
    } else {
      setError(true);
    }
  };

  const handlePhoneVerify = async (e) => {
    e.preventDefault();
    if (phoneNumber?.length === 10) {
      setError(false); // No error, valid phone number
      const res = await postSendLoginOtpAPI(phoneNumber);
      if (res?.session) {
        setOtpSession(res?.session);
        setPhoneVerifyModalState(true);
      }
    } else {
      setError(true); // Error, phone number should have exactly 10 digits
    }
  };

  return (
    <ProtectedRouteWrapper triggerElement={triggerElement}>
      <ModalWrapper
        open={modalState}
        setOpen={setModalState}
        trigger={triggerElement}
        title={"Make An Offer"}
      >
        <div className="Success">
          <div className="msg">
            Hi , You are submitting below offer <br /> Press Confirm to Continue
          </div>
          <div className="flex flex-col">
            <div className="txn_data">Unit type : {txnData?.unit_type}</div>
            <div className={txnData?.configuration ? "txn_data" : "hidden"}>
              Configuration : {txnData?.configuration}
            </div>
            <div className="txn_data">
              Transaction Date : {txnData?.transaction_date}
            </div>
            <div className="txn_data">
              Total Area : {txnData?.area?.total} sq ft
            </div>
            <div className="txn_data">Rate/sq ft : Rs {txnRate}</div>
            <div className={txnValue ? "txn_data" : "hidden"}>
              Total Value : Rs {formatIndianRupees(txnValue)}
            </div>
            <div className={txnData?.rent ? "txn_data" : "hidden"}>
              Rent : Rs {formatIndianRupees(txnData?.rent)}
            </div>
          </div>
          <div className={isPhoneNumber ? "hidden" : "mt-10"}>
            <div className="flex">
              <input
                type="number"
                id="phone"
                name="phone"
                required=""
                pattern="[0-9]{10}"
                value={phoneNumber}
                onChange={(e) => {
                  e.target.value = Math.max(0, parseInt(e.target.value))
                    .toString()
                    .slice(0, 10);
                  setPhoneNumber(e.target.value);
                  setError(false);
                }}
                className="w-full px-3 py-2 border rounded"
                maxLength={10}
              />
              <VerifyPhoneModal
                triggerElement={
                  <button
                    className={`min-w-max whitespace-nowrap ${
                      1 ? "bg-green-500" : "bg-red-500"
                    } text-white px-3 py-2`}
                    onClick={handlePhoneVerify}
                  >
                    Verify Phone
                  </button>
                }
                modalState={phoneVerifyModalState}
                setModalState={setPhoneVerifyModalState}
                setToggleUserProfile={setToggleUserProfile}
                setOtpSubmitted={setOtpSubmitted}
                phoneNumber={phoneNumber}
                otpSession={otpSession}
              />
            </div>
            {error && (
              <p className="text-red-500">Please enter a valid phone number.</p>
            )}
          </div>

          <button
            type="submit"
            className="review-added-btn"
            onClick={offerRequest}
            style={{ marginBottom: "10px" }}
          >
            {loader ? (
              <ScaleLoader color="#f1592a" height={25} radius={5} width={4} />
            ) : (
              "Confirm & send"
            )}
          </button>
        </div>
      </ModalWrapper>
    </ProtectedRouteWrapper>
  );
}
