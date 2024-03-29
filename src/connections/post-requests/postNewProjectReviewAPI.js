import axios from "@/axios-config/commonInstance";

export const postNewProjectReviewAPI = async (payload, token) => {
  try {
    const { data } = await axios.post(
      `/api/v1/project_reviews`,
      {
        project_name: payload?.project_name,
        project_review: {
          project_id: payload?.project_id,
          overall_rating: payload?.project_review?.overall_rating,
          location_rating: payload?.project_review?.location_rating,
          amenities_rating: payload?.project_review?.amenities_rating,
          floor_plan_rating: payload?.project_review?.floor_plan_rating,
          value_for_money_rating:
            payload?.project_review?.value_for_money_rating,
          customer_service_rating:
            payload?.project_review?.customer_service_rating,
          reviewer_type: payload?.project_review?.reviewer_type,
          text: payload?.project_review?.text,
          project_medias_attributes:
            payload?.project_review?.project_medias_attributes,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    // throw new Error("Couldn't get top projects");
    console.log("Error post review");
  }
};
