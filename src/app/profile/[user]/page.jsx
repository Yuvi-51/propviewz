import UserProfileForm from "@/components/profile-page/UserProfileForm";
import React from "react";

export default function UserProfilePage() {
  return (
    <main>
      <div className="my-profile container">
        <div className="my-profile-header">
          <p className="heading">My Profile</p>
          <p className="hr-line"></p>
        </div>
        <UserProfileForm />
      </div>
    </main>
  );
}
