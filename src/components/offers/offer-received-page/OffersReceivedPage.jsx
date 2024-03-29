"use client";
import { getOfferRequestsAPI } from "@/connections/get-requests/getOfferRequestsAPI";
import useAsync from "@/custom/useAsync";
import { useState } from "react";
import { useSelector } from "react-redux";
import "./OffersReceivedPage.scss";

import FacelessNegotiation from "@/components/modal-content/FacelessNegotiation";
import { formatOfferTransactionAmount } from "@/logic/format-transaction-amount";
import ReactGA from "react-ga";
import { ClipLoader } from "react-spinners";

const OffersReceivedPage = () => {
  const [openId, setOpenId] = useState(null);
  const [showData, setShowData] = useState(false);
  const [modalState, setModalState] = useState(false);
  const [selectedId, setSelectedId] = useState();

  const token = useSelector((state) => state.auth.token);

  const {
    loading,
    error,
    value: data,
  } = useAsync(getOfferRequestsAPI, [showData], [token, "owner"]);

  const onClinkHandler = (clickedId) => {
    ReactGA.event({
      category: "User",
      action: "Claimed Owner Clicked Offer",
      label: "Button Click",
    });
    setOpenId((prevOpenId) => (prevOpenId === clickedId ? null : clickedId));
  };
  const setShowSuccessModalCallback = (value) => {
    setShowSuccessModal(value);
  };

  // console.log("data", data);
  return (
    <div className="offer_page">
      <div className="container mx-auto">
        {loading ? (
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
            }}
          >
            <ClipLoader color="#f1592a" />
          </div>
        ) : (
          <>
            <div className="carousal-heading">
              <p className="p-heading">
                <h3>Activity / Offers Received</h3>
              </p>
              <p className="hr-line"></p>
            </div>

            <div className={data?.length > 0 ? "hidden" : "no_offer_div"}>
              <div className="offer_data">
                You Have Not Received Any Offer....
              </div>
            </div>
            <div className="offer_container w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              {data &&
                data?.map((data, index) => (
                  <div className="offer_card " key={index}>
                    <h3 className="w-full flex justify-center items-center">
                      {data?.project_name}, {data?.location}
                    </h3>
                    <div className="text-black whitespace-wrap p-4">
                      {`${data?.user_name} offered `}
                      <strong>
                        ₹ {formatOfferTransactionAmount(data?.value)}{" "}
                      </strong>{" "}
                      for{" "}
                      <strong>
                        {data?.unit_type === "Flat" && data?.configuration}{" "}
                        {data?.unit_type}{" "}
                      </strong>{" "}
                      on {"  "}
                      {`${data?.offer_requests[0]?.raised_at}`}
                    </div>

                    {data?.status === "matched" ? (
                      <div
                        className="w-full flex items-center justify-center  rounded-lg bg-green-300 shadow-sm p-10 cursor-pointer h-1"
                        onClick={() => {
                          setModalState(true);
                          setSelectedId(data.id);
                        }}
                      >
                        {data.offer_requests[data?.offer_requests.length - 1]
                          ?.role === "owner"
                          ? "Offer Accepted By  Customer"
                          : "Offer Accepted By You"}
                      </div>
                    ) : data?.status === "declined" ? (
                      <div
                        className="w-full flex items-center justify-center  rounded-lg bg-red-300 shadow-sm p-10 cursor-pointer h-1"
                        onClick={() => {
                          setModalState(true);
                          setSelectedId(data.id);
                        }}
                      >
                        {data.offer_requests[data?.offer_requests.length - 1]
                          ?.role === "owner"
                          ? "Offer Declined By  Customer"
                          : "Offer Declined By You"}
                      </div>
                    ) : data.offer_requests.length === 1 ? (
                      <div
                        className="w-full flex items-center justify-center  rounded-lg bg-orange-400 shadow-sm p-10 cursor-pointer h-1"
                        onClick={() => {
                          setModalState(true);
                          setSelectedId(data.id);
                        }}
                      >
                        Offer Received
                      </div>
                    ) : (
                      <div
                        className="w-full flex items-center justify-center  rounded-lg bg-yellow-300 shadow-sm p-10 cursor-pointer h-1"
                        onClick={() => {
                          setModalState(true);
                          setSelectedId(data.id);
                        }}
                      >
                        Counter Offer by{" "}
                        {data.offer_requests[data?.offer_requests.length - 1]
                          ?.role === "user"
                          ? "Customer"
                          : "You"}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
      <FacelessNegotiation
        setShowData={setShowData}
        offerSection={"received"}
        modalState={modalState}
        setModalState={setModalState}
        selectedId={selectedId}
      />
    </div>
  );
};

export default OffersReceivedPage;
