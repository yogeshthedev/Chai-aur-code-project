import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Play } from "lucide-react";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
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
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    checkAuth();
    setTheme(theme);
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] flex flex-col items-center justify-center text-slate-900 dark:text-zinc-100 transition-colors">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 animate-pulse">
          <Play className="w-6 h-6 fill-current ml-0.5" />
        </div>
        <p className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 mt-4 tracking-widest uppercase">
          Loading VideoFlow...
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
          className: "!rounded-2xl !px-4 !py-3 !text-xs !font-semibold !shadow-xl !backdrop-blur-md !border",
          style: {
            background: "var(--bg-surface)",
            color: "var(--text-primary)",
            borderColor: "var(--border-color)",
          },
          success: {
            iconTheme: {
              primary: "#6366f1",
              secondary: "#ffffff",
            },
          },
          error: {
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


