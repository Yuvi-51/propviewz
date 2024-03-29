const apiUrl = process.env.NEXT_PUBLIC_API_HOST;

export const getProjectReviewsAPI = async (
  projectId,
  type,
  reviews_order,
  pageNumber,
  token
) => {
  if (projectId && type && reviews_order && pageNumber) {
    try {
      const url = `${apiUrl}/api/v1/project_reviews?project_id=${projectId}&reviews_filter=${type}&reviews_order=${reviews_order}&page=${pageNumber}`;

      const headers = token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {};

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.log("failed to fetch", error);
    }
  }
};

export const getProjectReviewCommentsAPI = async (
  projectId,
  itemId,
  commentCount
) => {
  if (projectId && itemId && commentCount) {
    try {
      const url = `${apiUrl}/api/v1/comments?commentable_type=ProjectReview&project_id=${projectId}&commentable_id=${itemId}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data = await response.json();
      return data?.payload?.comments;
    } catch (error) {
      console.log("failed to fetch", error);
    }
  }
};
