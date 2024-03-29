"use client";
import { getTokenStatusAPI } from "@/connections/get-requests/getTokenStatusAPI";
import useAsync from "@/custom/useAsync";
import { removeToken } from "@/store/slices/authSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const TokenValidation = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const { loading, error, value } = useAsync(getTokenStatusAPI, [], [token]);
  useEffect(() => {
    if (value?.status === "unauthorized") {
      dispatch(removeToken());
    }
  }, [value]);
  return <div></div>;
};

export default TokenValidation;
