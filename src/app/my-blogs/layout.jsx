import React from "react";
import "../profile/ProfileStyles.scss";
import ProfileHeader from "@/components/header/profile-header/ProfileHeader";

export default function LocationLayout({ children }) {
  return (
    <>
      <header>
        <ProfileHeader />
      </header>
      {children}
    </>
  );
}
