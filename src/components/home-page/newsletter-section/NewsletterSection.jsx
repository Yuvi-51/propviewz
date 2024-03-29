"use client";
import { postNewsletterSubscriptionAPI } from "@/connections/post-requests/postNewsletterSubscriptionAPI";
import { useState } from "react";
import "./NewsletterSection.scss";
import ReactGA from "react-ga";
import { useToast } from "@/components/ui/use-toast";
import { setFailureToast, setSuccessToast } from "@/logic/handleToasterMsg";
export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSubscribe = async (e) => {
    ReactGA.event({
      category: "User",
      action: "User Subscribed News Letter",
      label: "Button Click",
    });
    e.preventDefault();
    if (email) {
      try {
        const res = await postNewsletterSubscriptionAPI(email);
        const isEmailExits = res?.response?.data?.payload?.errors[0];
        if (isEmailExits) setError(isEmailExits);
        else {
          setError("");
          setEmail("");
          toast(setSuccessToast("Subscriber Updated"));
        }
      } catch (error) {
        toast(setFailureToast());
        console.log(error);
      }
    }
  };
  return (
    <div className="news-letter">
      <div className="news-center">
        <div className="carousal-heading">
          <div className="p-heading">
            <h3>Newsletter</h3>
            <div className="trend-line" />
          </div>
        </div>
        <div className="news-para">
          Keep up with our latest news feed. Subscribe to our Newsletter.
        </div>

        <form className="search-form" onSubmit={handleSubscribe}>
          <input
            required
            type="email"
            placeholder="Enter your Email ID"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input type="submit" value="SUBSCRIBE" />
        </form>
        {error && <p className="text-red-500 mt-[-15px]">{error}</p>}
      </div>
      <img className="demo-img" src="images/bro.svg" />
    </div>
  );
}
