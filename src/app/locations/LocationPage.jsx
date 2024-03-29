"use client";
import LocationFilters from "@/components/location-filters/LocationFilters";
import LocationOptions from "@/components/location-options/LocationOptions";
import LandingSlugPropertyCard from "@/components/property-card/LandingSlugPropertyCard";
import LandingSlugPropertyCardSkeleton from "@/components/property-card/LandingSlugPropertyCardSkeleton";
import LandingPageDrawer from "@/components/user-drawer/LandingPageDrawer";
import { getFilteredLocationAPI } from "@/connections/get-requests/getFilteredLocationAPI";
import { paginationRenderItem } from "@/logic/paginationRenderItem";
import { Pagination } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export default function LocationPageComponent({ searchParams }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState({});
  const {
    location_ids,
    unit_type,
    max_price,
    min_price,
    configurations,
    unit_category,
    sort_by,
    transaction_type,
    transaction_date,
    locations,
    location_slug,
  } = selectedFilters;
  useEffect(() => {
    const {
      location_ids,
      unit_type,
      max_price,
      min_price,
      configurations,
      unit_category,
      sort_by,
      transaction_type,
      transaction_date,
      locations,
      location_slug,
    } = searchParams;

    setSelectedFilters({
      location_ids,
      unit_type,
      max_price,
      min_price,
      configurations,
      unit_category,
      sort_by,
      transaction_type,
      transaction_date,
      locations,
      location_slug,
    });
  }, [searchParams]);

  const {
    data: locationData,
    isLoading: loading,
    isError,
  } = useQuery({
    queryKey: [
      "getFilteredLocationAPI",
      ...(searchParams?.locations ? [location_ids] : []),
      unit_type,
      max_price,
      min_price,
      configurations,
      unit_category,
      sort_by,
      transaction_type,
      transaction_date,
      currentPage,
    ],
    queryFn: () =>
      getFilteredLocationAPI(
        ...(searchParams?.locations ? [location_ids] : []),
        unit_type,
        max_price,
        min_price,
        configurations,
        unit_category,
        sort_by,
        transaction_type,
        transaction_date,
        currentPage
      ),
  });
  // console.log("locationData", searchParams);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  useEffect(() => {
    setCurrentPage(1);
  }, [location_ids]);

  const appliedFilters = () => {
    const returnArray = [];

    if (selectedFilters?.configurations) {
      const configuration = selectedFilters.configurations
        .split(",")
        .map((key) => ({ [key]: "configurations" }));
      returnArray.push(...configuration);
    }

    if (selectedFilters?.locations) {
      const location = selectedFilters.locations
        .split(",")
        .map((key) => ({ [key]: "locations" }));
      returnArray.push(...location);
    }

    if (selectedFilters?.unit_type) {
      const unitType = selectedFilters.unit_type
        .split(",")
        .map((key) => ({ [key]: "unit_type" }));
      returnArray.push(...unitType);
    }

    if (selectedFilters?.transaction_type) {
      returnArray.push({
        [selectedFilters.transaction_type]: "transaction_type",
      });
    }

    if (selectedFilters?.unit_category) {
      returnArray.push({ [selectedFilters.unit_category]: "unit_category" });
    }

    if (selectedFilters?.sort_by) {
      returnArray.push({ [selectedFilters.sort_by]: "sort_by" });
    }
    if (selectedFilters?.transaction_date) {
      returnArray.push({
        [selectedFilters.transaction_date]: "transaction_date",
      });
    }

    return returnArray;
  };

  const configuration = selectedFilters.configurations
    ? selectedFilters.configurations
        .toUpperCase()
        .replace(/,+/g, ",")
        .replace(/^,|,$/g, "")
    : "";
  const unitType = searchParams.unit_type || "";

  const title = configuration
    ? `${configuration} ${
        unitType || searchParams.unit_category || "Properties"
      }`
    : `${unitType || searchParams.unit_category || "Properties"}`;
  return (
    <div className="flex flex-col md:flex-row justify-center md:gap-[30px] mx-5 h-max">
      <LandingPageDrawer selectedFilters={selectedFilters} />
      <aside
        id="default-sidebar"
        className="md:w-[26%] bg-white shadow-lg hidden md:block"
        aria-label="Sidebar"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#f1592a transparent",
        }}
      >
        <div className="px-3 py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            <div className="flex justify-start ml-[15px] mb-[10px] pt-[20px] items-start font-bold">
              Applied Filters
            </div>

            <div className="h-full px-3 py-4 overflow-y-auto flex flex-wrap gap-1 items-center">
              {selectedFilters?.locations?.length > 0 ? (
                <div className="carousal-heading flex-col items-start gap-2 h-max">
                  <div className="flex gap-2 flex-wrap">
                    {appliedFilters()
                      .filter((el) => {
                        const key = Object.keys(el)[0];

                        return key !== "undefined" && key.trim() !== ""; // Filter out undefined or empty keys
                      })
                      .map((el) => {
                        const key = Object.keys(el)[0];
                        const value = el[key];
                        return (
                          <div
                            key={key}
                            onClick={() => {
                              if (selectedFilters[value]) {
                                const newSelectedValue = selectedFilters[
                                  value
                                ]?.replace(key, "");
                                setSelectedFilters({
                                  ...selectedFilters,
                                  [value]: newSelectedValue,
                                });
                              }
                            }}
                            className="[word-wrap:break-word] my-[5px] mr-1 h-[30px]  cursor-pointer flex  items-center justify-between rounded-[16px] bg-orange-600 px-[10px] py-0 text-[14px] font-normal normal-case leading-loose text-white shadow-none transition-opacity duration-300 ease-linear hover:!shadow-none active:bg-[#cacfd1] md:w-fit md:mr-0 dark:bg-neutral-600 dark:text-neutral-200"
                          >
                            {key == "undefined"
                              ? null
                              : key.replaceAll("_", " ") == 3 ||
                                key == 6 ||
                                key == 9 ||
                                key == 12
                              ? `up to last ${key.replaceAll("_", " ")} months`
                              : key.replaceAll("_", " ")}
                            {key == "undefined" ? null : (
                              <X size={15} className="cursor-pointer" />
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              ) : null}
            </div>
          </ul>
        </div>
        <hr className="border border-gray-300 " />
        <div className="p-2 mb-[200px]">
          <LocationFilters selectedFilters={selectedFilters} />
        </div>
      </aside>
      <div className="md:w-[calc(100%-26%)]">
        <div>
          <div className="carousal-heading">
            {locationData?.count > 0 ? (
              <div className="p-heading">
                <h3>
                  {title}{" "}
                  {searchParams?.transaction_type &&
                    `for ${
                      searchParams?.transaction_type?.charAt(0)?.toUpperCase() +
                      searchParams?.transaction_type?.slice(1)
                    }`}{" "}
                  in {searchParams?.locations}{" "}
                  <span className="text-[#f1592a]">
                    {locationData?.count && `(${locationData?.count})`}
                  </span>
                </h3>

                <div className="trend-line"></div>
              </div>
            ) : (
              <div className="p-heading">
                {loading ? <h3>Searching...</h3> : <h3>No Projects Found</h3>}
                <div className="trend-line"></div>
              </div>
            )}
          </div>
          <div className="grid-container grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-2">
            {loading &&
              Array(9)
                .fill(null)
                .map((el, i) => <LandingSlugPropertyCardSkeleton key={i} />)}

            {locationData?.data?.map((el) => (
              <LandingSlugPropertyCard item={el} key={el.project_id} />
            ))}
          </div>
          {isError && (
            <div className="shadow-md w-max m-auto p-4 text-[30px] mt-[25%]">
              No projects found
            </div>
          )}
          {!isError && (
            <div className="my-[20px] flex justify-end">
              <Pagination
                disableCursorAnimation
                showControls
                total={Math.ceil(locationData?.count / 12)}
                page={currentPage}
                onChange={(selectedPage) => setCurrentPage(selectedPage)}
                radius="full"
                renderItem={paginationRenderItem}
              />
            </div>
          )}
        </div>
        <LocationOptions locationDataOption={searchParams} />
      </div>
    </div>
  );
}
