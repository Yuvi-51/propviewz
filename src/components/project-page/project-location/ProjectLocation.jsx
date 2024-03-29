"use client";
import ClaimProjectModal from "@/components/modal-content/ClaimProjectModal";
import LocationReportModal from "@/components/modal-content/report-errors/LocationReportModal";
import { Button } from "@/components/ui/button";
import PopOver from "@/components/ui/pop-over";
import { getExistingProjectClaimsAPI } from "@/connections/get-requests/getExistingProjectClaimsAPI";
import { getSingleProjectAPI } from "@/connections/get-requests/getSingleProjectAPI";
import useAsync from "@/custom/useAsync";
import { setInView } from "@/store/slices/projectSlice";
import { useQuery } from "@tanstack/react-query";
import { useInView } from "framer-motion";
import { MoreVerticalIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./ProjectLocation.scss";

export default function ProjectLocation({ city, location, slug }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [toggleExistingProjectClaims, setToggleExistingProjectClaims] =
    useState(false);

  const { data: projectData } = useQuery({
    queryKey: ["getSingleProjectAPI", city, location, slug],
    queryFn: () => getSingleProjectAPI(city, location, slug, token),
  });

  const {
    loading: projectLoading,
    error: projectError,
    value: projectClaims,
  } = useAsync(
    getExistingProjectClaimsAPI,
    [toggleExistingProjectClaims],
    [projectData?.id, token]
  );

  const claimed = projectData?.claimed;

  const ref = useRef(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (isInView === true) {
      dispatch(setInView("location"));
    }
  }, [isInView]);

  return (
    <div className="location_container container" id="location" ref={ref}>
      {!projectClaims && (
        <div className="project-info-card">
          <div className="project-claimers text-center">
            <h4 className="text-[18px]">Are you the owner or builder?</h4>
            <ClaimProjectModal
              projectId={projectData?.id}
              project_name={projectData?.name}
              setToggleExistingProjectClaims={setToggleExistingProjectClaims}
              triggerElement={
                <button className="btn-claim">Claim this project</button>
              }
            />
          </div>
        </div>
      )}
      {projectClaims && (
        <div className="project-info-card">
          <div className="project-claimer text-center">
            <h6>{projectClaims}</h6>
          </div>
        </div>
      )}
      <div className="carousal-heading" ref={ref}>
        <div className="p-heading">
          <div>
            <h3>Location</h3>
          </div>
          <div>
            <p className="trend-line"></p>
          </div>
        </div>

        <PopOver
          trigger={
            <MoreVerticalIcon size={22} className="inline cursor-pointer" />
          }
          isModalOpen={isModalOpen}
        >
          {(closeDropdown) => (
            <div className="absolute bg-white mt-1 drop-shadow-xl w-max whitespace-nowrap right-0 rounded-md">
              <LocationReportModal
                projectName={projectData?.name}
                project_id={projectData?.id}
                iFrameLink={projectData?.google_map_link}
                claimed={claimed}
                triggerElement={
                  claimed === true ? (
                    <Button className="bg-white text-black hover:text-white">
                      Edit Location Details
                    </Button>
                  ) : (
                    <Button className="bg-white text-black hover:text-white">
                      Report Incorrect
                    </Button>
                  )
                }
                setIsModalOpen={setIsModalOpen}
              />
            </div>
          )}
        </PopOver>
      </div>
      <div>
        <iframe
          src={projectData?.google_map_link}
          className="map-container"
          title="f"
        ></iframe>
      </div>
    </div>
  );
}
