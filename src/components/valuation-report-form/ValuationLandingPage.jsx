"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import ValuationReportForm from "./ValuationReportForm";
import "./ValuationReportForm.scss";

const ValuationLandingPage = () => {
  const [selectedOption, setSelectedOption] = useState("A");
  const [showForm, setShowform] = useState(false);
  const [reportDownload, setReportDownload] = useState(false);
  const [uniqueSlug, setUniqueSlug] = useState("");
  const [step, setStep] = useState(1);
  const VALUATION_REPORT_HOST = process.env.NEXT_PUBLIC_VALUATION_HOST;
  const token = useSelector((state) => state.auth.token);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    if (option === "D") {
      setReportDownload(false);
    }
  };
  window.addEventListener("message", (event) => {
    if (event.origin === "https://propviewz.com" && event.data === "hideLogo") {
      const logoBarElement = document.getElementById("logoBar");
      if (logoBarElement) {
        logoBarElement.style.display = "none";
      }
    }
  });

  const handelReportDownload = () => {
    if (uniqueSlug) {
      const url = `https://reports-git-staging-propviewz-tech.vercel.app/valuation?unique_slug=${uniqueSlug}&token=${token}`;
      window.open(url, "_blank");
    }
  };
  return (
    <>
      <div className={showForm ? "hidden" : "Valuation-report-container"}>
        <div className="Valuation-report">
          <div
            className="steps"
            style={{
              flexDirection: "column",
              marginBottom: "0",
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="ivr_desc">
              Instant Valuation Report (First time in India) Estimate current
              market value of any property in 3 simple steps!
            </div>
          </div>
          <div className="grid-container">
            <div
              className="item1"
              style={{ boxShadow: "4px 0px 4px rgba(0, 0, 0, 0.1)" }}
            >
              <div
                onClick={() => handleOptionSelect("A")}
                style={{ background: selectedOption === "A" ? "#f7835f " : "" }}
              >
                A. Use / Why to Generate
              </div>
              <div
                onClick={() => handleOptionSelect("B")}
                style={{ background: selectedOption === "B" ? "#f7835f " : "" }}
              >
                B. How it works
              </div>
              <div
                onClick={() => handleOptionSelect("C")}
                style={{ background: selectedOption === "C" ? "#f7835f " : "" }}
              >
                C. Sample / Content report
              </div>
              <div
                onClick={() => {
                  handleOptionSelect("D"), setStep(1);
                }}
                style={{ background: selectedOption === "D" ? "#f7835f " : "" }}
              >
                {" "}
                D. Generate Report{" "}
              </div>
            </div>
            <div className="item2">
              {selectedOption === "A" && (
                <div className="A">
                  <ul>
                    <li>
                      <h2 className="flex">
                        <img
                          style={{
                            width: "34px",
                            height: "34px",
                            marginRight: "20px",
                          }}
                          src="/images/buyer.png"
                          alt="buyer"
                        />
                        {""}
                        <p>Buyers:</p>
                      </h2>
                      <div style={{ marginLeft: "60px" }}>
                        <p>1. Can help save lacs!</p>
                        <p>
                          2. Assess fair market value before purchasing/leasing
                        </p>
                        <p>3. Supports in negotiation process</p>
                      </div>
                    </li>
                    <li>
                      <h2 className="flex">
                        <img
                          style={{
                            width: "34px",
                            height: "34px",
                            marginRight: "20px",
                          }}
                          src="/images/seller.png"
                          alt="buyer"
                        />
                        {""}
                        <p>Sellers:</p>
                      </h2>
                      <div style={{ marginLeft: "60px" }}>
                        <p>1. Get true value of your property!</p>
                        <p>2. Helps set an appropriate listing price</p>
                        <p>3. Supports in negotiation process</p>
                      </div>
                    </li>
                    <li>
                      <h2 className="flex">
                        <img
                          style={{
                            width: "34px",
                            height: "34px",
                            marginRight: "20px",
                          }}
                          src="/images/talk.png"
                          alt="buyer"
                        />
                        {""}
                        <p>Consultants/Brokers:</p>
                      </h2>
                      <div style={{ marginLeft: "60px" }}>
                        <p>1. Helps providing clients with market insights</p>
                        <p>2. Improves your perception in front of client</p>
                        <p>
                          3. Useful to get buyer & seller on same page to close
                          deals
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              )}
              {selectedOption === "B" && (
                <div className="B" id="div-id">
                  <video className="video_preview" controls>
                    <source
                      src="https://drive.google.com/uc?export=download&id=13xMuzvKWgra-klKJlCFR9MwcLJgY78m1"
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
              {selectedOption === "C" && (
                <div className="C">
                  <iframe
                    src="https://online.fliphtml5.com/kbrlx/vxqx/"
                    width="100%"
                    height="380"
                    scrolling="no"
                    frameborder="0"
                    allowfullscreen=""
                    allow="clipboard-write"
                  ></iframe>
                </div>
              )}
              {selectedOption === "D" && (
                <div className="D">
                  {reportDownload ? (
                    <div className="congrats_page">
                      <img src="/images/review added.svg" />
                      <div className="congratulations">Congratulations..</div>
                      <div>
                        Your report has been downloaded check your download or{" "}
                        <span
                          onClick={handelReportDownload}
                          style={{
                            color: "blue",
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                        >
                          click here
                        </span>{" "}
                        to download report again.
                      </div>
                      <div>
                        You can also download the report from{" "}
                        <span style={{ color: "#f1592a" }}>
                          {" "}
                          Profile » My Orders section
                        </span>
                      </div>
                    </div>
                  ) : (
                    <ValuationReportForm
                      setReportDownload={setReportDownload}
                      setUniqueSlug={setUniqueSlug}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ValuationLandingPage;
