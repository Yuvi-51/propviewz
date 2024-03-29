import ProfileHeader from "@/components/header/profile-header/ProfileHeader";
import React from "react";
import "../profile/ProfileStyles.scss";

export default function AddNewProjectLayout({ children }) {
  return (
    <>
      <header>
        <ProfileHeader />
      </header>
      {children}
    </>
  );
}
