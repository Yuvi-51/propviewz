import ProfileHeader from "@/components/header/profile-header/ProfileHeader";
import React from "react";

export default function TermsOfUseLayout({ children }) {
  return (
    <>
      <header>
        <ProfileHeader />
      </header>
      {children}
    </>
  );
}
