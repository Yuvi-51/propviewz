"use client";
import useMediaQuery from "@/custom/useMediaQuery";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function ProjectHeaderLogo() {
  const isSmallDevice = useMediaQuery("(max-width: 768px)");

  return (
    <Link href="/" shallow>
      <Image
        src={
          isSmallDevice
            ? "/images/only eye.svg"
            : "/images/Propviewz_logo_black.svg"
        }
        alt="propviewz-logo"
        priority={false}
        height={40}
        width={isSmallDevice ? 40 : 138}
      />
    </Link>
  );
}
