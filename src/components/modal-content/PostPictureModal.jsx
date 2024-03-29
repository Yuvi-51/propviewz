"use client";
import { postProjectPictureAPI } from "@/connections/post-requests/postProjectPictureAPI";
import { initialPostPictureState } from "@/constants/initialStateData";
import { convertBase64 } from "@/logic/conversions";
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

export default function PostPictureModal({
  triggerElement,
  project_id,
  project_name,
  callback,
  setIsModalOpen,
}) {
  const token = useSelector((state) => state.auth.token);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [modalState, setModalState] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedPostPictureDetails, setSelectedPostPictureDetails] = useState(
    initialPostPictureState
  );
  const { toast } = useToast();

  const handlePostPictureDetailsChange = async (e) => {
    let reviewImageFile;
    let project_medias_attribute = {};
    if (e.target.files) {
      reviewImageFile = e.target.files[0];
      const base64Image = await convertBase64(reviewImageFile);
      project_medias_attribute = {
        uid: "id" + Math.random().toString(16).slice(2),
        title: "",
        media_type: "review",
        given_by: "user",
        image: base64Image,
      };

      setSelectedPostPictureDetails({
        ...selectedPostPictureDetails,
        project_media: [
          ...selectedPostPictureDetails?.project_media,
          project_medias_attribute,
        ],
      });
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        project_media: false,
      }));
    }
  };

  const handlePostPictureSubmit = async (e, callbackToken) => {
    ReactGA.event({
      category: "User",
      action: "User Post a pic",
      label: "Button Click",
    });
    e && e.preventDefault();
    const errors = {};
    if (!selectedPostPictureDetails?.project_name) {
      errors.project_name = true;
    }
    if (selectedPostPictureDetails?.project_media?.length === 0) {
      errors.project_media = true;
    }

    if (Object.keys(errors).length === 0) {
      setSubmitLoading(true);
      try {
        const res = await postProjectPictureAPI(
          selectedPostPictureDetails,
          callbackToken ? callbackToken : token
        );
        if (res?.status?.status === "SUCCESS") {
          setSelectedPostPictureDetails(
            project_id
              ? { ...initialPostPictureState, project_name, project_id }
              : initialPostPictureState
          );
          setSubmitLoading(false);
          toast({
            variant: "success",
            title: "Picture Added",
            description:
              "Well Done! It will get displayed after approval from management",
          });
          setModalState(false);
          callback && callback();
        } else {
          toast({
            variant: "destructive",
            title: "Something went wrong",
            description: "Please try after some time",
          });
          setSubmitLoading(false);
        }
      } catch (error) {
        setSubmitLoading(false);
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: "Please try after some time",
        });
      }
    } else {
      setValidationErrors(errors);
    }
  };

  //INFO: Clear state data if Add Review Modal is closed
  useEffect(() => {
    if (!modalState && !project_id) {
      setSelectedPostPictureDetails(initialPostPictureState);
      setValidationErrors({});
    }
    if (modalState) {
      setIsModalOpen && setIsModalOpen(false);
    } else {
      setIsModalOpen && setIsModalOpen(true);
    }
  }, [modalState]);

  //INFO: Set project_name and project_id if project page is opened

  useEffect(() => {
    if (project_id && project_name) {
      setSelectedPostPictureDetails({
        ...selectedPostPictureDetails,
        project_name,
        project_id,
      });
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        project_name: false,
      }));
    }
  }, [project_id]);

  return (
    <ModalWrapper
      title={"Post Picture"}
      trigger={triggerElement}
      open={modalState}
      setOpen={setModalState}
    >
      <form className="project-review-modal" onSubmit={handlePostPictureSubmit}>
        <div className="heading">
          <div className="field-Title">
            Project <span style={{ color: "red" }}>*</span>
          </div>
          {project_id && project_name ? (
            <h2 className="project-name">{project_name}</h2>
          ) : (
            <div className="project-search-input-container">
              <ProjectSearch
                projectSearchDetails={selectedPostPictureDetails}
                setProjectSearchDetails={setSelectedPostPictureDetails}
                setValidationErrors={setValidationErrors}
              />
            </div>
          )}
          {validationErrors?.project_name && (
            <p className="error-text">Please select project</p>
          )}
          <div className="field-Title">Share Project photos</div>
          <div className="upload-pic">
            <label htmlFor="inputTag" className="upload-pic-btn">
              <UploadIcon />
              Upload a File
              <input
                className="file-input"
                id="inputTag"
                type="file"
                name="project_media"
                accept="image/png, image/jpeg"
                onChange={handlePostPictureDetailsChange}
              />
            </label>
            {selectedPostPictureDetails?.project_media?.map((item) => (
              <div className="w-[100%] flex flex-col items-end" key={item?.id}>
                <XIcon
                  cursor={"pointer"}
                  onClick={() => {
                    const filteredImageArray =
                      selectedPostPictureDetails?.project_media?.filter(
                        (filterElement) => filterElement?.uid !== item?.uid
                      );
                    setSelectedPostPictureDetails({
                      ...selectedPostPictureDetails,
                      project_media: filteredImageArray,
                    });
                  }}
                />
                <div
                  className={
                    item.image
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
                        selectedPostPictureDetails?.project_media?.map(
                          (mediaItem) => {
                            if (mediaItem.uid === item.uid) {
                              return {
                                ...mediaItem,
                                title: updatedTitle,
                              };
                            }
                            return mediaItem;
                          }
                        );
                      setSelectedPostPictureDetails({
                        ...selectedPostPictureDetails,
                        project_media: updatedMediaAttributes,
                      });
                    }}
                    placeholder="Please enter image title"
                  />
                </div>
              </div>
            ))}
          </div>
          {validationErrors?.project_media && (
            <p className="error-text">Please upload media</p>
          )}
        </div>
        <DialogFooter className="mt-5">
          <ProtectedRouteWrapper
            triggerElement={<Button className="w-[90%] m-auto">Submit</Button>}
            callback={handlePostPictureSubmit}
          >
            <Button className="w-[90%] m-auto" type="submit">
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
