"use client";
import { getUserActivityLogsAPI } from "@/connections/get-requests/getUserActivityLogsAPI";
import useAsync from "@/custom/useAsync";
import { Download } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import "../reviews-ratings/ReviewsRatings.scss";

export default function ReviewsAndRatings() {
  const token = useSelector((state) => state.auth.token);

  const searchParams = useSearchParams();
  const activeMenu = searchParams.get("type");
  console.log("searchParams", activeMenu);
  const {
    loading,
    error,
    value: activityData,
  } = useAsync(getUserActivityLogsAPI, [], [activeMenu, token]);
  const handelReportDownload = (uniqueSlug) => {
    if (uniqueSlug) {
      const url =
        activeMenu === "ValuationReport"
          ? `https://reports-git-staging-propviewz-tech.vercel.app/valuation?unique_slug=${uniqueSlug}&token=${token}`
          : activeMenu === "ProjectPlanningReport"
          ? `https://reports-git-staging-propviewz-tech.vercel.app/project-planning?unique_slug=${res.payload.unique_slug}&token=${token}`
          : "";
      window.open(url, "_blank");
    }
  };
  return (
    <div className="reviews-and-ratings">
      <div className="carousal-heading">
        <div className="p-heading">
          <h3>My-Orders / {activeMenu}</h3>
          <div className="trend-line"></div>
        </div>
      </div>
      <>
        {loading ? (
          <p className="w-full flex items-center justify-center">
            <ClipLoader color="#f1592a" />
          </p>
        ) : error ? (
          <p>Error loading pricing plans</p>
        ) : activityData && activityData.length > 0 ? (
          activityData.map((data) => (
            <div key={data?.id} className="review-rating-box">
              <div className="flex justify-between">
                <div className="activity-project-name">
                  <span className="static-text">{data.message}</span>
                  <div className="activity-date-time">{data?.created_at}</div>
                </div>
                <div className={activeMenu === "Order" ? "hidden" : ""}>
                  <div
                    className="download_btn"
                    onClick={() =>
                      handelReportDownload(data.parameters.unique_slug)
                    }
                  >
                    <span className="d-sub-btn">Download Report </span>
                    <Download />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="review-rating-box w-full text-center">
            <p>No orders found....</p>
          </div>
        )}
      </>
    </div>
  );
}
