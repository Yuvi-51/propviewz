"use client";
import { getProjectsOnSearchAPI } from "@/connections/get-requests/getProjectsOnSearchAPI";
import useClickOutside from "@/custom/useClickOutside";
import useDebouncedAPIFetch from "@/custom/useDebouncedAPIFetch";
import { getClientCookie } from "@/logic/clientCookie";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import ReactGA from "react-ga";
import LocationFilterModal from "../modal-content/LocationFilterModal";
import { Input } from "../ui/input";
import "./Project&LocationSearch.scss";

export default function ProjectAndLocationSearch() {
  const cityId = getClientCookie("cityID") || 2209;
  const [inputValue, setInputValue] = useState("");
  const [selectedLocation, setSelectedLocation] = useState({});
  const dropdownRef = useRef();

  const {
    loading: projectLoading,
    error: projectError,
    value: projectDetails,
  } = useDebouncedAPIFetch(
    getProjectsOnSearchAPI,
    [inputValue],
    ["projects", inputValue, cityId]
  );

  const {
    loading: locationLoading,
    error: locationError,
    value: locationDetails,
  } = useDebouncedAPIFetch(
    getProjectsOnSearchAPI,
    [inputValue],
    ["locations", inputValue, cityId]
  );

  useClickOutside(dropdownRef, () => {
    if (inputValue) setInputValue("");
  });

  const handleAfterLocationClick = () => {
    ReactGA.event({
      category: "User",
      action: "User Selected a location in Location Filter",
      label: "Button Click",
    });
    setSelectedLocation({});
    if (selectedLocation?.id) {
      setInputValue("");
    }
  };

  return (
    <>
      <Input
        className="project-and-location-search-inputs"
        type="search"
        autoComplete="off"
        placeholder="Search Projects, Locations"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
      />
      {inputValue ? (
        <div
          className="project-and-location-dropdown"
          ref={selectedLocation?.id ? null : dropdownRef}
        >
          <div className="project-and-location-dropdown-container">
            <p>Projects</p>
            <div className="project-and-location-dropdown-contents">
              {projectDetails?.projects?.map((item) => (
                <a
                  href={`/${cityId == 2209 ? "pune" : "mumbai"}/${
                    item?.location_slug
                  }/${item.slug}`}
                  className="project-and-location-dropdown-row"
                  key={item?.id}
                >
                  <img
                    src="/images/skyline 1.svg"
                    className="p-logo"
                    alt="img"
                  />
                  {item.name}, {item.detailed_area}
                </a>
              ))}
            </div>
            <Link href={"/add-new-project"}>
              <button className="btn-add-new" onClick={() => setInputValue("")}>
                <PlusIcon /> Add New Project
              </button>
            </Link>
          </div>
          <div className="project-and-location-dropdown-container">
            <p>Locations</p>
            <div className="project-and-location-dropdown-contents">
              {locationDetails?.locations?.map((item) => (
                <LocationFilterModal
                  key={item?.id}
                  selectedLocation={selectedLocation}
                  callback={handleAfterLocationClick}
                  triggerElement={
                    <div
                      onClick={() => {
                        ReactGA.event({
                          category: "User",
                          action: "User Selected a location in Location Filter",
                          label: "Button Click",
                        });
                        setSelectedLocation({
                          id: item?.id,
                          area: item?.area,
                          slug: item?.slug,
                        });
                      }}
                      className="project-and-location-dropdown-row"
                      key={item?.id}
                    >
                      <img
                        src="/images/location-pin 1.svg"
                        className="p-logo"
                        alt="img"
                      />
                      {item.area}
                    </div>
                  }
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
