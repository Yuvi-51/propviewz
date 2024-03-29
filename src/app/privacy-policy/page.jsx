"use client";
import { getUsefulLinksAPI } from "@/connections/get-requests/getUsefulLinksAPI";
import "./PrivacyPolicy.scss";
import { ClipLoader } from "react-spinners";
import { useQuery } from "@tanstack/react-query";

export default function PrivacyPolicyPage() {
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
            <div className="heading">{content[0]?.title}</div>
          </div>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: content[0]?.details }}
          ></div>
        </>
      )}
    </main>
  );
}
