// "use client";
import { createPropertyHref } from "@/logic/conversions";
import {
  formatTotalImpressions,
  formatTransactionAmount,
} from "@/logic/format-transaction-amount";
import { validateImageUrl } from "@/logic/validation";
import Link from "next/link";
import StarRating from "../ui/dynamic-star";
import "./PropertyCard.scss";

export default function OtherPropertyCard({ item }) {
  return (
    <Link
      href={createPropertyHref(item.city_id, item.location_slug, item.slug)}
    >
      <div className="other-property-container">
        <div className="property-tag">
          <img
            className="eye"
            src="/images/fi_eye.svg"
            alt="eye"
            width={25}
            height={25}
          />
          {formatTotalImpressions(item?.total_impressions)}
        </div>
        <img
          alt={
            item?.thumbnail_title &&
            `${item?.city_name}-${item?.detailed_area}-${item?.thumbnail_title}`
          }
          className="carousal_img"
          src={
            item?.thumbnail
              ? `${validateImageUrl(item?.thumbnail)}`
              : "images/img_alt.svg"
          }
        />
        <div className="details">
          <div className="sub-details">
            <div className="p-name">{item?.name}</div>
            <p className="p-reviews">({item?.total_ratings_count} Reviews)</p>
          </div>
          <div className="p-sub-details">
            <p className="l-name">{item?.detailed_area}</p>
            <div className="stars">
              <span className="rating">{item?.average_rating}</span>
              <StarRating
                rating={item?.average_rating}
                width={15}
                height={15}
              />
            </div>
          </div>
          <div
            className={
              item?.latest_transaction_value ? "p-txn-details" : "hidden"
            }
          >
            <div className="txn-name">
              {item?.configuration?.length > 13
                ? `${item?.configuration.split("").splice(0, 10).join("")}...`
                : item?.configuration}{" "}
              Sold @{" "}
              <span className="txn-value">
                ₹{formatTransactionAmount(item?.latest_transaction_value)}
              </span>
            </div>
            <div className="txn-reviews"> {item?.transaction_date}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
