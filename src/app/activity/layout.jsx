import React from "react";
import "../profile/ProfileStyles.scss";
import ProfileHeader from "@/components/header/profile-header/ProfileHeader";

export default function ActivityLayout({ children }) {
  return (
    <>
      <header>
        <ProfileHeader />
      </header>
      {children}
    </>
  );
}
