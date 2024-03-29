"use client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createContext, useContext } from "react";
import { useSelector } from "react-redux";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const token = useSelector((state) => state.auth.token);
  const isAuthenticated = !!token;

  const value = {
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID}
      >
        {children}
      </GoogleOAuthProvider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
