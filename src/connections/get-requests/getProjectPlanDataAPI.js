const apiUrl = process.env.NEXT_PUBLIC_API_HOST;

export const getProjectPlanDataAPI = async (
  firstStepData,
  locationId,
  selectedConfigurations,
  center,
  token,
  updatedProjectData
) => {
  try {
    const response = await fetch(
      `${apiUrl}/api/v1/projects/project_planning_report?location_id=${locationId}&company_name=${
        firstStepData.companyName
      }&configurations=${selectedConfigurations}&transaction_type=${
        firstStepData.txn_type
      }&transaction_date=${
        updatedProjectData?.txn_date || firstStepData.txn_date
      }&lat=${center?.lat}&long=${center?.lng}&distance=${
        updatedProjectData?.proximity || firstStepData.proximity
      }`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();

    const responseData = {
      data: data,
      count: data,
    };

    return responseData;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
