import ProfileHeader from "@/components/header/profile-header/ProfileHeader";
import React from "react";

export default function contactUsLayout({ children }) {
  return (
    <>
      <ProfileHeader />
      {children}
    </>
  );
}
