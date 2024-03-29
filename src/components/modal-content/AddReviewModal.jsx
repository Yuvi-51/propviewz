"use client";
import { getExistingProjectReviewAPI } from "@/connections/get-requests/getExistingProjectReviewAPI";
import { postNewProjectReviewAPI } from "@/connections/post-requests/postNewProjectReviewAPI";
import { putUpdateProjectReviewAPI } from "@/connections/put-requests/putUpdateProjectReviewAPI";
import { initialProjectReviewState } from "@/constants/initialStateData";
import useAsync from "@/custom/useAsync";
import { convertBase64 } from "@/logic/conversions";
import { Rating, Stack } from "@mui/material";
import { UploadIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import ReactGA from "react-ga";
import { useSelector } from "react-redux";
import ScaleLoader from "react-spinners/ScaleLoader";
import ProjectSearch from "../project-&-location-search/ProjectSearch";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import { useToast } from "../ui/use-toast";
import ModalWrapper from "../wrappers/ModalWrapper";
import ProtectedRouteWrapper from "../wrappers/ProtectedRouteWrapper";
import "./AddReviewModal.scss";
export default function AddReviewModal({
  triggerElement,
  project_id,
  project_name,
  callback,
  setIsModalOpen,
}) {
  const token = useSelector((state) => state.auth.token);
  const [modalState, setModalState] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { toast } = useToast();
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedProjectReviewDetails, setSelectedProjectReviewDetails] =
    useState(initialProjectReviewState);
  const {
    loading,
    error,
    value: existingProjectReviewDetails,
  } = useAsync(
    getExistingProjectReviewAPI,
    [selectedProjectReviewDetails?.project_id, modalState],
    [selectedProjectReviewDetails?.project_id, token]
  );

  //INFO: Setting existing project add reviews details
  useEffect(() => {
    if (
      existingProjectReviewDetails &&
      Object.keys(existingProjectReviewDetails).length !== 0
    ) {
      const {
        amenities_rating,
        customer_service_rating,
        floor_plan_rating,
        location_rating,
        overall_rating,
        reviewer_type,
        value_for_money_rating,
        text,
        // project_medias_attributes,
      } = existingProjectReviewDetails;

      setSelectedProjectReviewDetails({
        ...selectedProjectReviewDetails,
        project_review: {
          ...selectedProjectReviewDetails?.project_review,
          overall_rating,
          location_rating,
          amenities_rating,
          floor_plan_rating,
          value_for_money_rating,
          customer_service_rating,
          reviewer_type,
          text,
          // project_medias_attributes
        },
      });

      if (reviewer_type) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          reviewer_type: false,
        }));
      }
      if (overall_rating) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          overall_rating: false,
        }));
      }
    }
  }, [existingProjectReviewDetails?.id]);

  useEffect(() => {
    if (project_id && project_name) {
      setSelectedProjectReviewDetails({
        ...selectedProjectReviewDetails,
        project_id,
        project_name,
      });
    }
  }, [project_id]);

  const handleProjectReviewDetailsChange = async (e) => {
    const { name, value } = e.target;
    let reviewImageFile;
    let project_medias_attribute = {};
    if (e.target.files) {
      reviewImageFile = e.target.files[0];
      const base64Image = await convertBase64(reviewImageFile);
      project_medias_attribute = {
        uid: "id" + Math.random().toString(16).slice(2),
        title: "",
        project_id:
          selectedProjectReviewDetails?.project_review?.project_id ||
          project_id,
        media_type: "review",
        given_by: "user",
        image: base64Image,
      };
      setSelectedProjectReviewDetails({
        ...selectedProjectReviewDetails,
        project_review: {
          ...selectedProjectReviewDetails?.project_review,
          [name]: value,
          project_medias_attributes: [
            ...selectedProjectReviewDetails?.project_review
              ?.project_medias_attributes,
            project_medias_attribute,
          ],
        },
      });
    } else {
      setSelectedProjectReviewDetails({
        ...selectedProjectReviewDetails,
        project_review: {
          ...selectedProjectReviewDetails?.project_review,
          [name]: value,
        },
      });
    }

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: false,
    }));
  };

  //INFO: Clear state data if Add Review Modal is closed
  useEffect(() => {
    if (!modalState && !project_id) {
      setSelectedProjectReviewDetails(initialProjectReviewState);
      setValidationErrors({});
      setSubmitLoading(false);
    }
    if (modalState) {
      setIsModalOpen && setIsModalOpen(false);
    } else {
      setIsModalOpen && setIsModalOpen(true);
    }
  }, [modalState]);

  const handleProjectReviewSubmit = async (e, callbackToken) => {
    e && e.preventDefault();
    ReactGA.event({
      category: "User",
      action: "User Submitted Project Review",
      label: "Button Click",
    });

    //INFO: if handle project is passed in protected route callback, no event will be passed
    const errors = {};
    if (!selectedProjectReviewDetails?.project_id) {
      errors.project_name = true;
    }
    if (!selectedProjectReviewDetails?.project_review?.reviewer_type) {
      errors.reviewer_type = true;
    }
    if (!selectedProjectReviewDetails?.project_review?.overall_rating) {
      errors.overall_rating = true;
    }

    if (Object.keys(errors).length === 0) {
      setSubmitLoading(true);
      if (existingProjectReviewDetails?.id) {
        // INFO: If user already submitted a project review then update the existing project review
        const putReviewResponse = await putUpdateProjectReviewAPI(
          existingProjectReviewDetails?.id,
          selectedProjectReviewDetails,
          token
        );
        if (putReviewResponse?.status?.status === "SUCCESS") {
          setSubmitLoading(false);
          if (
            selectedProjectReviewDetails?.project_review?.overall_rating &&
            !selectedProjectReviewDetails?.project_review?.text &&
            selectedProjectReviewDetails?.project_review
              ?.project_medias_attributes?.length == 0
          ) {
            toast({
              variant: "success",
              title: "Rating Added",
            });
          } else if (
            selectedProjectReviewDetails?.project_review?.overall_rating &&
            !selectedProjectReviewDetails?.project_review?.text &&
            selectedProjectReviewDetails?.project_review
              ?.project_medias_attributes?.length !== 0
          ) {
            toast({
              variant: "success",
              title: "Rating Added",
              description:
                "Photo would show once it gets approved by Management",
            });
          } else {
            toast({
              variant: "success",
              title: "Review Added",
              description:
                "Well Done! It will get displayed after approval from management",
            });
          }
          setSelectedProjectReviewDetails(
            project_id
              ? { ...initialProjectReviewState, project_name, project_id }
              : initialProjectReviewState
          );
          setModalState(false);
          callback && callback();
        } else {
          setSubmitLoading(false);
          toast({
            variant: "destructive",
            title: "Something went wrong",
            description: "Please try after some time",
          });
        }
      } else {
        // INFO: If user is submitting a new project review
        const postReviewResponse = await postNewProjectReviewAPI(
          selectedProjectReviewDetails,
          callbackToken ? callbackToken : token
        );
        if (postReviewResponse?.status?.status === "SUCCESS") {
          setSubmitLoading(false);
          if (
            selectedProjectReviewDetails?.project_review?.overall_rating &&
            !selectedProjectReviewDetails?.project_review?.text &&
            selectedProjectReviewDetails?.project_review
              ?.project_medias_attributes?.length == 0
          ) {
            toast({
              variant: "success",
              title: "Rating Added",
            });
          } else if (
            selectedProjectReviewDetails?.project_review?.overall_rating &&
            !selectedProjectReviewDetails?.project_review?.text &&
            selectedProjectReviewDetails?.project_review
              ?.project_medias_attributes?.length !== 0
          ) {
            toast({
              variant: "success",
              title: "Rating Added",
              description:
                "Photo would show once it gets approved by Management",
            });
          } else {
            toast({
              variant: "success",
              title: "Review Added",
              description:
                "Well Done! It will get displayed after approval from management",
            });
          }
          setSelectedProjectReviewDetails(
            project_id
              ? { ...initialProjectReviewState, project_name, project_id }
              : initialProjectReviewState
          );
          setModalState(false);
          callback && callback();
        } else {
          setSubmitLoading(false);
          toast({
            variant: "destructive",
            title: "Something went wrong",
            description: "Please try after some time",
          });
        }
      }
    } else {
      setValidationErrors(errors);
    }
  };

  const handleSelectStatus = (reviewer_type) => {
    setSelectedProjectReviewDetails({
      ...selectedProjectReviewDetails,
      project_review: {
        ...selectedProjectReviewDetails?.project_review,
        reviewer_type,
      },
    });

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      reviewer_type: false,
    }));
  };

  return (
    <ModalWrapper
      title={existingProjectReviewDetails?.id ? "Edit Review" : "Add Review"}
      trigger={triggerElement}
      open={modalState}
      setOpen={setModalState}
    >
      <form className="project-review-modal">
        <div className="heading">
          <div className="field-Title">
            Project <span style={{ color: "red" }}>*</span>
          </div>
          {project_id && project_name ? (
            // <i className="project-name">{project_name}</i>
            <input
              type="text"
              value={project_name}
              className="project-name"
              // disabled
            />
          ) : (
            <div className="project-search-input-container">
              <ProjectSearch
                projectSearchDetails={selectedProjectReviewDetails}
                setProjectSearchDetails={setSelectedProjectReviewDetails}
                setValidationErrors={setValidationErrors}
              />
            </div>
          )}
          {validationErrors?.project_name && (
            <p className="error-text">Please select project</p>
          )}
          <div className="field-Title">
            Please confirm your status at Project
            <span style={{ color: "red" }}>*</span>
          </div>
          <div className="status">
            <div className="btn-group">
              {["Owner", "Tenant", "Visitor", "Agent"].map((el, i) => (
                <p
                  key={i}
                  type="button"
                  className={
                    selectedProjectReviewDetails?.project_review
                      ?.reviewer_type === el.toLowerCase()
                      ? "active"
                      : "status-title"
                  }
                  onClick={() => handleSelectStatus(el.toLowerCase())}
                >
                  {el}
                </p>
              ))}
            </div>
          </div>
          {validationErrors?.reviewer_type && (
            <p className="error-text">Please select status</p>
          )}
          <div className="field-Title">
            Your Overall Rating of this Project{" "}
            <span style={{ color: "red" }}>*</span>
          </div>
          {validationErrors?.overall_rating && (
            <p className="error-text">Please give overall rating</p>
          )}
          <div className="stars">
            <Stack spacing={1}>
              <Rating
                name="overall_rating"
                value={
                  selectedProjectReviewDetails?.project_review?.overall_rating
                }
                onChange={handleProjectReviewDetailsChange}
              />
            </Stack>
            <br />
          </div>
          <div className="field-Title">Project Ratings</div>
          <div className="star-rating-field">
            <div className="rating-field">
              <div className="field-name">Location</div>
              <div className="stars">
                <Stack spacing={1}>
                  <Rating
                    name="location_rating"
                    value={
                      selectedProjectReviewDetails?.project_review
                        ?.location_rating
                    }
                    onChange={handleProjectReviewDetailsChange}
                  />
                </Stack>
              </div>
            </div>
            <div className="rating-field ">
              <div className="field-name ">Amenities</div>
              <div className="stars">
                <Stack spacing={1}>
                  <Rating
                    name="amenities_rating"
                    value={
                      selectedProjectReviewDetails?.project_review
                        ?.amenities_rating
                    }
                    onChange={handleProjectReviewDetailsChange}
                  />
                </Stack>
              </div>
            </div>
            <div className="rating-field ">
              <div className="field-name ">Unit/ Floor Plan</div>
              <div className="stars ">
                <Stack spacing={1}>
                  <Rating
                    name="floor_plan_rating"
                    value={
                      selectedProjectReviewDetails?.project_review
                        ?.floor_plan_rating
                    }
                    onChange={handleProjectReviewDetailsChange}
                  />
                </Stack>
              </div>
            </div>
            <div className="rating-field">
              <div className="field-name">Customer Services</div>
              <div className="stars">
                <Stack spacing={1}>
                  <Rating
                    name="customer_service_rating"
                    value={
                      selectedProjectReviewDetails?.project_review
                        ?.customer_service_rating
                    }
                    onChange={handleProjectReviewDetailsChange}
                  />
                </Stack>
              </div>
            </div>
            <div className="rating-field">
              <div className="field-name">Value for Money</div>
              <div className="stars ">
                <Stack spacing={1}>
                  <Rating
                    name="value_for_money_rating"
                    value={
                      selectedProjectReviewDetails?.project_review
                        ?.value_for_money_rating
                    }
                    onChange={handleProjectReviewDetailsChange}
                  />
                </Stack>
              </div>
            </div>
          </div>
          <div className="field-Title">Review</div>
          <div>
            <textarea
              placeholder="Share your experience here"
              className="text"
              name="text"
              value={selectedProjectReviewDetails?.project_review?.text || ""}
              onChange={handleProjectReviewDetailsChange}
            />
          </div>
          <div className="field-Title">Share Project photos</div>
          <div className="upload-pic">
            <label htmlFor="inputTag" className="upload-pic-btn">
              <UploadIcon />
              Upload a File
              <input
                className="file-input"
                id="inputTag"
                type="file"
                name="project_medias_attributes"
                accept="image/png, image/jpeg"
                onChange={handleProjectReviewDetailsChange}
              />
            </label>
            {selectedProjectReviewDetails?.project_review?.project_medias_attributes?.map(
              (item) => (
                <div
                  className="w-[100%] flex flex-col items-end"
                  key={item?.uid}
                >
                  <XIcon
                    cursor={"pointer"}
                    onClick={() => {
                      const filteredImageArray =
                        selectedProjectReviewDetails?.project_review?.project_medias_attributes?.filter(
                          (filterElement) => filterElement?.uid !== item?.uid
                        );
                      setSelectedProjectReviewDetails({
                        ...selectedProjectReviewDetails,
                        project_review: {
                          ...selectedProjectReviewDetails?.project_review,
                          project_medias_attributes: filteredImageArray,
                        },
                      });
                    }}
                  />
                  <div
                    className={
                      item?.image
                        ? "flex items-center w-[90%] m-auto gap-[5px]"
                        : "hidden"
                    }
                  >
                    <Image
                      width={80}
                      height={80}
                      src={item?.image}
                      className="uploaded-image"
                      alt="review-image"
                    />
                    <input
                      className="title-input"
                      value={item?.title}
                      required
                      onChange={(e) => {
                        const updatedTitle = e.target.value;
                        const updatedMediaAttributes =
                          selectedProjectReviewDetails?.project_review?.project_medias_attributes?.map(
                            (mediaItem) =>
                              mediaItem?.uid === item?.uid
                                ? {
                                    ...mediaItem,
                                    title: updatedTitle,
                                  }
                                : mediaItem
                          );
                        setSelectedProjectReviewDetails({
                          ...selectedProjectReviewDetails,
                          project_review: {
                            ...selectedProjectReviewDetails.project_review,
                            project_medias_attributes: updatedMediaAttributes,
                          },
                        });
                      }}
                      placeholder="Please enter image title"
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
        <DialogFooter className="mt-5">
          <ProtectedRouteWrapper
            triggerElement={
              <Button className="w-[90%] m-auto" autoFocus>
                Submit
              </Button>
            }
            callback={handleProjectReviewSubmit}
          >
            <Button
              className="w-[90%] m-auto"
              onClick={handleProjectReviewSubmit}
            >
              {submitLoading ? (
                <ScaleLoader color="#ffffff" height={25} radius={5} width={4} />
              ) : (
                "Submit"
              )}
            </Button>
          </ProtectedRouteWrapper>
        </DialogFooter>
      </form>
    </ModalWrapper>
  );
}
