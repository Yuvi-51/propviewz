const apiUrl = process.env.NEXT_PUBLIC_API_HOST;

export const getUserActivityLogsAPI = async (trackable_type, token) => {
  try {
    if (trackable_type) {
      let endpoint;

      if (trackable_type === "ValuationReport") {
        endpoint = `${apiUrl}/api/v1/users/fetch_report_activity_logs?trackable_type=Report&plan_type=valuation_report`;
      } else if (trackable_type === "ProjectPlanningReport") {
        endpoint = `${apiUrl}/api/v1/users/fetch_report_activity_logs?trackable_type=Report&plan_type=project_planning_report`;
      } else {
        endpoint = `${apiUrl}/api/v1/users/fetch_activity_logs?trackable_type=${trackable_type}`;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(endpoint, { headers });

      if (!response.ok) {
        throw new Error("Error getting activity logs");
      }

      const data = await response.json();
      return data?.payload?.activity_logs;
    }
  } catch (error) {
    console.log("Error getting activity logs", error);
  }
};
