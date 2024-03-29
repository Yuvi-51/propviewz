"use client";
import ProtectedRouteWrapper from "@/components/wrappers/ProtectedRouteWrapper";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "./WriteBlogSection.scss";

export default function WriteBlogSection() {
  const router = useRouter();
  return (
    <ProtectedRouteWrapper
      triggerElement={
        <div className="blog-advertise container">
          <Image
            src="images/blog-advertise.svg"
            alt="img"
            className="advertise"
            width={1300}
            height={200}
          />
          <Image
            src="images/mo-blog-advertise.svg"
            alt="img"
            className="mo-advertise"
            width={800}
            height={200}
          />
        </div>
      }
      callback={() => router.push("/blog/ghost/#/posts")}
    >
      <div className="blog-advertise container">
        <Image
          src="images/blog-advertise.svg"
          alt="img"
          className="advertise"
          width={1300}
          height={200}
          onClick={() => router.push("/blog/ghost/#/posts")}
        />
        <Image
          src="images/mo-blog-advertise.svg"
          alt="img"
          className="mo-advertise"
          width={800}
          height={200}
          onClick={() => router.push("/blog/ghost/#/posts")}
        />
      </div>
    </ProtectedRouteWrapper>
  );
}
