"use client";
import "../privacy-policy/PrivacyPolicy.scss";
import { getUsefulLinksAPI } from "@/connections/get-requests/getUsefulLinksAPI";
import { useQuery } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";

export default function refundCancellationPage() {
  const { data: content } = useQuery({
    queryKey: ["getUsefulLinksAPI"],
    queryFn: () => getUsefulLinksAPI(),
  });
  console.log("content", content);
  return (
    <main className="useful-link">
      {!content ? (
        <div className="loader-div">
          <ClipLoader color="#f1592a" />
        </div>
      ) : (
        <>
          <div className="heading-div">
            <div className="heading">{content[2]?.title}</div>
          </div>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: content[2]?.details }}
          ></div>
        </>
      )}
    </main>
  );
}
