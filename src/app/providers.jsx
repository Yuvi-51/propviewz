// app/providers.tsx
"use client";
import TokenValidation from "@/components/auth/TokenValidation";
import { otherCarouselSettings } from "@/constants/carouselSettings";
import { AuthProvider } from "@/context/authContext";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useState } from "react";
import Slider from "react-slick";

const ReduxProvider = dynamic(() => import("@/store/reduxProvider"), {
  ssr: false,
});

export function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider>
        <AuthProvider>
          <NextUIProvider>
            {children}
            <TokenValidation />
          </NextUIProvider>
        </AuthProvider>
      </ReduxProvider>
    </QueryClientProvider>
  );
}

export function SliderProvider({ children, settings, className }) {
  return (
    <Slider {...otherCarouselSettings} {...settings} className={className}>
      {children}
    </Slider>
  );
}
