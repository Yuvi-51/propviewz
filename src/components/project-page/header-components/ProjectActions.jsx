"use client";
import { useToast } from "@/components/ui/use-toast";
import ProtectedRouteWrapper from "@/components/wrappers/ProtectedRouteWrapper";
import { getSingleProjectAPI } from "@/connections/get-requests/getSingleProjectAPI";
import { postProjectFavouriteAPI } from "@/connections/post-requests/postProjectFavouriteAPI";
import { useQuery } from "@tanstack/react-query";
import { HeartIcon, MilestoneIcon, Share2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import ReactGA from "react-ga";
import { useSelector } from "react-redux";

export default function ProjectActions({ city, location, slug }) {
  const { user } = useSelector((store) => store.user);
  const token = useSelector((state) => state.auth.token);
  const [isFavourite, setIsFavourite] = useState(false);
  const { toast } = useToast();

  const { data: projectDetails } = useQuery({
    queryKey: ["getSingleProjectAPI", city, location, slug],
    queryFn: () => getSingleProjectAPI(city, location, slug, token),
  });

  useEffect(() => {
    if (projectDetails?.favourite) setIsFavourite(true);
  }, [projectDetails?.favourite]);

  const handleProjectFavorite = async (empty, callbackToken) => {
    ReactGA.event({
      category: "User",
      action: "User added project as a  favorite",
      label: "Button Click",
    });
    const favouriteObject = {
      project_id: projectDetails?.id,
      user_id: user?.id,
    };
    try {
      const isFavouriteRes = await postProjectFavouriteAPI(
        favouriteObject,
        callbackToken || token
      );
      if (isFavouriteRes?.status === "created") {
        setIsFavourite(true);
        toast({
          variant: "success",
          title: "Added to favorites",
        });
      } else if (isFavouriteRes?.status === "deleted") {
        setIsFavourite(false);
        toast({
          variant: "destructive",
          title: "Removed from favorites",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: "Please try after some time",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try after some time",
      });
    }
  };

  useEffect(() => {
    if (projectDetails?.favourite) {
      setIsFavourite(true);
    }
  }, [projectDetails?.favourite]);

  const handleShareProject = async () => {
    ReactGA.event({
      category: "User",
      action: "User shared project",
      label: "Button Click",
    });
    try {
      const url = window.location.href;
      await navigator.share({
        title: "Share Review",
        url,
      });
    } catch (error) {
      console.error("Error sharing review:", error);
    }
  };
  return (
    <div className="project-action-icons">
      <ProtectedRouteWrapper
        triggerElement={
          <div>
            <HeartIcon size={25} fill={isFavourite ? "#f1592a" : "white"} />
          </div>
        }
        callback={handleProjectFavorite}
      >
        <div>
          <HeartIcon
            size={25}
            onClick={handleProjectFavorite}
            fill={isFavourite === true ? "#f1592a" : "white"}
          />
        </div>
      </ProtectedRouteWrapper>
      <div>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
            projectDetails?.name + projectDetails?.detailed_area
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MilestoneIcon size={25} />
        </a>
      </div>
      <div>
        <Share2Icon size={25} onClick={handleShareProject} />
      </div>
    </div>
  );
}
