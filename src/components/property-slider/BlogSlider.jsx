"use client";
import {
  getBlogDetailsAPI,
  getSimilarBlogsAPI,
} from "@/connections/get-requests/getBlogDetailsAPI";
import { otherCarouselSettings } from "@/constants/carouselSettings";
import useAsync from "@/custom/useAsync";
import Link from "next/link";
import "react-image-gallery/styles/css/image-gallery.css";
import Slider from "react-slick";
import BlogCard from "../property-card/BlogCard";
import PropertyCardSkeleton from "../property-card/PropertyCardSkeleton";

export default function BlogSlider({
  isSimilarBlog = false,
  blogSlug,
  heading,
  ViewAllLink,
}) {
  const {
    loading: blogDetailsLoading,
    error: blogDetailsError,
    value: blogDetails,
  } = useAsync(getBlogDetailsAPI, [], []);

  const {
    loading: similarBlogDetailsLoading,
    error: similarBlogDetailsError,
    value: similarBlogDetails,
  } = useAsync(getSimilarBlogsAPI, [], [blogSlug]);

  return (
    <div className="main-container">
      <div className="carousal-heading">
        <div className="p-heading">
          <h3>{heading}</h3>
          <div className="trend-line"></div>
        </div>
        <Link href={ViewAllLink} className="see-more" shallow>
          View All
        </Link>
      </div>
      {isSimilarBlog ? (
        <Slider {...otherCarouselSettings}>
          {similarBlogDetailsLoading
            ? Array(3)
                .fill(null)
                .map((el) => <PropertyCardSkeleton key={el} />)
            : similarBlogDetails?.map((el) => (
                <BlogCard item={el} key={el.id} />
              ))}
        </Slider>
      ) : (
        <Slider {...otherCarouselSettings}>
          {blogDetailsLoading
            ? Array(3)
                .fill(null)
                .map((el) => <PropertyCardSkeleton key={el} />)
            : blogDetails?.blogs?.map((el) => (
                <BlogCard item={el} key={el.id} />
              ))}
        </Slider>
      )}
    </div>
  );
}
