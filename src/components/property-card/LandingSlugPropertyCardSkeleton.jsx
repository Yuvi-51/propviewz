import React from "react";
import { Card } from "@nextui-org/react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./LandingSlugPropertyCard.scss";

export default function LandingSlugPropertyCardSkeleton() {
  return (
    <Card className="LandingSlug-property-container p-4" radius="lg">
      <Skeleton className="carousal_img w-full" />
      <div className="details w-full">
        <div className="flex justify-between gap-2">
          <Skeleton className="w-[100px] md:w-[110px]" />
          <Skeleton className="w-[100px] md:w-[110px]" />
        </div>
        <div className="flex justify-between gap-2">
          <Skeleton className="w-[100px] md:w-[110px] " />
          <Skeleton className="w-[100px] md:w-[110px]" />
        </div>
      </div>
    </Card>
  );
}
