"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import "./ReportsHeader.scss";
import ProtectedRouteWrapper from "@/components/wrappers/ProtectedRouteWrapper";
import UserDrawer from "@/components/user-drawer/UserDrawer";
import { PlusIcon, User2Icon } from "lucide-react";
import ProjectAndLocationSearch from "@/components/project-&-location-search/Project&LocationSearch";
import useMediaQuery from "@/custom/useMediaQuery";
import CitySelectComp from "@/components/hero-section/CitySelectComp";

export default function ReportsHeader({
  scrollToVisible = false,
  childDataTitle,
}) {
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
    <div
      className="reports-header"
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
          <div className="project-search-input-container">
            <p className="title">{childDataTitle} </p>
          </div>
          <UserDrawer />
        </div>
      </div>
    </div>
  );
}
