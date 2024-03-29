"use client";
import StarRating from "@/components/ui/dynamic-star";
import { getUserActivityLogsAPI } from "@/connections/get-requests/getUserActivityLogsAPI";
import useAsync from "@/custom/useAsync";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

export default function Blogs() {
  const token = useSelector((state) => state.auth.token);
  const {
    loading,
    error,
    value: blogData,
  } = useAsync(getUserActivityLogsAPI, [], ["Blog", token]);

  return (
    <div className="reviews-and-ratings">
      <div className="carousal-heading">
        <div className="p-heading">
          <h3>Activity / Blogs</h3>
          <div className="trend-line"></div>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-[300px]">
          <ClipLoader color="#f1592a" />
        </div>
      ) : blogData?.length > 0 ? (
        blogData?.map((data) => (
          <div key={data?.id} className="review-rating-box">
            <div className="flex justify-between">
              <div
                className="activity-project-name"
                style={{ cursor: "default" }}
              >
                <span className="static-text"> Added Blog:</span>
                {data?.parameters?.blog_title}
              </div>
              <div
                className={
                  data?.approved === true
                    ? "approved"
                    : data.approved === false
                    ? "declined"
                    : "submitted"
                }
              >
                {data?.approved === true
                  ? "Approved"
                  : data.approved === false
                  ? "Declined"
                  : "Submitted"}
              </div>
            </div>
            <div className="activity-date-time">{data?.created_at}</div>
          </div>
        ))
      ) : (
        <div className="text-center my-[20px]">There is No Blogs Here....</div>
      )}
    </div>
  );
}
