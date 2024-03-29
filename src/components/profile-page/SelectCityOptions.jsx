"use client";
import { getCountryCityAPI } from "@/connections/get-requests/getCountryStateAndCityAPI";
import useAsync from "@/custom/useAsync";
import useClickOutside from "@/custom/useClickOutside";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Input } from "../ui/input";

import ReactGA from "react-ga";

export default function SelectCityOptions({
  value,
  stateId = "",
  setCityIdAndName,
  isDisabled = false,
}) {
  const token = useSelector((state) => state.auth.token);
  const [inputValue, setInputValue] = useState("");
  const [openDropDown, setOpenDropDown] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const dropdownRef = useRef();

  const {
    loading: stateLoading,
    error: stateError,
    value: stateValue,
  } = useAsync(getCountryCityAPI, [], [stateId, token]);
  useClickOutside(dropdownRef, () => {
    if (openDropDown) setOpenDropDown(false);
  });

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (!openDropDown) setOpenDropDown(true);
  };

  useEffect(() => {
    const regex = new RegExp(inputValue, "i");
    const filteredLocations = stateValue?.filter((el) => regex.test(el.name));
    setFilteredLocations(filteredLocations);
  }, [inputValue]);

  return (
    <>
      <Input
        className="project-search-inputs"
        type="search"
        autoComplete="off"
        placeholder="Search City"
        value={inputValue}
        disabled={isDisabled}
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
                      action: "User Selected a city  in profile form",
                      label: "Button Click",
                    });

                    setInputValue(item?.name);
                    setCityIdAndName(item?.id, item?.name);
                    setOpenDropDown(false);
                  }}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
