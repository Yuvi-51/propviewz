"use client";
import { Button } from "@/components/ui/button";
import ProtectedRouteWrapper from "@/components/wrappers/ProtectedRouteWrapper";
import { postProjectErrorReportAPI } from "@/connections/post-requests/postProjectErrorReportAPI";
import { projectReportErrorInitState } from "@/constants/initialStateData";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { cloneElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ScaleLoader from "react-spinners/ScaleLoader";
import SuccessInfoModal from "../SuccessInfoModal";
import "./ProjectReportModal.scss";

import ReactGA from "react-ga";

export default function ProjectReportModal({
  projectData,
  triggerElement,
  callback,
  setIsModalOpen,
}) {
  const token = useSelector((state) => state.auth.token);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [reportState, setReportState] = useState(projectReportErrorInitState);
  const [isError, setIsError] = useState({
    checkedError: false,
    projectInput: false,
    locationInput: false,
  });
  const [loading, setLoading] = useState(false);
  const [requestEditSent, setRequestEditSent] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [commentForProjectName, setCommentForProjectName] = useState("");
  const currentProjectName = projectData?.name;
  const currentLocationName = projectData?.detailed_area;
  const [newLocationName, setNewLocationName] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [commentForLocationName, setCommentForLocationName] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const claimed = projectData?.claimed;
  const projectId = projectData?.id;

  const handleReportErrorChange = (e) => {
    setIsValid(false);
    if (e.target.type === "checkbox") {
      setReportState((prev) => ({
        ...prev,
        [e.target.name]: e.target.checked,
      }));
      setIsError((prev) => ({
        ...prev,
        checkedError: false,
        projectInput: false,
        locationInput: false,
      }));
    } else {
      setReportState((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
      setIsError((prev) => ({ ...prev, [e.target.name]: false }));
    }
  };

  const submitHandler = (onClose) => {
    const reportError = async (issueType, comments) => {
      setLoading(true);
      const requestData = {
        report_error: {
          reportable_type: "Project",
          reportable_id: projectId,
          issue_type: issueType,
          comments: comments,
        },
      };

      try {
        const res = await postProjectErrorReportAPI(requestData, token);
        return res;
      } catch (error) {
        return error;
      }
    };

    if (reportState?.isProjectChecked && reportState?.isLocationChecked) {
      if (reportState?.locationInput && reportState?.projectInput) {
        const projectPromise = reportError(
          `${projectData?.name}, Project name is incorrect`,
          {
            project_name: reportState?.projectInput,
          }
        );

        const locationPromise = reportError(
          `${projectData?.name}, Project location is incorrect`,
          {
            location_name: reportState?.locationInput,
          }
        );
        setLoading(true);
        Promise.all([projectPromise, locationPromise])
          .then((res) => {
            setLoading(false);
            onClose();
            setReportState(projectReportErrorInitState);
            setShowSuccessModal(true);
          })
          .catch((error) => {
            setLoading(false);
          });
      } else {
        setIsError((prev) => ({
          ...prev,
          projectInput: true,
          locationInput: true,
        }));
      }
    } else if (reportState?.isProjectChecked) {
      if (reportState?.projectInput) {
        setLoading(true);
        reportError(`${projectData?.name}, Project name is incorrect`, {
          project_name: reportState?.projectInput,
        })
          .then((res) => {
            setLoading(false);

            setReportState(projectReportErrorInitState);
            setShowSuccessModal(true);
          })
          .catch((error) => {
            setLoading(false);
          });
      } else {
        setIsError((prev) => ({
          ...prev,
          projectInput: true,
        }));
      }
    } else if (reportState?.isLocationChecked) {
      if (reportState?.locationInput) {
        setLoading(true);
        reportError(`${projectData?.name}, Project location is incorrect`, {
          location_name: reportState?.locationInput,
        })
          .then((res) => {
            setLoading(false);

            setReportState(projectReportErrorInitState);
            setShowSuccessModal(true);
          })
          .catch((error) => {
            setLoading(false);
          });
      } else {
        setIsError((prev) => ({
          ...prev,
          locationInput: true,
        }));
      }
    } else {
      setIsError((prev) => ({ ...prev, checkedError: true }));
    }
  };

  const isDataValid = () => {
    if (
      (reportState?.isProjectChecked && !newProjectName) ||
      (reportState?.isLocationChecked && !newLocationName)
    ) {
      setIsValid(true);
      return false;
    } else if (
      !reportState?.isProjectChecked &&
      !reportState?.isLocationChecked
    ) {
      setIsValid(true);
      setIsError((prev) => ({ ...prev, checkedError: true })); // You can uncomment this line if needed
      return false;
    }
    return true;
  };

  const editProjectDetailsHandler = (onClose) => {
    const editData = {
      report_error: {
        reportable_type: "Project",
        reportable_id: projectId,
        issue_type: "Edit Project Details Request By Claimed User",
        comments: {
          currentProjectName: currentProjectName,
          newProjectName: newProjectName,
          reasonForChangingProjectName: commentForProjectName,
          currentLocationName: currentLocationName,
          newLocationName: newLocationName,
          reasonForChangingLocationName: commentForLocationName,
        },
      },
    };

    if (isDataValid()) {
      if (!requestEditSent) {
        setRequestEditSent(true);
        setLoading(true);

        postProjectErrorReportAPI(editData, token)
          .then((response) => {
            setShowSuccessModal(true);
            setLoading(false);
          })
          .catch((error) => {
            setRequestEditSent(false);
            setLoading(false);
          });
      }
    }
  };

  const withoutLoginHandler = (onClose) => {
    ReactGA.event({
      category: "User",
      action: "User Submitted a ProjectReportError",
      label: "Button Click",
    });
    claimed === true
      ? editProjectDetailsHandler(onClose)
      : submitHandler(onClose);
  };

  useEffect(() => {
    if (isOpen) {
      setIsModalOpen && setIsModalOpen(false);
    } else {
      setIsModalOpen && setIsModalOpen(true);
    }
  }, [isOpen]);

  return (
    <ProtectedRouteWrapper triggerElement={triggerElement} callback={onOpen}>
      {cloneElement(triggerElement, { onClick: onOpen })}
      <Modal
        isOpen={isOpen}
        onOpenChange={() => {
          callback && callback();
          onOpenChange();
        }}
        size="lg"
        placement={"center"}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {claimed === true ? "Edit" : "Report"} Project Name/Location
              </ModalHeader>
              <ModalBody>
                <div className="ProjectReportHandler">
                  <div className="flex flex-col items-start">
                    <label className="project-div">
                      <input
                        type="checkbox"
                        name="isProjectChecked"
                        checked={reportState?.isProjectChecked}
                        onChange={handleReportErrorChange}
                        className="checkbox"
                      />
                      <span className="project-name">
                        {claimed === true
                          ? "Edit Project Name"
                          : "Project Name"}{" "}
                      </span>
                    </label>
                    <div className="sub-info">
                      The project name associated with the property is
                      incorrect.{" "}
                    </div>
                    {reportState?.isProjectChecked && (
                      <>
                        {claimed === true ? (
                          <>
                            <div className="edit-data">
                              <label className="label">
                                Current Project Name:
                              </label>
                              <input
                                className="input-area"
                                value={projectData?.name}
                                disabled
                              />
                            </div>
                            <div className="edit-data">
                              <label className="label">New Project Name:</label>
                              <input
                                className="input-area"
                                placeholder="Enter New Project Name Here"
                                onChange={(e) =>
                                  setNewProjectName(e.target.value)
                                }
                              />
                            </div>
                            {isValid && !newProjectName ? (
                              <div
                                style={{
                                  color: "red",
                                  marginLeft: "28px",
                                  fontSize: "12px",
                                }}
                              >
                                Please Enter New Project Name
                              </div>
                            ) : null}
                            <div className="edit-data">
                              <label className="label">
                                Enter Reason for Changing Project Name:
                              </label>
                              <textarea
                                className="input-area"
                                placeholder="Enter reason Here for Changing Project Name"
                                onChange={(e) =>
                                  setCommentForProjectName(e.target.value)
                                }
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <textarea
                              className="input-area"
                              placeholder="Please let us know the correct project name & we will look into it."
                              name="projectInput"
                              value={reportState?.projectInput}
                              onChange={handleReportErrorChange}
                            ></textarea>
                            <p className="max-limit">Max: 100 words</p>
                            {isError?.projectInput && (
                              <p className="text-[red] text-[15px] ml-[30px]">
                                Please input correct project name
                              </p>
                            )}
                          </>
                        )}
                      </>
                    )}
                    <p className="hr-line"></p>
                  </div>
                  <div className="flex flex-col items-start">
                    <label className="project-div">
                      <input
                        type="checkbox"
                        checked={reportState?.isLocationChecked}
                        name="isLocationChecked"
                        onChange={handleReportErrorChange}
                        className="checkbox"
                      />
                      <span className="project-name">
                        {claimed === true
                          ? "Edit Location Name"
                          : "Project Location"}
                      </span>
                    </label>
                    <div className="sub-info">
                      The project location associated with the property is
                      incorrect.{" "}
                    </div>
                    {reportState?.isLocationChecked && (
                      <>
                        {claimed === true ? (
                          <>
                            <div className="edit-data">
                              <label className="label">
                                Current Location Name:
                              </label>
                              <input
                                className="input-area"
                                value={projectData?.detailed_area}
                                disabled
                              />
                            </div>
                            <div className="edit-data">
                              <label className="label">
                                New Location Name:
                              </label>
                              <input
                                className="input-area"
                                placeholder="Enter New Location Name Here"
                                onChange={(e) =>
                                  setNewLocationName(e.target.value)
                                }
                              />
                            </div>
                            {isValid && !newLocationName ? (
                              <div
                                style={{
                                  color: "red",
                                  marginLeft: "28px",
                                  fontSize: "12px",
                                }}
                              >
                                Please Enter New Location Name
                              </div>
                            ) : null}
                            <div className="edit-data">
                              <label className="label">
                                Enter Reason for Changing Location Name:
                              </label>
                              <textarea
                                style={{ height: "60px" }}
                                className="input-area"
                                placeholder="Enter reason Here for Changing Location Name"
                                onChange={(e) =>
                                  setCommentForLocationName(e.target.value)
                                }
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <textarea
                              className="input-area"
                              placeholder="Please let us know the correct project location & we will look into it."
                              onChange={handleReportErrorChange}
                              value={reportState?.locationInput}
                              name="locationInput"
                            ></textarea>
                            <p className="max-limit">Max: 100 words</p>
                            {isError?.locationInput && (
                              <p className="text-[red] text-[15px] ml-[30px]">
                                Please input correct project location
                              </p>
                            )}
                          </>
                        )}
                      </>
                    )}
                    <p className="hr-line"></p>
                  </div>
                  {isError?.checkedError && (
                    <p className="text-[red] text-[15px] ml-[15px] mt-[15px]">
                      Please select any error type
                    </p>
                  )}
                  <ModalFooter>
                    <Button
                      className="w-[90%] m-auto"
                      onClick={() => {
                        withoutLoginHandler(onClose);
                      }}
                    >
                      {loading ? (
                        <ScaleLoader
                          color="#ffffff"
                          height={25}
                          radius={5}
                          width={4}
                        />
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </ModalFooter>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <SuccessInfoModal
        modalState={showSuccessModal}
        setModalState={setShowSuccessModal}
      >
        <div className="text-center">
          <img src="/images/review added.svg" alt="img" className="m-auto" />
          <h5 className="text-[20px] font-bold">
            {claimed === true ? " Edit" : "Report"} Project Name/Location
            Request Sent
          </h5>
          <p className="text-[13px]">
            Great We have received your request. Our team will contact you soon
          </p>
        </div>
      </SuccessInfoModal>
    </ProtectedRouteWrapper>
  );
}
