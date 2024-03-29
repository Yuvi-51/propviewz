"use client";
import { getBlogStatusAPI } from "@/connections/get-requests/getBlogDetailsAPI";
import useAsync from "@/custom/useAsync";
import { paginationRenderItem } from "@/logic/paginationRenderItem";
import { Pagination } from "@nextui-org/react";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";
import BlogCard from "../property-card/BlogCard";

export default function DraftBlog() {
  const token = useSelector((state) => state.auth.token);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    loading,
    error,
    value: draftBlogDetails,
  } = useAsync(getBlogStatusAPI, [], ["draft", token, currentPage]);

  console.log(draftBlogDetails?.blogs);

  return (
    <div className="draft-blog-container">
      <div className="carousal-heading">
        <div className="p-heading">
          <h3>My Blogs / Draft</h3>
          <div className="trend-line"></div>
        </div>
      </div>
      {draftBlogDetails?.blogs?.length ? (
        <>
          <div className="grid-container">
            {draftBlogDetails?.blogs?.map((el) => (
              <Link
                key={el.id}
                href={`/my-blogs?type=create&title=${el.title}&image=${
                  el.link
                }&description=${encodeURIComponent(el.text)}&slug=${el.slug}`}
              >
                <BlogCard item={el} clickable={false} />
              </Link>
            ))}
          </div>
          {draftBlogDetails?.blogs?.length > 12 && (
            <div className="my-[20px] flex justify-end">
              <Pagination
                disableCursorAnimation
                showControls
                total={Math.ceil(draftBlogDetails?.total / 12)}
                onChange={(selectedPage) => setCurrentPage(selectedPage)}
                page={currentPage}
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
