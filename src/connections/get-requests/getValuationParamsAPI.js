const hostUrl = process.env.NEXT_PUBLIC_API_HOST;

export const getValuationParamsAPI = async (
  token,
  projectid,
  configuration,
  unit,
  category,
  newProject,
  txntype
) => {
  try {
    if (!newProject && projectid && txntype) {
      const queryParams = [
        projectid && `project_id=${projectid}`,
        txntype && `transaction_type=${txntype}`,
        category && `unit_category=${category}`,
        unit && `unit_type=${unit}`,
        configuration && `configuration=${configuration}`,
      ];

      const apiUrl = `${hostUrl}/api/v1/projects/ivr_params_dependancy?${queryParams
        .filter(Boolean)
        .join("&")}`;

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(apiUrl, { headers });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      const responseData = {
        data: data?.payload,
      };

      return responseData;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle the error as needed
    throw error;
  }
};
