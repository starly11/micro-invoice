import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/app/features/auth/store/authStore";

export const PublicRoute = () => {
  const user = useAuthStore(state => state.user);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
