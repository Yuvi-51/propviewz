"use client";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import LoginModal from "../modal-content/LoginModal";

export default function ProtectedRouteWrapper({
  children,
  triggerElement,
  callback,
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    children
  ) : (
    <LoginModal triggerElement={triggerElement} callback={callback} />
  );
}
