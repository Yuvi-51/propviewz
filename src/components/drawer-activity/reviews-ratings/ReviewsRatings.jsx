"use client";
import StarRating from "@/components/ui/dynamic-star";
import { getUserActivityLogsAPI } from "@/connections/get-requests/getUserActivityLogsAPI";
import useAsync from "@/custom/useAsync";
import Link from "next/link";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import "./ReviewsRatings.scss";

export default function ReviewsAndRatings() {
  const token = useSelector((state) => state.auth.token);

  const {
    loading,
    error,
    value: reviewsRatingsData,
  } = useAsync(getUserActivityLogsAPI, [], ["ProjectReview", token]);

  return (
    <div className="reviews-and-ratings">
      <div className="carousal-heading">
        <div className="p-heading">
          <h3>Activity / Reviews & Ratings</h3>
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
                <span className="static-text"> Reviewed on Project:</span>
                <Link
                  href={`/${data?.city_slug}/${data?.parameters?.location_slug}/${data?.parameters?.project_slug}`}
                >
                  {data?.parameters?.project_name}
                </Link>
              </div>
              <div
                className={
                  data?.parameters?.approved === true
                    ? "approved"
                    : data?.parameters?.approved === false
                    ? "declined"
                    : "submitted"
                }
              >
                {data?.parameters?.approved === true
                  ? "Approved"
                  : data?.parameters?.approved === false
                  ? "Declined"
                  : "Submitted"}
              </div>
            </div>
            <div className="activity-details">
              {data?.parameters && data?.parameters?.text}
            </div>
            <div className="flex gap-5 flex-wrap">
              {data?.project_medias?.map((item, i) => (
                <div key={i} className="text-center shadow-md">
                  <img
                    className="activity-media"
                    src={item?.image_url}
                    alt={item?.title}
                  />
                  <p
                    style={{
                      inlineSize: "80px",
                      overflowWrap: "break-word",
                    }}
                  >
                    {item?.title}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 activity-rating">
              {data?.parameters?.overall_rating}
              <StarRating rating={data?.parameters?.overall_rating} />
            </div>
            <div className="activity-date-time">
              {data?.parameters?.updated_at}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center my-[20px]">
          There is No Reviews and (or) Ratings Here....
        </div>
      )}
    </div>
  );
}
