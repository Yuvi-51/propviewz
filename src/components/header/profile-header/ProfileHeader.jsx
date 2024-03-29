"use client";
import CitySelectComp from "@/components/hero-section/CitySelectComp";
import ProjectAndLocationSearch from "@/components/project-&-location-search/Project&LocationSearch";
import UserDrawer from "@/components/user-drawer/UserDrawer";
import useMediaQuery from "@/custom/useMediaQuery";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import "./ProfileHeader.scss";

export default function ProfileHeader({ scrollToVisible = false }) {
  const isSticky = () => {
    const header = document.querySelector(".header-section");
    const scrollTop = window.scrollY;
    scrollTop >= 600
      ? header.classList.add("is-sticky")
      : header.classList.remove("is-sticky");
    scrollTop <= 600
      ? header.classList.add("not-sticky")
      : header.classList.remove("not-sticky");
  };

  useEffect(() => {
    if (scrollToVisible) {
      window.addEventListener("scroll", isSticky);
      return () => {
        window.removeEventListener("scroll", isSticky);
      };
    }
  }, []);

  const isSmallDevice = useMediaQuery("(max-width: 768px)");

  return (
    <header
      className="profile-header"
      style={!scrollToVisible ? { marginBottom: "80px" } : null}
    >
      <div
        className={`header-section ${
          scrollToVisible ? "not-sticky" : "is-sticky"
        }`}
      >
        <div className="sticky-main">
          <Link href="/" className="sticky-logo" shallow>
            <Image
              src={
                isSmallDevice
                  ? "/images/only eye.svg"
                  : "/images/Propviewz_logo_black.svg"
              }
              alt="propviewz-logo"
              height={40}
              width={isSmallDevice ? 40 : 138}
            />
          </Link>
          <div className="sticky-city city-select">
            <CitySelectComp />
          </div>
          <div className="project-search-input-container">
            <ProjectAndLocationSearch />
          </div>
          <UserDrawer />
        </div>
      </div>
    </header>
  );
}
