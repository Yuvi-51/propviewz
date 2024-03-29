const apiUrl = process.env.NEXT_PUBLIC_API_HOST;
export const getBlogDetailsAPI = async (page = 1) => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/blogs?page=${page}`);
    const data = await response.json();
    return {
      blogs: data?.payload?.blogs,
      count: data?.meta?.meta?.total,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const getSimilarBlogsAPI = async (slug) => {
  if (slug) {
    try {
      const response = await fetch(
        `${apiUrl}/api/v1/blogs/other_blogs?slug=${slug}`
      );
      const data = await response.json();
      return data?.payload?.blogs;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
};

export const getSingleBlogAPI = async (slug) => {
  if (slug) {
    try {
      const response = await fetch(`${apiUrl}/api/v1/blogs/${slug}`);
      const data = await response.json();
      return data?.payload?.blog;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
};

export const getBlogStatusAPI = async (status, token, page = 1) => {
  try {
    const response = await fetch(
      `${apiUrl}/api/v1/blogs/my_blog?status=${status}&page=${page}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    const data = await response.json();
    return { total: data?.meta?.meta?.total, blogs: data?.payload?.blogs };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
