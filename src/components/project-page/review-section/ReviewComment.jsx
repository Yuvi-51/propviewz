import SuccessInfoModal from "@/components/modal-content/SuccessInfoModal";
import ProtectedRouteWrapper from "@/components/wrappers/ProtectedRouteWrapper";
import { getProjectReviewCommentsAPI } from "@/connections/get-requests/getProjectReviewsAPI";
import { postProjectReviewCommentAPI } from "@/connections/post-requests/postProjectReviewCommentAPI";
import useAsync from "@/custom/useAsync";
import { useState } from "react";
import { useSelector } from "react-redux";
import "./ReviewComment.scss";

import AccordionWrapper from "@/components/wrappers/AccordianWrapper";
import ReactGA from "react-ga";

export default function ReviewComment({
  commentable_id,
  project_id,
  toggleComment,
  setToggleComment,
  claimed,
  commentCount,
}) {
  const token = useSelector((state) => state.auth.token);
  const [text, setText] = useState("");
  const [validationError, setValidationError] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const {
    loading,
    error,
    value: reviewComments,
  } = useAsync(
    getProjectReviewCommentsAPI,
    [toggleComment],
    [project_id, commentable_id, commentCount]
  );

  const handleComment = async (callbackToken) => {
    ReactGA.event({
      category: "User",
      action: "User Commented on review",
      label: "Button Click",
    });
    if (text) {
      const payload = {
        project_id,
        commentable_id,
        commentable_type: "ProjectReview",
        text,
      };
      const res = await postProjectReviewCommentAPI(
        payload,
        callbackToken || token
      );
      if (res?.status?.status === "SUCCESS") setShowSuccessModal(true);
    } else {
      setValidationError(true);
    }
  };

  const handleAfterComment = () => {
    setText("");
    setToggleComment(!toggleComment);
  };
  return (
    <>
      <div className="Comments">
        <div className="flex">
          <input
            placeholder="Enter Comment"
            className="input-box"
            value={text}
            onChange={(e) => {
              setValidationError(false);
              setText(e.target.value);
            }}
          />
          <ProtectedRouteWrapper
            triggerElement={<p className="post-btn">Post</p>}
            callback={(empty, callbackToken) => handleComment(callbackToken)}
          >
            <p className="post-btn" onClick={() => handleComment()}>
              Post
            </p>
          </ProtectedRouteWrapper>
        </div>
        {validationError && (
          <p className="error-text">Please enter your comment</p>
        )}
      </div>

      {reviewComments?.length ? (
        <AccordionWrapper
          triggerElement={
            <p className="mr-2">
              <span>View Comments</span>
            </p>
          }
          isOpen={true}
        >
          {reviewComments?.map((data, i) => (
            <div className={"show-comment Comments"} key={i}>
              <div className="comment-box">
                <div className="user-details">
                  <p className="user-img">
                    {(data?.user_name &&
                      data?.user_name
                        .split(" ")
                        .map((word) => word.charAt(0).toUpperCase())
                        .join("")) ||
                      "Responded by management"
                        .split(" ")
                        .map((word) => word.charAt(0).toUpperCase())
                        .join("")}
                  </p>
                  <div className="sub-details">
                    <p className="username">
                      {data?.user_name || "Responded by management"}
                    </p>
                    <p className="date"> {data?.created_at}</p>
                  </div>
                </div>
                <div className="text ">{data?.text}</div>
              </div>
            </div>
          ))}
        </AccordionWrapper>
      ) : null}

      <SuccessInfoModal
        modalState={showSuccessModal}
        setModalState={setShowSuccessModal}
        onMountComplete={handleAfterComment}
      >
        <div className="text-center">
          <img src="/images/review added.svg" alt="img" className="m-auto" />
          <h5 className="text-[20px] font-bold">Commented Successfully</h5>
          <p className="text-[13px]">
            {claimed === true
              ? ""
              : "Well Done! It will get displayed after approval from management"}
          </p>
        </div>
      </SuccessInfoModal>
    </>
  );
}
