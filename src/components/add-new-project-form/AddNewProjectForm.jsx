"use client";
import { postAddNewProjectAPI } from "@/connections/post-requests/postAddNewProjectAPI";
import {
  addNewProjectInitValue,
  valuationReportCityOptions,
} from "@/constants/initialStateData";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { useRef, useState } from "react";
import ReactGA from "react-ga";
import { useSelector } from "react-redux";
import { ScaleLoader } from "react-spinners";
import LocationSearch from "../project-&-location-search/LocationSearch";
import { useToast } from "../ui/use-toast";
import ProtectedRouteWrapper from "../wrappers/ProtectedRouteWrapper";
export default function AddNewProjectForm() {
  const token = useSelector((state) => state.auth.token);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(addNewProjectInitValue);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [center, setCenter] = useState({ lat: 18.5204, lng: 73.8567 });
  const [zoom, setZoom] = useState(16);
  const [map, setMap] = useState(null);
  const closeLocationInputFunRef = useRef();
  const { toast } = useToast();

  const onLoad = (map) => {
    setMap(map);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: false,
    }));
  };

  const handleSubmit = async (e, callbackToken) => {
    e && e.preventDefault();

    ReactGA.event({
      category: "User",
      action: "User Added a New Project ",
      label: "Button Click",
    });
    const validationErrors = {};
    if (!formData.location_id) {
      validationErrors.location_id = true;
    }
    if (!formData.project_name) {
      validationErrors.project_name = true;
    }
    if (!formData.google_map_link) {
      validationErrors.google_map_link = true;
    }
    if (formData.city_id === "null") {
      validationErrors.city_id = true;
    }

    if (Object.keys(validationErrors).length === 0) {
      // Perform submit action, e.g., API call
      setSubmitLoading(true);
      try {
        const res = await postAddNewProjectAPI(
          formData,
          callbackToken ? callbackToken : token
        );
        setSubmitLoading(false);
        if (res?.status?.status === "SUCCESS") {
          toast({
            variant: "success",
            title: "Subscriber Updated",
          });
          setFormData(addNewProjectInitValue);
          if (closeLocationInputFunRef.current) {
            closeLocationInputFunRef.current.clearLocationInputOnSubmit();
          }
        } else {
          toast({
            variant: "destructive",
            title: "Something went wrong",
            description: "Please try after some time",
          });
        }
      } catch (error) {
        setSubmitLoading(false);
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: "Please try after some time",
        });
        console.log(error);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handleSetLocationIdAndName = (id, area) => {
    setFormData((prevData) => ({
      ...prevData,
      location_id: id,
    }));
    setErrors((prev) => ({
      ...prev,
      location_id: false,
    }));

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: area }, (results, status) => {
      if (status === "OK") {
        const location = results[0].geometry.location.toJSON();
        const marker = new window.google.maps.Marker({
          position: location,
          map, // Replace "map" with your map object
          title: area, // Optional title for the marker
          draggable: true,
        });

        setCenter(results[0].geometry.location.toJSON());
        marker.addListener("dragend", () => {
          const position = marker.getPosition();

          // Center the map on the new marker position
          setCenter(position.toJSON());
        });
        setZoom(15);
      } else {
        console.error(`Geocode failed: ${status}`);
      }
    });
    setFormData((prevData) => ({
      ...prevData,
      google_map_link: `https://www.google.com/maps?q=${center.lat},${center.lng}`,
    }));
  };

  return (
    <div className="p-4 user-profile-form">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[60px] gap-y-4">
          <div>
            <label className="block mb-1 font-medium">
              State <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={"Maharashtra"}
              className="w-full px-3 py-2 border rounded"
              disabled
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">
              City <span className="text-red-500">*</span>
            </label>
            <select
              name="city_id"
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              value={formData.city_id}
            >
              <>
                <option value="null" selected disabled hidden>
                  Select City
                </option>
                {valuationReportCityOptions?.map((el) => (
                  <option value={el.cityId}>{el.name}</option>
                ))}
              </>
            </select>
            {errors.city_id && (
              <p className="text-red-500">Please select city</p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">
              Location <span className="text-red-500">*</span>
            </label>
            <div className="project-search-input-container relative">
              <LocationSearch
                setLocationIdAndName={handleSetLocationIdAndName}
                cityIdProp={formData?.city_id}
                closeLocationInputFunRef={closeLocationInputFunRef}
              />
            </div>
            {errors.location_id && (
              <p className="text-red-500">Please Select Location</p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="project_name"
              placeholder="Enter project name"
              value={formData?.project_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.project_name && (
              <p className="text-red-500">Please Enter project Name</p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">RERA No</label>
            <input
              type="text"
              name="rera_number"
              value={formData?.rera_number}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">
              Developer Brand Name
            </label>
            <input
              className="w-full px-3 py-2 border rounded"
              name="brand_name"
              value={formData?.brand_name}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="mt-6">
          <label className="block mb-1 font-medium">
            Choose Exact Location on Map:<span className="text-red-500">*</span>
          </label>
          <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}>
            <GoogleMap
              mapContainerStyle={{ height: "400px", margin: "10px 0" }}
              options={{
                zoomControl: true,
                mapTypeControl: true,
                streetViewControl: true,
                fullscreenControl: true,
              }}
              center={center}
              zoom={zoom}
              onLoad={onLoad}
            ></GoogleMap>
          </LoadScript>
        </div>
        <div className="my-8 text-center">
          <ProtectedRouteWrapper
            triggerElement={
              <button className="ml-3 px-10 py-2 bg-[#f1592a] text-white rounded">
                Submit
              </button>
            }
            callback={handleSubmit}
          >
            <button
              type="submit"
              className="ml-3 px-10 py-2 bg-[#f1592a] text-white rounded"
            >
              {submitLoading ? (
                <ScaleLoader color="#ffffff" height={10} radius={5} width={4} />
              ) : (
                "Submit"
              )}
            </button>
          </ProtectedRouteWrapper>
        </div>
      </form>
    </div>
  );
}
