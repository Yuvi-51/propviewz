"use client";
import { getPlansAPI } from "@/connections/get-requests/getPlansAPI";
import { getProjectPlanDataAPI } from "@/connections/get-requests/getProjectPlanDataAPI";
import { getTotalSelectedProjectCountAPI } from "@/connections/get-requests/getTotalSelectedProjectCountAPI";
import { postProjectPlanningReportDataAPI } from "@/connections/post-requests/postProjectPlanningReportDataAPI";
import {
  configurations,
  proximity,
  txnDuration,
  txnSaleType,
  valuationReportCityOptions,
} from "@/constants/initialStateData";
import useAsync from "@/custom/useAsync";
import { displayRazorpay } from "@/logic/razorpay-request/razorPayPaymentAPI";
import { Select, SelectItem } from "@nextui-org/react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BtoBdataUpdateModal from "../modal-content/BtoBdataUpdateModal";
import LocationSearch from "../project-&-location-search/LocationSearch";
import ProtectedRouteWrapper from "../wrappers/ProtectedRouteWrapper";
import "./B_To_B_Form.scss";
import SecondStepTable from "./second-step-table/SecondStepTable";

export default function B_To_B_From({ setReportDownload, setUniqueSlug }) {
  const token = useSelector((state) => state.auth.token);
  const { user } = useSelector((state) => state.user);
  const contactNumber = user?.phone;
  const [city, setCity] = useState("");
  const [modalState, setModalState] = useState(false);
  const [getUpdateData, setGetUpdateData] = useState(false);
  const [value, setValue] = useState("");
  const [razorpayPaymentId, setRazorpayPaymentId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [txntype, setTxnType] = useState("");
  const [total, setTotal] = useState("");
  const [locationvalue, setLocationValue] = useState("");
  const [customproject, setCustomProject] = useState("");
  const [loader, setLoader] = useState(false);
  const [validation, setValidation] = useState(false);
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({ lat: 18.5204, lng: 73.8567 });
  const [zoom, setZoom] = useState(8);
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState([]);
  const [parentSelectedData, setParentSelectedData] = useState([]);
  const [calculateCost, SetCalculateCost] = useState([]);
  const [selectedConfigurations, setSelectedConfigurations] = useState([]);
  const [updatedProjectData, setUpdatedProjectData] = useState(null);
  const [dataRange, setDataRange] = useState(false);
  const [splitConfigurtions, setSplitConfigurtions] = useState([]);
  const VALUATION_REPORT_HOST = process.env.NEXT_PUBLIC_VALUATION_HOST;
  // selectedConfigurations && selectedConfigurations?.split(",");
  // const [receivedConfigurations, setReceivedConfigurations] = useState(null);
  const router = useRouter();
  // const router = useRouter
  const [firstStepData, setFirstStepData] = useState({
    city: "",
    companyName: "",
    txn_type: "",
    proximity: "",
    txn_date: "",
  });

  const {
    loading,
    error,
    value: paymentPlans,
  } = useAsync(getPlansAPI, [], [token, "project_planning_report"]);

  // console.log("city", calculateCost);
  const chunkArray = (array, chunkSize) => {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  };
  const groupedData = chunkArray(parentSelectedData, 5);
  const handleNextStep = (e) => {
    e && e.preventDefault();
    if (step === 1) {
      if (
        firstStepData.city.length > 0 &&
        firstStepData.companyName &&
        firstStepData.txn_type &&
        firstStepData.proximity &&
        firstStepData.txn_date &&
        selectedConfigurations.length >= 1 &&
        locationvalue
      ) {
        setStep(step + 1);
        setValidation(false);
      } else {
        setValidation(true);
      }
    } else if (step === 2) {
      setValidation(false);
      if (parentSelectedData.length === 10) {
        setStep(step + 1);
        setValidation(false);
      } else {
        setValidation(true);
      }
    }
  };
  const handleStepBack = (e) => {
    // e.preventDefault();

    setStep(step - 2);
  };
  const handlePrevStep = (e) => {
    e.preventDefault();

    setStep(step - 1);
  };

  const onLoad = (map) => {
    setMap(map);
  };
  // console.log(projectData);
  const setLocationIdAndName = (id, area) => {
    setLocationId(id);
    setLocationValue(area);
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: area }, (results, status) => {
      if (status === "OK") {
        const location = results[0].geometry.location.toJSON();
        const marker = new window.google.maps.Marker({
          position: location,
          map,
          title: area,

          draggable: true,
        });
        setCenter(results[0].geometry.location.toJSON());
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFirstStepData({
      ...firstStepData,
      [name]: value,
    });
  };

  const handleChange = (selectedOptions) => {
    setSelectedConfigurations(selectedOptions.target.value);

    const data = selectedOptions.target.value;
    setSplitConfigurtions(data.split(","));
  };
  const handleNextButtonClick = (e, callBackToken) => {
    e && e.preventDefault();
    if (parentSelectedData.length > 0) {
      handleNextStep();
    } else {
      if (
        firstStepData.city.length > 0 &&
        firstStepData.companyName &&
        firstStepData.txn_type &&
        firstStepData.proximity &&
        firstStepData.txn_date &&
        selectedConfigurations.length >= 1 &&
        locationvalue
      ) {
        setGetUpdateData(false);
        setValidation(false);
        setLoader(true);
        setModalState(false);
        getProjectPlanDataAPI(
          firstStepData,
          locationId,
          selectedConfigurations,
          center,
          callBackToken || token,
          updatedProjectData
        )
          .then((data) => {
            if (data.data.status.status === "SUCCESS") {
              setProjectData(data?.data?.payload);
              handleNextStep();
              setLoader(false);
            } else {
              setLoader(false);
              setModalState(true);
            }
            if (data.data.status.status === 204) {
              setModalState(true);
              setLoader(false);
            }
          })
          .catch((error) => {
            alert("SomeThing Went Wrong Please Try Again ..");
            console.error(error);
            setLoader(false);
          });
      } else {
        setValidation(true);
      }
    }
  };

  const convertMetersToKilometers = (meters) => {
    const kilometers = meters / 1000;
    return `${kilometers} Km`;
  };

  const handleSelectedDataChange = (selectedData) => {
    setParentSelectedData(selectedData);
  };

  const handelUpdateData = (e) => {
    e && e.preventDefault();
    setModalState(false);
    setGetUpdateData(false);
    setLoader(true);
    setValidation(false);
    getProjectPlanDataAPI(
      firstStepData,
      locationId,
      selectedConfigurations,
      center,
      token,
      updatedProjectData
    )
      .then((data) => {
        if (data.data.status.status === "SUCCESS") {
          setProjectData(data?.data?.payload);
          setLoader(false);
        }
        if (data.data.status.status === 204) {
          setModalState(true);
          setDataRange(true);
          setLoader(false);
        }
      })
      .catch((error) => {
        alert(error);
        console.error(error);
        setLoader(false);
      });
  };
  const data = {
    id: 1,
    generateReport: true,
    amount: calculateCost?.total_cost,
  };

  const razorPayHandler = (e, data, token) => {
    e.preventDefault();
    displayRazorpay(data, token, handleRazorpayResponse, contactNumber);
  };

  const handleRazorpayResponse = (response) => {
    // console.log("Complete Razorpay response:", response);
    console.log("Razorpay payment ID:", response.razorpay_payment_id);
    setRazorpayPaymentId(response.razorpay_payment_id);
    if (response.razorpay_payment_id) {
      handleGenerateReport(response.razorpay_payment_id);
    }
  };

  const handleGenerateReport = async (razorpay_payment_id) => {
    // e && e.preventDefault();
    const ids = parentSelectedData.map((item) => item.id);
    const idsString = ids.join(",");
    const payload = {
      transaction_type: firstStepData?.txn_type,
      company_name: firstStepData?.companyName,
      location_id: locationId,
      distance: firstStepData?.proximity,
      transaction_date: firstStepData?.txn_date,
      configurations: selectedConfigurations,
      selected_project_ids: idsString,
      lat: center.lat,
      long: center.lng,
      city: firstStepData?.city?.name,
      payment_id: razorpay_payment_id,
      amount: calculateCost?.total_cost,
      plan_id: paymentPlans[0].id,
    };
    try {
      setLoader(true);
      const res = await postProjectPlanningReportDataAPI(payload, token);
      console.log(res);
      if (res?.status?.status === "SUCCESS") {
        setUniqueSlug(res.payload.unique_slug);
        const url = `https://reports-git-staging-propviewz-tech.vercel.app/project-planning?unique_slug=${res.payload.unique_slug}&token=${token}`;
        window.location.href = url;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
    setReportDownload(true);
  };

  useEffect(() => {
    if (getUpdateData === true) {
      setGetUpdateData(false);
      handelUpdateData();
    }
  }, [getUpdateData]);

  useEffect(() => {
    if (parentSelectedData.length === 10) {
      const ids = parentSelectedData.map((item) => item.id);

      getTotalSelectedProjectCountAPI(ids, token)
        .then((data) => {
          console.log("datad", data);
          SetCalculateCost(data?.cost);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [parentSelectedData]);

  const handleUpdateData = (data) => {
    setUpdatedProjectData(data);
  };
  const handleSelectedConfigurationsChange = (configurations) => {
    if (configurations.length > 0) {
      setSelectedConfigurations(configurations);
    }
  };

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

                      <p className="step-name">Location Data</p>
                    </div>
                  ) : (
                    <div className="step-div">
                      <p className="step-number" style={{ cursor: "pointer" }}>
                        1
                      </p>
                      <p className="step-name">Location Data</p>
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
                        // onClick={handleNextButtonClick}
                      >
                        2
                      </p>
                    }
                    callback={(e, callBackToken) =>
                      handleNextButtonClick(e, callBackToken)
                    }
                  >
                    <p
                      className="step-number"
                      style={{ cursor: "pointer" }}
                      onClick={handleNextButtonClick}
                    >
                      2
                    </p>
                  </ProtectedRouteWrapper>
                  <p className="step-name">Data Selection</p>
                </div>
                <p className="hr"></p>
                <div className="step-div">
                  <p className="step-number" style={{ cursor: "pointer" }}>
                    3
                  </p>
                  <p className="step-name">Data Review</p>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="grp">
                <div className="new-div">
                  <h className="subtitle">Location Data:</h>
                </div>

                <div className="row">
                  <div className="column">
                    <div className="align">
                      <label className="myclass" htmlFor="last">
                        Company Name :
                      </label>
                      <span style={{ color: "red" }}> *</span>
                    </div>
                    <div className="relative">
                      <input
                        onChange={handleInputChange}
                        name="companyName"
                        type="text"
                        value={firstStepData.companyName}
                        placeholder="Enter Company Name"
                      />
                    </div>
                    {validation && !firstStepData.companyName && (
                      <p className="validation">Please Enter Company Name</p>
                    )}
                  </div>
                  <div className="column">
                    <div className="align">
                      <label className="myclass" htmlFor="last" name="city_id">
                        City :
                      </label>
                      <span style={{ color: "red" }}> *</span>
                    </div>
                    <Select
                      name="city"
                      className="multiselector bg-no"
                      placeholder="Select City"
                      defaultSelectedKeys={[firstStepData?.city]}
                      onChange={handleInputChange}
                    >
                      {valuationReportCityOptions.map((data) => (
                        <SelectItem key={data.value} value={data.name}>
                          {data.name}
                        </SelectItem>
                      ))}
                    </Select>
                    {validation && !firstStepData.city && (
                      <p className="validation">Please Select City</p>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="column">
                    <div className="align">
                      <label className="myclass" htmlFor="last">
                        Location :
                      </label>
                      <span style={{ color: "red" }}> *</span>
                    </div>
                    <div className="relative">
                      <LocationSearch
                        setLocationIdAndName={setLocationIdAndName}
                        cityIdProp={
                          firstStepData.city === "Pune"
                            ? 2209
                            : firstStepData.city === "Mumbai"
                            ? 2126
                            : 2209
                        }
                      />
                    </div>
                    {validation && !locationvalue && (
                      <p className="validation">Please Select Location</p>
                    )}
                  </div>
                  <div className="column">
                    <div className="align">
                      <label className="myclass" htmlFor="last">
                        Transaction Type :
                      </label>
                      <span style={{ color: "red" }}> *</span>
                    </div>
                    <Select
                      className="multiselector bg-no"
                      placeholder="Select Transaction Type"
                      name="txn_type"
                      value={firstStepData.txn_type}
                      defaultSelectedKeys={[firstStepData?.txn_type]}
                      onChange={handleInputChange}
                    >
                      {txnSaleType.map((data) => (
                        <SelectItem key={data.value} value={data.value}>
                          {data.name}
                        </SelectItem>
                      ))}
                    </Select>

                    {validation && !firstStepData.txn_type && (
                      <p className="validation">
                        Please Select Transaction Type
                      </p>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="column">
                    <div className="align">
                      <label className="myclass" htmlFor="last">
                        Proximity of X Km.:
                      </label>
                      <span style={{ color: "red" }}> *</span>
                    </div>

                    <Select
                      className="multiselector bg-no"
                      placeholder="Select Proximity "
                      name="proximity"
                      value={firstStepData.proximity}
                      defaultSelectedKeys={[firstStepData?.proximity]}
                      onChange={handleInputChange}
                    >
                      {proximity.map((data) => (
                        <SelectItem key={data.value} value={data.value}>
                          {data.name}
                        </SelectItem>
                      ))}
                    </Select>

                    {validation && !firstStepData.proximity && (
                      <p className="validation">Please Select Proximity</p>
                    )}
                  </div>
                  <div className="column">
                    <div className="align">
                      <label className="myclass" htmlFor="last">
                        Transaction Date Range:{" "}
                      </label>
                      <span style={{ color: "red" }}> *</span>
                    </div>
                    <Select
                      className="multiselector bg-no"
                      placeholder="Select Transaction Date Range "
                      name="txn_date"
                      value={firstStepData.txn_date}
                      defaultSelectedKeys={[firstStepData?.txn_date]}
                      onChange={handleInputChange}
                    >
                      {txnDuration.map((data) => (
                        <SelectItem key={data.value} value={data.value}>
                          {data.name}
                        </SelectItem>
                      ))}
                    </Select>

                    {validation && !firstStepData.txn_date && (
                      <p className="validation">
                        Please Select Transaction Date Range
                      </p>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="column">
                    <div className="align">
                      <label className="myclass" htmlFor="last">
                        Configurations :
                      </label>
                      <span style={{ color: "red" }}> *</span>
                    </div>

                    <Select
                      className="multiselector bg-no"
                      placeholder="Select configurations"
                      selectionMode="multiple"
                      onChange={handleChange}
                      defaultSelectedKeys={splitConfigurtions}
                      value={selectedConfigurations}
                    >
                      {configurations.map((item) => (
                        <SelectItem
                          key={item.value}
                          value={item.value}
                          name={item.name}
                        >
                          {item.name}
                        </SelectItem>
                      ))}
                    </Select>
                    {validation && selectedConfigurations.length == 0 && (
                      <p className="validation">Please Select Configurations</p>
                    )}
                  </div>

                  <div className="column"></div>
                </div>
                <div className="row">
                  <div className="column">
                    <div className="align">
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
                callback={(e, callBackToken) =>
                  handleNextButtonClick(e, callBackToken)
                }
              >
                <div className="steps-btn" style={{ float: "right" }}>
                  <button
                    onClick={handleNextButtonClick}
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
            <BtoBdataUpdateModal
              parrentConfigurtions={splitConfigurtions}
              parrentDateRange={firstStepData?.txn_date}
              ParrentProximity={firstStepData?.proximity}
              setModalState={setModalState}
              modalState={modalState}
              setGetUpdateData={setGetUpdateData}
              onUpdateData={handleUpdateData}
              onSelectedConfigurationsChange={
                handleSelectedConfigurationsChange
              }
              dataRange={dataRange}
            />
            {/* )} */}
            <div className={loader ? "loader" : "hidden"}>
              <div className="loading"></div>
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
                  <p className="step-name">Location Data</p>
                </div>
                <p className="hr-1"></p>
                {total ? (
                  <div className="step-div">
                    <p
                      className="step-number-2"
                      style={{ cursor: "pointer" }}
                      onClick={handlePrevStep}
                    >
                      <CheckIcon color="#ffffff" />
                    </p>
                    <p className="step-name">Data Selection</p>
                  </div>
                ) : (
                  <div className="step-div">
                    <p className="step-number" style={{ cursor: "pointer" }}>
                      2
                    </p>
                    <p className="step-name">Data Selection</p>
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
                  <p className="step-name">Data Review</p>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="grp ">
                <h className="subtitle">Data Selection:</h>
                <div className="project_table_filter">
                  <div className="table_div">
                    <b>Choose Projects:</b>
                    <div className="msg">
                      <p>
                        1. Choose comparable projects for generating the report.
                      </p>
                      <p>2. You can choose up to 10 projects at Rs. 20,000.</p>
                    </div>
                    <SecondStepTable
                      projectData={projectData}
                      selectedProjectData={handleSelectedDataChange}
                      setFilter={(value) => setModalState(value)}
                    />
                    {validation && parentSelectedData.length !== 10 && (
                      <div className="validation">
                        Please Select at Only 10 projects
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div
                className={parentSelectedData.length !== 0 ? "grp" : "hidden"}
              >
                <h2>
                  <b>Total Cost:</b>
                </h2>

                <div className="row">
                  <div className="column">
                    <div className="cart w-full flex justify-between">
                      <p>
                        {" "}
                        Selected Projects :{" "}
                        <span style={{ color: "#f1592a", fontWeight: "700" }}>
                          {parentSelectedData.length}{" "}
                        </span>
                      </p>

                      <p>
                        Base Amount :{" "}
                        <span style={{ color: "#f1592a", fontWeight: "700" }}>
                          {" "}
                          Rs. {calculateCost
                            ? calculateCost?.base_cost
                            : 0}{" "}
                        </span>
                      </p>
                    </div>
                    <div></div>
                  </div>
                </div>
                <BtoBdataUpdateModal
                  parrentConfigurtions={splitConfigurtions}
                  parrentDateRange={firstStepData?.txn_date}
                  ParrentProximity={firstStepData?.proximity}
                  setModalState={setModalState}
                  modalState={modalState}
                  setGetUpdateData={setGetUpdateData}
                  mobileFilter={true}
                  onUpdateData={handleUpdateData}
                  onSelectedConfigurationsChange={
                    handleSelectedConfigurationsChange
                  }
                  dataRange={dataRange}
                />
              </div>

              <div className="steps-btn">
                <button
                  onClick={handlePrevStep}
                  style={{
                    fontSize: "16px",
                    background: "#BFBFBF",
                    color: "black",
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
            <div className={loader ? "loader" : "hidden"}>
              <div className="loading"></div>
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
                  <p className="step-name">Location Data</p>
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
                  <p className="step-name">Data Selection</p>
                </div>
                <p className="hr-1"></p>
                <div className="step-div">
                  <p className="step-number" style={{ cursor: "pointer" }}>
                    3
                  </p>
                  <p className="step-name">Data Review</p>
                </div>
              </div>
            </div>

            <div className="container">
              <div className="grp">
                <h className="subtitle">Data Review :</h>
                <div className="">
                  <div className="row">
                    <div className="column">
                      <div className="align">
                        <label className="myclass" htmlFor="last">
                          <b> Company Name: </b>
                          {firstStepData.companyName}
                        </label>
                      </div>
                    </div>
                    <div className="column">
                      <div className="align">
                        <label className="myclass" htmlFor="last">
                          <b> City : </b> {firstStepData.city}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="column">
                      <div className="align">
                        <label className="myclass" htmlFor="last">
                          <b> Location : </b>
                          {locationvalue}
                        </label>
                      </div>
                    </div>
                    <div className="column">
                      <div className="align">
                        <label className="myclass" htmlFor="last">
                          <b> lat & long : </b>
                          {center.lat} & {center.lng}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="column">
                      <div className="align">
                        <label className="myclass" htmlFor="last">
                          <b> Transaction Type : </b>
                          {firstStepData.txn_type}
                        </label>
                      </div>
                    </div>
                    <div className="column">
                      <div className="align">
                        <label className="myclass" htmlFor="last">
                          <b> Proximity : </b>
                          {convertMetersToKilometers(
                            updatedProjectData?.proximity ||
                              firstStepData.proximity
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="column">
                      <div className="align">
                        <label className="myclass" htmlFor="last">
                          <b> Transaction Range : </b>
                          Last{" "}
                          {updatedProjectData?.txn_date ||
                            firstStepData.txn_date}
                          Months
                        </label>
                      </div>
                    </div>
                    <div className="column">
                      <div className="align">
                        <label className="myclass" htmlFor="last">
                          <b> Configurations : </b>
                          {selectedConfigurations}
                        </label>
                      </div>
                    </div>
                  </div>{" "}
                  <div className="row">
                    <div className="column">
                      <LoadScript
                        googleMapsApiKey={
                          process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY
                        }
                      >
                        <GoogleMap
                          mapContainerStyle={{ height: "400px" }}
                          center={center}
                          zoom={zoom}
                          onLoad={onLoad}
                        >
                          <Marker
                            position={center}
                            icon={{
                              url: "/images/32px-Map_marker.svg.png",
                            }}
                          />

                          {parentSelectedData.map((marker, index) => (
                            <Marker
                              key={index}
                              position={{
                                lat: parseFloat(marker.lat),
                                lng: parseFloat(marker.long),
                              }}
                            />
                          ))}
                        </GoogleMap>
                      </LoadScript>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grp">
                <div className="row">
                  <div className="column">
                    <div className="align">
                      <label className="myclass" htmlFor="last">
                        <b> Selected Projects : </b>
                      </label>
                    </div>
                    <div className="flex flex-col sm:flex-row">
                      {groupedData.map((group, groupIndex) => (
                        <div
                          key={groupIndex}
                          className="w-full sm:w-1/2 p-4 flex items-center"
                        >
                          <table className="w-full">
                            <thead className="thead">
                              <tr>
                                <th className="text-center">Project</th>
                                <th className="text-center">Txn Count</th>
                              </tr>
                            </thead>
                            <tbody>
                              {group.map((data, i) => (
                                <tr key={i + groupIndex * 5}>
                                  <td
                                    className="truncate text-sm t_data"
                                    title={data.name}
                                  >
                                    {data?.name} , {data?.detailed_area} <br />
                                    {data?.all_config}
                                  </td>
                                  <td className="text-center text-sm t_data">
                                    {data?.each_configuration_count}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grp">
                <div className="row">
                  <div className="column">
                    <div className="align">
                      <label className="myclass" htmlFor="last">
                        <b> Payment Details : </b>
                      </label>
                    </div>
                    <div
                      className={
                        parentSelectedData.length !== 0 ? "" : "hidden"
                      }
                    >
                      <div className="row">
                        <div className="column">
                          <div className="carts">
                            <div className="pt-2 w-full flex justify-between">
                              <p>
                                {" "}
                                Total Selected Projects :{" "}
                                <span
                                  style={{
                                    color: "#f1592a",
                                    fontWeight: "700",
                                  }}
                                >
                                  {parentSelectedData.length}{" "}
                                </span>
                              </p>
                              <p>
                                Total Amount :{" "}
                                <span
                                  style={{
                                    color: "#f1592a",
                                    fontWeight: "700",
                                  }}
                                >
                                  {" "}
                                  Rs.{" "}
                                  {calculateCost
                                    ? calculateCost?.total_cost
                                    : 0}{" "}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="steps-btn">
                <button
                  onClick={handlePrevStep}
                  style={{
                    fontSize: "16px",
                    background: "#BFBFBF",
                    color: "black",
                  }}
                >
                  <ArrowLeftIcon color="#ffffff" />
                  Prev
                </button>
                <button
                  type="submit"
                  style={{ cursor: "pointer" }}
                  className=" btn-secondary"
                  onClick={(e) => razorPayHandler(e, data, token)}
                >
                  <span className="button-text">PAY & GENERATE REPORT</span>
                </button>
              </div>
            </div>
            <div className={loader ? "loader" : "hidden"}>
              <div className="loading"></div>
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
