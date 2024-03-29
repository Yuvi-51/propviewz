"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./PaymentScheduleForm.scss";

import ReactGA from "react-ga";
import ProtectedRouteWrapper from "../wrappers/ProtectedRouteWrapper";

export default function PaymentScheduleForm() {
  const [pname, setPname] = useState("");
  const [city, setCity] = useState("");
  const [buildname, setBuildName] = useState("");
  const [location, setLocation] = useState("");
  const [basement, setBasement] = useState();
  const [floors, setFloors] = useState();
  const [floorsData, setFloorsData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [changeTotal, setChangeTotal] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { user } = useSelector((state) => state.user);
  const token = useSelector((state) => state.auth.token);

  const router = useRouter();
  const onClick = (e) => {
    e.preventDefault();
    router.push(`/`);
  };
  let total = parseInt(basement) + parseInt(floors) + 1 || 0;

  let fields = pname && city && buildname && location && total;

  const floorSlice = floors > 9 ? floorsData.slice(2) : floorsData.slice(1);
  const tableDataSlice = basement > 9 ? tableData.slice(2) : tableData.slice(1);

  const handleDeleteRow = (id) => {
    ReactGA.event({
      category: "User",
      action: "User Deleted a Row from Payment schedule",
      label: "Button Click",
    });
    const updatedTableData = tableData.filter((row) => row.id !== id);
    const data1 = updatedTableData.map((item) => {
      return { ...item, value: (25 / (changeTotal - 1)).toFixed(2) };
    });
    const data2 = floorsData.map((item) => {
      return { ...item, value: (25 / (changeTotal - 1)).toFixed(2) };
    });
    setTableData(data1);
    setFloorsData(data2);
    setChangeTotal(changeTotal - 1);
  };

  const handleDeleteFloor = (id) => {
    ReactGA.event({
      category: "User",
      action: "User Deleted a Row from Payment schedule",
      label: "Button Click",
    });
    const updatedFloorsData = floorsData.filter((row) => row.id !== id);
    const data1 = updatedFloorsData.map((item) => {
      return { ...item, value: (25 / (changeTotal - 1)).toFixed(2) };
    });
    const data2 = tableData.map((item) => {
      return { ...item, value: (25 / (changeTotal - 1)).toFixed(2) };
    });
    setFloorsData(data1);
    setTableData(data2);
    setChangeTotal(changeTotal - 1);
  };

  useEffect(() => {
    let total = parseInt(basement) + parseInt(floors) + 1 || 0;

    setChangeTotal(total);
  }, [basement, floors]);

  const myHandler = () => {
    const newRows = [];
    const newSlabs = [];
    for (let i = basement; i >= 0; i--) {
      if (i === 0) {
        let newRow = {
          id: i,
          name: `Completion of Ground`,
          value: `${(25 / changeTotal).toFixed(2)}`,
        };
        newRows.push(newRow);
      } else {
        let newRow = {
          id: i,
          name: `Completion of basement ${i}`,
          value: `${(25 / changeTotal).toFixed(2)}`,
        };
        newRows.push(newRow);
      }
    }
    setTableData([...basement, ...newRows]);

    for (let i = 0; i < floors; i++) {
      let newSlab = {
        id: i,
        name: `${i + 1}`,
        value: `${(25 / changeTotal).toFixed(2)}`,
      };
      newSlabs.push(newSlab);
    }
    setFloorsData([...floors, ...newSlabs]);
  };

  const changeTotalHandler = (myHandler) => {
    myHandler();
  };
  const clickHandler = (event) => {
    ReactGA.event({
      category: "User",
      action: "User Clicked on submit to generate Payment schedule",
      label: "Button Click",
    });
    event && event.preventDefault();
    setIsSubmitted(true);
    changeTotalHandler(myHandler);
  };

  function CreatePDFfromHTML() {
    ReactGA.event({
      category: "User",
      action: "User Downloaded PDF of Payment schedule",
      label: "Button Click",
    });
    var HTML_Width = $("#content").width();
    var HTML_Height = $("#content").height();
    var top_left_margin = 15;
    var PDF_Width = HTML_Width + top_left_margin * 2;
    var PDF_Height = PDF_Width * 1.5 + top_left_margin * 2;
    var canvas_image_width = HTML_Width;
    var canvas_image_height = HTML_Height;
    var elementsToInclude = $(".icon").remove(); //for removing cross
    var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

    html2canvas($("#content")[0]).then(function (canvas) {
      var imgData = canvas.toDataURL("image/jpeg", 1.0);
      var pdf = new jsPDF("p", "pt", [PDF_Width, PDF_Height]);
      pdf.addImage(
        imgData,
        "JPG",
        top_left_margin,
        top_left_margin,
        canvas_image_width,
        canvas_image_height
      );
      for (var i = 1; i <= totalPDFPages; i++) {
        pdf.addPage(PDF_Width, PDF_Height, elementsToInclude);
        pdf.addImage(
          imgData,
          "JPG",
          top_left_margin,
          -(PDF_Height * i) + top_left_margin * 4,
          canvas_image_width,
          canvas_image_height
        );
      }
      pdf.save("Payment_Schedule.pdf");
    });
  }
  return (
    <div className="payment-schedule">
      <div className="container">
        <div className="Project-Details">
          <div>
            <p className="text-center text-[22px] font-semibold">
              Create Construction Linked Payment Schedule as per MahaRERA
            </p>
            <p className="hr-line"></p>
            <p className="label"> Project Details:</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[60px] gap-y-4">
          <div>
            <label className="block mb-1 font-medium required">
              Project Name:
            </label>
            <input
              className="w-full px-3 py-2 border rounded"
              onChange={(e) => setPname(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium required">City :</label>
            <input
              className="w-full px-3 py-2 border rounded"
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium required">
              Building Name:
            </label>
            <input
              className="w-full px-3 py-2 border rounded"
              onChange={(e) => setBuildName(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium required">
              Location :
            </label>
            <input
              className="w-full px-3 py-2 border rounded"
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="Project-Details">
          <div>
            <p className="hr-line"></p>
            <p className="label">Structure Details:</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[60px] gap-y-4">
          <div>
            <label className="block mb-1 font-medium required">
              No of Basement:
            </label>
            <input
              className="w-full px-3 py-2 border rounded"
              type="number"
              onChange={(e) => setBasement(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium required">
              No of Floors above Ground (Including Terrace) :
            </label>
            <input
              className="w-full px-3 py-2 border rounded"
              type="number"
              onChange={(e) => setFloors(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium required ">
              <b>Total RCC Structure :</b>
            </label>
            <input
              className="w-full px-3 py-2 border rounded"
              readOnly
              value={total}
            />
            <span className={total ? "" : "hidden"} style={{ color: "green" }}>
              By default added Ground Floor value
            </span>
          </div>
          <div className="form-group col-md-5 invisible"></div>
        </div>

        <div className="Project-Details">
          <p className="hr-line"></p>
        </div>
        {fields ? (
          <ProtectedRouteWrapper
            callback={clickHandler}
            triggerElement={
              <div className="text-center my-5">
                <button className={"generate-payment-btn"}>
                  Generate Payment Schedule
                </button>
              </div>
            }
          >
            <div className="text-center my-5">
              <button className={"generate-payment-btn"} onClick={clickHandler}>
                Generate Payment Schedule
              </button>
            </div>
          </ProtectedRouteWrapper>
        ) : (
          <div className="text-center my-5">
            <button className={"disable"}>Generate Payment Schedule</button>
          </div>
        )}
        {isSubmitted && (
          <div>
            <div id="content">
              <div className="table-header">
                <h4 className="text-[23px] font-bold">
                  {pname}-{buildname}
                </h4>
                <h6 className="text-[20px] font-semibold">
                  {location}, {city}
                </h6>
                <p>Construct Linked Payment Schedule as per MahaRERA</p>
              </div>
              <table className="table table-bordered table-striped">
                <tbody>
                  <tr>
                    <td className="p-2">
                      <b>Payment Stage</b>
                    </td>
                    <td className="p-2">
                      <b>% of Agreement Value </b>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2">Booking</td>
                    <td className="p-2">9.9%</td>
                  </tr>
                  <tr>
                    <td className="p-2">Agreement Registration</td>
                    <td className="p-2">20.1%</td>
                  </tr>
                  <tr>
                    <td className="p-2 ">Completion of Footing/Plinth</td>
                    <td className="p-2">15.00%</td>
                  </tr>
                  {tableDataSlice.map((row) => (
                    <tr key={row.id}>
                      <td className="p-2">{row.name}</td>
                      <td className="flex justify-between p-2">
                        {row.value}%
                        <i
                          className="icon"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDeleteRow(row.id)}
                        >
                          ×
                        </i>
                      </td>
                    </tr>
                  ))}
                  {floorSlice.map((row) => (
                    <tr key={row.id}>
                      <td className="p-2">{row.name}</td>
                      <td className="flex justify-between p-2">
                        {row.value}%
                        <i
                          className="icon"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDeleteFloor(row.id)}
                        >
                          ×
                        </i>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="p-2">
                      Completion of walls, internal plaster, floorings, door &
                      windows, Sanitary fittings, staircases, lift wells,
                      lobbies up to the floor level on the Apartment.
                    </td>
                    <td className="p-2">5%</td>
                  </tr>
                  <tr>
                    <td className="p-2">
                      Completion of the external plumbing and external plaster,
                      elevation, terraces with waterproofing of the building or
                      wing in which the Apartment.
                    </td>
                    <td className="p-2">10%</td>
                  </tr>
                  <tr>
                    <td className="p-2">
                      Completion of the lifts, water pump, electrical fittings,
                      electro, mechanical and environments requirements,
                      entrance lobby/s, plinth protection, paving of areas
                      appertain and all another requirements as may be
                      prescribed in the agreement of sale of the building or
                      wing in which the said Apartment
                    </td>
                    <td className="p-2">10%</td>
                  </tr>
                  <tr>
                    <td className="p-2">
                      At the time of handling over the possession of the
                      Apartment OR after receipt of occupancy/ completion
                      certificate, whichever is earlier.
                    </td>
                    <td className="p-2">5%</td>
                  </tr>
                  <tr>
                    <td className="p-2">Total</td>
                    <td className="p-2">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="text-center my-5">
              <button
                className="generate-payment-btn"
                onClick={CreatePDFfromHTML}
              >
                Download (Excel/Word/PDF)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
