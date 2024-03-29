"use client";
import { getUserActivityLogsAPI } from "@/connections/get-requests/getUserActivityLogsAPI";
import useAsync from "@/custom/useAsync";
import Link from "next/link";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

export default function ViewedProjects() {
  const token = useSelector((state) => state.auth.token);

  const {
    loading,
    error,
    value: recentlyViewedData,
  } = useAsync(getUserActivityLogsAPI, [], ["Project", token]);

  return (
    <div className="reviews-and-ratings">
      <div className="carousal-heading">
        <div className="p-heading">
          <h3>Activity / Viewed Projects</h3>
          <div className="trend-line"></div>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-[300px]">
          <ClipLoader color="#f1592a" />
        </div>
      ) : recentlyViewedData?.length > 0 ? (
        recentlyViewedData?.map((data) => (
          <div key={data?.id} className="review-rating-box">
            <div className="flex justify-between">
              <div
                className="activity-project-name"
                style={{ cursor: "default" }}
              >
                <span className="static-text">Viewed project:</span>
                <Link
                  href={`/${data?.city_slug}/${data?.parameters?.location_slug}/${data?.parameters?.project_slug}`}
                >
                  {data.parameters.project_name}
                </Link>
              </div>
            </div>
            <div className="activity-date-time">{data?.created_at}</div>
          </div>
        ))
      ) : (
        <div className="text-center my-[20px]">
          There is No Viewed Projects Here....
        </div>
      )}
    </div>
  );
}
