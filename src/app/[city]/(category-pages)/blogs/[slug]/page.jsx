"use client";
import BlogSlider from "@/components/property-slider/BlogSlider";
import { getSingleBlogAPI } from "@/connections/get-requests/getBlogDetailsAPI";
import { validateImageUrl } from "@/logic/validation";
import { useQuery } from "@tanstack/react-query";
import { UserCircle2Icon } from "lucide-react";
import Link from "next/link";
import "./SingleBlogPage.scss";

export default function SingleBlogPage({ params }) {
  const { data: blogDetails } = useQuery({
    queryKey: ["getSingleBlogAPI"],
    queryFn: () => getSingleBlogAPI(params?.slug),
  });

  return (
    <main className="showBlogs">
      <div>
        <div>
          <div className="blue-background">
            <h3 className="main-title">{blogDetails?.title}</h3>
            <img
              src={validateImageUrl(blogDetails?.link)}
              alt="img"
              className="blog-img"
            />
          </div>
        </div>

        <div className="blog-text container">
          <div className="flex justify-between">
            <div className="flex items-center gap-[10px]">
              <div>
                <UserCircle2Icon size={50} />
              </div>
              <div className="creator-details">
                <p className="creator-name">{blogDetails?.publisher}</p>
                <p className="created-date">{blogDetails?.created_at}</p>
              </div>
            </div>
            <div className="social-icons">
              <p className="follow-us">Follow us :</p>
              <div className="icons">
                <Link
                  href="https://www.facebook.com/propviewz/?modal=admin_todo_tour"
                  target="_blank"
                >
                  <img
                    src="/images/Facebook Fill.svg"
                    aria-hidden="true"
                    href="/"
                    alt=""
                  ></img>
                </Link>
                <Link
                  href="https://www.linkedin.com/company/68974999/"
                  target="_blank"
                >
                  <img
                    src="/images/Linkedin Fill.svg"
                    aria-hidden="true"
                    href="/"
                    alt=""
                  ></img>
                </Link>
                <Link
                  href="https://www.instagram.com/propviewz/"
                  target="_blank"
                >
                  <img
                    src="/images/Instagram Fill.svg"
                    aria-hidden="true"
                    href="/"
                    alt=""
                  ></img>
                </Link>
                <Link href="https://twitter.com/propviewz" target="_blank">
                  <img
                    src="/images/Twitter Fill.svg"
                    aria-hidden="true"
                    href="/"
                    alt=""
                  ></img>
                </Link>
              </div>
            </div>
          </div>
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{
              __html: blogDetails?.text,
            }}
          />
        </div>
        <div className="related-blogs">
          <BlogSlider
            isSimilarBlog={true}
            blogSlug={params?.slug}
            ViewAllLink={"/blogs"}
            heading={"Other Blogs"}
          />
        </div>
      </div>
    </main>
  );
}
