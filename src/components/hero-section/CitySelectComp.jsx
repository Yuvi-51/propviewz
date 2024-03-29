"use client";
import { getClientCookie, setClientCookie } from "@/logic/clientCookie";
import CitySelectModal from "../modal-content/CitySelectModal";
import { Button } from "../ui/button";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { cityNameToId } from "@/logic/conversions";

export default function CitySelectComp() {
  const cityId = getClientCookie("cityID") || 2209;
  const { city } = useParams();
  const { refresh } = useRouter();
  useEffect(() => {
    const isCityDifferent = cityId != cityNameToId(city);
    if (isCityDifferent) {
      setClientCookie("cityID", cityNameToId(city), 30);
      refresh();
    }
  }, [city]);

  return (
    <CitySelectModal
      triggerElement={
        <Button variant="outline">{cityId == 2209 ? "Pune" : "Mumbai"}</Button>
      }
    />
  );
}
