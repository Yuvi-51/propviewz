import LocationSearch from "@/components/project-&-location-search/LocationSearch";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import ModalWrapper from "@/components/wrappers/ModalWrapper";
import ProtectedRouteWrapper from "@/components/wrappers/ProtectedRouteWrapper";
import { postProjectErrorReportAPI } from "@/connections/post-requests/postProjectErrorReportAPI";
import { extractLatLngFromGoogleMapsLink } from "@/logic/extractLatLang";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ScaleLoader from "react-spinners/ScaleLoader";
import SuccessInfoModal from "../SuccessInfoModal";
import "./LocationReportModal.scss";

import ReactGA from "react-ga";

export default function LocationReportModal({
  project_id,
  projectName,
  triggerElement,
  iFrameLink,
  claimed,
  setIsModalOpen,
}) {
  const token = useSelector((state) => state.auth.token);
  const [modalState, setModalState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [center, setCenter] = useState({});
  const [zoom, setZoom] = useState(16);
  const [map, setMap] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const newGoogleMapLink = `https://maps.google.com/?q=${center.lat},${center.lng}`;

  useEffect(() => {
    setCenter(extractLatLngFromGoogleMapsLink(iFrameLink));
  }, []);

  const onLoad = (map) => {
    setMap(map);
  };

  const handleSetLocationIdAndName = (id, area) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: area }, (results, status) => {
      if (status === "OK") {
        const location = results[0].geometry.location.toJSON();
        const marker = new window.google.maps.Marker({
          position: location,
          map: map, // Replace "map" with your map object
          title: area, // Optional title for the marker
          draggable: true,
        });

        setCenter(results[0].geometry.location.toJSON());
        setIsError(false);
        marker.addListener("dragend", () => {
          const position = marker.getPosition();

          setCenter(position.toJSON());
        });
        setZoom(15);
      } else {
        console.error(`Geocode failed: ${status}`);
      }
    });
  };

  const submitHandler = () => {
    ReactGA.event({
      category: "User",
      action: "User Clicked on LocationReportError",
      label: "Button Click",
    });
    const payload = {
      report_error: {
        reportable_type: "Project",
        reportable_id: project_id,
        issue_type: `${projectName}, Suggest an edit- Map Link`,
        comments: {
          newGoogleMapLink,
        },
      },
    };
    if (center?.lat !== extractLatLngFromGoogleMapsLink(iFrameLink)?.lat) {
      setLoading(true);
      postProjectErrorReportAPI(payload, token)
        .then((response) => {
          setLoading(false);
          setModalState(false);
          setShowSuccessModal(true);
        })
        .catch((error) => {
          console.error("Error:", error);
          setLoading(false);
        });
    } else {
      setIsError(true);
    }
  };

  useEffect(() => {
    if (modalState) {
      setIsModalOpen && setIsModalOpen(false);
    } else {
      setIsModalOpen && setIsModalOpen(true);
    }
  }, [modalState]);

  return (
    <ProtectedRouteWrapper
      triggerElement={triggerElement}
      callback={() => setModalState(true)}
    >
      <ModalWrapper
        title={claimed === true ? "Edit Location Pin" : "Report Location"}
        trigger={triggerElement}
        open={modalState}
        setOpen={setModalState}
      >
        <div className="LocationErrorReport">
          <label>
            <input type="radio" value="option1" checked />
            <span className="error-name">Suggest an edit</span>
          </label>
          <p className="map-label">
            Pin exact Location <b style={{ color: "red" }}>*</b> :
          </p>
          <div className="project-search-input-container">
            <LocationSearch setLocationIdAndName={handleSetLocationIdAndName} />
            {isError && (
              <p className="text-[red] text-[15px]">Please search location</p>
            )}
          </div>

          <div className="map ">
            <div className="align">
              <label className="myclass" htmlFor="last">
                Choose Exact Location on Map:
              </label>
            </div>

            <LoadScript
              googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}
            >
              <GoogleMap
                mapContainerStyle={{ height: "250px" }}
                className="map-style"
                center={center}
                zoom={zoom}
                onLoad={onLoad}
              ></GoogleMap>
            </LoadScript>
          </div>
          <p className="hr-line"></p>

          <DialogFooter className="mt-10">
            <Button className="w-[90%] m-auto" onClick={submitHandler}>
              {loading ? (
                <ScaleLoader color="#ffffff" height={25} radius={5} width={4} />
              ) : (
                "Submit"
              )}
            </Button>
          </DialogFooter>
        </div>
      </ModalWrapper>
      <SuccessInfoModal
        modalState={showSuccessModal}
        setModalState={setShowSuccessModal}
      >
        <div className="text-center">
          <img src="/images/review added.svg" alt="img" className="m-auto" />
          <h5 className="text-[20px] font-bold">
            Report Location Map Request Sent
          </h5>
          <p className="text-[13px]">
            Great We have received your request. Our team will contact you soon
          </p>
        </div>
      </SuccessInfoModal>
    </ProtectedRouteWrapper>
  );
}
