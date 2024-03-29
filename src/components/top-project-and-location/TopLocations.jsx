// "use client"
import { getTopLocationsAPI } from "@/connections/get-requests/getTopLocationsAPI";
import { cityIdToName } from "@/logic/conversions";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function TopLocations() {
  const cookieCityId = cookies().get("cityID")?.value || 2209;
  const topLocations = await getTopLocationsAPI(cookieCityId);
  return (
    <div>
      <h3>TOP LOCATIONS</h3>
      {topLocations?.map((location) => (
        <Link
          href={`/locations?locations=${location.area}&location_ids=${
            location?.id
          }&city=${cityIdToName(cookieCityId)}&page=1&location_slug=${
            location.slug
          }&configurations=`}
          key={location.id}
        >
          <p className="text">Properties in {location?.area}</p>
        </Link>
      ))}
    </div>
  );
}
