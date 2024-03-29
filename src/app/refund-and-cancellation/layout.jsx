import ProfileHeader from "@/components/header/profile-header/ProfileHeader";
import React from "react";

export default function refundCancellationLayout({ children }) {
  return (
    <>
      <ProfileHeader />
      {children}
    </>
  );
}
