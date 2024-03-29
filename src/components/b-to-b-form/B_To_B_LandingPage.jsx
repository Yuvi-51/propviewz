"use client";
("use strict");
import { useState } from "react";
// import ValuationReportForm from "./ValuationReportForm";
import { useSelector } from "react-redux";
import "../valuation-report-form/ValuationReportForm.scss";
import B_To_B_From from "./B_To_B_From";

const B_To_B_LandingPage = () => {
  const [selectedOption, setSelectedOption] = useState("A");
  const [showForm, setShowform] = useState(false);
  const [reportDownload, setReportDownload] = useState(false);
  const [uniqueSlug, setUniqueSlug] = useState("");
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
      const url = `https://reports-git-staging-propviewz-tech.vercel.app/project-planning?unique_slug=${uniqueSlug}&token=${token}`;
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
              A project planning report for B2B provides a detailed overview of
              sales, inventory distribution, and future prospects to guide
              effective business planning and growth.
            </div>
          </div>
          <div className="grid-container">
            <div
              class="item1"
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
                onClick={() => handleOptionSelect("D")}
                style={{ background: selectedOption === "D" ? "#f7835f " : "" }}
              >
                {" "}
                D. Generate Report{" "}
              </div>
            </div>
            <div class="item2">
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
                          src="/images/seller.png"
                          alt="buyer"
                        />
                        {""}
                        <p> Developers:</p>
                      </h2>
                      <div style={{ marginLeft: "60px" }}>
                        <p>
                          1. Profitable Investments: Identify lucrative
                          inventory in the report for resource allocation in
                          real estate investments.
                        </p>
                        <p>
                          2. Strategic Collaborations: Partner with analysts and
                          planners using report data for informed
                          collaborations.
                        </p>
                        <p>
                          3. Client Trust: Build client trust with transparent,
                          data-driven consultations using the project planning
                          report.
                        </p>
                        <p>
                          4. Competitive Edge: Stay ahead with market-aligned
                          strategies based on the report's recommendations.
                        </p>
                        <p>
                          4. Project Success: Ensure project success by aligning
                          strategies with the report's insights for market and
                          financial objectives.
                        </p>
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
                          src="/images/buyer.png"
                          alt="buyer"
                        />

                        {""}
                        <p>Investors:</p>
                      </h2>
                      <div style={{ marginLeft: "60px" }}>
                        <p>
                          1. Smart Decision-Making: Make property decisions
                          based on the report's data on sales and inventory
                          distribution.
                        </p>
                        <p>
                          2. Strategic Positioning: Position properties
                          effectively by understanding sales trends and future
                          prospects as per the report.
                        </p>
                        <p>
                          3. Accurate Valuation: Use report insights for precise
                          property valuations, considering buyer preferences and
                          market conditions.
                        </p>
                        <p>
                          4. Risk Management: Spot potential challenges early in
                          the Project Planning to manage risks and make informed
                          decisions.
                        </p>
                        <p>
                          5. Targeted Marketing: Tailor marketing to buyers
                          using the sales curve and profitable inventory data as
                          per the report.
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
                    <B_To_B_From
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

export default B_To_B_LandingPage;
