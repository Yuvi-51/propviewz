import { getTransactionDetailsAPI } from "@/connections/get-requests/getTransactionDetailsAPI";
import useAsync from "@/custom/useAsync";
import { formatIndianRupees } from "@/logic/format-transaction-amount";
import { fetchIPAddress } from "@/logic/get-ip/getIP";
import { MoreVerticalIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { Button } from "../ui/button";
import PopOver from "../ui/pop-over";
import ModalWrapper from "../wrappers/ModalWrapper";
import LoginModal from "./LoginModal";
import MatchOfferModal from "./MatchOfferModal";
import "./ViewTransactionModal.scss";
import TxnReportModal from "./report-errors/TxnReportModal";
export default function ViewTransactionModal({
  txnDetails,
  modalState,
  setModalState,
  reportable = true,
  projectData,
}) {
  const token = useSelector((state) => state.auth.token);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [modal, setModal] = useState(false);
  const viewRef = useRef(null);
  const [refresh, setRefresh] = useState(false);
  const [ipAddress, setIPAddress] = useState("");

  const key = "xfn9P8L9rIpKtWKj68IZ3G865WfdYXNY";
  useEffect(() => {
    async function fetchData() {
      try {
        const ipAddress = await fetchIPAddress(token);
        setIPAddress(ipAddress);
      } catch (error) {
        console.error("Failed to fetch IP address:", error);
      }
    }

    fetchData();
  }, [token]);

  const handleRefreshChange = (value) => {
    setRefresh(value);
  };
  const {
    loading,
    error,
    value: data,
  } = useAsync(
    modalState ? getTransactionDetailsAPI : null,
    [modalState, refresh],
    [txnDetails?.id, ipAddress, token]
  );
  const viewTransactionDetails = data?.payload;
  useEffect(() => {
    setModal(false);
    if (!token && data?.status?.status === "NOT_FOUND") {
      setModal(token ? false : true);
      setModalState(false);
    }
  }, [token, viewTransactionDetails]);
  useEffect(() => {
    txnDetails?.setIsTxnViewed && txnDetails?.setIsTxnViewed((prev) => !prev);
  }, [modalState]);

  return (
    <>
      <ModalWrapper
        title={
          <div className="view-transaction-header" ref={viewRef}>
            <p>Transaction Details</p>

            {reportable && (
              <PopOver
                trigger={
                  <MoreVerticalIcon
                    size={22}
                    className="inline cursor-pointer"
                  />
                }
                isModalOpen={isModalOpen}
              >
                {(closeDropdown) => (
                  <div className="absolute bg-white mt-1 drop-shadow-xl w-max whitespace-nowrap left-0 rounded-md">
                    <TxnReportModal
                      txnId={viewTransactionDetails?.id}
                      projectName={txnDetails?.projectName}
                      triggerElement={
                        <Button className="bg-white text-black hover:text-white">
                          Report Incorrect
                        </Button>
                      }
                      setIsModalOpen={setIsModalOpen}
                    />
                  </div>
                )}
              </PopOver>
            )}
          </div>
        }
        // trigger={triggerElement}
        open={modalState}
        setOpen={setModalState}
      >
        {loading ? (
          <div className="view-transaction-container flex items-center justify-center">
            <ClipLoader color="#f1592a" />
          </div>
        ) : (
          <div className="view-transaction-container">
            <table className="table-striped">
              <tbody>
                <tr>
                  <td className="first-td">
                    <img src="/images/Type.svg" alt="img" />
                    <span>Type</span>
                  </td>
                  <td>{viewTransactionDetails?.transaction_type}</td>
                </tr>
                <tr>
                  <td className="first-td">
                    <img src="/images/project name.svg" alt="img" />
                    <span>Project Name</span>
                  </td>
                  <td>{viewTransactionDetails?.project_name}</td>
                </tr>
                <tr>
                  <td className="first-td">
                    <img src="/images/calender.svg" alt="img" />
                    <span>Transaction Date</span>
                  </td>
                  <td>{viewTransactionDetails?.transaction_date}</td>
                </tr>
                <tr>
                  <td className="first-td">
                    <img src="/images/unit type.svg" alt="img" />
                    <span>Unit Type</span>
                  </td>
                  <td>{viewTransactionDetails?.unit_type}</td>
                </tr>
                {viewTransactionDetails?.unit_category !== "Commercial" ? (
                  <tr>
                    <td className="first-td">
                      <img src="/images/fi_settings.svg" alt="img" />
                      <span> Configuration </span>
                    </td>
                    <td>{viewTransactionDetails?.configuration}</td>
                  </tr>
                ) : null}
                <tr>
                  <td className="first-td">
                    <img src="/images/bulding.svg" alt="img" />
                    <span>Building Name</span>
                  </td>
                  <td>{viewTransactionDetails?.building_name}</td>
                </tr>
                <tr>
                  <td className="first-td">
                    <img src="/images/floor.svg" alt="img" />
                    <span>Floor / Unit No </span>
                  </td>
                  <td>
                    {viewTransactionDetails?.floor} /{" "}
                    {viewTransactionDetails?.unit_no}
                  </td>
                </tr>
                <tr>
                  <td className="first-td">
                    <img src="/images/fi_pie-chart.svg" alt="img" />
                    <span> Area </span>
                  </td>
                  <td>
                    <p
                      className={
                        viewTransactionDetails?.area?.carpet ? " " : "hidden"
                      }
                    >
                      Carpet : {viewTransactionDetails?.area?.carpet} Sq Ft
                    </p>
                    <p
                      className={
                        viewTransactionDetails?.area?.terrace ? " " : "hidden"
                      }
                    >
                      Terrace : {viewTransactionDetails?.area?.terrace} Sq Ft
                    </p>

                    <p
                      className={
                        viewTransactionDetails?.area?.built_up_area
                          ? " "
                          : "hidden"
                      }
                    >
                      Built Up Area:{" "}
                      {viewTransactionDetails?.area?.built_up_area} Sq Ft
                    </p>
                    <p
                      className={
                        viewTransactionDetails?.area?.saleable_built_up_area
                          ? " "
                          : "hidden"
                      }
                    >
                      Saleable Built Up Area:
                      {viewTransactionDetails?.area?.saleable_built_up_area} Sq
                      Ft
                    </p>
                    <p
                      className={
                        viewTransactionDetails?.area?.enclosed ? " " : "hidden"
                      }
                    >
                      Enclosed : {viewTransactionDetails?.area?.enclosed} Sq Ft
                    </p>
                    <p
                      className={
                        viewTransactionDetails?.area?.open ? " " : "hidden"
                      }
                    >
                      Open: {viewTransactionDetails?.area?.open} Sq Ft
                    </p>
                    <p
                      className={
                        viewTransactionDetails?.area?.dry ? " " : "hidden"
                      }
                    >
                      Dry: {viewTransactionDetails?.area?.dry} Sq Ft
                    </p>
                    <p
                      className={
                        viewTransactionDetails?.area?.passage ? " " : "hidden"
                      }
                    >
                      Passage : {viewTransactionDetails?.area?.passage} Sq Ft
                    </p>
                    <p
                      className={
                        viewTransactionDetails?.area?.sit_out ? " " : "hidden"
                      }
                    >
                      Sit out : {viewTransactionDetails?.area?.sit_out} Sq Ft
                    </p>
                    <p
                      className={
                        viewTransactionDetails?.area?.arch_projection
                          ? " "
                          : "hidden"
                      }
                    >
                      Arch Position :{" "}
                      {viewTransactionDetails?.area?.arch_projection} Sq Ft
                    </p>
                    <p
                      className={
                        viewTransactionDetails?.area?.porch ? " " : "hidden"
                      }
                    >
                      Porch: {viewTransactionDetails?.area?.porch} Sq Ft
                    </p>
                    <p
                      className={
                        viewTransactionDetails?.area?.garage ? " " : "hidden"
                      }
                    >
                      Garage: {viewTransactionDetails?.area?.garage} Sq Ft
                    </p>
                    <p
                      className={
                        viewTransactionDetails?.area?.garden ? " " : "hidden"
                      }
                    >
                      Garden: {viewTransactionDetails?.area?.garden} Sq Ft
                    </p>
                    <p
                      className={
                        viewTransactionDetails?.area?.mezzanine ? " " : "hidden"
                      }
                    >
                      Mezzanine : {viewTransactionDetails?.area?.mezzanine} Sq
                      Ft
                    </p>
                    <p
                      className={
                        viewTransactionDetails?.area?.loft_area ? " " : "hidden"
                      }
                    >
                      Loft Area : {viewTransactionDetails?.area?.loft_area} Sq
                      Ft
                    </p>
                    <p
                      className={
                        viewTransactionDetails?.area?.lobby ? " " : "hidden"
                      }
                    >
                      Lobby : {viewTransactionDetails?.area?.lobby} Sq Ft
                    </p>
                    <p
                      className={
                        viewTransactionDetails?.area?.plot ? " " : "hidden"
                      }
                    >
                      Plot: {viewTransactionDetails?.area?.plot} Sq Ft
                    </p>
                    <p
                      className={
                        viewTransactionDetails?.area?.common_amenities
                          ? " "
                          : "hidden"
                      }
                    >
                      Common Amenities :{" "}
                      {viewTransactionDetails?.area?.common_amenities} Sq Ft
                    </p>
                    <p
                      className={
                        viewTransactionDetails?.area?.road_alignment
                          ? " "
                          : "hidden"
                      }
                    >
                      Road Alignment :{" "}
                      {viewTransactionDetails?.area?.road_alignment} Sq Ft
                    </p>
                    <p
                      className={
                        viewTransactionDetails?.area?.total ? " " : "hidden"
                      }
                    >
                      Total : {viewTransactionDetails?.area?.total} Sq Ft
                    </p>
                  </td>
                </tr>
                <tr
                  className={
                    viewTransactionDetails?.transaction_type === "Mortgage" ||
                    viewTransactionDetails?.transaction_type === "Lease"
                      ? "hidden"
                      : ""
                  }
                >
                  <td className="first-td">
                    <img src="/images/amount.svg" alt="img" />
                    <span> ₹ Amount </span>
                  </td>
                  <td>
                    Rs {formatIndianRupees(viewTransactionDetails?.value)}
                  </td>
                </tr>
                <tr
                  className={
                    viewTransactionDetails?.transaction_type === "Lease"
                      ? ""
                      : "hidden"
                  }
                >
                  <td className="first-td">
                    <img src="/images/amount.svg" alt="img" />
                    <span>Rent </span>
                  </td>
                  <td>Rs {viewTransactionDetails?.rent}</td>
                </tr>
                <tr
                  className={
                    viewTransactionDetails?.transaction_type === "Lease"
                      ? ""
                      : "hidden"
                  }
                >
                  <td className="first-td">
                    <img src="/images/rate.svg" alt="img" />
                    <span> Deposit </span>
                  </td>
                  <td>Rs {viewTransactionDetails?.deposit}</td>
                </tr>
                <tr
                  className={
                    viewTransactionDetails?.transaction_type === "Mortgage"
                      ? "hidden"
                      : ""
                  }
                >
                  <td className="first-td">
                    <img src="/images/rate.svg" alt="img" />
                    <span> Rate/ Sq Ft </span>
                  </td>
                  <td>Rs {viewTransactionDetails?.rate_per_sq_feet}</td>
                </tr>
              </tbody>
            </table>
            {viewTransactionDetails?.offer_requested === false &&
              txnDetails?.claimed === true &&
              projectData.claimed === false && (
                <MatchOfferModal
                  txn_id={viewTransactionDetails?.id}
                  projectId={txnDetails?.projectId}
                  txnData={viewTransactionDetails}
                  onRefreshChange={handleRefreshChange}
                  triggerElement={
                    <div
                      className={
                        txnDetails?.claimed === true &&
                        viewTransactionDetails?.offer_requested === false
                          ? "match_the_price_btn"
                          : "hidden"
                      }
                    >
                      Make An Offer
                    </div>
                  }
                />
              )}

            <div className="disclaimer-details">
              <strong>Disclaimer: </strong>
              <ol>
                <li>
                  Above transaction details are based on information retrieved
                  from Maharashtra IGR Records
                </li>
                <li>
                  Amount at which transaction takes place is highly dependent on
                  payment terms of the buyer, requirements of the seller, market
                  conditions, and many more factors.
                </li>
                <li>
                  Area mentioned above is as per property details mentioned in
                  Index II of the transaction (excluding parking area)
                </li>
                <li>
                  Rate per sq.ft. = Amount / total area 5. If you know that the
                  details mentioned above are inaccurate, please help us improve
                  our user experience by reporting inaccurate
                  viewTransactionDetails.
                </li>
              </ol>
            </div>
          </div>
        )}
      </ModalWrapper>
      <LoginModal
        withoutLoginModalTrigger={modal}
        msg={"To see more transactions please login"}
        callback={() => setModalState(true)}
      />
    </>
  );
}
