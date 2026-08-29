import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <p>Checking your session...</p>;
  }

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
