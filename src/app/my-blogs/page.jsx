import CreateBlog from "@/components/my-blog-page/CreateBlog";
import DraftBlog from "@/components/my-blog-page/DraftBlog";
import InProcessBlog from "@/components/my-blog-page/InProcessBlog";
import PublishedBlog from "@/components/my-blog-page/PublishedBlog";
import React from "react";
import "./my-blogs.scss";

export default async function MyBlogPage({ searchParams }) {
  const { type } = searchParams;
  return (
    <main>
      {type === "draft" ? (
        <DraftBlog />
      ) : type === "in-process" ? (
        <InProcessBlog />
      ) : type === "published" ? (
        <PublishedBlog />
      ) : (
        <CreateBlog />
      )}
    </main>
  );
}
