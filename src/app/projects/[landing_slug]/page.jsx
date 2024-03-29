import LocationFilters from "@/components/location-filters/LocationFilters";
import LandingSlugPropertyCard from "@/components/property-card/LandingSlugPropertyCard";
import LandingPageDrawer from "@/components/user-drawer/LandingPageDrawer";
import { getLandingSlugAPI } from "@/connections/get-requests/getLandingSlugAPI";
import Link from "next/link";
import "../../[city]/(category-pages)/category-page.scss";
import LocationOptions from "@/components/location-options/LocationOptions";

export default async function LandingSlugPage({ params, searchParams }) {
  const currentPage = searchParams?.page || 1;

  const formattedTitle = params?.["landing_slug"]
    .split("-")
    .map((part, index) => (index === 0 ? part.toUpperCase() : part))
    .join(" ");
  const locationData = await getLandingSlugAPI(
    params?.["landing_slug"],
    currentPage
  );
  const totalProjectsCount = locationData?.meta?.count;

  const selectedFilters = locationData?.meta?.parameters;

  const dividedArray = Array.from(
    { length: Math.ceil(totalProjectsCount / 12) },
    (_, i) => i + 1
  );
  return (
    <main className="flex flex-col md:flex-row justify-center md:gap-[30px] mx-5 h-max">
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
        <div className="px-3 py-4 overflow-y-auto ">
          <ul className="space-y-2 font-medium">
            <div className="flex justify-start ml-[15px] mb-[10px] pt-[20px] items-start font-bold">
              Applied Filters
            </div>

            <div className="h-full px-3 py-4 overflow-y-auto flex flex-wrap gap-1 items-center ">
              {Object.entries(selectedFilters).map(([key, value]) => {
                // Define the keys to exclude from the filters and URL
                const excludedKeys = [
                  "location_slug",
                  "configuration",
                  "city_id",
                  "location_ids",
                  "max_price",
                  "min_price",
                  "page",
                  "city",
                ];

                if (
                  !excludedKeys.includes(key) &&
                  (value !== "" || undefined)
                ) {
                  if (Array.isArray(value)) {
                    return value.map((item, index) => (
                      <Link
                        key={key + index}
                        className="[word-wrap:break-word] my-[5px] mr-1 h-[30px]  cursor-pointer flex  items-center justify-between rounded-[16px] bg-orange-600 px-[10px] py-0 text-[14px] font-normal normal-case leading-loose text-white shadow-none transition-opacity duration-300 ease-linear hover:!shadow-none active:bg-[#cacfd1] md:w-fit md:mr-0 dark:bg-neutral-600 dark:text-neutral-200"
                        href={`/locations?${Object.entries(selectedFilters)
                          .map(([k, v]) =>
                            k === key
                              ? v
                                  .filter((x) => x !== item)
                                  .map((x) => `${k}=${encodeURIComponent(x)}`)
                                  .join("&")
                              : `${k}=${encodeURIComponent(
                                  Array.isArray(v) ? v.join(",") : v
                                )}`
                          )
                          .filter((param) => param !== "")
                          .join("&")}`}
                      >
                        {item}
                        <span className="ml-2">×</span>
                      </Link>
                    ));
                  } else {
                    return (
                      <Link
                        key={key}
                        className="[word-wrap:break-word] my-[5px] mr-1 h-[30px]  cursor-pointer flex  items-center justify-between rounded-[16px] bg-orange-600 px-[10px] py-0 text-[14px] font-normal normal-case leading-loose text-white shadow-none transition-opacity duration-300 ease-linear hover:!shadow-none active:bg-[#cacfd1] md:w-fit md:mr-0 dark:bg-neutral-600 dark:text-neutral-200"
                        href={`/locations?${Object.entries(selectedFilters)
                          .filter(([k]) => k !== key) // Exclude current key from query parameters
                          .map(
                            ([k, v]) =>
                              `${k}=${encodeURIComponent(
                                Array.isArray(v) ? v.join(",") : v
                              )}`
                          )
                          .join("&")}`}
                      >
                        {value === 2209
                          ? "Pune"
                          : value === 2126
                          ? "Mumbai"
                          : value}
                        <span className="ml-2">×</span>
                      </Link>
                    );
                  }
                } else {
                  return null; // If the key is in the excludedKeys array, return null to skip rendering
                }
              })}
            </div>
          </ul>
        </div>
        <hr className="border border-gray-300" />
        <div className="p-2 mb-[200px] ">
          <LocationFilters selectedFilters={selectedFilters} />
        </div>
      </aside>
      <div className="md:w-[calc(100%-26%)]">
        <div>
          <div className="carousal-heading">
            <div className="p-heading">
              <h3 className="text-xl font-medium">
                {formattedTitle}
                <span className="text-[#f1592a]"> ({totalProjectsCount})</span>
              </h3>
              <div className="w-14  border border-solid border-orange-600 "></div>
            </div>
          </div>
          <div className="grid-container grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-2">
            {locationData?.payload?.project_cards?.map((el) => (
              <LandingSlugPropertyCard item={el} key={el.project_id} />
            ))}
          </div>
          <div className="my-[20px] flex justify-end ">
            <div className="container flex justify-end gap-2 items-center">
              {currentPage > 1 ? (
                <Link
                  href={`/projects/${params?.["landing_slug"]}?page=${
                    parseInt(currentPage) - 1
                  }`}
                  className="w-8 h-8 bg-gray-100 text-black border-2 hover:border-orange-600 p-1 rounded-full text-xs flex items-center justify-center"
                >
                  {`<`}
                </Link>
              ) : null}
              <Link
                href="#"
                className={`w-8 h-8 bg-gray-100 text-black border-2 border-orange-600 p-1 rounded-full text-xs flex items-center justify-center`}
              >
                {currentPage}
              </Link>
              <span className="my-[20px] flex justify-end text-sm">
                of {dividedArray.length}
              </span>

              {currentPage < dividedArray.length && ( // Only render the button if currentPage is less than dividedArray length
                <Link
                  href={`/projects/${params?.["landing_slug"]}?page=${
                    parseInt(currentPage) + 1
                  }`}
                  className="w-8 h-8 bg-gray-100 text-black border-2 hover:border-orange-600 p-1 rounded-full text-xs flex items-center justify-center"
                >
                  {`>`}
                </Link>
              )}
            </div>
          </div>
        </div>
        <LocationOptions locationDataOption={selectedFilters} />
      </div>
    </main>
  );
}
