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
import { useRouter } from "next/navigation";
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
import "./LocationFilters.scss";

export default function LocationFilters({
  selectedLocation,
  selectedFilters,
  setOpen,
}) {
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
  const [count, setCount] = useState("");
  const location_ids = locationLists?.map((el) => el?.id);
  const router = useRouter();
  useEffect(() => {
    setLocationLists([]);
    setLocationLists((prev) => [...prev, locationLists]);
  }, [selectedLocation?.id]);

  useEffect(() => {
    if (selectedFilters) {
      setSelectedConfigurations(
        selectedFilters?.configurations?.split(",") || []
      );

      const locationIds = String(selectedFilters?.location_ids);
      const locations = selectedFilters?.locations;

      const combinedLocationLists =
        typeof locationIds === "string" && locationIds.trim() !== ""
          ? locationIds
              .split(",")
              .map((id, index) => ({
                id,
                area: locations?.split(",")[index],
                slug: selectedFilters?.location_slug,
              }))
              .filter((item) => item.id && item.area)
          : [];

      setLocationLists(combinedLocationLists || []);
      setUnitCategory(selectedFilters?.unit_category || "");
      setTxnType(selectedFilters?.transaction_type || "");
      setUnitType(
        (selectedFilters?.unit_type || "")
          .split(",")
          .map((type) => type.trim())
          .filter(Boolean) || []
      );

      setRange([
        selectedFilters?.min_price / 100000 || 0,
        selectedFilters?.max_price / 100000 || 1000,
      ]);
      setIsWithin(parseInt(selectedFilters?.transaction_date) || "");
      setSortBy(selectedFilters?.sort_by || "");
    }
  }, [selectedFilters]);

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
      const newConfigurations = selectedConfigurations
        ? selectedConfigurations.concat(configuration).filter(Boolean)
        : [configuration];
      setSelectedConfigurations(newConfigurations);
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
    // Add more cityId-cityName mappings as needed
  };

  const cityName = cityNames[cityId] || "pune";
  useEffect(() => {
    // Check if parameters have changed and navigate accordingly
    if (!loading && locationCount?.count != count) {
      setCount(locationCount?.count);
      const url = `/locations?city=${cityName}&locations=${locationLists?.map(
        (el) => el?.area
      )}&location_ids=${location_ids}&unit_type=${unitType}&max_price=${
        range[1] * 100000
      }&min_price=${
        range[0] * 100000
      }&configurations=${selectedConfigurations?.join(
        ","
      )}&unit_category=${unitCategory}&sort_by=${sortBy}&transaction_type=${txnType}&transaction_date=${isWithin}&location_slug=${locationLists?.map(
        (el) => el?.slug
      )}`;
      router.push(url);
    }
  }, [
    locationCount,
    cityId,
    locationLists,
    location_ids,
    unitType,
    range,
    selectedConfigurations,
    unitCategory,
    sortBy,
    txnType,
    isWithin,
    loading,
  ]);

  return (
    <div className="Location_Filter">
      <div className="w-full ml-[-10px] flex items-center justify-between">
        <div className="flex items-center justify-start ml-[15px] mb-[10px] pt-[20px] font-bold">
          Filters
        </div>
      </div>
      <div className="localities">
        {locationLists?.map((list) => (
          <p
            key={list?.id}
            className="selected-locality"
            onClick={() => {
              const updatedLocationLists = locationLists?.filter(
                (item) => item.id !== list.id || item.area !== list.area
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
              onClick={() => {
                setUnitType((prevUnitType) =>
                  prevUnitType.includes(el)
                    ? prevUnitType?.filter((type) => type !== el)
                    : prevUnitType?.length > 0
                    ? [...prevUnitType, el]
                    : [el]
                );
              }}
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
              onClick={() => {
                setUnitType((prevUnitType) =>
                  prevUnitType.includes(el)
                    ? prevUnitType.filter((type) => type !== el)
                    : [...prevUnitType, el]
                );
              }}
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
      <div className={unitCategory === "Residential" ? "confi-tabs" : "hidden"}>
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
      <div className="view_txn_btn">
        <span
          className={
            (!loading && locationCount?.count <= 0) || isError
              ? "error-msg"
              : "hidden"
          }
        >
          No projects found, please refine the filters.
        </span>
        {loading ? (
          <div className="submit">
            <ScaleLoader color="#ffffff" height={25} radius={5} width={4} />
          </div>
        ) : (
          <Link
            href={
              locationCount?.count >= 1
                ? `/locations?city=${
                    cityId == 2209 ? "pune" : "mumbai"
                  }&locations=${locationLists?.map(
                    (el) => el?.area
                  )}&location_ids=${location_ids}&unit_type=${unitType}&max_price=${
                    range[1] * 100000
                  }&min_price=${
                    range[0] * 100000
                  }&configurations=${selectedConfigurations?.join(
                    ","
                  )}&unit_category=${unitCategory}&sort_by=${sortBy}&transaction_type=${txnType}&transaction_date=${isWithin}&location_slug=${locationLists?.map(
                    (el) => el?.slug
                  )}`
                : ""
            }
            role="link"
            className={
              locationCount?.count <= 0 || isError ? "disable" : "submit"
            }
            onClick={() => setOpen(false)}
          >
            {(!loading && locationCount?.count <= 0) || isError
              ? `Please Add More Filters`
              : `View ${locationCount?.count} Properties`}
          </Link>
        )}
      </div>
    </div>
  );
}
