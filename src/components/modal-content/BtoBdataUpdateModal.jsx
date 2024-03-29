"use client";
import {
  configurations,
  proximity,
  txnDuration,
} from "@/constants/initialStateData";
import { useEffect, useState } from "react";
import Select from "react-select";
import { Button } from "../ui/button";
import ModalWrapper from "../wrappers/ModalWrapper";
import "./BtoBdataUpdateModal.scss";

const BtoBdataUpdateModal = ({
  modalState,
  setModalState,
  setGetUpdateData,
  mobileFilter,
  onUpdateData,
  onSelectedConfigurationsChange,
  dataRange,
  parrentConfigurtions,
  parrentDateRange,
  ParrentProximity,
}) => {
  const [updateData, setUpdateData] = useState({
    proximity: "",
    txn_date: "",
  });
  const [selectedConfigurations, setSelectedConfigurations] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateData({
      ...updateData,
      [name]: value,
    });
  };
  const handleChange = (selectedOptions) => {
    setSelectedConfigurations(selectedOptions);
  };
  useEffect(() => {
    // Call the callback function whenever updateData changes
    onUpdateData(updateData);
    onSelectedConfigurationsChange(
      selectedConfigurations.map((config) => config.value)
    );
  }, [updateData, selectedConfigurations]);

  const arrayOfObjects = parrentConfigurtions.map((value) => ({
    label: value,
    value,
  }));
  return (
    <ModalWrapper
      open={modalState}
      setOpen={setModalState}
      title={
        <div className="text-center flex justify-center gap-2 items-center">
          <hr className="border-[#f1592a] border-2 w-[57px]"></hr>
          <div className="text-[20px]">Update Filters</div>
          <hr className="border-[#f1592a] border-2 w-[57px]"></hr>
        </div>
      }
    >
      <div className="BtoBdataUpdateModal">
        <div
          className={
            mobileFilter === true && dataRange === false ? "hidden" : ""
          }
          style={{ color: "red", fontSize: "14px", marginBottom: "30px" }}
        >
          Not enough data based on the filters selected. Please increase
          <b> proximity </b> OR <b> Transaction date range</b>
        </div>
        {mobileFilter == true && (
          <div className="column">
            <div className="align">
              <label className="myclass" htmlFor="last">
                Configurations :
              </label>
            </div>
            <Select
              isMulti
              name="colors"
              options={configurations}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={handleChange}
              defaultValue={
                selectedConfigurations.length > 0
                  ? selectedConfigurations
                  : arrayOfObjects
              }
              // onFocus={(e) => e.target.blur()}
              styles={{
                menu: (provided, state) => ({
                  ...provided,
                  // add custom styles here
                  top: "auto", // reset the top position
                  bottom: 0, // position the menu at the bottom
                }),
              }}
            />
          </div>
        )}
        <div className="row ">
          <div className="column mb-3">
            <div className="align">
              <label className="myclass" htmlFor="last">
                Proximity of X Km.:
              </label>
              <span style={{ color: "red" }}> *</span>
            </div>
            <select
              className="select_tag"
              name="proximity"
              id=""
              value={updateData.proximity || ParrentProximity}
              onChange={handleInputChange}
              placeholder="select Proximity"
            >
              <>
                <option value="" disabled selected hidden>
                  Select Proximity
                </option>
                {proximity?.map((el) => (
                  <option value={el.value}>{el.name}</option>
                ))}
              </>
            </select>
          </div>

          <div className="column mb-3">
            <div className="align">
              <label className="myclass" htmlFor="last">
                Transaction Date Range:
              </label>
            </div>
            <select
              className="select_tag"
              name="txn_date"
              id=""
              value={updateData.txn_date || parrentDateRange}
              onChange={handleInputChange}
              placeholder="Transaction date"
            >
              <>
                <option value="" disabled selected hidden>
                  Select Transaction Date
                </option>
                {txnDuration?.map((el) => (
                  <option value={el.value}>{el.name}</option>
                ))}
              </>
            </select>
          </div>
        </div>
      </div>
      {mobileFilter === true ? (
        <Button className="bg-green-700" onClick={() => setGetUpdateData(true)}>
          Update Data
        </Button>
      ) : (
        <Button onClick={() => setGetUpdateData(true)}>Submit</Button>
      )}
    </ModalWrapper>
  );
};

export default BtoBdataUpdateModal;
