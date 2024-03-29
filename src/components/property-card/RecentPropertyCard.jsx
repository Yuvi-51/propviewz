import React from "react";
import "./PropertyCard.scss";
import Image from "next/image";
import { formatTransactionAmount } from "@/logic/format-transaction-amount";
import { validateImageUrl } from "@/logic/validation";
import Link from "next/link";
import StarRating from "../ui/dynamic-star";
import Skeleton from "react-loading-skeleton";
import { createPropertyHref } from "@/logic/conversions";

export function RecentPropertyCard({ item }) {
  return (
    <Link
      href={createPropertyHref(item.city_id, item.location_slug, item.slug)}
    >
      <div className="recent-property-container">
        <div className="first-part d-flex">
          <img
            src={
              item?.thumbnail
                ? `${validateImageUrl(item?.thumbnail)}`
                : "images/img_alt.svg"
            }
            alt={
              item?.thumbnail_title &&
              `${item?.city_name}-${item?.detailed_area}-${item?.thumbnail_title}`
            }
            className="card-img"
          />
          <div className="sub-details">
            <p className="p-name">{item?.name}</p>
            <p className="l-name">{item?.detailed_area}</p>
          </div>
        </div>
        <div className="p-sub-details">
          <div className="rating-div">
            <div>
              {item?.configuration} Sold @
              <span className="txn-value">
                ₹{formatTransactionAmount(item?.latest_transaction_value)}
              </span>
            </div>
            ({item?.total_ratings_count} Reviews)
          </div>
          {item?.latest_transaction_value && (
            <div className="txn-card-sub-details">
              <div className="stars">
                <span className="rating">{item?.average_rating}</span>
                <StarRating
                  rating={item?.average_rating}
                  width={15}
                  height={15}
                />
              </div>
              <div>Sold on {item?.transaction_date}</div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export function RecentPropertyCardSkeleton() {
  return (
    <div className="recent-property-container">
      <div className="first-part flex">
        <Skeleton className="card-img h-[44px] w-[54px]" />
        <div className="sub-details">
          <Skeleton />
          <Skeleton />
        </div>
      </div>
      <div className="p-sub-details ">
        <div className="flex justify-between w-full">
          <Skeleton className="w-[100px] md:w-[120px]" />
          <Skeleton className="w-[100px] md:w-[120px]" />
        </div>
        <div className="flex justify-between w-full">
          <Skeleton className="w-[100px] md:w-[120px]" />
          <Skeleton className="w-[100px] md:w-[120px]" />
        </div>
      </div>
    </div>
  );
}
