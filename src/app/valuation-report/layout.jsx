import ReportsHeader from "@/components/header/reports-header/ReportsHeader";
import React from "react";

export default function ValuationReportLayout({ children }) {
  const childDataTitle = "Instant Valuation Report";
  const childDataDesc =
    "Instant Valuation Report (First time in India) Estimate current market value of any property in 3 simple steps!";
  return (
    <>
      <ReportsHeader
        childDataTitle={childDataTitle}
        childDataDesc={childDataDesc}
      />
      {children}
    </>
  );
}
