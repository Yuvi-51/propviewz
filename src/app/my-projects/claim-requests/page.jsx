"use client";
import { getUserActivityLogsAPI } from "@/connections/get-requests/getUserActivityLogsAPI";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import "../../activity/activity.scss";
import "../../../components/drawer-activity/reviews-ratings/ReviewsRatings.scss";
import { ClipLoader } from "react-spinners";

export default function AllClaimRequests() {
  const token = useSelector((state) => state.auth.token);

  const { data: allClaimRequests, isLoading } = useQuery({
    queryKey: ["getUserActivityLogsAPI"],
    queryFn: () => getUserActivityLogsAPI("ClaimRequest", token),
  });

  return (
    <main className="activity-container">
      <div className="reviews-and-ratings">
        <div className="carousal-heading">
          <div className="p-heading">
            <h3>My Projects / Claim Requests</h3>
            <div className="trend-line"></div>
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-[300px]">
            <ClipLoader color="#f1592a" />
          </div>
        ) : allClaimRequests.length > 0 ? (
          allClaimRequests?.map((data) => (
            <div key={data?.id} className="review-rating-box">
              <div className="flex justify-between">
                <div className="activity-project-name">
                  <span className="static-text">Claim request raised:</span>
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
              <div className="activity-details"></div>
              <div className="activity-rating ml-[15px]">
                {data.comment_text}
              </div>
              <div className="activity-date-time ml-[15px]">
                {data?.parameters?.updated_at}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center my-[20px]">
            There is No Claimed Requests Here....
          </div>
        )}
      </div>
    </main>
  );
}
