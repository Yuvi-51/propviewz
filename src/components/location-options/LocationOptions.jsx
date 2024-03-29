"use client";
import { getCategoryProjectsAPI } from "@/connections/get-requests/getCategoryProjectsAPI";
import { getTopLocationsAPI } from "@/connections/get-requests/getTopLocationsAPI";
import { Bhk_Wise } from "@/constants/initialStateData";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LocationOptions({ locationDataOption }) {
  const cityId = locationDataOption?.city === "pune" ? 2209 : 2126;
  const useFetchData = (apiFunction, ...args) => {
    const [data, setData] = useState(null);
    useEffect(() => {
      apiFunction(...args).then((result) => setData(result));
    }, [apiFunction, ...args]);
    return data;
  };

  const topLocations = useFetchData(getTopLocationsAPI, cityId);

  const topTrending = useFetchData(getCategoryProjectsAPI, "trending", cityId);

  return (
    <div className="flex items-start justify-around h-auto p-[10px] bg-white border border-gray-300 rounded-lg mb-[30px] mt-[20px] max-md:flex-col ">
      <div style={{ marginTop: "10px" }}>
        <h4>Popular BHK Searches</h4>
        <div className="mt-[10px]">
          {Bhk_Wise?.map((data) => (
            <Link
              href={`/projects/${data?.value}-flat-in-${locationDataOption?.location_slug}-${locationDataOption?.city}`}
              key={data.id}
            >
              <p className="text-gray-700 hover:text-orange-600">
                {data?.name} Flats in {locationDataOption?.locations}{" "}
                {locationDataOption?.city}
              </p>
            </Link>
          ))}
        </div>
      </div>
      <div style={{ marginTop: "10px" }}>
        <h4>Top Locations</h4>
        <div className="mt-[10px]">
          {topLocations?.map((location) => (
            <Link
              href={`/locations?locations=${location.area}&location_ids=${
                location?.id
              }&city=${
                cityId == 2209 ? "pune" : "mumbai"
              }&page=1&location_slug=${location.slug}&configurations=`}
              key={location.id}
            >
              <p className="text-gray-700 hover:text-orange-600">
                Properties in {location?.area}
              </p>
            </Link>
          ))}
        </div>
      </div>
      <div style={{ marginTop: "10px" }}>
        <h4>Top Trending</h4>
        <div className="mt-[10px]">
          {topTrending?.map((data, i) => (
            <Link
              href={`/${
                data?.city_id === 2209
                  ? "pune"
                  : cityId === 2126
                  ? "mumbai"
                  : "pune"
              }/${data?.location_slug}/${data?.slug}`}
              key={i}
            >
              <p className="text-gray-700 hover:text-orange-600">
                {data?.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
