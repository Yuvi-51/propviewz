import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import ModalWrapper from "@/components/wrappers/ModalWrapper";
import ProtectedRouteWrapper from "@/components/wrappers/ProtectedRouteWrapper";
import { postProjectErrorReportAPI } from "@/connections/post-requests/postProjectErrorReportAPI";
import { txnReportInitValue } from "@/constants/initialStateData";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ScaleLoader from "react-spinners/ScaleLoader";
import SuccessInfoModal from "../SuccessInfoModal";
import "./TxnReportModal.scss";

import ReactGA from "react-ga";

export default function TxnReportModal({
  txnId,
  projectName,
  triggerElement,
  setIsModalOpen,
}) {
  const token = useSelector((state) => state.auth.token);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalState, setModalState] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [isError, setIsError] = useState(false);
  const [txnDetails, setTxnDetails] = useState(txnReportInitValue);
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
      action: "User Submitted TxnReportError",
      label: "Button Click",
    });
    const payload = {
      report_error: {
        reportable_type: "Transaction",
        reportable_id: txnId,
        issue_type: `${projectName} ${selectedOption}`,
        comments: txnDetails,
      },
    };

    if (selectedOption) {
      setLoading(true);
      postProjectErrorReportAPI(payload, token)
        .then((response) => {
          setLoading(false);
          setTxnDetails(txnReportInitValue);
          setShowSuccessModal(true);
          setModalState(false);
          setSelectedOption("");
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
        title={"Report Transaction Details"}
        trigger={triggerElement}
        open={modalState}
        setOpen={setModalState}
      >
        <div className="TxnReportError">
          <label>
            <input
              type="checkbox"
              value="Transaction Type"
              checked={
                selectedOption.includes("Transaction Type") ? true : false
              }
              onChange={handleOptionChange}
            />
            <span>Transaction Type</span>
          </label>
          <p className="info-data">
            The current transaction type mentioned for the property is
            incorrect.
          </p>
          {selectedOption.includes("Transaction Type") && (
            <>
              <p className="comment">Add Comment</p>
              <textarea
                className="input-area"
                value={txnDetails.txnType}
                placeholder="Please let us know the correct transaction type & we will look into it."
                onChange={(e) =>
                  setTxnDetails({
                    ...txnDetails,
                    txnType: e.target.value,
                  })
                }
              ></textarea>
              <p className="max-limit">Max: 100 words</p>
            </>
          )}
          <p className="hr-line"></p>
          <br />
          <label>
            <input
              type="checkbox"
              value="Unit Type"
              checked={selectedOption.includes("Unit Type") ? true : false}
              onChange={handleOptionChange}
            />
            <span>Unit Type</span>
          </label>
          <p className="info-data">
            The current unit type mentioned for the property is incorrect.
          </p>
          {selectedOption.includes("Unit Type") && (
            <>
              <p className="comment">Add Comment</p>
              <textarea
                className="input-area"
                placeholder="Please let us know the correct unit type & we will look into it."
                onChange={(e) =>
                  setTxnDetails({
                    ...txnDetails,
                    unitType: e.target.value,
                  })
                }
                value={txnDetails.unitType}
              ></textarea>
              <p className="max-limit">Max: 100 words</p>
            </>
          )}
          <p className="hr-line"></p>
          <br />
          <label>
            <input
              type="checkbox"
              value="Configuration"
              checked={selectedOption.includes("Configuration") ? true : false}
              onChange={handleOptionChange}
            />
            <span>Configuration</span>
          </label>
          <p className="info-data">
            The configuration details provided for the property are inaccurate.
          </p>
          {selectedOption.includes("Configuration") && (
            <>
              <p className="comment">Add Comment</p>
              <textarea
                className="input-area"
                placeholder="Please let us know the correct configuration & we will look into it."
                onChange={(e) =>
                  setTxnDetails({
                    ...txnDetails,
                    config: e.target.value,
                  })
                }
                value={txnDetails.config}
              ></textarea>
              <p className="max-limit">Max: 100 words</p>
            </>
          )}
          <p className="hr-line"></p>
          <br />
          <label>
            <input
              type="checkbox"
              value="Building Name"
              checked={selectedOption.includes("Building Name") ? true : false}
              onChange={handleOptionChange}
            />
            <span>Building Name</span>
          </label>
          <p className="info-data">
            The building name associated with the property is incorrect.
          </p>
          {selectedOption.includes("Building Name") && (
            <>
              <p className="comment">Add Comment</p>
              <textarea
                className="input-area"
                placeholder="Please let us know the correct building name & we will look into it."
                onChange={(e) =>
                  setTxnDetails({
                    ...txnDetails,
                    buildName: e.target.value,
                  })
                }
                value={txnDetails.buildName}
              ></textarea>
              <p className="max-limit">Max: 100 words</p>
            </>
          )}
          <p className="hr-line"></p>
          <br />
          <label>
            <input
              type="checkbox"
              value="Floor / Unit Number"
              checked={
                selectedOption.includes("Floor / Unit Number") ? true : false
              }
              onChange={handleOptionChange}
            />
            <span>Floor / Unit Number</span>
          </label>
          <p className="info-data">
            The unit number mentioned for the property is incorrect.
          </p>
          {selectedOption.includes("Floor / Unit Number") && (
            <>
              <p className="comment">Add Comment</p>
              <textarea
                className="input-area"
                placeholder="Please let us know the correct floor / unit Number & we will look into it."
                onChange={(e) =>
                  setTxnDetails({
                    ...txnDetails,
                    floor: e.target.value,
                  })
                }
                value={txnDetails.floor}
              ></textarea>
              <p className="max-limit">Max: 100 words</p>
            </>
          )}
          <p className="hr-line"></p>
          <br />
          <label>
            <input
              type="checkbox"
              value="Area"
              checked={selectedOption.includes("Area") ? true : false}
              onChange={handleOptionChange}
            />
            <span>Area</span>
          </label>
          <p className="info-data">
            The area specified for the property is inaccurate.
          </p>
          {selectedOption.includes("Area") && (
            <>
              <p className="comment">Add Comment</p>
              <textarea
                className="input-area"
                placeholder="Please let us know the correct area & we will look into it."
                onChange={(e) =>
                  setTxnDetails({
                    ...txnDetails,
                    area: e.target.value,
                  })
                }
                value={txnDetails.area}
              ></textarea>
              <p className="max-limit">Max: 100 words</p>
            </>
          )}
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
          <h5 className="text-[20px] font-bold">
            Report Transaction Request Sent
          </h5>
          <p className="text-[13px]">
            Great We have received your request. Our team will contact you soon
          </p>
        </div>
      </SuccessInfoModal>
    </ProtectedRouteWrapper>
  );
}
