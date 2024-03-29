"use client";
import { getBlogStatusAPI } from "@/connections/get-requests/getBlogDetailsAPI";
import useAsync from "@/custom/useAsync";
import { paginationRenderItem } from "@/logic/paginationRenderItem";
import { Pagination } from "@nextui-org/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import BlogCard from "../property-card/BlogCard";

export default function PublishedBlog() {
  const token = useSelector((state) => state.auth.token);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    loading,
    error,
    value: publishedBlogDetails,
  } = useAsync(getBlogStatusAPI, [], ["published", token, currentPage]);

  return (
    <div className="draft-blog-container">
      <div className="carousal-heading">
        <div className="p-heading">
          <h3>My Blogs / Published</h3>
          <div className="trend-line"></div>
        </div>
      </div>
      {publishedBlogDetails?.blogs?.length ? (
        <>
          <div className="grid-container">
            {publishedBlogDetails?.blogs?.map((el) => (
              <BlogCard key={el.id} item={el} isPublished={true} />
            ))}
          </div>
          {publishedBlogDetails?.blogs?.length > 12 && (
            <div className="my-[20px] flex justify-end">
              <Pagination
                disableCursorAnimation
                showControls
                total={Math.ceil(publishedBlogDetails?.total / 12)}
                page={currentPage}
                onChange={(selectedPage) => setCurrentPage(selectedPage)}
                radius="full"
                renderItem={paginationRenderItem}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center my-[20px]">There is No blog Here....</div>
      )}
    </div>
  );
}
