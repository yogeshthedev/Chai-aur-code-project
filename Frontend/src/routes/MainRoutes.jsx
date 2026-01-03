import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import VideoDetail from "../pages/VideoDetail";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Home from "./../pages/Home";

const MainRoutes = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/watch/:id"
        element={
          <ProtectedRoute>
            <VideoDetail />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default MainRoutes;
