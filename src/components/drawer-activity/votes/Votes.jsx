"use client";
import { getUserActivityLogsAPI } from "@/connections/get-requests/getUserActivityLogsAPI";
import useAsync from "@/custom/useAsync";
import { getClientCookie } from "@/logic/clientCookie";
import Link from "next/link";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

export default function Votes() {
  const token = useSelector((state) => state.auth.token);

  const cityId = getClientCookie("cityID") || 2209;

  const {
    loading,
    error,
    value: votesData,
  } = useAsync(getUserActivityLogsAPI, [], ["ReviewVote", token]);

  return (
    <div className="reviews-and-ratings">
      <div className="carousal-heading">
        <div className="p-heading">
          <h3>Activity / Votes</h3>
          <div className="trend-line"></div>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-[300px]">
          <ClipLoader color="#f1592a" />
        </div>
      ) : votesData?.length > 0 ? (
        votesData?.map((data) => (
          <div key={data?.id} className="review-rating-box">
            <div className="flex justify-between">
              <div className="activity-project-name">
                <span className="static-text">
                  Added Vote on review of Project:
                </span>
                <Link
                  href={`/${cityId == 2209 ? "pune" : "mumbai"}/${
                    data?.parameters?.location_slug
                  }/${data?.parameters?.project_slug}`}
                >
                  {data.parameters.project_name}
                </Link>
              </div>
            </div>
            <div className="activity-date-time">
              {data?.parameters?.updated_at}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center my-[20px]">There is No Votes Here....</div>
      )}
    </div>
  );
}
