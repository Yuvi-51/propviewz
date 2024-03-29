"use client";
import { getDealDetailAPI } from "@/connections/get-requests/getOfferRequestsAPI";
import {
  postActionOnCounterOfferAPI,
  postNewCounterOfferAPI,
} from "@/connections/post-requests/postMatchPriceOfferAPI";
import useAsync from "@/custom/useAsync";
import { formatIndianRupees } from "@/logic/format-transaction-amount";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ModalWrapper from "../wrappers/ModalWrapper";

export default function FacelessNegotiation({
  modalState,
  setModalState,
  selectedId,
  offerSection,
  setShowData,
}) {
  const token = useSelector((state) => state.auth.token);
  const [isCounter, setIsCounter] = useState(false);
  // const [action, setAction] = useState("");
  const [counter, setCounter] = useState();
  const [counterDealId, setCounterDealId] = useState();
  const [refreshApi, setRefreshApi] = useState(false);
  const increment = () => {
    setCounter((prevCounter) => prevCounter + 25000);
  };

  const decrement = () => {
    if (counter >= 25000) {
      setCounter((prevCounter) => prevCounter - 25000);
    } else {
      setCounter(0);
    }
  };

  const {
    loading,
    error,
    value: data,
  } = useAsync(getDealDetailAPI, [refreshApi], [selectedId, token]);

  const offerRequest = async (action, dealId) => {
    setRefreshApi(false);
    setIsCounter(false);
    const payload = {
      deal: {
        status: action, // status:  declined: 2, matched: 3 , abandoned: 4
      },
    };
    try {
      const res = await postActionOnCounterOfferAPI(payload, dealId, token);
      if (res.status.status === "SUCCESS") {
        setRefreshApi(true);
        setShowData(true);
      }
    } catch (error) {}
  };

  const CounterOfferRequest = async () => {
    setRefreshApi(false);
    const payload = {
      offer_request: {
        deal_id: counterDealId,
        amount: counter,
      },
    };
    try {
      const res = await postNewCounterOfferAPI(payload, token);
      // console.log(res.status.status);
      if (res.status.status === "SUCCESS") {
        setRefreshApi(true);
        setIsCounter(false);
        setShowData(true);
      }
    } catch (error) {}
  };

  // const entries = [1, 2, 3, 4, 5, 6];
  useEffect(() => {
    if (data) {
      setCounter(data?.offer_requests[0]?.amount);
    }
  }, [data]);
  // useEffect(() => {
  //   if ((action === "matched" || "declined") && dealId) {
  //     offerRequest();
  //   }
  // }, [action, dealId]);

  // console.log("data", data);
  return (
    <ModalWrapper open={modalState} setOpen={setModalState}>
      <div
        className="flex justify-start items-center flex flex-col  max-h-80 overflow-y-auto"
        style={{
          scrollbarWidth: "thin", // Adjust the width as needed
          scrollbarColor: "#f1592a #f1f1f1", // Color of the thumb and track
        }}
      >
        {data?.offer_requests.map((item, index) => (
          <div className="" key={index}>
            <div
              className={
                offerSection === "sent"
                  ? "flex justify-center items-center flex-col gap-2 w-full "
                  : "hidden"
              }
            >
              <div className="flex justify-center items-center flex-col gap-1">
                <p className="text-sm font-medium text-orange-600">
                  {item?.role === "user" ? "Customer Msg" : "Developer Msg"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {" "}
                  {item?.role === "user"
                    ? `You have sent an offer of ₹ ${formatIndianRupees(
                        item?.amount
                      )} to Developer on ${item?.raised_at}`
                    : `Developer has sent an offer to you  of ₹ ${formatIndianRupees(
                        item?.amount
                      )} on ${item?.raised_at}`}
                </p>
              </div>

              <div
                className={
                  data.offer_requests.length > 1 &&
                  index < data.offer_requests.length - 1
                    ? ""
                    : "hidden"
                }
              >
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="35"
                  viewBox="0 0 24 35"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-git-commit-vertical"
                >
                  <path d="M12 0v12" />
                  <circle cx="12" cy="15" r="3" />
                  <path d="M12 18v11" />
                </svg> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="#f1592a"
                  stroke="#f1592a"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-arrow-big-down"
                >
                  <path d="M15 6v10h4l-7 7-7-7h4V6h6z" />
                </svg>
              </div>
            </div>
            {/* received section/ */}
            <div
              className={
                offerSection === "received"
                  ? "flex justify-center items-center flex-col gap-2 w-full "
                  : "hidden"
              }
            >
              <div className="flex justify-center items-center flex-col gap-1">
                <p className="text-sm font-medium text-orange-600">
                  {item?.role === "user" ? "Customer Msg" : "Developer Msg"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {" "}
                  {item?.role === "user"
                    ? `User has sent an offer to you  of  ₹ ${formatIndianRupees(
                        item?.amount
                      )} on ${item?.raised_at}`
                    : `You have sent an offer of ₹ ${formatIndianRupees(
                        item?.amount
                      )} to Customer on ${item?.raised_at}`}
                </p>
              </div>

              <div
                className={
                  data.offer_requests.length > 1 &&
                  index < data.offer_requests.length - 1
                    ? ""
                    : "hidden"
                }
              >
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="35"
                  viewBox="0 0 24 35"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-git-commit-vertical"
                >
                  <path d="M12 0v12" />
                  <circle cx="12" cy="15" r="3" />
                  <path d="M12 18v11" />
                </svg> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="#f1592a"
                  stroke="#f1592a"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-arrow-big-down"
                >
                  <path d="M15 6v10h4l-7 7-7-7h4V6h6z" />
                </svg>
              </div>
            </div>
          </div>
        ))}
        {isCounter && (
          <div className=" flex-1 justify-center items-center flex flex-col gap-4 mt-4">
            <div className="flex items-center justify-between w-full gap-2">
              <button
                onClick={decrement}
                disabled={counter === 0}
                className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-red-500 hover:bg-red-500 text-white hover:text-white h-9 rounded-md px-3"
              >
                -
              </button>
              <input
                type="text"
                value={counter}
                readOnly
                className="border border-gray-300 bg-gray-100 px-3 py-1 rounded text-center"
              />
              {/* <span class="italic text-red-500">
                The amount will increase or decrease by ₹25,000.
              </span> */}

              <button
                onClick={increment}
                className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-500 text-primary-foreground hover:bg-green-500 h-9 rounded-md px-3"
              >
                +
              </button>
              <X
                onClick={() => setIsCounter(false)}
                className="cursor-pointer"
                style={{ marginLeft: "10px" }}
              />
            </div>

            {/* <Button variant="outline">Send Counter Offer</Button> */}
          </div>
        )}
      </div>
      <div className="flex w-full items-center  p-4 border-t mt-4">
        {data?.status === "matched" ? (
          <>
            <div
              className={
                offerSection === "received"
                  ? "w-full flex items-center justify-center  rounded-lg bg-green-300 shadow-sm p-10 cursor-pointer h-1"
                  : "hidden"
              }
            >
              {data?.offer_requests[data?.offer_requests.length - 1]?.role ===
              "user"
                ? " Offer Accepted by You"
                : "Offer Accepted by customer"}
            </div>
            <div
              className={
                offerSection === "sent"
                  ? "w-full flex items-center justify-center  rounded-lg bg-green-300 shadow-sm p-10 cursor-pointer h-1"
                  : "hidden"
              }
            >
              {data?.offer_requests[data?.offer_requests.length - 1]?.role ===
              "user"
                ? " Offer Accepted by Owner"
                : "Offer Accepted by You"}
            </div>
          </>
        ) : data?.status === "declined" ? (
          <>
            <div
              className={
                offerSection === "received"
                  ? "w-full flex items-center justify-center  rounded-lg bg-red-300 shadow-sm p-10 cursor-pointer h-1"
                  : "hidden"
              }
            >
              {data?.offer_requests[data?.offer_requests.length - 1]?.role ===
              "user"
                ? " Offer Declined by You"
                : "Offer Declined by Customer"}
            </div>
            <div
              className={
                offerSection === "sent"
                  ? "w-full flex items-center justify-center  rounded-lg bg-red-300 shadow-sm p-10 cursor-pointer "
                  : "hidden"
              }
            >
              {data?.offer_requests[data?.offer_requests.length - 1]?.role ===
              "owner"
                ? " Offer Declined by You"
                : "Offer Declined by Owner"}
            </div>
          </>
        ) : (
          <div className="flex items-center  w-full  justify-between">
            <button
              onClick={() => {
                offerRequest(
                  "matched",
                  data?.offer_requests[data?.offer_requests.length - 1]?.deal_id
                );
              }}
              disabled={
                (offerSection === "received" &&
                  data?.offer_requests[data?.offer_requests.length - 1]
                    ?.role === "owner") ||
                (offerSection === "sent" &&
                  data?.offer_requests[data?.offer_requests.length - 1]
                    ?.role === "user")
              }
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-500 text-primary-foreground hover:bg-green-600 h-9 rounded-md px-3"
            >
              Accept
            </button>

            <button
              onClick={() => {
                offerRequest(
                  "declined",
                  data?.offer_requests[data?.offer_requests.length - 1]?.deal_id
                );
              }}
              disabled={
                (offerSection === "received" &&
                  data?.offer_requests[data?.offer_requests.length - 1]
                    ?.role === "owner") ||
                (offerSection === "sent" &&
                  data?.offer_requests[data?.offer_requests.length - 1]
                    ?.role === "user")
              }
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-red-500 hover:bg-red-600 text-white hover:text-white h-9 rounded-md px-3"
            >
              Decline
            </button>

            <button
              className={
                isCounter
                  ? "hidden"
                  : "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-yellow-300 hover:bg-yellow-400  hover:text-black h-9 rounded-md px-3"
              }
              onClick={() => {
                setIsCounter(!isCounter);
                setCounterDealId(
                  data?.offer_requests[data?.offer_requests.length - 1]?.deal_id
                );
              }}
              disabled={
                (offerSection === "received" &&
                  data?.offer_requests[data?.offer_requests.length - 1]
                    ?.role === "owner") ||
                (offerSection === "sent" &&
                  data?.offer_requests[data?.offer_requests.length - 1]
                    ?.role === "user")
              }
            >
              Counter Offer
            </button>
            <button
              onClick={CounterOfferRequest}
              className={
                isCounter
                  ? "inline-flex items-center justify-center whitespace-nowrap text-sm text-white font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-500 hover:bg-green-700 h-9 rounded-md px-3"
                  : "hidden"
              }
            >
              Send Counter Offer
            </button>
          </div>
        )}
      </div>
    </ModalWrapper>
  );
}
