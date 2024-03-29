"use client";
import { getFilteredLocationAPI } from "@/connections/get-requests/getFilteredLocationAPI";
import {
  locationFilterConfigurations,
  locationFilterUnitCategory,
  locationFilterUnitType,
} from "@/constants/initialStateData";
import { getClientCookie } from "@/logic/clientCookie";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import ScaleLoader from "react-spinners/ScaleLoader";
import LocationSearch from "../project-&-location-search/LocationSearch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import ModalWrapper from "../wrappers/ModalWrapper";
import "./LocationFilterModal.scss";

export default function LocationFilterModal({
  triggerElement,
  selectedLocation,
  callback,
}) {
  const [modalState, setModalState] = useState(false);
  const cityId = getClientCookie("cityID") || 2209;

  const [range, setRange] = useState([0, 1000]);
  const [add, setAdd] = useState(false);
  const [locationLists, setLocationLists] = useState([]);
  const [unitCategory, setUnitCategory] = useState("");
  const [txnType, setTxnType] = useState("");
  const [unitType, setUnitType] = useState([]);
  const [selectedConfigurations, setSelectedConfigurations] = useState([]);
  const [isWithin, setIsWithin] = useState("");
  const [sortBy, setSortBy] = useState("");
  const location_ids = locationLists?.map((el) => el?.id);

  useEffect(() => {
    setLocationLists([]);
    setLocationLists((prev) => [...prev, selectedLocation]);
  }, [selectedLocation?.id]);

  const handelReset = () => {
    setUnitCategory("");
    setTxnType("");
    setUnitType([]);
    setSelectedConfigurations([]);
    setSortBy("");
    setIsWithin("");
    setRange([0, 1000]);
    setLocationLists([]);
  };

  useEffect(() => {
    if (modalState === false) {
      callback && callback();
      handelReset();
    }
  }, [modalState]);

  const handleMinChange = (event) => {
    const newMinValue = Math.max(parseInt(event.target.value), 0); // Restrict min value to 0 or greater
    const newRange = [newMinValue, range[1]]; // Update the range values
    setRange(newRange);
  };

  const handleMaxChange = (event) => {
    const newMaxValue = Math.min(parseInt(event.target.value), 1000); // Restrict max value to 500 or less
    const newRange = [range[0], newMaxValue]; // Update the range values
    setRange(newRange);
  };

  //INFO: for configuration tabs
  const toggleConfiguration = (configuration) => {
    if (selectedConfigurations?.includes(configuration)) {
      setSelectedConfigurations(
        selectedConfigurations?.filter((c) => c !== configuration)
      );
    } else {
      setSelectedConfigurations([...selectedConfigurations, configuration]);
    }
  };

  //INFO: Handle Reset

  const handleSetLocationIdAndName = (id, area, slug) => {
    setLocationLists((prev) => [
      ...prev,
      {
        id,
        area,
        slug,
      },
    ]);
    //INFO: hide location search bar when location selected
    setAdd(false);
  };

  const {
    data: locationCount,
    isLoading: loading,
    isError,
  } = useQuery({
    queryKey: [
      "getFilteredLocationAPI",
      location_ids || null,
      unitType?.join(",").replace(" /", ",") || null,
      range[1] || null,
      range[0] || null,
      selectedConfigurations?.join(",") || null,
      unitCategory || null,
      sortBy || null,
      txnType || null,
      isWithin || null,
    ].filter((param) => param !== null), // Remove null values from the array
    queryFn: () =>
      getFilteredLocationAPI(
        location_ids,
        unitType?.join(",").replace(" /", ","),
        range[1] * 100000,
        range[0] * 100000,
        selectedConfigurations?.join(","),
        unitCategory,
        sortBy,
        txnType,
        isWithin,
        1
      ),
  });
  const cityNames = {
    2209: "pune",
    2126: "mumbai",
  };

  const cityName = cityNames[cityId] || "pune";

  return (
    <ModalWrapper
      trigger={triggerElement}
      open={modalState}
      setOpen={setModalState}
      title={
        <div className="flex justify-between">
          <p>Filter Localities</p>
          <button onClick={handelReset} className="mr-[25px] text-[#f1592a]">
            Reset
          </button>
        </div>
      }
    >
      <div className="LocationFilter">
        <div className="localities">
          {locationLists?.map((list) => (
            <p
              key={list?.id}
              className="selected-locality"
              onClick={() => {
                const updatedLocationLists = locationLists?.filter(
                  (item) => item.id !== list.id
                );
                return setLocationLists(updatedLocationLists);
              }}
            >
              {list?.area} <span style={{ color: "grey" }}>⨉</span>
            </p>
          ))}
          <p
            className={location === "visitor" ? "active" : "add-more-btn"}
            onClick={() => setAdd((prev) => !prev)}
          >
            + Add More
          </p>
        </div>
        {add ? (
          <div className="project-search-input-container">
            <LocationSearch
              locationLists={locationLists}
              setLocationIdAndName={handleSetLocationIdAndName}
            />
          </div>
        ) : null}
        <hr className="hr-line" />
        <div className="confi-tabs">
          {locationFilterUnitCategory?.map((el) => (
            <p
              key={el.title}
              className={
                unitCategory === el.category && txnType === el.type
                  ? "active"
                  : "status-title"
              }
              onClick={() => {
                if (unitCategory !== el.category) {
                  setUnitType([]);
                  setSelectedConfigurations([]);
                }
                setUnitCategory(el.category);
                setTxnType(el.type);
              }}
            >
              {el.title}
            </p>
          ))}
        </div>
        {unitCategory && (
          <>
            <hr className="hr-line" />
            <div className="l-heading">Unit Type</div>
          </>
        )}

        {unitCategory === "Residential" && (
          <div className={"unit-type"}>
            {locationFilterUnitType.residential?.map((el) => (
              <p
                key={el}
                className={
                  unitType.includes(el) ? "selected-unit" : "not-selected-unit"
                }
                onClick={() =>
                  setUnitType((prevUnitType) =>
                    prevUnitType.includes(el)
                      ? prevUnitType.filter((type) => type !== el)
                      : prevUnitType?.length
                      ? [...prevUnitType, el]
                      : [el]
                  )
                }
              >
                {el}
              </p>
            ))}
          </div>
        )}

        {unitCategory === "Commercial" && (
          <div className="unit-type">
            {locationFilterUnitType.commercial?.map((el) => (
              <p
                key={el}
                className={
                  unitType.includes(el) ? "selected-unit" : "not-selected-unit"
                }
                onClick={() =>
                  setUnitType((prevUnitType) =>
                    prevUnitType.includes(el)
                      ? prevUnitType.filter((type) => type !== el)
                      : [...prevUnitType, el]
                  )
                }
              >
                {el}
              </p>
            ))}
          </div>
        )}
        <hr className={unitCategory === "Residential" ? "hr-line" : "hidden"} />
        <div
          className={
            unitCategory === "Residential" && unitType !== "Plot"
              ? "l-heading"
              : "hidden"
          }
        >
          Configuration
        </div>
        <div
          className={unitCategory === "Residential" ? "confi-tabs" : "hidden"}
        >
          {locationFilterConfigurations.map((el) => (
            <p
              key={el}
              className={
                selectedConfigurations?.includes(el) ? "active" : "status-title"
              }
              onClick={() => toggleConfiguration(el)}
            >
              {el}
            </p>
          ))}
        </div>
        <hr className="hr-line" />
        <div className="l-heading">
          Sold at
          <span className="sub-title">(actual txn price as per IGR data)</span>
        </div>
        <div className="Range">
          <div className="range-input">
            {["Min", "Max"].map((el) => (
              <p style={{ position: "relative" }} key={el}>
                {el}:
                <input
                  className="input-range"
                  type="number"
                  value={range[el === "Min" ? 0 : 1]}
                  onChange={el === "Min" ? handleMinChange : handleMaxChange}
                  min={range[0]}
                  max={range[1]}
                />
                <span className="permanent-text">Lacs</span>
              </p>
            ))}
          </div>
          <RangeSlider
            min={0}
            max={1000}
            step={1}
            value={range}
            onInput={setRange}
            className="custom-range-slider"
          />
        </div>
        <Select onValueChange={setIsWithin} value={isWithin}>
          <SelectTrigger className="h-[36px]">
            <SelectValue placeholder="Sold within" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {[
                { title: "upto last 3 months", range: 3 },
                { title: "upto last 6 months", range: 6 },
                { title: "upto last 9 months", range: 9 },
                { title: "upto last 12 months", range: 12 },
              ].map((el) => (
                <SelectItem value={el.range} key={el.range}>
                  {el.title.replace("last", "")}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <hr className="hr-line" />
        <div className="sort-by">
          <p className="l-heading">Sort by</p>
          <div className="sorting">
            {[
              { title: "Low to High", value: "low_to_high" },
              { title: "High to Low", value: "high_to_low" },
            ].map((el) => (
              <p
                key={el.value}
                className={
                  sortBy === el.value
                    ? "sorting-title "
                    : "sorting-title-not-selected "
                }
                onClick={() => setSortBy(el.value)}
              >
                Price: {el.title}
              </p>
            ))}
          </div>
        </div>
        <hr className="hr-line" />
        <div className="flex flex-col items-center justify-center">
          {loading ? (
            <div className="submit">
              <ScaleLoader color="#ffffff" height={25} radius={5} width={4} />
            </div>
          ) : (
            <Link
              href={`/locations?city=${cityName}&locations=${locationLists?.map(
                (el) => el?.area
              )}&location_ids=${location_ids}&unit_type=${unitType}&max_price=${
                range[1] * 100000
              }&min_price=${
                range[0] * 100000
              }&configurations=${selectedConfigurations?.join(
                ","
              )}&unit_category=${unitCategory}&sort_by=${sortBy}&transaction_type=${txnType}&transaction_date=${isWithin}&location_slug=${locationLists?.map(
                (el) => el?.slug
              )}`}
              aria-disabled={!locationCount?.count || isError}
              tabIndex={!locationCount?.count || isError ? -1 : undefined}
              className={
                !locationCount?.count || isError ? "disable" : "submit"
              }
              onClick={() => locationCount?.count >= 1 && setModalState(false)}
            >
              {!locationCount?.count || isError
                ? `No projects please refine filters`
                : `View ${locationCount?.count} Properties`}
            </Link>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
}
