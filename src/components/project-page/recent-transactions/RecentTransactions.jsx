"use client";
import LatestTxnRequest from "@/components/modal-content/LatestTxnRequest";
import PaymentGateway from "@/components/modal-content/PaymentGateway";
import SuccessInfoModal from "@/components/modal-content/SuccessInfoModal";
import ViewTransactionModal from "@/components/modal-content/ViewTransactionModal";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ProtectedRouteWrapper from "@/components/wrappers/ProtectedRouteWrapper";
import {
  getRecentTransactionsCountAPI,
  getRecentTransactionsOnProjectAPI,
} from "@/connections/get-requests/getRecentTransactionsAPI";
import { getSingleProjectAPI } from "@/connections/get-requests/getSingleProjectAPI";
import { getUserDetailsAPI } from "@/connections/get-requests/getUserDetailsAPI";
import { postRequestTxnAPI } from "@/connections/post-requests/postRequestTxnAPI";
import useAsync from "@/custom/useAsync";
import { paginationRenderItem } from "@/logic/paginationRenderItem";
import { setInView } from "@/store/slices/projectSlice";
import { Pagination } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useInView } from "framer-motion";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactGA from "react-ga";
import "react-loading-skeleton/dist/skeleton.css";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import "./RecentTransactions.scss";

