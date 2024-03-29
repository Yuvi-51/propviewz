import { getFilteredLocationAPI } from "@/connections/get-requests/getFilteredLocationAPI";
import "../[city]/(category-pages)/category-page.scss";
import LocationPageComponent from "./LocationPage";
export async function generateMetadata({ searchParams }) {
  const currentPage = searchParams?.page || 1;

  const locationData = await getFilteredLocationAPI(
    searchParams?.location_ids,
    searchParams?.unitType,
    searchParams?.maxRange,
    searchParams?.minRange,
    searchParams?.configurations,
    searchParams?.unitCategory,
    searchParams?.sortBy,
    searchParams?.type,
    searchParams?.isWithin,
    currentPage
  );
  // console.log("locationData", locationData.data);
  const dataNotFound = !locationData?.data?.length;
  const totalProjectsCount = locationData?.count || 0;

  if (dataNotFound) {
    return {
      title: "Page Not Found",
      description: "This page does not exist on propviewz.com",
    };
  } else {
    return {
      title: `${totalProjectsCount} + Properties in ${searchParams?.locations}`,
    };
  }
}
export default async function LocationPage({ searchParams }) {
  return (
    <main>
      <LocationPageComponent searchParams={searchParams} />
    </main>
  );
}
