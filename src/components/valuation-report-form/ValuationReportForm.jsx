"use client";
import { getValuationProjectCountAPI } from "@/connections/get-requests/getValuationProjectCountJAPI";
import {
  valuationReportCityOptions,
  valuationReportConfigurations,
  valuationReportTxnType,
  valuationReportUnitCategories,
  valuationReportUnitTypes,
} from "@/constants/initialStateData";

import { GoogleMap, LoadScript } from "@react-google-maps/api";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  Info,
  PlusIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ScaleLoader } from "react-spinners";
import LocationSearch from "../project-&-location-search/LocationSearch";
import ProjectSearch from "../project-&-location-search/ProjectSearch";
import "./ValuationReportForm.scss";

import { getPlansAPI } from "@/connections/get-requests/getPlansAPI";
import { getValuationParamsAPI } from "@/connections/get-requests/getValuationParamsAPI";
import { postInstantValuationReportAPI } from "@/connections/post-requests/postInstantValuationReportAPI";
import useAsync from "@/custom/useAsync";
import { displayRazorpay } from "@/logic/razorpay-request/razorPayPaymentAPI";
import { useQuery } from "@tanstack/react-query";
import ReactGA from "react-ga";
import ProtectedRouteWrapper from "../wrappers/ProtectedRouteWrapper";
export default function ValuationReportForm({
  setReportDownload,
  setUniqueSlug,
}) {
  const token = useSelector((state) => state.auth.token);
  const { user } = useSelector((store) => store.user);
  const contactNumber = user?.phone;
  const [configuration, setConfiguration] = useState("");
  const [unit, setUnit] = useState("");
  const [category, setCategory] = useState("");
  const [loader, setLoader] = useState(false);
  const [city, setCity] = useState("2209");
  const [newProject, setNewProject] = useState(false);
  const [add, setAdd] = useState(false);
  const [myArray, setMyArray] = useState([]);
  const [projectid, setProjectId] = useState("");
  const [locationid, setLocationId] = useState("");
  const [value, setValue] = useState("");
  const [distance, setDistance] = useState("");
  const [location, setLocation] = useState("");
  const [txntype, setTxnType] = useState(null);
  const [total, setTotal] = useState("");
  const [otherTotal, setOtherTotal] = useState("");
  const [addmorestate, setAddMoreState] = useState({});
  const [locationvalue, setLocationValue] = useState("");
  const [customproject, setCustomProject] = useState("");
  const [unitNo, setUnitNo] = useState("");
  const [validation, setValidation] = useState(false);
  const [message, setMessage] = useState("");
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({ lat: 18.5204, lng: 73.8567 });
  const [zoom, setZoom] = useState(8);
  const [step, setStep] = useState(1);
  const [projectRequestId, setProjectRequestId] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [otherArea, setOtherArea] = useState(false);
  const [addData, setAddData] = useState([
    { id: 1, name: "Bike Parks", placeholder: "eg.", field_name: "bike_parks" },
    { id: 2, name: "Car Parks", placeholder: "eg.", field_name: "car_parks" },
    {
      id: 3,
      name: "Built up area",
      placeholder: "eg.",
      field_name: "built_up_area",
    },
    {
      id: 4,
      name: "Saleable built up area",
      placeholder: "eg.",
      field_name: "saleable_built_up_area",
    },
    { id: 5, name: "Enclosed", placeholder: "eg.", field_name: "enclosed" },
    { id: 6, name: "Open", placeholder: "eg.", field_name: "open" },
    { id: 7, name: "Dry", placeholder: "eg.", field_name: "dry" },
    { id: 8, name: "Terrace", placeholder: "eg.", field_name: "terrace" },
    { id: 9, name: "Passage", placeholder: "eg.", field_name: "passage" },
    { id: 10, name: "Sit out", placeholder: "eg.", field_name: "sit_out" },
    {
      id: 11,
      name: " Arch projection",
      placeholder: "eg.",
      field_name: "arch_projection",
    },
    { id: 12, name: "Porch", placeholder: "eg.", field_name: "porch" },
    { id: 13, name: "Garage", placeholder: "eg.", field_name: "garage" },
    { id: 14, name: "Mezzanine", placeholder: "eg.", field_name: "mezzanine" },
  ]);

  const VALUATION_REPORT_HOST = process.env.NEXT_PUBLIC_VALUATION_HOST;
  const currentUserName = user?.first_name + " " + user?.last_name;

  function handleClick(data) {
    setMyArray([...myArray, data]);
  }

  function handleDelete(index) {
    const newArray = addData.filter((item, i) => i !== index);
    setAddData(newArray);
  }
  const handleChange = (event) => {
    const addedValue = event.target.value;
    setAddMoreState({ ...addmorestate, [event.target.name]: addedValue });
  };
  const {
    loading,
    error,
    value: paymentPlans,
  } = useAsync(getPlansAPI, [], [token, "valuation_report"]);

  const { data: unitFields } = useQuery({
    queryKey: [
      "getValuationParamsAPI",
      token,
      projectid,
      configuration,
      unit,
      category,
      total,
      newProject,
      txntype,
    ],
    queryFn: () => {
      const apiUrl = getValuationParamsAPI(
        token,
        projectid,
        configuration,
        unit,
        category,
        newProject,
        txntype
      );
      console.log("API URL:", apiUrl);
      return apiUrl;
    },
  });

  const handleNextStep = (e) => {
    e && e.preventDefault();
    if (step === 1) {
      if ((value && txntype) || (locationvalue && customproject && txntype)) {
        setStep(step + 1);
        setValidation(false);
      } else {
        setValidation(true);
      }
    } else if (step === 2) {
      setValidation(false);
      if (
        category &&
        (unit.name === "Flat" ? unit && configuration : unit) &&
        (otherTotal || total !== "other" || "")
      ) {
        setStep(step + 1);
        setValidation(false);
      } else {
        setValidation(true);
      }
    }
  };
  const handleStepBack = () => {
    setMessage("");
    setDistance("");
    setStep(step - 2);
  };
  const handlePrevStep = () => {
    setMessage("");
    setDistance("");
    setStep(step - 1);
  };

  const getResponse = async (liveToken) => {
    ReactGA.event({
      category: "User",
      action: "Clicked on submit to generate valuation report",
      label: "Button Click",
    });

    if (!newProject) {
      const payload = `distance=${distance}&project_id=${projectid}&configuration=${configuration}&unit_type=${unit}&unit_category=${category}&area=${total}&transaction_type=${txntype}
          `;
      setLoader(true);
      const res = await getValuationProjectCountAPI(
        payload,
        token || liveToken
      );

      setLoader(false);
      if (res.status.status === "SUCCESS") {
        razorPayHandler(token);
      } else {
        setMessage(res?.status?.message);
      }
    } else {
      setProjectRequestId(null);
      const payload = `distance=${distance}&location_id=${locationid}&lat=${center.lat}&long=${center.lng}&project_name=${customproject}&configuration=${configuration}&unit_type=${unit}&unit_category=${category}&area=${total}&transaction_type=${txntype}     
          `;
      setLoader(true);
      const res = await getValuationProjectCountAPI(payload, token);
      console.log(res);
      setLoader(false);
      if (res.status.status === "SUCCESS") {
        setProjectRequestId(res?.payload?.project_request_id);
      } else {
        setMessage(res?.status?.message);
      }
    }
  };
  useEffect(() => {
    if (projectRequestId) {
      razorPayHandler(token);
    }
  }, [projectRequestId]);
  const handleRazorpayResponse = async (response) => {
    if (response.razorpay_payment_id) {
      if (!newProject) {
        const payload = {
          distance: distance,
          project_id: projectid,
          configurations: configuration,
          unit_type: unit,
          unit_category: category,
          coupon_id: paymentPlans[0]?.coupons[0]?.id,
          area: total,
          payment_id: response.razorpay_payment_id,
          transaction_type: txntype,
          building_name: unitNo,
          current_user: currentUserName,
          amount:
            paymentPlans[0]?.coupons?.length >= 1
              ? paymentPlans[0]?.coupons[0]?.new_amount
              : paymentPlans[0]?.amount,
          plan_id: paymentPlans[0]?.id,
          report_type: "valuation_report",
        };
        try {
          setLoader(true);
          const res = await postInstantValuationReportAPI(payload, token);
          if (res?.status?.status === "SUCCESS") {
            setUniqueSlug(res.payload.unique_slug);

            const url = `https://reports-git-staging-propviewz-tech.vercel.app/valuation?unique_slug=${res.payload.unique_slug}&token=${token}`;
            window.location.href = url;

            setReportDownload(true);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoader(false);
        }
      } else {
        const payload = {
          project_request_id: projectRequestId,
          distance: distance,
          location_id: locationid,
          project_name: customproject,
          unit_type: unit,
          configuration: configuration,
          unit_category: category,
          lat: center.lat,
          long: center.lng,
          area: total,
          payment_id: response.razorpay_payment_id,
          transaction_type: txntype,
          building_name: unitNo,
          current_user: currentUserName,
          amount:
            paymentPlans[0]?.coupons?.length >= 1
              ? paymentPlans[0]?.coupons[0]?.new_amount
              : paymentPlans[0]?.amount,
          plan_id: paymentPlans[0]?.id,
          report_type: "valuation_report",
        };
        try {
          setLoader(true);
          const res = await postInstantValuationReportAPI(payload, token);
          console.log(res);
          if (res?.status?.status === "SUCCESS") {
            setUniqueSlug(res.payload.unique_slug);

            const url = `https://reports-git-staging-propviewz-tech.vercel.app/valuation?unique_slug=${res.payload.unique_slug}&token=${token}`;
            window.location.href = url;

            setReportDownload(true);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoader(false);
        }
      }
    }
  };
  const razorPayHandler = (token) => {
    const data = {
      id: 1,
      generateReport: true,
      amount:
        paymentPlans[0]?.coupons?.length >= 1
          ? paymentPlans[0]?.coupons[0]?.new_amount
          : paymentPlans[0]?.amount,
    };

    displayRazorpay(data, token, handleRazorpayResponse, contactNumber);
  };
  const onLoad = (map) => {
    setMap(map);
  };

  const setLocationIdAndName = (id, area) => {
    setLocationId(id);
    setLocationValue(area);
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
  };

  const setProjectIdAndName = (name, id, location) => {
    setLocation(location);
    setValue(name);
    setProjectId(id);
  };

  const handleAddNewProject = () => {
    setCity("");
    setLocationId("");
    setTxnType("");
    setDistance("");
    setLocationValue("");
    setUnitNo("");
    setTotal("");
    setCustomProject("");
    setLocation("");
    setValue("");
    setProjectId("");
    setValidation(false);
    setNewProject(!newProject);
  };

  const withoutLoginHandler = () => {
    handleNextStep();
  };
  useEffect(() => {
    if (otherTotal) {
      setTotal(otherTotal);
    }
  }, [otherTotal]);
  const renderStep = (steps) => {
    switch (step) {
      case 1:
        return (
          <div className="Valuation-report">
            <div className="steps">
              <div className="one-two-three">
                <div className="step-div">
                  {(city && value && txntype) ||
                  (locationvalue && customproject && center && txntype) ? (
                    <div className="step-div">
                      <p
                        className="step-number-1"
                        style={{ cursor: "pointer" }}
                      >
                        <CheckIcon color="#ffffff" />
                      </p>

                      <p className="step-name">Project Details</p>
                    </div>
                  ) : (
                    <div className="step-div">
                      <p className="step-number" style={{ cursor: "pointer" }}>
                        1
                      </p>
                      <p className="step-name">Project Details</p>
                    </div>
                  )}
                </div>
                <p className="hr"></p>
                <div className="step-div">
                  <ProtectedRouteWrapper
                    triggerElement={
                      <p
                        className="step-number"
                        style={{ cursor: "pointer" }}
                        // onClick={handleNextStep}
                      >
                        2
                      </p>
                    }
                    callback={withoutLoginHandler}
                  >
                    <p
                      className="step-number"
                      style={{ cursor: "pointer" }}
                      onClick={handleNextStep}
                    >
                      2
                    </p>
                  </ProtectedRouteWrapper>
                  <p className="step-name">Unit Details</p>
                </div>
                <p className="hr"></p>
                <div className="step-div">
                  <p className="step-number" style={{ cursor: "pointer" }}>
                    3
                  </p>
                  <p className="step-name">Additional Details</p>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="grp">
                <div className="new-div">
                  <h className="subtitle">Project Details:</h>
                  <p
                    className={newProject ? "addnewproject" : "none"}
                    onClick={handleAddNewProject}
                  >
                    <p>Cancel Project</p>
                  </p>
                </div>
                <div className="row">
                  <div className={newProject ? "column" : "none"}>
                    <div className="flex">
                      <label className="myclass" htmlFor="last">
                        State :
                      </label>
                      <span style={{ color: "red" }}> *</span>
                    </div>
                    <input type="text" value={"Maharashtra"} disabled />
                  </div>
                  <div className={newProject ? "column" : "none"}>
                    <div className="flex">
                      <label className="myclass" htmlFor="last" name="city_id">
                        City :
                      </label>
                      <span style={{ color: "red" }}> *</span>
                    </div>
                    <input type="text" value={"Pune"} disabled />
                  </div>
                </div>
                <div className="row">
                  <div className={!newProject ? "column" : "none"}>
                    <div className="flex">
                      <label className="myclass" htmlFor="last" name="city_id">
                        City :
                      </label>
                      <span style={{ color: "red" }}> *</span>
                    </div>
                    <select
                      name=""
                      id=""
                      onChange={(e) => {
                        setCity(e.target.value);
                        setValue("");
                        setLocation("");
                      }}
                    >
                      <>
                        {valuationReportCityOptions?.map((el) => (
                          <option value={el.cityId}>{el.name}</option>
                        ))}
                      </>
                    </select>
                  </div>
                  <div className={newProject ? "colunm" : "none"}>
                    <div className="flex">
                      <label className="myclass" htmlFor="last">
                        Location :
                      </label>
                      <span style={{ color: "red" }}> *</span>
                    </div>
                    <div className="relative">
                      <LocationSearch
                        setLocationIdAndName={setLocationIdAndName}
                        cityIdProp={city}
                      />
                    </div>
                    {validation && !locationvalue && (
                      <p className="validation">Please Select Location</p>
                    )}
                  </div>
                  <div className={newProject ? "colunm" : "none"}>
                    <div className="flex">
                      <label className="myclass" htmlFor="last">
                        Project Name :
                      </label>
                      <span style={{ color: "red" }}> *</span>
                    </div>
                    <div className="search-drop">
                      <input
                        className="search"
                        type="search"
                        autoComplete="off"
                        placeholder="Enter Project Name"
                        value={customproject}
                        onChange={(e) => setCustomProject(e.target.value)}
                      ></input>
                    </div>

                    {validation && !customproject && (
                      <p className="validation">Please Enter project Name</p>
                    )}
                  </div>
                  <div className={newProject ? "none" : "colunm"}>
                    <div className="flex">
                      <label className="myclass" htmlFor="last">
                        Project Name :
                      </label>
                      <span style={{ color: "red" }}> *</span>
                    </div>
                    <div className="relative">
                      <ProjectSearch
                        setProjectIdAndName={setProjectIdAndName}
                        addNewProjectBtn={
                          <p
                            className="btn-add-new"
                            onClick={handleAddNewProject}
                          >
                            <PlusIcon /> Add New Project
                          </p>
                        }
                        prevInputValue={value}
                        cityIdProp={city}
                      />
                    </div>
                    {validation && !value && (
                      <p className="validation">Please Select project</p>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className={location && !newProject ? "colunm" : "none"}>
                    <div className="flex">
                      <label className="myclass" htmlFor="last">
                        Location :
                      </label>
                      <span style={{ color: "red" }}> *</span>
                    </div>
                    <input
                      className="name1"
                      id="last"
                      disabled
                      value={location}
                    />
                  </div>
                  <div
                    className={
                      location && !newProject ? "column" : "Add-detail-column"
                    }
                  >
                    <div className="flex">
                      <label className="myclass" htmlFor="last">
                        Transaction Type :
                      </label>
                      <span style={{ color: "red" }}> *</span>
                    </div>
                    <select
                      name=""
                      id=""
                      value={txntype}
                      onChange={(e) => setTxnType(e.target.value)}
                      placeholder="Select Transaction Type"
                    >
                      <>
                        <option value={""} disabled selected hidden>
                          Select Transaction Type
                        </option>
                        {valuationReportTxnType?.map((el) => (
                          <option value={el.value}>{el.name}</option>
                        ))}
                      </>
                    </select>
                    {validation && !txntype && (
                      <p className="validation">
                        Please Select Transaction Type
                      </p>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className={newProject ? "colunm" : "none"}>
                    <div className="flex">
                      <label className="myclass" htmlFor="last">
                        Choose Exact Location on Map:
                      </label>
                      <span style={{ color: "red" }}> *</span>
                    </div>

                    <LoadScript
                      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}
                    >
                      <GoogleMap
                        mapContainerStyle={{ height: "400px" }}
                        center={center}
                        zoom={zoom}
                        onLoad={onLoad}
                      ></GoogleMap>
                    </LoadScript>
                  </div>
                </div>
              </div>
              <ProtectedRouteWrapper
                triggerElement={
                  <div className="steps-btn" style={{ float: "right" }}>
                    <div
                      className="steps-btn-route"
                      style={{
                        fontSize: "16px",
                        background: "#F15A29",
                        color: "white",
                      }}
                    >
                      Next
                      <ArrowRightIcon color="#ffffff" />
                    </div>
                  </div>
                }
                callback={withoutLoginHandler}
              >
                <div className="steps-btn" style={{ float: "right" }}>
                  <button
                    onClick={handleNextStep}
                    style={{
                      fontSize: "16px",
                      background: "#F15A29",
                      color: "white",
                    }}
                  >
                    Next
                    <ArrowRightIcon color="#ffffff" />
                  </button>
                </div>
              </ProtectedRouteWrapper>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="Valuation-report">
            <div className="steps">
              <div className="one-two-three">
                <div className="step-div">
                  <p
                    className="step-number-1"
                    style={{ cursor: "pointer" }}
                    onClick={handlePrevStep}
                  >
                    <CheckIcon color="#ffffff" />
                  </p>
                  <p className="step-name">Project Details</p>
                </div>
                <p className="hr-1"></p>
                {category && unit && total ? (
                  <div className="step-div">
                    <p
                      className="step-number-2"
                      style={{ cursor: "pointer" }}
                      onClick={handlePrevStep}
                    >
                      <CheckIcon color="#ffffff" />
                    </p>
                    <p className="step-name">Unit Details</p>
                  </div>
                ) : (
                  <div className="step-div">
                    <p className="step-number" style={{ cursor: "pointer" }}>
                      2
                    </p>
                    <p className="step-name">Unit Details</p>
                  </div>
                )}
                <p className="hr"></p>
                <div className="step-div">
                  <p
                    className="step-number"
                    style={{ cursor: "pointer" }}
                    onClick={handleNextStep}
                  >
                    3
                  </p>
                  <p className="step-name">Additional Details</p>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="grp">
                <div className="new-div">
                  <h className="subtitle">Unit Details:</h>
                </div>
                <div className="row">
                  <div className="colunm">
                    <div className="flex">
                      <label className="myclass" htmlFor="last">
                        Unit Category :
                      </label>
                      <span style={{ color: "red" }}> *</span>
                    </div>
                    <select
                      name=""
                      id=""
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setConfiguration("");
                        setUnit("");
                      }}
                    >
                      <>
                        <option value="" disabled selected hidden>
                          Select Unit Category
                        </option>
                        {newProject
                          ? valuationReportUnitCategories?.map((el) => (
                              <option key={el.name} value={el.name}>
                                {el.name}
                              </option>
                            ))
                          : unitFields?.data?.unit_category?.map((el) => (
                              <option key={el} value={el}>
                                {el}
                              </option>
                            ))}
                      </>
                    </select>
                    {validation && !category && (
                      <p className="validation">Please Select Category</p>
                    )}
                  </div>
                  <div className="colunm">
                    <div className="flex">
                      <label className="myclass" htmlFor="last">
                        Unit Type :
                      </label>
                      <span style={{ color: "red" }}> *</span>
                    </div>
                    <select
                      name=""
                      id=""
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                    >
                      <>
                        <option value="" disabled selected hidden>
                          Select Unit Type
                        </option>
                        {newProject
                          ? valuationReportUnitTypes
                              ?.filter((el) => el.role === category)
                              ?.map((el) => (
                                <option key={el.name} value={el.name}>
                                  {el.name}
                                </option>
                              ))
                          : unitFields?.data?.unit_type?.map((el) => (
                              <option key={el} value={el}>
                                {el}
                              </option>
                            ))}
                      </>
                    </select>
                    {validation && !unit && (
                      <p className="validation">Please Select Unit Type</p>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className={unit === "Flat" ? "colunm" : "none"}>
                    <div className="flex">
                      <label className="myclass" htmlFor="last">
                        Configuration :
                      </label>
                      <span style={{ color: "red" }}> *</span>
                    </div>
                    <select
                      name=""
                      id=""
                      value={configuration}
                      onChange={(e) => setConfiguration(e.target.value)}
                    >
                      <>
                        <option value="" selected hidden>
                          Select Configuration
                        </option>
                        {newProject
                          ? valuationReportConfigurations?.map((el) => (
                              <option key={el.name} value={el.value}>
                                {el.name}
                              </option>
                            ))
                          : unitFields?.data?.configuration?.map((el) => (
                              <option key={el} value={el}>
                                {el}
                              </option>
                            ))}
                      </>
                    </select>
                    {validation && !configuration && category && (
                      <p className="validation">Please Select Configuration</p>
                    )}
                  </div>
                  <div className="line">
                    <div
                      className={
                        category === "Residential"
                          ? `${
                              unit === "Flat" ? "column w-100" : "column w-50"
                            }`
                          : " Add-detail-column"
                      }
                    >
                      <div className="flex">
                        <label className="myclass" htmlFor="last">
                          BuildingName - Unit No :
                        </label>
                      </div>
                      <input
                        className="name1"
                        type="search"
                        id="last"
                        value={unitNo}
                        onChange={(e) => setUnitNo(e.target.value)}
                        placeholder="eg: D-202"
                      />
                    </div>
                  </div>
                </div>

                <div className="Add-detail-column row">
                  <div className="column">
                    <div className="flex gap-1 items-center">
                      <label className="myclass" htmlFor="last">
                        Total area (in Sq Ft ) :
                      </label>
                      <span style={{ color: "red" }}> *</span>
                      <span
                        className="info-icon"
                        onMouseEnter={() => setShowInfo(true)}
                        onMouseLeave={() => setShowInfo(false)}
                      >
                        <Info size={18} />
                      </span>
                      {showInfo && (
                        <div className="info_popup">
                          This is total useable area of the apartment including
                          carpet area, any balcony/terrace, mezzanine/loft,etc.
                        </div>
                      )}
                    </div>
                    {newProject ? (
                      <input
                        className="name1"
                        type="number"
                        onInput={(e) => {
                          e.target.value = e.target.value.slice(0, 4); // Limit input to 4 characters
                          setTotal(e.target.value);
                        }}
                        maxLength="4"
                        id="last"
                        placeholder="eg: 1000.00"
                        name="total"
                        value={total}
                        onChange={(e) => {
                          setTotal(e.target.value);
                        }}
                      />
                    ) : (
                      <select
                        name=""
                        id=""
                        value={total}
                        onChange={(e) => {
                          setTotal(e.target.value);
                          if (e.target.value === "other") {
                            setOtherArea(true);
                          } else {
                            setOtherArea(false);
                          }
                        }}
                      >
                        <>
                          <option value="" selected hidden>
                            Select Total Area
                          </option>
                          {unitFields?.data?.total_areas?.map((el) => (
                            <option key={el} value={el}>
                              {el}
                            </option>
                          ))}
                          <option value="other">Other</option>
                        </>
                      </select>
                    )}
                    {validation && !total && (
                      <p className="validation">
                        Please Enter Total area (in Sq Ft ){" "}
                      </p>
                    )}
                    <div
                      className="note"
                      style={{
                        textAlign: "left",
                        fontSize: "10px",
                        marginTop: "5px",
                      }}
                    >
                      <br />
                      <br />
                      <b style={{ color: "red" }}>Note :</b> <br />
                      1. This is total useable area of the apartment including
                      carpet area, any balcony/terrace, mezzanine/loft,etc.{" "}
                      <br />
                      2. Please do not add rooftop terrace, garden or car park
                      areas as it may result in skewed valuation.
                    </div>{" "}
                    <br />
                  </div>
                  <div className={otherArea ? "column" : "hidden"}>
                    <div className="flex gap-1 items-center">
                      <label className="myclass" htmlFor="last">
                        Other area (in Sq Ft ) :
                      </label>
                      <span style={{ color: "red" }}> *</span>
                    </div>

                    <input
                      className="name1"
                      type="number"
                      onInput={(e) => {
                        e.target.value = e.target.value.slice(0, 4); // Limit input to 4 characters
                        setOtherTotal(e.target.value);
                      }}
                      maxLength="4"
                      id="last"
                      placeholder="eg: 1000.00"
                      name="total"
                      value={otherTotal}
                      onChange={(e) => {
                        setOtherTotal(e.target.value);
                      }}
                    />
                    {validation && !otherTotal && (
                      <p className="validation">
                        Please enter total area as an integer (in Sq Ft)
                      </p>
                    )}
                  </div>
                </div>
                {myArray.map((data, i) => (
                  <div className="colunm" key={i}>
                    <div className="flex">
                      <label className="myclass" htmlFor="last">
                        {data.name} :
                      </label>
                    </div>
                    <input
                      className="name1"
                      type="search"
                      id="last"
                      name={data.field_name}
                      placeholder={data.placeholder}
                      onChange={handleChange}
                    />
                  </div>
                ))}
              </div>

              <div className="">
                <div className="none">
                  <button
                    type="button"
                    className=" btn-primary"
                    onClick={() => setAdd(!add)}
                  >
                    <span className="button-icon">
                      <span className="material-symbols-outlined ab">add</span>
                    </span>
                    <span className="button-text">Add More</span>
                  </button>

                  <div className={add ? "addmore" : "none"}>
                    {addData?.map((data, index) => (
                      <ul key={index}>
                        <li
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            handleClick(data);
                            handleDelete(index);
                            setAdd(!add);
                          }}
                        >
                          {data.name}
                        </li>
                      </ul>
                    ))}
                  </div>
                </div>
              </div>
              <div className="steps-btn">
                <button
                  onClick={handlePrevStep}
                  style={{
                    fontSize: "16px",
                    background: "#F15A29",
                    color: "white",
                  }}
                >
                  <ArrowLeftIcon color="#ffffff" />
                  Prev
                </button>
                <button
                  onClick={handleNextStep}
                  style={{
                    fontSize: "16px",
                    background: "#F15A29",
                    color: "white",
                  }}
                >
                  Next
                  <ArrowRightIcon color="#ffffff" />
                </button>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="Valuation-report">
            <div className="steps">
              <div className="one-two-three">
                <div className="step-div">
                  <p
                    className="step-number-1"
                    style={{ cursor: "pointer" }}
                    onClick={handleStepBack}
                  >
                    <CheckIcon color="#ffffff" />
                  </p>
                  <p className="step-name">Project Details</p>
                </div>
                <p className="hr-1"></p>
                <div className="step-div">
                  <p
                    className="step-number-2"
                    style={{ cursor: "pointer" }}
                    onClick={handlePrevStep}
                  >
                    <CheckIcon color="#ffffff" />
                  </p>
                  <p className="step-name">Unit Details</p>
                </div>
                <p className="hr-1"></p>
                {distance ? (
                  <div className="step-div">
                    <p
                      className="step-number-2"
                      style={{ cursor: "pointer" }}
                      // onClick={handlePrevStep}
                    >
                      <CheckIcon color="#ffffff" />
                    </p>
                    <p className="step-name">Additional Details</p>
                  </div>
                ) : (
                  <div className="step-div">
                    <p className="step-number" style={{ cursor: "pointer" }}>
                      3
                    </p>
                    <p className="step-name">Additional Details</p>
                  </div>
                )}
              </div>
            </div>

            <div className="container">
              <div className="grp">
                <div className="new-div">
                  <h className="subtitle">Additional Details :</h>
                </div>
                <div className="">
                  <div className="Add-detail-column ">
                    <div className="flex">
                      <label className="myclass" htmlFor="last">
                        Project Vicinity radius in meters :
                      </label>
                      <span style={{ color: "red" }}> *</span>
                      <span
                        className="info-icon"
                        onMouseEnter={() => setShowInfo(true)}
                        onMouseLeave={() => setShowInfo(false)}
                      >
                        <Info size={18} />
                      </span>
                      {showInfo && (
                        <div
                          className="info_popup"
                          style={{
                            marginTop: "20px",
                            height: "170px",
                            textAlign: "left",
                            padding: "10px",
                          }}
                        >
                          1.Please enter radius which has sufficient number of
                          project for {txntype}
                          <br />
                          2.Transaction data of projects within the entered
                          radius will be shown & considered for valuation
                          analysis
                        </div>
                      )}
                    </div>
                    <div>
                      <div>
                        <input
                          className="w-full"
                          type="number"
                          onInput={(e) =>
                            (e.target.value = e.target.value.slice(0, 4))
                          }
                          placeholder="100+"
                          value={distance}
                          onChange={(e) => {
                            setMessage("");
                            setDistance(e.target.value);
                          }}
                        />
                      </div>
                      {!distance && (
                        <div
                          className="validation"
                          style={{ textAlign: "left" }}
                        >
                          Please Enter Distance min 100 mtr.
                        </div>
                      )}
                      <div className="validation" style={{ textAlign: "left" }}>
                        {message}
                      </div>
                      <div className="note">
                        <b style={{ color: "red" }}>Note :</b> <br />
                        1. Minimum distance 100 mtr.
                        <br />
                        2. Please enter radius which has sufficient number of
                        project for {txntype}
                        <br />
                        3.Transaction data of projects within the entered radius
                        will be shown & considered for valuation analysis
                      </div>{" "}
                      <br />
                    </div>
                  </div>
                </div>
              </div>

              <div className="steps-btn">
                <button
                  onClick={handlePrevStep}
                  style={{
                    fontSize: "16px",
                    background: "#F15A29",
                    color: "white",
                  }}
                >
                  <ArrowLeftIcon color="#ffffff" />
                  Prev
                </button>
                <ProtectedRouteWrapper
                  triggerElement={
                    <div
                      style={{ cursor: "pointer" }}
                      className={distance >= 100 ? " btn-secondary" : "disable"}
                    >
                      <span className="button-text">
                        {" "}
                        {loader ? (
                          <ScaleLoader
                            color="#ffffff"
                            height={25}
                            radius={5}
                            width={4}
                          />
                        ) : (
                          `Pay ₹ ${
                            paymentPlans[0]?.coupons?.length >= 1
                              ? paymentPlans[0]?.coupons[0]?.new_amount
                              : paymentPlans[0]?.amount
                          } & GENERATE REPORT`
                        )}{" "}
                      </span>
                    </div>
                  }
                  callback={(el, liveToken) => getResponse(liveToken)}
                >
                  <div
                    style={{ cursor: "pointer" }}
                    className={distance >= 100 ? "btn-secondary" : "disable"}
                    onClick={() => getResponse()}
                  >
                    <span className="button-text">
                      {loader ? (
                        <ScaleLoader
                          color="#ffffff"
                          height={25}
                          radius={5}
                          width={4}
                        />
                      ) : (
                        `Pay ₹ ${
                          paymentPlans[0]?.coupons?.length >= 1
                            ? paymentPlans[0]?.coupons[0]?.new_amount
                            : paymentPlans[0]?.amount
                        } & GENERATE REPORT`
                      )}
                    </span>
                  </div>
                </ProtectedRouteWrapper>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="Valuation-report-container">
      <form>{renderStep()}</form>
    </div>
  );
}
