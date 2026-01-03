import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, authChecked } = useSelector((state) => state.auth);

  if (!authChecked) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;
