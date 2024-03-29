import { SliderProvider } from "@/app/providers";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./PropertyCard.scss";

export default function PropertyCardSkeleton({ count = 1 }) {
  return (
    <SliderProvider>
      {Array(count)
        .fill(null)
        .map((el) => (
          <div key={el}>
            <div className="other-property-container">
              <Skeleton className="carousal_img" />
              <div className="details">
                <div className="skeleton_container">
                  <Skeleton />
                  <Skeleton />
                </div>
                <div className="skeleton_container">
                  <Skeleton />
                  <Skeleton />
                </div>
              </div>
            </div>
          </div>
        ))}
    </SliderProvider>
  );
}
