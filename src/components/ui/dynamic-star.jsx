"use client";
import { dynamicStarConfig } from "@/constants/initialStateData";
import { DynamicStar } from "react-dynamic-star";

export default function StarRating({ rating, width = 16, height = 16 }) {
  return (
    <DynamicStar
      rating={rating}
      width={parseFloat(width)}
      height={parseFloat(height)}
      totalStars={dynamicStarConfig.totalStars}
      sharpnessStar={dynamicStarConfig.sharpness}
      fullStarColor={dynamicStarConfig.fullStarColor}
      emptyStarColor={dynamicStarConfig.emptyStarColor}
    />
  );
}
