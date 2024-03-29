"use client";
import OtherPropertyCard from "@/components/property-card/OtherPropertyCard";
import { getMyFavouritesAPI } from "@/connections/get-requests/getMyFavouritesAPI";
import useAsync from "@/custom/useAsync";
import { paginationRenderItem } from "@/logic/paginationRenderItem";
import { Pagination } from "@nextui-org/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

export default function MyFavourites() {
  const token = useSelector((state) => state.auth.token);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    loading,
    error,
    value: myFavouritesData,
  } = useAsync(getMyFavouritesAPI, [], [currentPage, token]);

  return (
    <div className="reviews-and-ratings">
      <div className="carousal-heading">
        <div className="p-heading">
          <h3>Activity / My Favourites</h3>
          <div className="trend-line"></div>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-[300px]">
          <ClipLoader color="#f1592a" />
        </div>
      ) : myFavouritesData?.payload?.projects?.length > 0 ? (
        <>
          <div className="grid-container">
            {myFavouritesData?.payload?.projects?.map((el) => (
              <OtherPropertyCard item={el} key={el.project_id} />
            ))}
          </div>
          {Math.ceil(myFavouritesData?.meta?.meta?.total / 9) > 1 && (
            <div className="my-[20px] flex justify-end">
              <Pagination
                disableCursorAnimation
                showControls
                total={Math.ceil(myFavouritesData?.meta?.meta?.total / 9)}
                initialPage={currentPage}
                onChange={(selectedPage) => setCurrentPage(selectedPage)}
                radius="full"
                renderItem={paginationRenderItem}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center my-[20px]">
          There is No Favourites Here....
        </div>
      )}
    </div>
  );
}
