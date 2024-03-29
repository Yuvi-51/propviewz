"use client";
import CitySelectComp from "@/components/hero-section/CitySelectComp";
import AddReviewModal from "@/components/modal-content/AddReviewModal";
import PostPictureModal from "@/components/modal-content/PostPictureModal";
import ProjectAndLocationSearch from "@/components/project-&-location-search/Project&LocationSearch";
import PopOver from "@/components/ui/pop-over";
import UserDrawer from "@/components/user-drawer/UserDrawer";
import useMediaQuery from "@/custom/useMediaQuery";
import { scrollToSection } from "@/logic/scrollToSection";
import { CameraIcon, PlusIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import "./CategoryHeader.scss";

export default function CategoryHeader({
  scrollToVisible = false,
  isCategory = false,
}) {
  const isSmallDevice = useMediaQuery("(max-width: 768px)");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const pathname = usePathname();
  const { city } = useParams();
  // console.log(city);

  const isSticky = () => {
    const header = document.querySelector(".header-section");
    const scrollTop = window.scrollY;
    scrollTop >= 550
      ? header.classList.add("is-sticky")
      : header.classList.remove("is-sticky");
    scrollTop <= 550
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

  return (
    <div
      className="sticky-header"
      style={!scrollToVisible ? { marginBottom: "60px" } : null}
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
          <div className="sticky-city">
            <CitySelectComp />
          </div>
          <div className="project-search-input-container">
            <ProjectAndLocationSearch />
          </div>
          <div className="sticky-nav">
            <Link
              className={`link-i ${
                pathname?.includes("/most-trending") && "text-[#f1592a]"
              }`}
              href={isCategory ? `/${city}/most-trending` : ""}
              onClick={(e) => {
                !isCategory &&
                  scrollToSection(e, isSmallDevice ? 85 : 60, "trending");
              }}
            >
              Most Trending
            </Link>
            <Link
              href={isCategory ? `/${city}/top-rated` : ""}
              className={`link-i ${
                pathname?.includes("/top-rated") && "text-[#f1592a]"
              }`}
              onClick={(e) => {
                !isCategory &&
                  scrollToSection(e, isSmallDevice ? 85 : 60, "top-rated");
              }}
            >
              Top Rated
            </Link>
            <Link
              href={isCategory ? `/${city}/most-reviewed` : ""}
              className={`link-i ${
                pathname?.includes("/most-reviewed") && "text-[#f1592a]"
              }`}
              onClick={(e) => {
                !isCategory &&
                  scrollToSection(e, isSmallDevice ? 85 : 60, "most-reviewed");
              }}
            >
              Most Reviewed
            </Link>
          </div>
          <PopOver
            trigger={
              <div className="btn_share">
                <PlusIcon /> Share Views
              </div>
            }
            isModalOpen={isModalOpen}
          >
            {(closeDropdown) => (
              <div className="absolute bg-white flex flex-col items-start mt-1 drop-shadow-xl w-full">
                <AddReviewModal
                  triggerElement={
                    <div className="flex text-[#f1592a] gap-[2px] cursor-pointer w-full pl-[13px] p-2 hover:bg-[#e7e0e0]">
                      <StarIcon />
                      Add Review
                    </div>
                  }
                  setIsModalOpen={setIsModalOpen}
                  callback={closeDropdown}
                />
                <PostPictureModal
                  triggerElement={
                    <div className="flex text-[#f1592a] gap-[2px] cursor-pointer w-full pl-[13px] p-2 hover:bg-[#e7e0e0]">
                      <CameraIcon />
                      Post a Picture
                    </div>
                  }
                  setIsModalOpen={setIsModalOpen}
                  callback={closeDropdown}
                />
              </div>
            )}
          </PopOver>
          <UserDrawer />
        </div>
      </div>
    </div>
  );
}
