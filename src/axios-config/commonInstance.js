import axios from "axios";

const commonInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
});

// commonInstance.defaults.headers.common["Authorization"] = "Bearer ";

export default commonInstance;
