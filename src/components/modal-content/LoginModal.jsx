"use client";
import { postGoogleLoginAPI } from "@/connections/post-requests/postGoogleLoginAPI";
import { postSendLoginOtpAPI } from "@/connections/post-requests/postSendLoginOtpAPI";
import { postVerifyLoginOtpAPI } from "@/connections/post-requests/postVerifyLoginOtpAPI";
import { initialLoginData } from "@/constants/initialStateData";
import { useResendOtp } from "@/custom/useResendOtp";
import {
  isNameValid,
  isOtpValid,
  isPhoneNumberValid,
} from "@/logic/validation";
import { setToken } from "@/store/slices/authSlice";
import { setUser } from "@/store/slices/userSlice";

import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import ReactGA from "react-ga";
import OTPInput from "react-otp-input";
import { useDispatch } from "react-redux";
import { ScaleLoader } from "react-spinners";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";
import ModalWrapper from "../wrappers/ModalWrapper";
import "./LoginModal.scss";

export default function LoginModal({
  triggerElement,
  callback,
  withoutLoginModalTrigger,
  msg,
}) {
  const dispatch = useDispatch();
  const { resendTimer, resendDisabled, startResendTimer } = useResendOtp();
  const [loginData, setLoginData] = useState(initialLoginData);
  const [modalState, setModalState] = useState(false);
  const [sessionDetails, setSessionDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    if (withoutLoginModalTrigger) {
      if (modalState === false) {
        setModalState(true);
      }
    }
  }, [withoutLoginModalTrigger]);

  const showUserInformation = async (response) => {
    const decodedToken = jwtDecode(response.credential);

    if (decodedToken) {
      try {
        const payload = {
          email: decodedToken.email,
          first_name: decodedToken.given_name,
          last_name: decodedToken.family_name,
          picture: decodedToken.picture,
          exp: decodedToken.exp,
          jti: decodedToken.jti,
        };
        const res = await postGoogleLoginAPI(payload);
        if (res?.user?.id) {
          dispatch(setToken(res?.user.login_token)); // setting login token in store
          dispatch(setUser(res?.user)); // setting user info in store
          setModalState(false);
          setLoginData(initialLoginData);
          toast({
            variant: "success",
            title: "Great Log In Successfully",
          });
          setValidationErrors({});
          if (callback) callback(null, res?.user?.login_token);
        } else {
          toast({
            variant: "destructive",
            title: "Something went wrong !",
            description: "Please try again later",
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setSessionDetails({});
    }
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: false,
    }));
  };

  const handleSendOTP = async (e) => {
    ReactGA.event({
      category: "User",
      action: "User Clicked on send Otp",
      label: "Button Click",
    });
    e.preventDefault();
    try {
      if (isPhoneNumberValid(loginData.phone)) {
        setLoading(true);
        const res = await postSendLoginOtpAPI(loginData.phone);
        setLoading(false);
        if (res?.session) {
          setSessionDetails(res);
          startResendTimer();
        } else {
          toast({
            variant: "destructive",
            title: "Something went wrong !",
            description: "Please try again later",
          });
        }
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          phone: true,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLoginSubmit = async (e) => {
    e && e.preventDefault();
    ReactGA.event({
      category: "User",
      action: "User Clicked Submit in Login Popup",
      label: "Button Click",
    });
    const errors = {};

    if (!isPhoneNumberValid(loginData.phone)) {
      errors.phone = true;
    }
    if (!sessionDetails?.user_exists) {
      if (!isNameValid(loginData.first_name)) {
        errors.first_name = true;
      }
    }

    if (
      !isOtpValid(loginData.otp) ||
      loginData.otp != sessionDetails?.session
    ) {
      errors.otp = true;
    }

    if (Object.keys(errors).length === 0) {
      setLoading(true);
      try {
        const res = await postVerifyLoginOtpAPI(
          loginData,
          sessionDetails?.session
        );
        setLoading(false);
        if (res?.id) {
          dispatch(setToken(res?.login_token)); // setting login token in store
          dispatch(setUser(res)); // setting user info in store
          setModalState(false);
          setLoginData(initialLoginData);
          toast({
            variant: "success",
            title: "Great Log In Successfully",
          });
          setValidationErrors({});
          if (callback) callback(null, res?.login_token);
        } else {
          toast({
            variant: "destructive",
            title: "Something went wrong !",
            description: "Please try again later",
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setValidationErrors(errors);
    }
  };

  useEffect(() => {
    // Check if all OTP inputs are filled
    const isFilled = loginData?.otp?.length === 6;
    if (isFilled) {
      // Call your submit function here
      handleLoginSubmit();
    }
  }, [loginData?.otp]);

  const renderNameInputs = () =>
    sessionDetails?.user_exists === false &&
    sessionDetails.session && (
      <div className="input-container">
        <label>Please fill the details</label>
        <div className="flex gap-x-5">
          <div>
            <Input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={loginData.first_name}
              onChange={handleInputChange}
              style={{
                borderColor: validationErrors.first_name ? "red" : undefined,
              }}
            />
            {validationErrors.first_name && (
              <p className="error-text">Please enter a valid first name.</p>
            )}
          </div>
          <div>
            <Input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={loginData.last_name}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    );

  const renderOtpInputs = () =>
    sessionDetails?.session && (
      <div className="input-container">
        <OTPInput
          value={loginData.otp}
          onChange={(value) => {
            setLoginData((prev) => ({ ...prev, otp: value }));
          }}
          numInputs={6}
          renderSeparator={<span>-</span>}
          renderInput={(props) => <input {...props} />}
          containerStyle=""
          inputStyle="w-[10%] align-center text-center mx-auto my-[5px] border-[#cbcbcb] border-1 focus-visible:outline-none focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#f1592a]"
          shouldAutoFocus={true}
          skipDefaultStyles={true}
          inputType="number"
        />
        {validationErrors.otp && (
          <p className="error-text">Please enter a valid OTP.</p>
        )}

        <div className="resend-otp-container">
          <span>Didn't receive code?</span>
          <Button
            variant="link"
            disabled={resendDisabled}
            onClick={handleSendOTP}
          >
            Resend OTP {resendTimer > 0 && `in ${resendTimer}s`}
          </Button>
        </div>
      </div>
    );

  return (
    <ModalWrapper
      title={"Login"}
      description={
        msg && msg ? msg : "Hi!!! Please login to continue on Propviewz."
      }
      trigger={triggerElement}
      open={modalState}
      setOpen={setModalState}
    >
      <div className="m-auto mt-[10px]">
        <GoogleLogin
          clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID}
          onSuccess={showUserInformation}
          onError={() => {
            console.log("Login Failed");
          }}
          scope="https://www.googleapis.com/auth/userinfo.email"
        />
      </div>
      <div className="login-modal-m-b-m">
        <p className="lines"></p>
        <p className="orwith">or with</p>
        <p className="lines"></p>
      </div>
      <form
        onSubmit={sessionDetails?.session ? handleLoginSubmit : handleSendOTP}
        className="login-form-container"
      >
        <div className="input-container">
          <label>Enter Mobile Number</label>
          <Input
            name="phone"
            value={loginData.phone}
            type="number"
            onInput={(e) => (e.target.value = e.target.value.slice(0, 10))}
            onChange={handleInputChange}
            style={{
              borderColor: validationErrors.phone ? "red" : null,
            }}
          />
          {validationErrors.phone && (
            <p className="error-text">Please enter a valid phone number.</p>
          )}
        </div>

        {renderNameInputs()}

        {renderOtpInputs()}
        <DialogFooter className="mt-10">
          <Button className="w-[90%] m-auto" type="submit">
            {loading ? (
              <ScaleLoader color="#ffffff" height={20} radius={5} width={4} />
            ) : sessionDetails?.session ? (
              "Submit"
            ) : (
              "Continue"
            )}
          </Button>
        </DialogFooter>
      </form>
    </ModalWrapper>
  );
}
