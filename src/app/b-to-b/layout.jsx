import React from "react";
import "../profile/ProfileStyles.scss";
import ReportsHeader from "@/components/header/reports-header/ReportsHeader";

export default function Form({ children }) {
  const childDataTitle = "Project Planning Report";
  const childDataDesc =
    "It is similar to a valuation report, giving detailed information on sales, inventory distribution, and future prospects for effective Project Planning";
  return (
    <>
      <header>
        <ReportsHeader
          childDataTitle={childDataTitle}
          childDataDesc={childDataDesc}
        />
      </header>
      {children}
    </>
  );
}
