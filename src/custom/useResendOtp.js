"use client";

import { useState, useEffect } from "react";

export function useResendOtp() {
  const [resendTimer, setResendTimer] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);

  useEffect(() => {
    if (resendTimer > 0 && resendDisabled) {
      const interval = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (resendTimer === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [resendTimer, resendDisabled]);

  const startResendTimer = () => {
    setResendTimer(30);
    setResendDisabled(true);
  };

  return {
    resendTimer,
    resendDisabled,
    startResendTimer,
  };
}
