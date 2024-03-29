import ProfileHeader from "@/components/header/profile-header/ProfileHeader";
import React from "react";

export default function MyOrdersLayout({ children }) {
  return (
    <>
      <ProfileHeader />
      {children}
    </>
  );
}
