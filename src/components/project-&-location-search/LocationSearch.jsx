"use client";
import { getProjectsOnSearchAPI } from "@/connections/get-requests/getProjectsOnSearchAPI";
import useClickOutside from "@/custom/useClickOutside";
import useDebouncedAPIFetch from "@/custom/useDebouncedAPIFetch";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import "./ProjectSearch.scss";

import { getClientCookie } from "@/logic/clientCookie";
import ReactGA from "react-ga";

export default function LocationSearch({
  locationLists = [],
  setLocationIdAndName,
  cityIdProp,
  closeLocationInputFunRef,
}) {
  const cityId = getClientCookie("cityID") || 2209;
  const [inputValue, setInputValue] = useState("");
  const [openDropDown, setOpenDropDown] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const dropdownRef = useRef();
  const {
    loading: locationLoading,
    error: locationError,
    value: locationDetails,
  } = useDebouncedAPIFetch(
    getProjectsOnSearchAPI,
    [inputValue],
    ["locations", inputValue, cityIdProp || cityId] //if city ID is coming from valuation report form use cityIdProp
  );

  useClickOutside(dropdownRef, () => {
    if (openDropDown) setOpenDropDown(false);
  });

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (!openDropDown) setOpenDropDown(true);
  };

  useEffect(() => {
    const filteredLocations = [];
    for (const item of locationDetails?.locations || []) {
      let isExcluded = false;
      for (const excludedItem of locationLists) {
        if (item.id === excludedItem.id) {
          isExcluded = true;
          break;
        }
      }
      if (!isExcluded) {
        filteredLocations.push(item);
      }
    }
    setFilteredLocations(filteredLocations);
  }, [locationDetails?.locations?.length]);

  const clearLocationInputOnSubmit = () => {
    setInputValue("");
  };

  React.useImperativeHandle(closeLocationInputFunRef, () => ({
    clearLocationInputOnSubmit,
  }));

  return (
    <>
      <Input
        className="project-search-inputs"
        type="search"
        autoComplete="off"
        placeholder={
          cityIdProp === "null"
            ? "Please select city first"
            : "Search Location eg: Wakad"
        }
        disabled={cityIdProp === "null" ? true : false}
        value={inputValue}
        onChange={handleInputChange}
      />
      {openDropDown && inputValue ? (
        <div className="project-dropdown" ref={dropdownRef}>
          <div className="project-dropdown-container">
            <div className="project-dropdown-contents">
              {filteredLocations?.map((item) => (
                <div
                  className="project-dropdown-row"
                  key={item?.id}
                  onClick={() => {
                    ReactGA.event({
                      category: "User",
                      action: "User Selected a location from search",
                      label: "Button Click",
                    });
                    setInputValue(item?.area);
                    setLocationIdAndName(item?.id, item?.area, item?.slug);
                    setOpenDropDown(false);
                  }}
                >
                  <img
                    src="/images/location-pin 1.svg"
                    className="p-logo"
                    alt="img"
                  />
                  {item.area}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
