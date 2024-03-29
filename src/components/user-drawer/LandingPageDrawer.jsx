"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import LocationFilters from "../location-filters/LocationFilters";
import { ScrollArea } from "../ui/scroll-area";
import "./UserDrawer.scss";

export default function LandingPageDrawer({ selectedFilters }) {
  const [open, setOpen] = useState(false);
  const [newFilters, setNewFilters] = useState({});

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
    } = selectedFilters;

    setNewFilters({
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
  }, [selectedFilters]);
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
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="w-full block md:hidden">
          <button className="p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clip-rule="evenodd"
                fill-rule="evenodd"
                d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
              ></path>
            </svg>
          </button>
        </div>
      </SheetTrigger>

      <SheetContent>
        <ScrollArea className="h-[99vh]">
          <aside
            id="default-sidebar"
            className={`fixed top-0 left-0 z-1 w-[100%] transition-transform  sm:translate-x-0 h-full`}
            aria-label="Sidebar"
          >
            <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
              <ul className="space-y-2 font-medium">
                <div className="flex justify-start ml-[15px] mb-[10px] pt-[20px] items-start font-bold">
                  Applied Filters
                </div>
                <div className="h-full px-3 py-4 overflow-y-auto flex flex-wrap gap-1 items-center">
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
                              className="[word-wrap:break-word] my-[5px] mr-1 h-[30px]  cursor-pointer flex  items-center justify-between rounded-[16px] bg-orange-600 px-[10px] py-0 text-[14px] font-normal normal-case leading-loose text-white shadow-none transition-opacity duration-300 ease-linear hover:!shadow-none active:bg-[#cacfd1] md:w-fit md:mr-0 dark:bg-neutral-600 dark:text-neutral-200"
                              onClick={() => {
                                if (selectedFilters[value]) {
                                  const newSelectedValue = selectedFilters[
                                    value
                                  ]?.replace(key, "");
                                  setNewFilters({
                                    ...selectedFilters,
                                    [value]: newSelectedValue,
                                  });
                                }
                              }}
                            >
                              {key == "undefined"
                                ? null
                                : key.replaceAll("_", " ") == 3 ||
                                  key == 6 ||
                                  key == 9 ||
                                  key == 12
                                ? `up to last ${key.replaceAll(
                                    "_",
                                    " "
                                  )} months`
                                : key.replaceAll("_", " ")}
                              {key == "undefined" ? null : (
                                <X size={15} className="cursor-pointer" />
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </ul>
              <hr className="border border-gray-300 " />
              <div className="p-2 ">
                <LocationFilters
                  selectedFilters={newFilters}
                  setOpen={setOpen}
                />
              </div>
            </div>
          </aside>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
