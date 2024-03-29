import React from "react";
import "./PaymentCards.scss";
import Link from "next/link";

export default function PaymentCards() {
  return (
    <div className="payment-cards">
      <img
        src="images/feedback.svg"
        className="image-1"
        alt="images/feedback"
      />
      <Link href="/payment-schedule" className="image-2">
        <img src="images/payment schedule.svg" alt="images/payment" />
      </Link>
      <img className="mobile-add" src="images/payment-mobile.svg" alt="Image" />
    </div>
  );
}
