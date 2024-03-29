import { postVerifyPhoneOtpAPI } from "@/connections/post-requests/postVerifyLoginOtpAPI";
import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import ModalWrapper from "../wrappers/ModalWrapper";

import ReactGA from "react-ga";

export default function VerifyPhoneModal({
  triggerElement,
  modalState,
  setModalState,
  setToggleUserProfile,
  setOtpSubmitted,
  phoneNumber,
  otpSession,
}) {
  const token = useSelector((state) => state.auth.token);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [error, setError] = useState(false);
  const handleInputChange = (e) => {
    setError(false);
    setPhoneOtp(e.target.value);
  };

  const handleSubmit = async () => {
    ReactGA.event({
      category: "User",
      action: "User Verifying Phone Otp",
      label: "Button Click",
    });
    const res = await postVerifyPhoneOtpAPI(
      phoneOtp,
      otpSession,
      phoneNumber,
      token
    );
    if (res?.status?.status === "SUCCESS") {
      setToggleUserProfile((prev) => !prev);
      setOtpSubmitted(true);
      setModalState(false);
    } else {
      setError(true);
      setOtpSubmitted(false);
    }
  };
  return (
    <ModalWrapper
      open={modalState}
      setOpen={setModalState}
      trigger={triggerElement}
      title={<p className="text-center">Enter OTP received on your mobile</p>}
    >
      <div>
        <Input
          value={phoneOtp}
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
