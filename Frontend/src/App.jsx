import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Play } from "lucide-react";
import { useAuthStore } from "./store/useAuthStore";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import VideoDetail from "./pages/VideoDetail";
import Channel from "./pages/Channel";
import Profile from "./pages/Profile";
import History from "./pages/History";
import LikedVideos from "./pages/LikedVideos";
import Playlists from "./pages/Playlists";
import PlaylistDetail from "./pages/PlaylistDetail";
import Dashboard from "./pages/Dashboard";
import UploadVideo from "./pages/UploadVideo";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import RootLayout from "./layouts/RootLayout";

function App() {
  const { checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-(--bg-primary) flex flex-col items-center justify-center text-(--text-primary)">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-red-600 text-white shadow-lg shadow-red-500/25 animate-pulse">
          <Play className="w-6 h-6 fill-current ml-0.5" />
        </div>
        <p className="text-[11px] font-bold text-(--text-muted) mt-4 tracking-widest uppercase">
          Loading VideoTube...
        </p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {/* Toast Notification Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: "!rounded-2xl !px-4 !py-3 !text-xs !font-semibold !shadow-xl !backdrop-blur-md",
          style: {
            background: "rgba(24, 24, 27, 0.95)",
            color: "#f4f4f5",
            border: "1px solid rgba(63, 63, 70, 0.4)",
          },
          success: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
        }}
      />

      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/videos/:videoId" element={<VideoDetail />} />
            <Route path="/c/:username" element={<Channel />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/history" element={<History />} />
            <Route path="/liked" element={<LikedVideos />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/playlists/:playlistId" element={<PlaylistDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<UploadVideo />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


