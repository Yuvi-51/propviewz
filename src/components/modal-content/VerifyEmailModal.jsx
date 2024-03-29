import { postVerifyEmailOtpAPI } from "@/connections/post-requests/postVerifyLoginOtpAPI";
import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import ModalWrapper from "../wrappers/ModalWrapper";

import ReactGA from "react-ga";

export default function VerifyEmailModal({
  triggerElement,
  modalState,
  setModalState,
  setToggleUserProfile,
}) {
  const token = useSelector((state) => state.auth.token);
  const [emailOtp, setEmailOtp] = useState("");
  const [error, setError] = useState(false);
  const handleInputChange = (e) => {
    setError(false);
    setEmailOtp(e.target.value);
  };

  const handleSubmit = async () => {
    ReactGA.event({
      category: "User",
      action: "User Verifying Email Otp",
      label: "Button Click",
    });
    const res = await postVerifyEmailOtpAPI(emailOtp, token);
    if (res?.status?.status === "SUCCESS") {
      setToggleUserProfile((prev) => !prev);
      setModalState(false);
    } else {
      setError(true);
    }
  };
  return (
    <ModalWrapper
      open={modalState}
      setOpen={setModalState}
      trigger={triggerElement}
      title={<p className="text-center">Enter OTP received on your email</p>}
    >
      <div>
        <Input
          value={emailOtp}
          type="number"
          variant="bordered"
          className="p-2 w-[60%] m-auto"
          isInvalid={error}
          errorMessage={error ? "Please enter a valid otp" : ""}
          onChange={handleInputChange}
        />
      </div>
      <Button
        onClick={handleSubmit}
        className={`w-[50%] m-auto ${"bg-[#f1592a] text-white"}`}
      >
        Submit
      </Button>
    </ModalWrapper>
  );
}
