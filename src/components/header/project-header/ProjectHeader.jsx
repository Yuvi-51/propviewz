"use client";
import CitySelectComp from "@/components/hero-section/CitySelectComp";
import AddReviewModal from "@/components/modal-content/AddReviewModal";
import PostPictureModal from "@/components/modal-content/PostPictureModal";
import ProjectReportModal from "@/components/modal-content/report-errors/ProjectReportModal";
import ProjectAndLocationSearch from "@/components/project-&-location-search/Project&LocationSearch";
import ProjectActions from "@/components/project-page/header-components/ProjectActions";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/ui/dynamic-star";
import PopOver from "@/components/ui/pop-over";
import UserDrawer from "@/components/user-drawer/UserDrawer";
import { getSingleProjectAPI } from "@/connections/get-requests/getSingleProjectAPI";
import { useQuery } from "@tanstack/react-query";
import { MoreVerticalIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-scroll";
import "./ProjectHeader.scss";
import ProjectHeaderLogo from "./ProjectHeaderLogo";

export default function ProjectHeader({ params }) {
  const { city, location, slug } = params;
  const {
    auth: { token },
    project: { inView },
  } = useSelector((state) => state);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const { data: projectData } = useQuery({
    queryKey: ["getSingleProjectAPI", city, location, slug],
    queryFn: () => getSingleProjectAPI(city, location, slug, token),
  });

  const claimed = projectData?.claimed;

  const [activeSection, setActiveSection] = useState("recent-transactions");

  return (
    <>
      <div className="project-header-container">
        <div className="sticky-main">
          <ProjectHeaderLogo />
          <div className="sticky-city city-select">
            <CitySelectComp />
          </div>
          <div className="project-search-input-container">
            <ProjectAndLocationSearch />
          </div>
          <UserDrawer />
        </div>
        <div className="sub-nav">
          <div className="project-details">
            <h1 className="project-name">{projectData?.name} </h1>
            <h2 className="location-name">{projectData?.detailed_area}</h2>
          </div>
          <div className="start-and-action-container">
            <div className="star-container">
              <span className="rating">{projectData?.average_rating}</span>
              <StarRating rating={projectData?.average_rating} />
              <Link
                className="stars-review"
                to="reviews"
                spy={true}
                smooth={true}
                offset={-180}
                duration={100}
              >
                ({projectData?.total_ratings_count})
              </Link>
            </div>
            <ProjectActions slug={slug} city={city} location={location} />
          </div>
          <div className="share-review-btn">
            <AddReviewModal
              triggerElement={
                <p className="add-review">
                  <Image
                    width={20}
                    height={20}
                    src="/images/fi_star.svg"
                    alt="icon"
                  />
                  Add Review
                </p>
              }
              project_id={projectData?.id}
              project_name={projectData?.name}
            />
            <PostPictureModal
              triggerElement={
                <p className="post-pic">
                  <Image
                    width={20}
                    height={20}
                    src="/images/fi_camera - Copy.svg"
                    alt="icon"
                  />
                  Post a picture
                </p>
              }
              project_id={projectData?.id}
              project_name={projectData?.name}
            />
          </div>
          <PopOver
            trigger={
              <MoreVerticalIcon size={22} className="inline cursor-pointer" />
            }
            isModalOpen={isModalOpen}
          >
            {(closeDropdown) => (
              <div className="absolute bg-white mt-1 drop-shadow-xl w-max whitespace-nowrap right-0">
                <ProjectReportModal
                  projectData={projectData}
                  triggerElement={
                    claimed === true ? (
                      <Button className="bg-white text-black hover:text-white">
                        Edit Project Details
                      </Button>
                    ) : (
                      <Button className="bg-white text-black hover:text-white">
                        Report Incorrect
                      </Button>
                    )
                  }
                  callback={closeDropdown}
                  setIsModalOpen={setIsModalOpen}
                />
              </div>
            )}
          </PopOver>
        </div>
        <div className="sticky-nav">
          <Link
            className={`link-i ${
              activeSection === "recent-transactions" ? "active-link" : ""
            }`}
            to="recent-transactions"
            spy={true}
            smooth={true}
            offset={-160}
            duration={100}
            onSetActive={setActiveSection}
          >
            Transactions
          </Link>
          <Link
            className={`link-i ${
              activeSection === "ratings" ? "active-link" : ""
            }`}
            to="ratings"
            spy={true}
            smooth={true}
            offset={-160}
            duration={100}
            onSetActive={setActiveSection}
          >
            Ratings
          </Link>
          <Link
            className={`link-i ${
              activeSection === "reviews" ? "active-link" : ""
            }`}
            to="reviews"
            spy={true}
            smooth={true}
            offset={-180}
            duration={100}
            onSetActive={setActiveSection}
          >
            Reviews
          </Link>
          <Link
            className={`link-i ${
              activeSection === "location" ? "active-link" : ""
            }`}
            to="location"
            spy={true}
            smooth={true}
            offset={140}
            duration={100}
            onSetActive={setActiveSection}
          >
            Location
          </Link>
        </div>
      </div>
      <div className="header-placeholder" />
    </>
  );
}
