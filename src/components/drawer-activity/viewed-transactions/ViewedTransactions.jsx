"use client";
import ViewTransactionModal from "@/components/modal-content/ViewTransactionModal";
import { getViewedTransactionsAPI } from "@/connections/get-requests/getViewedTransactionsAPI";
import useAsync from "@/custom/useAsync";
import { formatIndianRupees } from "@/logic/format-transaction-amount";
import { paginationRenderItem } from "@/logic/paginationRenderItem";
import { Pagination } from "@nextui-org/react";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import "./ViewedTransactions.scss";
import { getClientCookie } from "@/logic/clientCookie";
export default function ViewedTransactions() {
  const token = useSelector((state) => state.auth.token);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalState, setModalState] = useState(false);
  const cityId = getClientCookie("cityID") || 2209;
  const [txnDetails, setTxnDetails] = useState({});

  const {
    loading,
    error,
    value: viewedTransactions,
  } = useAsync(getViewedTransactionsAPI, [currentPage], [currentPage, token]);

  return (
    <div className="viewed-transactions">
      <div className="carousal-heading">
        <div className="p-heading">
          <h3>Activity / Viewed Transactions</h3>
          <div className="trend-line"></div>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-[300px]">
          <ClipLoader color="#f1592a" />
        </div>
      ) : viewedTransactions?.data?.length > 0 ? (
        <>
          <table className="table-striped">
            <tbody>
              <tr>
                <th>Transaction Date</th>
                <th>Building</th>
                <th>Floor/Unit No</th>
                <th>Unit Type</th>
                <th>Amount</th>
                <th>Project</th>
              </tr>

              {viewedTransactions?.data?.map((item, index) => (
                <tr key={index}>
                  <td>{item.transaction_date}</td>
                  <td>{item.building_name}</td>
                  <td>{item.unit_no}</td>
                  <td>{item.unit_type}</td>
                  <td>
                    <button
                      onClick={() => {
                        setTxnDetails({
                          id: encodeURIComponent(item?.uuid),
                          projectName: item?.name,
                        });
                        setModalState(true);
                      }}
                      style={{ color: "#f1592a", cursor: "pointer" }}
                    >
                      {formatIndianRupees(item?.value || item?.rent)}
                    </button>
                  </td>
                  <td>
                    <Link
                      style={{ color: "#f1592a", cursor: "pointer" }}
                      href={`/${cityId == 2209 ? "pune" : "mumbai"}/${
                        item?.location_slug
                      }/${item.project_slug}`}
                    >
                      {item.project_name}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ViewTransactionModal
            txnDetails={txnDetails}
            modalState={modalState}
            setModalState={setModalState}
            reportable={false}
          />
          <div className="my-[20px] flex justify-end">
            <Pagination
              disableCursorAnimation
              showControls
              total={Math.ceil(viewedTransactions?.count / 12)}
              initialPage={currentPage}
              onChange={(selectedPage) => setCurrentPage(selectedPage)}
              radius="full"
              renderItem={paginationRenderItem}
            />
          </div>
        </>
      ) : (
        <div className="text-center my-[20px]">
          There is No Viewed Transactions Here....
        </div>
      )}
    </div>
  );
}
