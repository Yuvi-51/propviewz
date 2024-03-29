import React from "react";
import "./ProfileStyles.scss";
import ProfileHeader from "@/components/header/profile-header/ProfileHeader";

export default function ProfileLayout({ children }) {
  return (
    <>
      <header>
        <ProfileHeader />
      </header>
      {children}
    </>
  );
}
