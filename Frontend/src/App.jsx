import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Play, LogOut, User, Video, ShieldCheck } from "lucide-react";
import { useAuthStore } from "./store/useAuthStore";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Button from "./components/Button";

function HomePage() {
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg p-8 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl text-center space-y-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-600/10 text-red-500 border border-red-500/20">
          <Play className="w-7 h-7 fill-current" />
        </div>

        <div>
          <h1 className="text-3xl font-black tracking-tight">VideoTube</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Industry-Level Fullstack Video Platform
          </p>
        </div>

        {isAuthenticated && user ? (
          <div className="p-4 bg-zinc-800/80 rounded-xl border border-zinc-700 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.fullName}
                className="w-12 h-12 rounded-full object-cover border border-red-500"
              />
              <div className="text-left">
                <h3 className="font-semibold text-white">{user.fullName}</h3>
                <p className="text-xs text-zinc-400">@{user.username}</p>
                <p className="text-xs text-zinc-500">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-700 text-xs text-zinc-400">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" /> Session Verified
              </span>
              <Button
                variant="danger"
                size="sm"
                icon={LogOut}
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-zinc-400">
              Authentication Module is configured and ready.
            </p>
            <div className="flex gap-3 justify-center">
              <Link to="/login">
                <Button variant="primary" size="md">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="secondary" size="md">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const { checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-600/10 text-red-500 animate-pulse border border-red-500/20">
          <Play className="w-7 h-7 fill-current" />
        </div>
        <p className="text-xs text-zinc-500 mt-4 tracking-widest uppercase">
          Initializing Session...
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
          style: {
            background: "#18181b",
            color: "#f4f4f5",
            border: "1px solid #27272a",
            fontSize: "13px",
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
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


