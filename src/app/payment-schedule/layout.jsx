import ProfileHeader from "@/components/header/profile-header/ProfileHeader";
import React from "react";

export default function PaymentScheduleLayout({ children }) {
  return (
    <>
      <ProfileHeader />
      {children}
    </>
  );
}
