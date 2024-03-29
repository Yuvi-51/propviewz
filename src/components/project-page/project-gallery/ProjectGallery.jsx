"use client";
import { getProjectImagesAPI } from "@/connections/get-requests/getProjectImagesAPI";
import {
  CustomLeftArrow,
  CustomRightArrow,
} from "@/constants/carouselSettings";
import { validateImageUrl } from "@/logic/validation";
import { Camera, ImagePlus, MoreVerticalIcon } from "lucide-react";
import { useEffect, useState } from "react";
import "react-image-gallery/styles/css/image-gallery.css";
import { ClipLoader } from "react-spinners";
import "./ProjectGallery.scss";

import PostPictureModal from "@/components/modal-content/PostPictureModal";
import GalleryImageReportModal from "@/components/modal-content/report-errors/GalleryImageReportModal";
import { Button } from "@/components/ui/button";
import PopOver from "@/components/ui/pop-over";
import { getSingleProjectAPI } from "@/connections/get-requests/getSingleProjectAPI";
import { dummyData } from "@/constants/dummyData";

import { Image } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import Slider from "react-slick";

import ReactGA from "react-ga";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
export default function ProjectGallery({ city, location, slug }) {
  const [image, setImage] = useState([]);
  const [state, setState] = useState();
  const [slidesToShow, setSlidesToShow] = useState(4);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [fullscreenSliderIndex, setFullscreenSliderIndex] = useState(0);
  const [fullscreenSliderVisible, setFullscreenSliderVisible] = useState(false);
  const token = useSelector((state) => state.auth.token);

  const { data: projectData } = useQuery({
    queryKey: ["getSingleProjectAPI", city, location, slug],
    queryFn: () => getSingleProjectAPI(city, location, slug, token),
  });

  const { data: projectApiImages, isLoading: managementLoading } = useQuery({
    queryKey: ["getProjectImagesAPI", projectData?.id, state],
    queryFn: () => getProjectImagesAPI(projectData?.id, state),
  });

  const claimed = projectData?.claimed;

  const projectImages = projectApiImages?.payload?.project_medias;
  const userImageCount = projectApiImages?.meta?.user_count;
  const ManagementImageCount = projectApiImages?.meta?.user_count;
  useEffect(() => {
    let imagesToDisplay = [];

    if (projectImages && projectImages.length >= 5) {
      imagesToDisplay = projectImages;
    } else if (projectImages && projectImages.length > 0) {
      imagesToDisplay = [...projectImages];

      const numDummyImagesToAdd = Math.max(5 - imagesToDisplay.length, 0);

      for (let i = 0; i < numDummyImagesToAdd; i++) {
        imagesToDisplay.push(dummyData[i]);
      }
    } else {
      imagesToDisplay = dummyData.slice(0, 5);
    }

    setImage(imagesToDisplay?.filter((data) => data.link !== null));
  }, [projectData?.id, state, projectImages]);

  useEffect(() => {
    const handleResize = () => {
      const maxWidth = 700; // Maximum width for 3 images
      const windowWidth = window.innerWidth;

      if (windowWidth <= maxWidth) {
        setSlidesToShow(3);
      } else {
        setSlidesToShow(5);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleClickImage = (data) => {

    ReactGA.event({
      category: "User",
      action: "User Clicked on Gallery Image",
      label: "Button Click",
    });
    setFullscreenSliderIndex(data);
    setFullscreenSliderVisible(true);
  };

  const handleCloseFullscreenSlider = () => {
    setFullscreenSliderVisible(false);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleCloseFullscreenSlider();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const slidesToScroll = Math.min(image.length, slidesToShow);

  const settings = {
    slidesToShow: slidesToScroll,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    dots: false,
    nextArrow: <CustomRightArrow />,
    prevArrow: <CustomLeftArrow />,
    centerMode: "true",
    centerPadding: image.length <= 3 ? "10px" : "0",
  };
  const settingsFullscreen = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: true,
    nextArrow: <CustomRightArrow />,
    prevArrow: <CustomLeftArrow />,

    // initialSlide: 0,
  };
  const newImageArray = [fullscreenSliderIndex, ...image];
  const FullscreenImagesUpdatedArray = newImageArray.filter(
    (item, index) => newImageArray.indexOf(item) === index
  );

  useEffect(() => {
    // Set overflow: hidden on body when fullscreenSliderVisible is true
    document.body.style.overflow = fullscreenSliderVisible ? "hidden" : "auto";

    // Cleanup: Reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [fullscreenSliderVisible]);
  return (
    <div className="project-gallery-container container">
      {managementLoading ? (
        <ClipLoader color="#f1592a" />
      ) : (
        <div className="gallery_container">
          <div className="side-div">
            <div
              onClick={() => {
                ReactGA.event({
                  category: "User",
                  action: "User select a Gallery Management Image ",
                  label: "Button Click",
                });
                setState("management");
              }}
              style={{
                backgroundColor: state === "management" ? "#f1592a" : "",
                color: state === "management" ? "white" : "",
              }}
            >
              <Camera /> Management
            </div>
            <div
              onClick={() => {
                ReactGA.event({
                  category: "User",
                  action: "User select a Gallery user Image ",
                  label: "Button Click",
                });
                setState("user");
              }}
              style={{
                backgroundColor: state === "user" ? "#f1592a" : "",
                color: state === "user" ? "white" : "",
              }}
            >
              <Camera /> User
            </div>
            <PostPictureModal
              triggerElement={
                <div className="flex text-[#f1592a] gap-[5px] cursor-pointer p-[3px] hover:bg-[#f1592a] hover:text-white">
                  <ImagePlus />
                  Add Photos
                </div>
              }
              project_id={projectData?.id}
              project_name={projectData?.name}
            />
          </div>
          <div className="gallery-image-div">
            {image?.length && (
              <Slider {...settings}>
                {image
                  // ?.filter((data) => data.link !== null)
                  .map((data, i) => (
                    <div
                      key={i}
                      onClick={() => handleClickImage(data)}
                      className="thumb_div"
                    >
                      <img
                        src={
                          data.link && data.link.startsWith("/images/")
                            ? data.link
                            : validateImageUrl(data.link)
                        }
                        className="thumb_images"
                        alt={`${projectData?.city} ${projectData?.detailed_area} ${projectData?.name} ${data?.title}`}
                      />
                    </div>
                  ))}
              </Slider>
            )}
          </div>
          <div className="side-div-mobile">
            <div
              onClick={() => {
                ReactGA.event({
                  category: "User",
                  action: "User select a Gallery Management Image ",
                  label: "Button Click",
                });
                setState("management");
              }}
              style={{
                backgroundColor: state === "management" ? "#f1592a" : "",
                color: state === "management" ? "white" : "",
              }}
            >
              <Camera
                size={16}
                strokeWidth={2}
                style={{ marginRight: "2px" }}
              />
              Management
            </div>
            <div
              onClick={() => {
                ReactGA.event({
                  category: "User",
                  action: "User select a Gallery User Image ",
                  label: "Button Click",
                });
                setState("user");
              }}
              style={{
                backgroundColor: state === "user" ? "#f1592a" : "",
                color: state === "user" ? "white" : "",
              }}
            >
              <Camera
                size={16}
                strokeWidth={2}
                style={{ marginRight: "2px" }}
              />
              User
            </div>
            <PostPictureModal
              triggerElement={
                <div className="flex text-[#f1592a] gap-[2px] cursor-pointer p-[3px] hover:bg-[#e7e0e0]">
                  <ImagePlus size={16} strokeWidth={2} />
                  Add Photos
                </div>
              }
              project_id={projectData?.id}
              project_name={projectData?.name}
            />
          </div>
          <div
            className={
              fullscreenSliderVisible ? "fullscreen-container " : "hidden"
            }
          >
            {image?.length && (
              <Slider className="slider-container" {...settingsFullscreen}>
                {FullscreenImagesUpdatedArray.map(
                  (data, i) => (
                    // i !== 0 && (
                    <div className="second-div-image" key={i}>
                      <div className="fullscreen-content">
                        <div className="fullscreen_image_container">
                          <Image
                            src={
                              data.link && data.link.startsWith("/images/")
                                ? data.link
                                : validateImageUrl(data.link)
                            }
                            className="fullscreen-image"
                            alt={`${projectData?.city}-${projectData?.detailed_area}-${projectData?.name} ${data?.title}`}
                          />
                          <div
                            className={
                              data.given_by ? "fullscreen_title" : "hidden"
                            }
                          >
                            {data?.publisher || data?.given_by} /{" "}
                            {data.title || "Not Mentioned"}
                            <div
                              style={{ fontSize: "14px", textAlign: "left" }}
                            >
                              Date : {data.created_at}
                            </div>
                          </div>
                        </div>
                        {data.link !== "/images/propviewz_dummy_image.jpeg" && (
                          <div className="image-report-btn">
                            <PopOver
                              trigger={
                                <MoreVerticalIcon
                                  color="#ffffff"
                                  size={22}
                                  className="inline cursor-pointer"
                                />
                              }
                              isModalOpen={isModalOpen}
                            >
                              {(closeDropdown) => (
                                <div className="absolute bg-white mt-1 drop-shadow-xl w-max whitespace-nowrap right-0 rounded-md">
                                  <GalleryImageReportModal
                                    projectName={projectData?.name}
                                    projectId={projectData?.id}
                                    activeImageDetails={data}
                                    claimed={claimed}
                                    triggerElement={
                                      <Button className="bg-white text-black hover:text-white">
                                        {claimed === true &&
                                        data.given_by === "management"
                                          ? "Edit Image Details"
                                          : "Report Incorrect"}
                                      </Button>
                                    }
                                    callback={closeDropdown}
                                    setIsModalOpen={setIsModalOpen}
                                  />
                                </div>
                              )}
                            </PopOver>
                          </div>
                        )}
                        <div
                          className="close-button"
                          onClick={handleCloseFullscreenSlider}
                        >
                          ⨉
                        </div>
                      </div>
                    </div>
                  )
                  // )
                )}
              </Slider>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
