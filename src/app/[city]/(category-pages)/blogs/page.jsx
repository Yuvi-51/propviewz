"use client";
import React, { useState } from "react";
import "../category-page.scss";
import { getBlogDetailsAPI } from "@/connections/get-requests/getBlogDetailsAPI";
import BlogCard from "@/components/property-card/BlogCard";
import { useQuery } from "@tanstack/react-query";
import { Pagination } from "@nextui-org/react";
import { paginationRenderItem } from "@/logic/paginationRenderItem";
import PropertyCardSkeleton from "@/components/property-card/PropertyCardSkeleton";

export default function Blogs() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: blogDetails, isLoading } = useQuery({
    queryKey: ["getBlogDetailsAPI", currentPage],
    queryFn: () => getBlogDetailsAPI(currentPage),
  });

  return (
    <main className="most-trending-main-container">
      <div className="carousal-heading">
        <div className="p-heading">
          <h3>Blogs</h3>
          <div className="trend-line"></div>
        </div>
      </div>
      <div className="grid-container">
        {isLoading
          ? Array(12)
              .fill(null)
              .map((el, id) => <PropertyCardSkeleton key={id} />)
          : blogDetails?.blogs?.map((el) => (
              <BlogCard item={el} key={el.id} isPublished={true} />
            ))}
      </div>
      <div className="my-[20px] flex justify-end">
        <Pagination
          disableCursorAnimation
          showControls
          // isCompact
          total={Math.ceil(blogDetails?.count / 12)}
          initialPage={1}
          onChange={(selectedPage) => setCurrentPage(selectedPage)}
          radius="full"
          renderItem={paginationRenderItem}
        />
      </div>
    </main>
  );
}