export default function RecentTransactions({ city, location, slug }) {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [type, setType] = useState("");
  const [modalState, setModalState] = useState(false);
  const [unitCategory, setUnitCategory] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState(1);
  const [toggleRequestTxn, setToggleRequestTxn] = useState(false);
  const [isTxnViewed, setIsTxnViewed] = useState(false);
  const [txnDetails, setTxnDetails] = useState({});
  const recentTxnRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [updateData, setUpdateData] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const toggleDescription = () => {
    setExpanded(!expanded);
  };
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { data: projectData } = useQuery({
    queryKey: ["getSingleProjectAPI", city, location, slug],
    queryFn: () => getSingleProjectAPI(city, location, slug, token),
  });

  const {
    loading: recentTxnLoading,
    error: txnError,
    value: recentTxnValue,
  } = useAsync(
    getRecentTransactionsOnProjectAPI,
    [type, unitCategory, currentPage, toggleRequestTxn],
    [
      projectData?.name,
      type,
      unitCategory,
      currentPage,
      projectData?.latest_transaction?.village,
      token,
    ]
  );

  const {
    loading: TxnCountLoading,
    error: txnCountError,
    value: txnCount,
  } = useAsync(
    getRecentTransactionsCountAPI,
    [],
    [projectData?.name, projectData?.latest_transaction?.village, token]
  );
  const {
    loading: userLoading,
    error: userError,
    value: userDetails,
  } = useAsync(getUserDetailsAPI, [isTxnViewed, updateData], [token]);

  const isInView = useInView(recentTxnRef, { margin: "100px 0px 1000px 0px" });

  useEffect(() => {
    if (isInView === true) {
      dispatch(setInView("txn"));
    }
  }, [isInView]);

  const remainingCredits = userDetails?.view_transactions?.credits;
  const userViewedTransactions =
    userDetails?.view_transactions?.transaction_ids;

  const handleTransactionRequest = async (empty, callbackToken) => {
    const payload = {
      project_id: projectData?.id,
      unit_category: unitCategory,
      transaction_type: type,
    };
    try {
      const res = await postRequestTxnAPI(
        payload,
        callbackToken ? callbackToken : token
      );
      if (res?.status?.status === "SUCCESS") {
        setShowSuccessModal(true);
      }
    } catch (error) {}
  };

  useEffect(() => {
    setUnitCategory(txnCount?.sorted_properties[0]?.unit_category);
    setType(txnCount?.sorted_properties[0]?.unit_type);
  }, [txnCount?.sorted_properties]);

  const handleUpdateTxnDashboard = () => {
    setToggleRequestTxn((prev) => !prev);
  };

  const renderTransactionDetails = () => {
    if (recentTxnValue?.data === undefined) {
      return (
        <div className="flex justify-center items-center h-[300px]">
          <ClipLoader color="#f1592a" />
        </div>
      );
    } else {
      return recentTxnValue?.data?.length > 0 ? (
        <div>
          <table className="table">
            <tbody>
              <tr>
                <th>Transaction Date</th>
                <th>Bldg</th>
                <th>Floor/Unit No</th>
                <th>Unit Type</th>
                <th>Total Area (sq.ft)</th>
                <th>Amount</th>
              </tr>
              {recentTxnValue?.data?.map((data, index) => (
                <tr key={data?.id}>
                  <td>{data.transaction_date}</td>
                  <td>{data.building_name}</td>
                  <td>
                    {data.floor} / {data.unit_no}
                  </td>
                  <td>{data.unit_type_in_detail}</td>
                  <td>{data.total}</td>
                  <td
                    style={{
                      color: "#f1592a",
                      cursor: "pointer",
                    }}
                  >
                    {userViewedTransactions?.find(
                      (transaction) => transaction === data?.uuid
                    ) ? (
                      <Button
                        variant="outline"
                        onClick={() => {
                          ReactGA.event({
                            category: "User",
                            action: `User Views a txn from txn Table`,
                            label: "Button Click",
                          });
                          setTxnDetails({
                            id: encodeURIComponent(data?.uuid),
                            projectName: projectData?.name,
                            claimed: projectData?.claimed_project,
                            projectId: projectData?.id,
                          });
                          setModalState(true);
                        }}
                      >
                        <EyeIcon className="inline" />
                      </Button>
                    ) : (!token && index === 0) || (!token && index == 1) ? (
                      <Button
                        variant="outline"
                        onClick={() => {
                          ReactGA.event({
                            category: "User",
                            action: `User Views a txn from txn Table`,
                            label: "Button Click",
                          });
                          setTxnDetails({
                            id: encodeURIComponent(data?.uuid),
                            projectName: projectData?.name,
                            claimed: projectData?.claimed_project,
                            projectId: projectData?.id,
                          });
                          setModalState(true);
                        }}
                      >
                        <EyeIcon className="inline" />
                      </Button>
                    ) : token ? (
                      <Popover>
                        <PopoverTrigger>
                          <Button variant="outline">
                            <EyeOffIcon className="inline" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="text-center">
                          {token && "You have  "}
                          <span className="text-[#f1592a]">
                            {remainingCredits}
                          </span>
                          <br />
                          {token && "views remaining"} <br />
                          {remainingCredits === 0 ? (
                            <PaymentGateway
                              triggerElement={<Button>Buy Now</Button>}
                              setUpdateData={setUpdateData}
                            />
                          ) : (
                            <Button
                              onClick={() => {
                                ReactGA.event({
                                  category: "User",
                                  action: `User Views a txn from txn Table`,
                                  label: "Button Click",
                                });
                                setTxnDetails({
                                  id: encodeURIComponent(data?.uuid),
                                  projectName: projectData?.name,
                                  claimed: projectData?.claimed_project,
                                  projectId: projectData?.id,
                                  setIsTxnViewed,
                                });
                                setModalState(true);
                              }}
                            >
                              View
                            </Button>
                          )}
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => {
                          ReactGA.event({
                            category: "User",
                            action: `User Views a txn from txn Table`,
                            label: "Button Click",
                          });
                          setTxnDetails({
                            id: encodeURIComponent(data?.uuid),
                            projectName: projectData?.name,
                            claimed: projectData?.claimed_project,
                            projectId: projectData?.id,
                            setIsTxnViewed,
                          });
                          setModalState(true);
                        }}
                      >
                        <EyeOffIcon className="inline" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-col gap-5 md:flex-row justify-between items-center my-5 ">
            <LatestTxnRequest
              unitCategory={unitCategory}
              type={type}
              triggerElement={
                <button className="bg-[#f1592a] text-white py-2 px-4 rounded-[5px] text-center">
                  Request Latest Txn
                </button>
              }
              projectId={projectData?.id}
            />
            <Pagination
              disableCursorAnimation
              showControls
              total={Math.ceil(recentTxnValue?.count / 5)}
              page={currentPage}
              onChange={(selectedPage) => setCurrentPage(selectedPage)}
              radius="full"
              renderItem={paginationRenderItem}
            />
          </div>
        </div>
      ) : recentTxnValue?.requested === true ? (
        <div>
          <div className="txn-request-main">
            <h4 className="text-[20px] font-bold">
              {unitCategory} {type?.charAt(0).toUpperCase() + type?.slice(1)}{" "}
              Transaction data request submitted!
            </h4>
            <p>We shall try to update them within 48-72 hours</p>
          </div>
        </div>
      ) : (
        <div className="txn-request-main">
          <h4 className="text-[18px]">Yet to be uploaded</h4>
          <p className="text-center my-[10px]">
            Place request to upload latest transaction data soon and we shall
            try to do so within 48-72 hours. You shall be updated once the data
            is uploaded.
          </p>
          <ProtectedRouteWrapper
            triggerElement={
              <div className="txn-request">Request Transactions</div>
            }
            callback={handleTransactionRequest}
          >
            <div className="txn-request" onClick={handleTransactionRequest}>
              Request Transactions
            </div>
          </ProtectedRouteWrapper>
        </div>
      );
    }
  };

  return (
    <div
      className="transaction container"
      id="recent-transactions"
      ref={recentTxnRef}
    >
      <div className="carousal-heading">
        <div className="p-heading">
          <div>
            <h3>Recent Transactions</h3>
          </div>
          <div>
            <p className="trend-line"></p>
          </div>
        </div>
      </div>
      <div className="txn-tabs">
        {txnCount?.sorted_properties?.map((item) => (
          <div
            key={item?.id}
            className={`${selectedTab === item?.id ? "selected-tab" : "tab"}`}
            onClick={() => {
              ReactGA.event({
                category: "User",
                action: `User Select a ${item.unit_category} & ${item.unit_type} tab from txn Table`,
                label: "Button Click",
              });
              setSelectedTab(item?.id);
              setUnitCategory(item?.unit_category);
              setType(item?.unit_type);
              setCurrentPage(1);
            }}
          >
            {item?.unit_category?.slice(0, 4)}.{" "}
            {item?.unit_type?.charAt(0).toUpperCase() +
              item?.unit_type?.slice(1)}{" "}
            ({item?.count})
          </div>
        ))}
      </div>
      {renderTransactionDetails()}
      <SuccessInfoModal
        modalState={showSuccessModal}
        setModalState={setShowSuccessModal}
        onMountComplete={handleUpdateTxnDashboard}
      >
        <div className="text-center">
          <img src="/images/review added.svg" alt="img" className="m-auto" />
          <h5 className="text-[20px] font-bold">Transaction Request Sent</h5>
          <p className="text-[13px]">
            Well Done! It will get displayed after approval from management.
          </p>
        </div>
      </SuccessInfoModal>
      <ViewTransactionModal
        projectData={projectData}
        txnDetails={txnDetails}
        modalState={modalState}
        setModalState={setModalState}
      />

      {projectData?.details && (
        <>
          <div className="p-heading">
            <div>
              <h3>About {projectData?.name}</h3>
            </div>
            <div>
              <p className="trend-line"></p>
            </div>
          </div>
          <div
            className={`project-description ${expanded ? "expanded" : ""}`}
            style={{
              maxHeight: expanded ? "none" : "200px",
              overflow: "hidden",
            }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: projectData?.details }}
            ></div>
            {!expanded &&
              (isMobile
                ? projectData?.details.length > 500
                : projectData?.details.length > 650) && (
                <button onClick={toggleDescription} id="toggleBtn">
                  More...
                </button>
              )}
          </div>
        </>
      )}
    </div>
  );
}
