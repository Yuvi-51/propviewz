"use client";
import { getUserActivityLogsAPI } from "@/connections/get-requests/getUserActivityLogsAPI";
import useAsync from "@/custom/useAsync";
import { shortenResponseText } from "@/logic/validation";
import { CornerDownRightIcon } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

export default function Comments() {
  const token = useSelector((state) => state.auth.token);

  const {
    loading,
    error,
    value: reviewsRatingsData,
  } = useAsync(getUserActivityLogsAPI, [], ["Comment", token]);

  return (
    <div className="reviews-and-ratings">
      <div className="carousal-heading">
        <div className="p-heading">
          <h3>Activity / Comments</h3>
          <div className="trend-line"></div>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-[300px]">
          <ClipLoader color="#f1592a" />
        </div>
      ) : reviewsRatingsData?.length > 0 ? (
        reviewsRatingsData?.map((data) => (
          <div key={data?.id} className="review-rating-box">
            <div className="flex justify-between">
              <div className="activity-project-name">
                <span className="static-text">
                  Comment added on the review of Project:
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
            <div className="activity-details">
              {shortenResponseText(data?.review_text)}
            </div>
            <CornerDownRightIcon className="mb-[-26px] ml-[-10px]" />
            <div className="activity-rating ml-[15px]">{data.comment_text}</div>
            <div className="activity-date-time ml-[15px]">
              {data?.parameters?.updated_at}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center my-[20px]">
          There is No Comments Here....
        </div>
      )}
    </div>
  );
}
