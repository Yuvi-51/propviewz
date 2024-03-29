import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import ModalWrapper from "@/components/wrappers/ModalWrapper";
import ProtectedRouteWrapper from "@/components/wrappers/ProtectedRouteWrapper";
import { postProjectErrorReportAPI } from "@/connections/post-requests/postProjectErrorReportAPI";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ScaleLoader from "react-spinners/ScaleLoader";
import SuccessInfoModal from "../SuccessInfoModal";
import "./ReviewReportModal.scss";

import ReactGA from "react-ga";

export default function ReviewReportModal({
  reviewId,
  projectName,
  triggerElement,
  setIsModalOpen,
}) {
  const token = useSelector((state) => state.auth.token);
  const [modalState, setModalState] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (event) => {
    setIsError(false);
    if (event.target.checked) {
      setSelectedOption(`${selectedOption}, ${event.target.value}`);
    } else {
      setSelectedOption(selectedOption.replace(`, ${event.target.value}`, ""));
    }
  };

  const submitHandler = () => {
    ReactGA.event({
      category: "User",
      action: "User Submitted ReviewReportError",
      label: "Button Click",
    });
    const payload = {
      report_error: {
        reportable_type: "ProjectReview",
        reportable_id: reviewId,
        issue_type: `${projectName}${selectedOption}`,
      },
    };
    if (selectedOption) {
      setLoading(true);
      postProjectErrorReportAPI(payload, token)
        .then((response) => {
          setLoading(false);
          setModalState(false);
          setSelectedOption("");
          setShowSuccessModal(true);
        })
        .catch((error) => {
          console.error("Error:", error);
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
      callback={() => setModalState(true)}
    >
      <ModalWrapper
        title={"Report Review"}
        trigger={triggerElement}
        open={modalState}
        setOpen={setModalState}
      >
        <div className="ReviewReportHandler">
          <label>
            <input
              type="checkbox"
              value="Off topic"
              checked={selectedOption.includes("Off topic") ? true : false}
              onChange={handleOptionChange}
            />
            <span>Off topic</span>
          </label>
          <p className="info-data">
            Review doesn't pertain to an experience at or with this business
          </p>
          <p className="hr-line"></p>

          <br />
          <label>
            <input
              type="checkbox"
              value="Spam"
              checked={selectedOption.includes("Spam") ? true : false}
              onChange={handleOptionChange}
            />
            <span>Spam</span>
          </label>
          <p className="info-data">
            Review is from a bot, a fake account or contains ads and promotions
          </p>
          <p className="hr-line"></p>
          <br />
          <label>
            <input
              type="checkbox"
              value="Conflict of interest"
              checked={
                selectedOption.includes("Conflict of interest") ? true : false
              }
              onChange={handleOptionChange}
            />
            <span>Conflict of interest</span>
          </label>
          <p className="info-data">
            Review is from someone affiliated with the business or a
            competitor’s business
          </p>
          <p className="hr-line"></p>
          <br />
          <label>
            <input
              type="checkbox"
              value="Profanity"
              checked={selectedOption.includes("Profanity") ? true : false}
              onChange={handleOptionChange}
            />
            <span>Profanity</span>
          </label>
          <p className="info-data">
            Review contains swear words, has sexually explicit language or
            details graphic violence
          </p>
          <p className="hr-line"></p>
          <br />
          <label>
            <input
              type="checkbox"
              value="Bullying or harassment"
              checked={
                selectedOption.includes("Bullying or harassment") ? true : false
              }
              onChange={handleOptionChange}
            />
            <span>Bullying or harassment</span>
          </label>
          <p className="info-data">
            Review personally attacks a specific individual
          </p>

          <p className="hr-line"></p>
          <br />
          <label>
            <input
              type="checkbox"
              value="Discrimination or hate speech"
              checked={
                selectedOption.includes("Discrimination or hate speech")
                  ? true
                  : false
              }
              onChange={handleOptionChange}
            />
            <span>Discrimination or hate speech</span>
          </label>
          <p className="info-data">
            Review has harmful language about an individual or group based on
            identity
          </p>

          <p className="hr-line"></p>
          <br />
          <label>
            <input
              type="checkbox"
              value="Personal information"
              checked={
                selectedOption.includes("Personal information") ? true : false
              }
              onChange={handleOptionChange}
            />
            <span>Personal information</span>
          </label>
          <p className="info-data">
            Review contains personal information, such as an address or phone
            number
          </p>

          <p className="hr-line"></p>
          <br />
          <label>
            <input
              type="checkbox"
              value="Not helpful"
              checked={selectedOption.includes("Not helpful") ? true : false}
              onChange={handleOptionChange}
            />
            <span>Not helpful</span>
          </label>
          <p className="info-data">
            Review doesn’t help people decide whether to go to this place
          </p>
          <p className="hr-line"></p>
          {isError && (
            <p className="text-[red] text-[15px] ml-[15px] mt-[15px]">
              Please select any error type
            </p>
          )}
          <DialogFooter className="mt-10">
            <Button className="w-[90%] m-auto" onClick={submitHandler}>
              {loading ? (
                <ScaleLoader color="#ffffff" height={25} radius={5} width={4} />
              ) : (
                "Submit"
              )}
            </Button>
          </DialogFooter>
        </div>
      </ModalWrapper>
      <SuccessInfoModal
        modalState={showSuccessModal}
        setModalState={setShowSuccessModal}
      >
        <div className="text-center">
          <img src="/images/review added.svg" alt="img" className="m-auto" />
          <h5 className="text-[20px] font-bold">Report Review Request Sent</h5>
          <p className="text-[13px]">
            Great We have received your request. Our team will contact you soon
          </p>
        </div>
      </SuccessInfoModal>
    </ProtectedRouteWrapper>
  );
}
