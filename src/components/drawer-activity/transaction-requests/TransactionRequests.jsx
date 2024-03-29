"use client";
import { getUserActivityLogsAPI } from "@/connections/get-requests/getUserActivityLogsAPI";
import useAsync from "@/custom/useAsync";
import Link from "next/link";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

export default function TransactionRequests() {
  const token = useSelector((state) => state.auth.token);

  const {
    loading,
    error,
    value: TxnRequestData,
  } = useAsync(getUserActivityLogsAPI, [], ["TransactionRequest", token]);

  return (
    <div className="reviews-and-ratings">
      <div className="carousal-heading">
        <div className="p-heading">
          <h3>Activity / Txn Requests</h3>
          <div className="trend-line"></div>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-[300px]">
          <ClipLoader color="#f1592a" />
        </div>
      ) : TxnRequestData?.length > 0 ? (
        TxnRequestData?.map((data) => (
          <div key={data?.id} className="review-rating-box">
            <div className="flex justify-between">
              <div
                className="activity-project-name"
                style={{ cursor: "default" }}
              >
                <span className="static-text">
                  {" "}
                  Transaction request raised:
                </span>
                <Link
                  href={`/${data?.city_slug}/${data?.parameters?.location_slug}/${data?.parameters?.project_slug}`}
                >
                  {data.parameters.project_name}
                </Link>
              </div>
              <div
                className={
                  data?.approved === true
                    ? "approved"
                    : data.approved === false
                    ? "declined"
                    : "submitted"
                }
              >
                {data?.approved === true
                  ? "Approved"
                  : data.approved === false
                  ? "Declined"
                  : "Submitted"}
              </div>
            </div>
            <div className="activity-date-time">{data?.created_at}</div>
          </div>
        ))
      ) : (
        <div className="text-center my-[20px]">
          There is No Transaction Requests Here....
        </div>
      )}
    </div>
  );
}
