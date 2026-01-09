import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import VideoDetail from "../pages/VideoDetail";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Home from "./../pages/Home";
import Profile from "../pages/Profile";

import Channel from "./../pages/Channel/Channel";
import Playlist from "../pages/Playlist/Playlist";
import PlaylistDetail from "../pages/Playlist/PlaylistDetail";

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
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/c/:username"
        element={
          <ProtectedRoute>
            <Channel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/playlists"
        element={
          <ProtectedRoute>
            <Playlist />
          </ProtectedRoute>
        }
      />
      <Route
        path="/playlist/:playlistId"
        element={
          <ProtectedRoute>
            <PlaylistDetail />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default MainRoutes;
