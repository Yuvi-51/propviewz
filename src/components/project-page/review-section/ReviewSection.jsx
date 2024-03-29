"use client";
import AddReviewModal from "@/components/modal-content/AddReviewModal";
import SuccessInfoModal from "@/components/modal-content/SuccessInfoModal";
import ReviewReportModal from "@/components/modal-content/report-errors/ReviewReportModal";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/ui/dynamic-star";
import PopOver from "@/components/ui/pop-over";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProtectedRouteWrapper from "@/components/wrappers/ProtectedRouteWrapper";
import { getExistingProjectReviewAPI } from "@/connections/get-requests/getExistingProjectReviewAPI";
import { getProjectReviewsAPI } from "@/connections/get-requests/getProjectReviewsAPI";
import { getSingleProjectAPI } from "@/connections/get-requests/getSingleProjectAPI";
import { postReviewsVoteAPI } from "@/connections/post-requests/postReviewsVoteAPI";
import useAsync from "@/custom/useAsync";
import { validateImageUrl } from "@/logic/validation";
import { setInView } from "@/store/slices/projectSlice";

import { useQuery } from "@tanstack/react-query";
import { useInView } from "framer-motion";
import { MoreVerticalIcon, ThumbsUpIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ReactGA from "react-ga";
import { useDispatch, useSelector } from "react-redux";
import ReviewComment from "./ReviewComment";
import "./ReviewSection.scss";

export default function ReviewSection({ city, location, slug }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const sectionRef = useRef();
  const [reviewDetails, setReviewDetails] = useState([]);
  const [reviewsOrder, setReviewsOrder] = useState("latest");
  const [reviewsFilter, setReviewsFilter] = useState("with_text");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [toggleComment, setToggleComment] = useState(false);
  const [helpfulToggle, setHelpfulToggle] = useState(false);
  const [remainingReviews, setRemainingReviews] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    setPageNumber(1);
  }, [reviewsOrder, reviewsFilter]);

  const { data: projectData } = useQuery({
    queryKey: ["getSingleProjectAPI", city, location, slug],
    queryFn: () => getSingleProjectAPI(city, location, slug, token),
  });

  const {
    loading: existingProjectLoading,
    error: existingProjectError,
    value: existingProjectReviewDetails,
  } = useAsync(
    getExistingProjectReviewAPI,
    [projectData?.id],
    [projectData?.id, token]
  );

  // console.log(remainingReviews);

  const claimed = projectData?.claimed;

  useEffect(() => {
    if (pageNumber === 1) {
      getProjectReviewsAPI(
        projectData?.id,
        reviewsFilter,
        reviewsOrder,
        pageNumber,
        token
      ).then((res) => {
        setReviewDetails(res?.payload?.project_reviews);
        setRemainingReviews(res?.meta?.count - 10);
      });
    } else {
      getProjectReviewsAPI(
        projectData?.id,
        reviewsFilter,
        reviewsOrder,
        pageNumber,
        token
      ).then((res) => {
        setReviewDetails([...reviewDetails, ...res?.payload?.project_reviews]);
      });
    }
  }, [
    pageNumber,
    reviewsOrder,
    reviewsFilter,
    helpfulToggle,
    toggleComment,
    projectData?.id,
  ]);

  const handleHelpful = async (reviewable_id, callbackToken) => {
    const payload = {
      reviewable_id,
      reviewable_type: "ProjectReview",
    };
    try {
      const res = await postReviewsVoteAPI(payload, callbackToken || token);
      if (res === "created") {
        setHelpfulToggle(!helpfulToggle);
        setShowSuccessModal(true);
        setSuccessMsg("Your vote have been recorded");
      } else if (res === "deleted") {
        setHelpfulToggle(!helpfulToggle);
        setShowSuccessModal(true);
        setSuccessMsg("Your vote have been removed");
      }
    } catch (error) {}
  };

  const handleShareReview = async () => {
    ReactGA.event({
      category: "User",
      action: "User Shared a review",
      label: "Button Click",
    });
    try {
      const url = window.location.href;
      await navigator.share({
        title: "Share Review",
        url,
      });
    } catch (error) {
      console.error("Error sharing review:", error);
    }
  };

  const userColors = ["#ef8379", "#79A8EF", "#79EF7D", "#A679EF", "#EF799C"];

  const handleShowMore = () => {
    ReactGA.event({
      category: "User",
      action: "User Clicked on show more btn",
      label: "Button Click",
    });
    setPageNumber((prev) => prev + 1);
    setRemainingReviews((prevCount) => prevCount - 10);
  };

  const isInView = useInView(sectionRef, { margin: "-300px 0px -200px 0px" });

  useEffect(() => {
    if (isInView === true) {
      dispatch(setInView("reviews"));
    }
  }, [isInView]);

  return (
    <div className="review-section container" id="reviews" ref={sectionRef}>
      <div className="carousal-heading">
        <div className="p-heading">
          <div>
            <h3>Reviews</h3>
          </div>
          <div>
            <p className="trend-line"></p>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-start mt-3">
        <AddReviewModal
          triggerElement={
            <p className="add-review">
              <Image
                width={20}
                height={20}
                src="/images/fi_star.svg"
                alt="icon"
              />
              {existingProjectReviewDetails?.id ? "Edit Review" : "Add Review"}
            </p>
          }
          project_id={projectData?.id}
          project_name={projectData?.name}
        />
        <div
          className={reviewDetails?.length >= 1 ? "filter-container" : "hidden"}
        >
          <Select onValueChange={setReviewsOrder}>
            <SelectTrigger className="h-[36px]">
              <SelectValue placeholder="Latest" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="top-rated">Top Rated</SelectItem>
                <SelectItem value="lowest-rated">Lowest Rated</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select onValueChange={setReviewsFilter}>
            <SelectTrigger className="h-[36px]">
              <SelectValue placeholder="Text" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="with_text">Text</SelectItem>
                <SelectItem value="only_ratings">Only Ratings</SelectItem>
                <SelectItem
                  className={claimed ? "" : "hidden"}
                  value="unreplied"
                >
                  Un Replied
                </SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      {reviewDetails?.map((item, i) => (
        <div
          className={reviewDetails ? "main-div" : "hidden"}
          key={i}
          id={item?.id}
        >
          <div className="first-row">
            <div className="user-details">
              <p
                className="user-img"
                style={{
                  backgroundColor: userColors[i % userColors.length],
                }}
              >
                {item?.publisher
                  ?.split(" ")
                  ?.slice(0, 2) // Select only the first two words
                  ?.map((word) => word.charAt(0).toUpperCase())
                  ?.join("") ||
                  item?.reviewer_name
                    ?.split(" ")
                    ?.slice(0, 2) // Select only the first two words
                    ?.map((word) => word.charAt(0).toUpperCase())
                    ?.join("")}
              </p>
              <div className="sub-details">
                <p className="username">
                  {item?.publisher
                    ?.split(" ")
                    ?.map(
                      (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    )
                    ?.join(" ") ||
                    item?.reviewer_name
                      ?.split(" ")
                      ?.map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase()
                      )
                      ?.join(" ")}
                </p>
                <p className="review-date">{item.review_datetime}</p>
              </div>
            </div>
            <div className="g-review">
              <div className="flex items-center gap-2 ml-2">
                {item.reviewer_type === "google_reviewer" && (
                  <svg
                    height="16px"
                    width="16px"
                    viewBox="0 0 533.5 544.3"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                      fill="#4285f4"
                    />
                    <path
                      d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                      fill="#34a853"
                    />
                    <path
                      d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                      fill="#fbbc04"
                    />
                    <path
                      d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                      fill="#ea4335"
                    />
                  </svg>
                )}
                <StarRating rating={item.overall_rating} />
              </div>
              <div className="popOver">
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
                    <div className="absolute bg-white mt-1 drop-shadow-xl w-max whitespace-nowrap right-0 rounded-md">
                      <ReviewReportModal
                        reviewId={item?.id}
                        projectName={projectData?.name}
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
              </div>
            </div>
          </div>
          <div className="content-div">
            <p className="review-content">{item.text}</p>
          </div>
          <div
            className={
              item.approved_images?.length >= 1 ? "review-img" : "hidden"
            }
          >
            {item?.approved_images?.map((imageUrl, index) => (
              <img key={index} src={validateImageUrl(imageUrl?.url)} />
            ))}
          </div>
          <div className="review-footer">
            <div className="comments-votes">
              <p className="comments">{item.comment} Comments </p>
              <p className="p-line"></p>
              <p className="votes">{item.vote} Votes </p>
            </div>
            <div className="social">
              <ProtectedRouteWrapper
                triggerElement={
                  <p className="add-comment">
                    <ThumbsUpIcon style={{ color: "grey" }} />
                    <span>Helpful</span>
                  </p>
                }
                callback={(empty, callbackToken) =>
                  handleHelpful(item?.id, callbackToken)
                }
              >
                <p
                  className="add-comment"
                  onClick={() => {
                    ReactGA.event({
                      category: "User",
                      action: "User Clicked on helpful  review",
                      label: "Button Click",
                    });
                    handleHelpful(item?.id);
                  }}
                >
                  <ThumbsUpIcon
                    style={{ color: item?.voted == true ? "#f1592a" : "grey" }}
                  />
                  <span>Helpful</span>
                </p>
              </ProtectedRouteWrapper>
              <p
                className="add-comment"
                style={{ cursor: "pointer" }}
                onClick={handleShareReview}
              >
                <img src="/images/fi_corner-up-right.svg " alt="icon" />
                <span>Share</span>
              </p>
            </div>
          </div>
          <ReviewComment
            claimed={claimed}
            commentable_id={item?.id}
            project_id={projectData?.id}
            toggleComment={toggleComment}
            setToggleComment={setToggleComment}
            commentCount={item.comment}
          />
        </div>
      ))}
      <div
        className={reviewDetails?.length <= 0 ? "main-div-review" : "hidden"}
      >
        No Reviews
      </div>
      <ProtectedRouteWrapper
        triggerElement={
          <div className="view-btn">
            <p className={remainingReviews > 10 ? "see_more" : "hidden"}>
              Show More ({remainingReviews})
            </p>
          </div>
        }
        callback={handleShowMore}
      >
        <div className="view-btn">
          <p
            className={remainingReviews > 10 ? "see_more" : "hidden"}
            onClick={handleShowMore}
          >
            Show More ({remainingReviews})
          </p>
        </div>
      </ProtectedRouteWrapper>
      <SuccessInfoModal
        modalState={showSuccessModal}
        setModalState={setShowSuccessModal}
      >
        <div className="text-center">
          <img src="/images/review added.svg" alt="img" className="m-auto" />
          <h5 className="text-[20px] font-bold">Voted Successfully</h5>
          <p className="text-[13px]">{successMsg}</p>
        </div>
      </SuccessInfoModal>
    </div>
  );
}
