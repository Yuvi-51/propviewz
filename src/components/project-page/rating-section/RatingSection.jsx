"use client";
import StarRating from "@/components/ui/dynamic-star";
import { getSingleProjectAPI } from "@/connections/get-requests/getSingleProjectAPI";
import { setInView } from "@/store/slices/projectSlice";
import { Box, CircularProgress, circularProgressClasses } from "@mui/material";
import { Progress } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./RatingSection.scss";

export default function RatingSection({ city, location, slug }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const sectionRef = useRef();

  const { data: projectData } = useQuery({
    queryKey: ["getSingleProjectAPI", city, location, slug],
    queryFn: () => getSingleProjectAPI(city, location, slug, token),
  });

  const isInView = useInView(sectionRef, { margin: "400px 0px 0px 0px" });

  useEffect(() => {
    if (isInView === true) {
      dispatch(setInView("ratings"));
    }
  }, [isInView]);

  return (
    <div className="rating container" id="ratings" ref={sectionRef}>
      <div className="carousal-heading">
        <div className="p-heading">
          <div>
            <h3>Ratings</h3>
          </div>
          <div>
            <p className="trend-line"></p>
          </div>
        </div>
      </div>
      <div className="main-div">
        <div className="first-div">
          <div className="stars">
            <span>{projectData?.average_rating}</span>
            <StarRating rating={projectData?.average_rating} />
            <span className="stars-review">
              ({projectData?.total_ratings_count} Reviews)
            </span>
          </div>
          <div className="bar-rating-div">
            <div className="bar-rating">
              <p>
                5 <img src="/images/material-symbols_star.svg" alt="" />
              </p>
              <div className="custom-progress">
                <Progress
                  color="warning"
                  aria-label="Loading..."
                  value={projectData?.rating5}
                  maxValue={projectData?.total_ratings_count}
                />
              </div>
              <p>{projectData?.rating5}</p>
            </div>
            <div className="bar-rating">
              <p>
                4 <img src="/images/material-symbols_star.svg" alt="" />
              </p>
              <div className="custom-progress">
                <Progress
                  color="warning"
                  aria-label="Loading..."
                  value={projectData?.rating4}
                  maxValue={projectData?.total_ratings_count}
                />
              </div>
              <p>{projectData?.rating4}</p>
            </div>
            <div className="bar-rating">
              <p>
                3 <img src="/images/material-symbols_star.svg" alt="" />
              </p>
              <div className="custom-progress">
                <Progress
                  color="warning"
                  aria-label="Loading..."
                  value={projectData?.rating3}
                  maxValue={projectData?.total_ratings_count}
                />
              </div>
              <p>{projectData?.rating3}</p>
            </div>
            <div className="bar-rating">
              <p>
                2 <img src="/images/material-symbols_star.svg" alt="" />
              </p>
              <div className="custom-progress">
                <Progress
                  color="warning"
                  aria-label="Loading..."
                  value={projectData?.rating2}
                  maxValue={projectData?.total_ratings_count}
                />
              </div>
              <p>{projectData?.rating2}</p>
            </div>
            <div className="bar-rating">
              <p>
                1{" "}
                <img
                  className="extra-space"
                  src="/images/material-symbols_star.svg"
                  alt=""
                />
              </p>
              <div className="custom-progress">
                <Progress
                  color="warning"
                  aria-label="Loading..."
                  value={projectData?.rating1}
                  maxValue={projectData?.total_ratings_count}
                />
              </div>
              <p>{projectData?.rating1}</p>
            </div>
          </div>
        </div>
        <div className="second-div">
          <div>
            <div className="centered">
              <Box sx={{ position: "relative" }}>
                <CircularProgress
                  variant="determinate"
                  className="circular-ratings"
                  sx={{
                    color: (theme) =>
                      theme.palette.grey[
                        theme.palette.mode === "light" ? 200 : 800
                      ],
                  }}
                  thickness={4}
                  value={100}
                />
                <CircularProgress
                  className="circular-rating"
                  variant="determinate"
                  sx={{
                    color: (theme) =>
                      theme.palette.mode === "light" ? "#ffbc00" : "#ffbc00",

                    position: "absolute",
                    left: 0,
                    [`& .${circularProgressClasses.circle}`]: {
                      strokeLinecap: "round",
                    },
                  }}
                  value={projectData?.location_rating * 20}
                />
              </Box>
              <span className="inner-value">
                {projectData?.location_rating}
              </span>
            </div>
            <p className="rating-value">Location</p>
          </div>
          <div>
            <div className="centered">
              <Box sx={{ position: "relative" }}>
                <CircularProgress
                  variant="determinate"
                  className="circular-ratings"
                  sx={{
                    color: (theme) =>
                      theme.palette.grey[
                        theme.palette.mode === "light" ? 200 : 800
                      ],
                  }}
                  thickness={4}
                  value={100}
                />
                <CircularProgress
                  className="circular-rating"
                  variant="determinate"
                  sx={{
                    color: (theme) =>
                      theme.palette.mode === "light" ? "#ffbc00" : "#ffbc00",

                    position: "absolute",
                    left: 0,
                    [`& .${circularProgressClasses.circle}`]: {
                      strokeLinecap: "round",
                    },
                  }}
                  value={projectData?.amenities_rating * 20}
                />
              </Box>
              <span className="inner-value">
                {projectData?.amenities_rating}
              </span>
            </div>
            <p className="rating-value">Amenities</p>
          </div>
          <div>
            <div className="centered">
              <Box sx={{ position: "relative" }}>
                <CircularProgress
                  variant="determinate"
                  className="circular-ratings"
                  sx={{
                    color: (theme) =>
                      theme.palette.grey[
                        theme.palette.mode === "light" ? 200 : 800
                      ],
                  }}
                  thickness={4}
                  value={100}
                />
                <CircularProgress
                  className="circular-rating"
                  variant="determinate"
                  sx={{
                    color: (theme) =>
                      theme.palette.mode === "light" ? "#ffbc00" : "#ffbc00",

                    position: "absolute",
                    left: 0,
                    [`& .${circularProgressClasses.circle}`]: {
                      strokeLinecap: "round",
                    },
                  }}
                  value={projectData?.floor_plan_rating * 20}
                />
              </Box>
              <span className="inner-value">
                {projectData?.floor_plan_rating}
              </span>
            </div>
            <p className="rating-value">Layout Planning</p>
          </div>
          <div>
            <div className="centered">
              <Box sx={{ position: "relative" }}>
                <CircularProgress
                  variant="determinate"
                  className="circular-ratings"
                  sx={{
                    color: (theme) =>
                      theme.palette.grey[
                        theme.palette.mode === "light" ? 200 : 800
                      ],
                  }}
                  thickness={4}
                  value={100}
                />
                <CircularProgress
                  className="circular-rating"
                  variant="determinate"
                  sx={{
                    color: (theme) =>
                      theme.palette.mode === "light" ? "#ffbc00" : "#ffbc00",

                    position: "absolute",
                    left: 0,
                    [`& .${circularProgressClasses.circle}`]: {
                      strokeLinecap: "round",
                    },
                  }}
                  value={projectData?.customer_service_rating * 20}
                />
              </Box>
              <span className="inner-value">
                {projectData?.customer_service_rating}
              </span>
            </div>
            <p className="rating-value">Customer Service</p>
          </div>
          <div>
            <div className="centered">
              <Box sx={{ position: "relative" }}>
                <CircularProgress
                  variant="determinate"
                  className="circular-ratings"
                  sx={{
                    color: (theme) =>
                      theme.palette.grey[
                        theme.palette.mode === "light" ? 200 : 800
                      ],
                  }}
                  thickness={4}
                  value={100}
                />

                <CircularProgress
                  className="circular-rating"
                  variant="determinate"
                  sx={{
                    color: (theme) =>
                      theme.palette.mode === "light" ? "#ffbc00" : "#ffbc00",

                    position: "absolute",
                    left: 0,
                    [`& .${circularProgressClasses.circle}`]: {
                      strokeLinecap: "round",
                    },
                  }}
                  value={projectData?.value_for_money_rating * 20}
                />
              </Box>
              <span className="inner-value">
                {projectData?.value_for_money_rating}
              </span>
            </div>
            <p className="rating-value">Value for Money</p>
          </div>
        </div>
      </div>
    </div>
  );
}
