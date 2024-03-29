import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ModalWrapper from "@/components/wrappers/ModalWrapper";
import ProtectedRouteWrapper from "@/components/wrappers/ProtectedRouteWrapper";
import { postProjectErrorReportAPI } from "@/connections/post-requests/postProjectErrorReportAPI";
import { putClaimOwnerActivityAPI } from "@/connections/put-requests/putClaimOwnerActivityAPI";
import { setFailureToast, setSuccessToast } from "@/logic/handleToasterMsg";
import { validateImageUrl } from "@/logic/validation";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import ReactGA from "react-ga";
import { useSelector } from "react-redux";
import ScaleLoader from "react-spinners/ScaleLoader";
import "./GalleryImageReportModal.scss";
import "./ReviewReportModal.scss";

export default function GalleryImageReportModal({
  activeImageDetails,
  projectName,
  triggerElement,
  claimed,
  projectId,
  callback,
  setIsModalOpen,
}) {
  const token = useSelector((state) => state.auth.token);
  const [modalState, setModalState] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otherReasons, setOtherReasons] = useState("");
  const [title, setTitle] = useState("");
  const { toast } = useToast();

  const handleOptionChange = (event) => {
    setIsError(false);
    if (event.target.checked) {
      setSelectedOption(`${selectedOption}, ${event.target.value}`);
    } else {
      setSelectedOption(selectedOption.replace(`, ${event.target.value}`, ""));
    }
  };

  const submitHandler = (empty, callbackToken) => {
    ReactGA.event({
      category: "User",
      action: "User Submitted GalleryImageReport",
      label: "Button Click",
    });
    let payload = {};
    if (claimed === true && activeImageDetails.given_by === "management") {
      payload = {
        report_error: {
          reportable_type: "ProjectMedia",
          reportable_id: activeImageDetails.id,
          issue_type: `${projectName}, delete media`,
          comments: `null`,
        },
        action_type: "delete_management_image",
      };
    } else {
      payload = {
        report_error: {
          reportable_type: "ProjectMedia",
          reportable_id: activeImageDetails.id,
          issue_type: `${projectName}, ${selectedOption}`,
          comments: otherReasons || `null`,
        },
      };
    }

    if (payload?.action_type || selectedOption) {
      setLoading(true);
      postProjectErrorReportAPI(payload, callbackToken || token)
        .then((res) => {
          setLoading(false);
          if (res?.status?.status === "SUCCESS") {
            setSelectedOption("");
            setOtherReasons("");
            if (payload?.action_type) {
              toast(
                setSuccessToast(
                  "Image Deleted Successfully",
                  "Please refresh page for updated changes"
                )
              );
            } else {
              toast(
                setSuccessToast(
                  "Report Image Request Sent",
                  "Great We have received your request. Our team will contact you soon"
                )
              );
            }
            callback && callback();
          }
        })
        .catch((error) => {
          setLoading(false);
          toast(setFailureToast());
          console.error("Error:", error);
        });
    } else {
      setIsError(true);
    }
  };

  const editImageTitle = () => {
    ReactGA.event({
      category: "User",
      action: "User Edited Image Title",
      label: "Button Click",
    });
    const editData = {
      project_media_id: activeImageDetails.id,
      title: title,
      id: projectId,
      action_type: "change_image_title",
    };

    if (title) {
      setLoading(true);
      putClaimOwnerActivityAPI(editData, token)
        .then((response) => {
          setLoading(false);
          if (response.status === 200) {
            toast(
              setSuccessToast(
                "Title Changed Successfully",
                "Please refresh page for updated changes"
              )
            );
          } else {
            toast(setFailureToast());
          }
        })
        .catch((error) => {
          setLoading(false);
          toast(setFailureToast());
          console.log("error", error);
        });
    } else {
      setIsError(true);
    }
  };

  useEffect(() => {
    if (modalState) {
      setIsModalOpen && setIsModalOpen(false);
    } else {
      setIsModalOpen && setIsModalOpen(true);
    }
  }, [modalState]);

  return (
    <ProtectedRouteWrapper
      triggerElement={triggerElement}
      callback={submitHandler}
    >
      <ModalWrapper
        open={modalState}
        setOpen={setModalState}
        trigger={triggerElement}
        title={
          claimed === true && activeImageDetails.given_by === "management"
            ? "Edit Image Details"
            : "Report Image"
        }
      >
        {claimed === true && activeImageDetails.given_by === "management" ? (
          <div className="flex flex-col gap-5 items-center GalleryErrorReport">
            <div className="flex gap-5 w-[90%]">
              <p style={{ fontWeight: "500" }}> Delete Image </p>{" "}
              <Trash2
                size={20}
                color="#fb0404"
                onClick={submitHandler}
                style={{ cursor: "pointer" }}
              />
            </div>

            <div className="w-[90%]">
              <div style={{ fontWeight: "600", marginBottom: "10px" }}>
                Edit Image Title
              </div>
              <div style={{ fontWeight: "500" }}>Current Title :</div>

              <input
                className="w-[90%]"
                style={{
                  border: "1px solid #f1592a",
                  padding: "5px",
                  fontSize: "14px",
                  borderRadius: "6px",
                  margin: "5px",
                }}
                value={activeImageDetails.title || "Not Mentioned"}
              />
              <div style={{ fontWeight: "500" }}>Enter New Title :</div>
              <input
                value={title}
                onChange={(e) => {
                  setIsError(false);
                  setTitle(e.target.value);
                }}
                className="w-[90%]"
                style={{
                  border: "1px solid #f1592a",
                  padding: "5px",
                  fontSize: "14px",
                  borderRadius: "6px",
                  margin: "5px",
                }}
                placeholder="Enter New Title Here"
              />
            </div>
            {isError && (
              <p
                className="text-red-600 w-full"
                style={{ textAlign: "left", marginLeft: "40px" }}
              >
                Please Enter New Title
              </p>
            )}
            <Button className="w-[90%] m-auto" onClick={editImageTitle}>
              {loading ? (
                <ScaleLoader color="#ffffff" height={25} radius={5} width={4} />
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-start GalleryErrorReport">
            {activeImageDetails && (
              <div className="error-image-container">
                <img
                  src={validateImageUrl(activeImageDetails?.link)}
                  alt={activeImageDetails?.project}
                />
              </div>
            )}
            <p className="modal-body-title">
              Why are you reporting this photo?{" "}
              <span className="text-red-500">*</span>
            </p>
            <label>
              <input
                type="checkbox"
                checked={
                  selectedOption.includes(
                    "Offensive, hateful or sexually explicit"
                  )
                    ? true
                    : false
                }
                value="Offensive, hateful or sexually explicit"
                onChange={handleOptionChange}
              />
              <span>Offensive, hateful or sexually explicit</span>
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                checked={selectedOption.includes("Legal issue") ? true : false}
                value="Legal issue"
                onChange={handleOptionChange}
              />
              <span>Legal issue</span>
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                value="Privacy concern"
                checked={
                  selectedOption.includes("Privacy concern") ? true : false
                }
                onChange={handleOptionChange}
              />
              <span>Privacy concern</span>
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                value="Poor quality"
                checked={selectedOption.includes("Poor quality") ? true : false}
                onChange={handleOptionChange}
              />
              <span>Poor quality</span>
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                value="Not a photo or video of the place"
                checked={
                  selectedOption.includes("Not a photo or video of the place")
                    ? true
                    : false
                }
                onChange={handleOptionChange}
              />
              <span>Not a photo or video of the place</span>
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                value="other"
                onChange={handleOptionChange}
              />
              <span>Other</span>
            </label>
            {selectedOption.includes("other") && (
              <>
                <textarea
                  rows={5}
                  className="input-area"
                  placeholder="Please share your reason.
For eg. Inappropriate caption, misclassification."
                  onChange={(e) => setOtherReasons(e.target.value)}
                  value={otherReasons}
                ></textarea>
                <p className="max-limit">Max: 150 words</p>
              </>
            )}

            {isError && (
              <p className="text-red-600">Please select at least one option</p>
            )}

            <p className="hr-line"></p>
            <Button className="w-[90%] m-auto" onClick={submitHandler}>
              {loading ? (
                <ScaleLoader color="#ffffff" height={25} radius={5} width={4} />
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        )}
      </ModalWrapper>
    </ProtectedRouteWrapper>
  );
}
