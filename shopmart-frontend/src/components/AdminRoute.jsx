import { useAuth } from "../context/AuthContext";
import { Outlet, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminRoute() {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    toast.error("You do not have permission to view this page.");
    return <Navigate to="/" />;
  }

  return <Outlet />;
}