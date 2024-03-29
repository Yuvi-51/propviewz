import ProfileHeader from "@/components/header/profile-header/ProfileHeader";
import React from "react";

export default function PrivacyPolicyLayout({ children }) {
  return (
    <>
      <header>
        <ProfileHeader />
      </header>
      {children}
    </>
  );
}
