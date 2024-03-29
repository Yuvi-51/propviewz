"use client";
import React from "react";
import "../privacy-policy/PrivacyPolicy.scss";
import { getUsefulLinksAPI } from "@/connections/get-requests/getUsefulLinksAPI";
import { ClipLoader } from "react-spinners";
import { useQuery } from "@tanstack/react-query";

export default function TermsOfUsePage() {
  const { data: content } = useQuery({
    queryKey: ["getUsefulLinksAPI"],
    queryFn: () => getUsefulLinksAPI(),
  });

  return (
    <main className="useful-link">
      {!content ? (
        <div className="loader-div">
          <ClipLoader color="#f1592a" />
        </div>
      ) : (
        <>
          <div className="heading-div">
            <div className="heading">{content[1]?.title}</div>
          </div>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: content[1]?.details }}
          ></div>
        </>
      )}
    </main>
  );
}
