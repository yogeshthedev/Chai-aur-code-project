import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import ProtectedRoute from "./routes/ProtectedRoute";
import RootLayout from "./layouts/RootLayout";

// 🚀 Dynamic Route Code-Splitting
// Pages are loaded on-demand when the user visits the route, reducing the initial bundle size.
const Home = lazy(() => import("./pages/Home"));
const VideoDetail = lazy(() => import("./pages/VideoDetail"));
const Channel = lazy(() => import("./pages/Channel"));
const Profile = lazy(() => import("./pages/Profile"));
const History = lazy(() => import("./pages/History"));
const LikedVideos = lazy(() => import("./pages/LikedVideos"));
const Playlists = lazy(() => import("./pages/Playlists"));
const PlaylistDetail = lazy(() => import("./pages/PlaylistDetail"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const UploadVideo = lazy(() => import("./pages/UploadVideo"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

// Lightweight fallback loader while lazy chunks are fetched over the network
const PageLoader = () => (
  <div className="w-full min-h-[50vh] flex items-center justify-center">
    <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#18181B] border border-white/10 text-[#FAFAF8] font-display font-bold text-xs animate-pulse">
      R<span className="text-[#FF5A36]">.</span>
    </div>
  </div>
);

function AppRoutes() {
  const location = useLocation();
  const state = location.state;
  const isAuthModalRoute = location.pathname === "/login" || location.pathname === "/register";

  // If user navigated to /login or /register, the underlying page stays active in the background
  const backgroundLocation = isAuthModalRoute
    ? state?.backgroundLocation || state?.from || { pathname: "/" }
    : null;

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes location={backgroundLocation || location}>
        {/* Global Root Layout — Open Public Viewing */}
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/videos/:videoId" element={<VideoDetail />} />
          <Route path="/c/:username" element={<Channel />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/playlists/:playlistId" element={<PlaylistDetail />} />

          {/* Protected Creator & Personal Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/history" element={<History />} />
            <Route path="/liked" element={<LikedVideos />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<UploadVideo />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Modal Popup Overlay for Authentication Routes */}
      {isAuthModalRoute && (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      )}
    </Suspense>
  );
}

function App() {
  const { checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-[#FAFAF8]">
        <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#18181B] border border-white/15 text-[#FAFAF8] font-display font-black text-lg animate-pulse">
          R<span className="text-[#FF5A36]">.</span>
        </div>
        <p className="font-mono text-[11px] font-medium text-[#71717A] mt-4 tracking-widest uppercase">
          Initializing Reelio Index...
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
          className: "!rounded-md !px-3.5 !py-2.5 !text-xs !font-mono !shadow-2xl !backdrop-blur-md !border",
          style: {
            background: "#18181B",
            color: "#FAFAF8",
            borderColor: "rgba(255, 255, 255, 0.12)",
          },
          success: {
            iconTheme: {
              primary: "#FF5A36",
              secondary: "#0A0A0A",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#FAFAF8",
            },
          },
        }}
      />

      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
