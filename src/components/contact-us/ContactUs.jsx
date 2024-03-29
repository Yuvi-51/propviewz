"use client";
import { postContactUsAPI } from "@/connections/post-requests/postContactUsAPI";
import { useState } from "react";
import SuccessInfoModal from "../modal-content/SuccessInfoModal";
import "./ContactUs.scss";
import { useToast } from "../ui/use-toast";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const { toast } = useToast();

  const validateName = (name) => name.trim().length > 0;

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhoneNumber = (phoneNumber) => /^\d{10}$/.test(phoneNumber);

  const handleCheckboxChange = (event) => {
    setAgreeTerms(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let isValid = true;

    if (!validateName(name)) {
      setNameError("Please enter your name.");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!validatePhoneNumber(phone)) {
      setPhoneError("Please enter a valid 10-digit phone number.");
      isValid = false;
    } else {
      setPhoneError("");
    }

    if (agreeTerms && !validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!isValid) {
      return;
    }

    try {
      let response = await postContactUsAPI({
        full_name: name,
        phone,
        email,
        query: message,
        is_subscriber: agreeTerms,
      });

      if (response?.status?.status === "SUCCESS") {
        toast({
          variant: "success",
          title: "Great",
          description: "Your record Submitted Successfully",
        });
        setName("");
        setPhone("");
        setEmail("");
        setMessage("");
        setAgreeTerms(false);
      } else {
        // console.log("res", response);
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
      console.log("Error:", error);
    }
  };

  return (
    <div className="contact">
      <div className="heading-div">
        <div className="heading">Contact Us</div>
      </div>

      <section className="text-gray-600 body-font bg-white-100">
        <div
          className="container flex flex-col lg:max-w-5xl w-70 px-5 py-12 mx-auto section"
          id="contact-form"
        >
          <div className="w-full">
            <p className="leading-relaxed text-xl text-gray-900">
              We're here to assist you! If you have any concerns or issues with
              the service you received, we encourage you to share your contact
              details with us by filling the below form.
              <br />
            </p>
          </div>
          <div
            className="w-full"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="w-full mt-10 md:mt-0 md:w-3/5">
              <form
                action="contact-us"
                method="post"
                id="submit-contact-form"
                onSubmit={handleSubmit}
              >
                <div className="p-2 w-full">
                  <div className="relative">
                    <label
                      htmlFor="name"
                      className="leading-7 py-4 text-lg text-gray-900"
                    >
                      Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required=""
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white rounded border border-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-900 py-1 px-1 leading-8 transition-colors duration-200 ease-in-out"
                    />
                    {nameError && <p className="text-red-500">{nameError}</p>}
                  </div>
                </div>

                <div className="p-2 w-full">
                  <div className="relative">
                    <label
                      htmlFor="email"
                      className="leading-7 py-4 text-lg text-gray-900"
                    >
                      Email{" "}
                      {agreeTerms && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required=""
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white rounded border border-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-900 py-1 px-1 leading-8 transition-colors duration-200 ease-in-out"
                    />
                    {emailError && <p className="text-red-500">{emailError}</p>}
                  </div>
                </div>

                <div className="p-2 w-full">
                  <div className="relative">
                    <label
                      htmlFor="phone"
                      className="leading-7 py-4 text-lg text-gray-900"
                    >
                      Phone<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="phone"
                      name="phone"
                      required=""
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      pattern="[0-9]{10}"
                      className="w-full bg-white rounded border border-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-900 py-1 px-1 leading-8 transition-colors duration-200 ease-in-out"
                      onInput={(e) => {
                        e.target.value = Math.max(0, parseInt(e.target.value))
                          .toString()
                          .slice(0, 10);
                      }}
                    />
                    {phoneError && <p className="text-red-500">{phoneError}</p>}
                  </div>
                </div>

                <div className="p-2 w-full">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      name="agreeTerms"
                      className="h-5 w-5 text-blue-500 border-gray-300 rounded focus:ring-blue-200"
                      checked={agreeTerms}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="agreeTerms" className="ml-2 text-gray-700">
                      Subscribe to our Newsletter and get the latest updates
                    </label>
                  </div>
                </div>

                <div className="p-2 w-full">
                  <div className="relative">
                    <label
                      htmlFor="message"
                      className="leading-7 py-4 text-lg text-gray-900"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required=""
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-white rounded border border-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 h-32 text-base outline-none text-gray-900 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                      defaultValue={""}
                    />
                  </div>
                </div>

                <div className="p-2 w-full">
                  <button
                    type="submit"
                    className="flex text-black bg-grey-500 border-1 py-4 px-6 focus:outline-none hover:bg-orange-600 hover:text-white rounded text-xl font-bold shadow-lg mx-0 flex-col text-center"
                    style={{ boxShadow: "10px 10px 8px rgba(0, 0, 0, 0.2)" }}
                  >
                    Send Message ✉
                  </button>
                </div>
              </form>
            </div>
          </div>
          <p className="leading-relaxed text-xl text-gray-900">
            Alternatively, you can also send us your concerns or queries on
            below email id
            <br />
            <a
              href="mailto:contact@propviewz.com"
              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            >
              contact@propviewz.com
            </a>
            <br />
            <br />
            Our team will diligently work to address your concerns and provide
            assistance within 2-3 working days.
          </p>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
