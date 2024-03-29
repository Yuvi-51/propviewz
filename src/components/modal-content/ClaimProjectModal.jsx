"use client";
import { postProjectClaimAPI } from "@/connections/post-requests/postProjectClaimAPI";
import { claimProjectInitState } from "@/constants/initialStateData";
import { useEffect, useState } from "react";
import ReactGA from "react-ga";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import { useToast } from "../ui/use-toast";
import ModalWrapper from "../wrappers/ModalWrapper";
import ProtectedRouteWrapper from "../wrappers/ProtectedRouteWrapper";
import "./ClaimProjectModal.scss";
export default function ClaimProjectModal({
  projectId,
  project_name,
  setToggleExistingProjectClaims,
  triggerElement,
}) {
  const token = useSelector((state) => state.auth.token);
  const { user } = useSelector((state) => state.user);
  const [modalState, setModalState] = useState(false);
  const [formData, setFormData] = useState(claimProjectInitState);
  const [errors, setErrors] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      project_id: projectId,
      user_id: user?.id,
      full_name: user?.first_name + " " + user?.last_name,
      mobile: user?.phone,
      email: user?.email,
    }));
  }, [projectId, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === "mobile" ? value.slice(0, 10) : value;

    setFormData({
      ...formData,
      [name]: updatedValue,
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: false,
    }));
  };
  const handleClaimProject = async (e) => {
    ReactGA.event({
      category: "User",
      action: "User Sent a Request to Claim Project",
      label: "Button Click",
    });

    e.preventDefault();
    const validationErrors = {};

    // Validate the form fields here
    if (!formData.email) {
      validationErrors.email = "Email is required";
    }
    if (!formData.company_name) {
      validationErrors.company_name = "Company name is required";
    }
    if (!formData.mobile) {
      validationErrors.mobile = "Mobile is required";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      validationErrors.mobile = "Please enter a valid 10-digit mobile number";
    } else if (!/^\d+$/.test(formData.mobile)) {
      validationErrors.mobile = "Please enter only integers";
    }

    // Check if there are any validation errors
    if (Object.keys(validationErrors).length === 0) {
      try {
        const res = await postProjectClaimAPI(formData, token);
        if (res?.status?.status === "SUCCESS") {
          toast({
            variant: "success",
            title: "Claim Request Sent",
            description:
              "Great We have received your request. Our team will contact you soon",
          });
          setModalState(false);
          setToggleExistingProjectClaims((prev) => !prev);
        } else {
          toast({
            variant: "destructive",
            title: "Something went wrong",
            description: "Please try after some time",
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: "Please try after some time",
        });
      }
    } else {
      // Set validation errors
      setErrors(validationErrors);
    }
  };

  return (
    <ProtectedRouteWrapper
      triggerElement={triggerElement}
      callback={() => {
        setModalState(true);
      }}
    >
      <ModalWrapper
        title={"Claim Request"}
        trigger={triggerElement}
        open={modalState}
        setOpen={setModalState}
      >
        <form onSubmit={handleClaimProject} className="claim-project-container">
          <h2 className="project-name">{project_name}</h2>
          <div className="form-group">
            <label htmlFor="full_name">Full Name</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              disabled
            />
          </div>
          <div className="form-group">
            <label htmlFor="mobile">Mobile</label>
            <span className="text-red-500">*</span>
            <input
              // disabled
              type="text"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
            />
            {errors.mobile && <span className="error">{errors.mobile}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="company_name">
              Company Name<span className="text-red-500">*</span>
            </label>
            <input
              autoFocus
              type="text"
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
            />
            {errors.company_name && (
              <span className="error">{errors.company_name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="designation">Designation</label>
            <input
              type="text"
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="details">Additional Info</label>
            <textarea
              id="details"
              name="details"
              value={formData.details}
              onChange={handleChange}
            />
          </div>
          <DialogFooter className="mt-10">
            <Button className="w-[90%] m-auto" type="submit">
              Submit
            </Button>
          </DialogFooter>
        </form>
      </ModalWrapper>
    </ProtectedRouteWrapper>
  );
}
