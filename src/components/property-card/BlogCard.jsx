"use client";
import { validateImageUrl } from "@/logic/validation";
import { Card } from "@nextui-org/react";
import Link from "next/link";
import "./PropertyCard.scss";

export default function BlogCard({
  item,
  clickable = true,
  isPublished = false,
}) {
  return clickable ? (
    <Link href={`/blogs/${item.slug}`}>
      <Card className="other-property-container" isPressable>
        <img
          className="carousal_img z-0"
          src={
            item?.link
              ? `${validateImageUrl(item?.link)}`
              : "/assets/seo/og-image.png"
          }
          alt={item?.title}
        />
        <div className="blog-details w-full">
          <div className="blog-para">{item?.title}</div>
          <div className="blog-footer-details">
            <p className="user-img">
              <img src="/images/fi_user.svg" alt={item?.title} />
              {item?.publisher}
            </p>
            <p className="calender">
              <img src="/images/fi_calendar.svg" alt={item?.title} />
              {isPublished ? item?.published_at : item?.created_at}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  ) : (
    <Card className="other-property-container" isPressable>
      <img
        className="carousal_img z-0"
        src={
          item?.link
            ? `${validateImageUrl(item?.link)}`
            : "/assets/seo/og-image.png"
        }
        alt={item?.title}
      />
      <div className="blog-details w-full">
        <div className="blog-para">{item?.title}</div>
        <div className="blog-footer-details">
          <p className="user-img">
            <img src="/images/fi_user.svg" alt={item?.title} />
            {item?.publisher}
          </p>
          <p className="calender">
            <img src="/images/fi_calendar.svg" alt={item?.title} />
            {item?.created_at}
          </p>
        </div>
      </div>
    </Card>
  );
}
