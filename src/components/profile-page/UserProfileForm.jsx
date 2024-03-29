"use client";
import { getUserDetailsAPI } from "@/connections/get-requests/getUserDetailsAPI";
import {
  postSendEmailOtpAPI,
  postSendLoginOtpAPI,
} from "@/connections/post-requests/postSendLoginOtpAPI";
import { putMyProfileDetailsAPI } from "@/connections/put-requests/putMyProfileDetailsAPI";
import { userProfileInitValue } from "@/constants/initialStateData";
import useAsync from "@/custom/useAsync";
import {
  isEmailValid,
  isNameValid,
  isPhoneNumberValid,
} from "@/logic/validation";

import { setUser } from "@/store/slices/userSlice";
import { useEffect, useState } from "react";
import ReactGA from "react-ga";
import { useDispatch, useSelector } from "react-redux";
import { ScaleLoader } from "react-spinners";
import VerifyEmailModal from "../modal-content/VerifyEmailModal";
import VerifyPhoneModal from "../modal-content/VerifyPhoneModal";
import SelectCityOptions from "./SelectCityOptions";
import SelectStateOptions from "./SelectStateOptions";
import "./UserProfileForm.scss";

export default function UserProfileForm() {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [emailVerifyModalState, setEmailVerifyModalState] = useState(false);
  const [phoneVerifyModalState, setPhoneVerifyModalState] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [toggleUserProfile, setToggleUserProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userProfileInitValue);
  const [otpSession, setOtpSession] = useState(""); //TODO: remove passing session when api resolved
  const {
    loading,
    error,
    value: userProfileData,
  } = useAsync(getUserDetailsAPI, [toggleUserProfile], [token]);

  useEffect(() => {
    if (userProfileData?.id) {
      const {
        first_name,
        last_name,
        email,
        phone,
        marital_status,
        gender,
        state,
        city,
        dob,
        email_verified,
        phone_verified,
      } = userProfileData;
      setFormData({
        first_name: first_name || "",
        last_name: last_name || "",
        email: email || "",
        phone: phone || "",
        marital_status: marital_status || "",
        gender: gender || "",
        state: state || "",
        city: city || "",
        dob: dob || "",
        email_verified: email_verified || false,
        phone_verified: phone_verified || false,
      });
      dispatch(setUser(userProfileData)); // setting user info in store
    }
  }, [userProfileData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleEmailVerify = async (e) => {
    ReactGA.event({
      category: "User",
      action: "User verifying email  in profile form",
      label: "Button Click",
    });
    e.preventDefault();
    if (!isEmailValid(formData.email)) {
      setErrors((prev) => ({ ...prev, email: true }));
    } else {
      const res = await postSendEmailOtpAPI(formData?.email, token);
      if (res?.data?.status?.status === "SUCCESS") {
        setEmailVerifyModalState(true);
      }
    }
  };
  const handlePhoneVerify = async (e) => {
    ReactGA.event({
      category: "User",
      action: "User verifying phone  in profile form",
      label: "Button Click",
    });
    e.preventDefault();
    if (!isPhoneNumberValid(formData.phone)) {
      setErrors((prev) => ({ ...prev, phone: true }));
    } else {
      const res = await postSendLoginOtpAPI(formData?.phone);
      if (res?.session) {
        setOtpSession(res?.session);
        setPhoneVerifyModalState(true);
      }
    }
  };

  const handleSubmit = async (e) => {
    ReactGA.event({
      category: "User",
      action: "User Submitting profile form",
      label: "Button Click",
    });
    e.preventDefault();
    const validationErrors = {};
    if (!isNameValid(formData.first_name)) {
      validationErrors.first_name = true;
    }
    if (!isNameValid(formData.last_name)) {
      validationErrors.last_name = true;
    }

    if (Object.keys(validationErrors).length === 0) {
      // Perform submit action, e.g., API call
      setSubmitLoading(true);
      try {
        const res = await putMyProfileDetailsAPI(
          userProfileData?.id,
          formData,
          token
        );
        setIsEditing(false);
        setErrors({});
        setSubmitLoading(false);
        setToggleUserProfile((prev) => !prev);
      } catch (error) {}
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="p-0 md:p-4 user-profile-form">
      <form className="flex flex-col md:grid gap-x-[60px] gap-y-4">
        <div className="col-span-2">
          <label className="block mb-1 font-medium">First Name</label>
          <input
            type="text"
            name="first_name"
            value={formData?.first_name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            disabled={!isEditing}
            style={{
              borderColor: errors.first_name ? "red" : undefined,
            }}
          />
          {errors.first_name && (
            <p className="text-red-500">Please enter a valid first name.</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={formData?.last_name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            disabled={!isEditing}
          />
          {errors.last_name && (
            <p className="text-red-500">Please enter a valid last name.</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <div className="flex">
            <input
              type="email"
              name="email"
              value={formData?.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              disabled={!isEditing || formData?.email_verified}
            />
            {isEditing && (
              <VerifyEmailModal
                triggerElement={
                  <button
                    className={`min-w-max whitespace-nowrap ${
                      formData?.email_verified ? "bg-green-500" : "bg-red-500"
                    } text-white px-3 py-2`}
                    onClick={handleEmailVerify}
                    disabled={formData?.email_verified ? true : false}
                  >
                    {formData?.email_verified ? "Verified" : "Verify Email"}
                  </button>
                }
                modalState={emailVerifyModalState}
                setModalState={setEmailVerifyModalState}
                setToggleUserProfile={setToggleUserProfile}
              />
            )}
          </div>
          {errors.email && (
            <p className="text-red-500">Please enter a valid email.</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Phone Number</label>
          <div className="flex">
            <input
              type="text"
              name="phone"
              value={formData?.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              disabled={!isEditing || formData?.phone_verified}
              maxLength={10}
            />
            {isEditing && (
              <VerifyPhoneModal
                triggerElement={
                  <button
                    className={`min-w-max whitespace-nowrap ${
                      formData?.phone_verified ? "bg-green-500" : "bg-red-500"
                    } text-white px-3 py-2`}
                    onClick={handlePhoneVerify}
                    disabled={formData?.phone_verified ? true : false}
                  >
                    {formData?.phone_verified ? "Verified" : "Verify Phone"}
                  </button>
                }
                modalState={phoneVerifyModalState}
                setModalState={setPhoneVerifyModalState}
                setToggleUserProfile={setToggleUserProfile}
                phoneNumber={formData?.phone}
                otpSession={otpSession}
              />
            )}
          </div>
          {errors.phone && (
            <p className="text-red-500">Please enter a valid phone number.</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Marital Status</label>
          <select
            className="w-full px-3 py-2 border rounded"
            name="marital_status"
            value={formData?.marital_status}
            onChange={handleInputChange}
            disabled={!isEditing}
          >
            <option value="">Select</option>
            <option value="Married">Married</option>
            <option value="Unmarried">Unmarried</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Gender</label>
          <select
            className="w-full px-3 py-2 border rounded"
            name="gender"
            value={formData?.gender}
            onChange={handleInputChange}
            disabled={!isEditing}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">State</label>
          <div className="state-search-container relative">
            <SelectStateOptions
              value={formData?.state?.name}
              setStateIdAndName={(state_id) =>
                setFormData((prev) => ({ ...prev, state_id, city: "" }))
              }
              isDisabled={!isEditing}
            />
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium">City</label>
          <div className="city-search-container relative">
            <SelectCityOptions
              value={formData?.city}
              stateId={formData?.state_id || formData?.state?.id}
              setCityIdAndName={(city_id) =>
                setFormData((prev) => ({ ...prev, city_id }))
              }
              isDisabled={!isEditing}
            />
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData?.dob}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            max={new Date().toISOString().split("T")[0]} // Set max attribute to the current date
            disabled={!isEditing}
          />
        </div>
      </form>
      {isEditing &&
        (!formData?.email_verified || !formData?.phone_verified) && (
          <p className="text-red-500 text-center mt-4">
            Please verify email and phone to continue
          </p>
        )}
      <div className="my-4 text-center">
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className={`px-10 py-2 ${
            isEditing ? "bg-gray-300" : "bg-[#f1592a] text-white"
          } rounded`}
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
        {isEditing && (
          <button
            type="submit"
            onClick={handleSubmit}
            className={
              formData?.email_verified && formData?.phone_verified
                ? "ml-3 px-10 py-2 bg-[#f1592a] text-white rounded"
                : "ml-3 px-10 py-2 bg-[#f1582ab6] text-white rounded cursor-not-allowed"
            }
            disabled={!formData?.email_verified || !formData?.phone_verified}
          >
            {submitLoading ? (
              <ScaleLoader color="#ffffff" height={15} radius={5} width={4} />
            ) : (
              "Save"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
