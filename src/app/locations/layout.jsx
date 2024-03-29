import ProfileHeader from "@/components/header/profile-header/ProfileHeader";
import "../profile/ProfileStyles.scss";
import { getFilteredLocationAPI } from "@/connections/get-requests/getFilteredLocationAPI";

export default function LocationLayout({ children, searchParams }) {
  console.log("children", searchParams);
  return (
    <>
      <header>
        <ProfileHeader />
      </header>
      {children}
    </>
  );
}
