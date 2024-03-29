"use client";

import axios from "axios";
import { useSelector } from "react-redux";

function PrivateInstance() {
  const token = useSelector((state) => state.auth.token);

  const privateAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_HOST,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return privateAxios;
}

export default PrivateInstance;
