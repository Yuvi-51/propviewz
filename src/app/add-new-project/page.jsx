import AddNewProjectForm from "@/components/add-new-project-form/AddNewProjectForm";
import Link from "next/link";
import React from "react";

export default function AddNewProject() {
  return (
    <main>
      <div className="my-profile container">
        <div className="my-profile-header">
          <p className="heading flex justify-between">
            Project Details{" "}
            <Link
              href={"/"}
              className="border-[#f1592a] border-1 rounded-[4px] p-[10px] text-[13px] cursor-pointer text-[#f1592a] transition ease-in delay-100 hover:bg-[#f1592a] hover:text-white"
            >
              Cancel Project
            </Link>
          </p>
          <p className="hr-line"></p>
        </div>
        <AddNewProjectForm />
      </div>
    </main>
  );
}
