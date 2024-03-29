"use client";
import { getProjectsOnSearchAPI } from "@/connections/get-requests/getProjectsOnSearchAPI";
import useClickOutside from "@/custom/useClickOutside";
import useDebouncedAPIFetch from "@/custom/useDebouncedAPIFetch";
import { useEffect, useRef, useState } from "react";
import ReactGA from "react-ga";
import { Input } from "../ui/input";
import "./ProjectSearch.scss";
import { getClientCookie } from "@/logic/clientCookie";

export default function ProjectSearch({
  projectSearchDetails,
  setProjectSearchDetails,
  setValidationErrors,
  addNewProjectBtn,
  cityIdProp,
}) {
  const cityId = getClientCookie("cityID") || 2209;
  const [openDropDown, setOpenDropDown] = useState(false);
  const dropdownRef = useRef();

  const {
    loading: projectLoading,
    error: projectError,
    value: projectDetails,
  } = useDebouncedAPIFetch(
    getProjectsOnSearchAPI,
    [projectSearchDetails?.project_name],
    ["projects", projectSearchDetails?.project_name, cityIdProp || cityId] //if city ID is coming from valuation report use cityIdProp
  );

  useClickOutside(dropdownRef, () => {
    if (openDropDown) setOpenDropDown(false);
  });

  const handleInputChange = (e) => {
    setProjectSearchDetails((prev) => ({
      ...prev,
      project_name: e.target.value,
    }));
    if (!openDropDown) setOpenDropDown(true);
  };

  useEffect(() => {
    setProjectSearchDetails((prev) => ({
      ...prev,
      project_name: "",
    }));
  }, [cityIdProp]);

  const handleSetProjectIdAndName = (project_name, project_id) => {
    ReactGA.event({
      category: "User",
      action: "User Selected Project from search",
      label: "Button Click",
    });

    setProjectSearchDetails((prev) => ({
      ...prev,
      project_name,
      project_id,
    }));
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      project_name: false,
    }));
    setOpenDropDown(false);
  };

  return (
    <>
      <Input
        className="project-search-inputs"
        type="search"
        autoComplete="off"
        placeholder="Search Projects"
        value={projectSearchDetails?.project_name}
        onChange={handleInputChange}
      />
      {openDropDown && projectSearchDetails?.project_name ? (
        <div className="project-dropdown" ref={dropdownRef}>
          <div className="project-dropdown-container">
            <div className="project-dropdown-contents">
              {projectDetails?.projects?.map((item) => (
                <div
                  className="project-dropdown-row"
                  key={item?.id}
                  onClick={() => {
                    handleSetProjectIdAndName(
                      item?.name,
                      item?.id,
                      item?.detailed_area
                    );
                  }}
                >
                  <img
                    src="/images/skyline 1.svg"
                    className="p-logo"
                    alt="img"
                  />
                  {item?.name}, {item?.detailed_area}
                </div>
              ))}
              {addNewProjectBtn}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
