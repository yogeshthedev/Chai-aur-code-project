import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Lock, User, Eye, EyeOff, ArrowRight, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const Login = () => {
  const { login, isSubmitting, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const backgroundLocation =
    location.state?.backgroundLocation || location.state?.from || { pathname: "/" };
  const redirectTarget = location.state?.from?.pathname || backgroundLocation?.pathname || "/";

  // If user is already authenticated, close popup and redirect
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTarget, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTarget]);

  // Lock body scroll while modal is open & add Escape key listener
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        navigate(backgroundLocation?.pathname || "/");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate, backgroundLocation]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const handleClose = () => {
    navigate(backgroundLocation?.pathname || "/");
  };

  const onSubmit = async (data) => {
    const isEmail = data.identifier.includes("@");
    const payload = isEmail
      ? { email: data.identifier.trim(), password: data.password }
      : { username: data.identifier.trim(), password: data.password };

    const result = await login(payload);
    if (result.success) {
      navigate(redirectTarget, { replace: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dimmed Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={handleClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md rounded-xl border border-white/12 bg-[#121212] p-6 sm:p-8 shadow-2xl z-10 space-y-6 animate-in zoom-in-95 duration-200">
        {/* Header Strip: Brand + Title + Close Button */}
        <div className="flex items-start justify-between pb-4 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#18181B] border border-white/15 text-[#FAFAF8] font-display font-black text-sm">
              R<span className="text-[#FF5A36]">.</span>
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-[#FAFAF8]">
                Sign In to Studio
              </h2>
              <p className="font-mono text-[11px] text-[#71717A]">
                Enter your email address or channel handle
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="p-1 rounded-md text-[#71717A] hover:text-[#FAFAF8] hover:bg-white/6 transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-lg bg-[#18181B] p-1 border border-white/6 font-mono text-xs">
          <button
            type="button"
            className="flex-1 py-1.5 rounded-md bg-[#FF5A36] text-[#0A0A0A] font-bold shadow-xs cursor-default"
          >
            Sign In
          </button>
          <Link
            to="/register"
            state={{ backgroundLocation, from: location.state?.from }}
            className="flex-1 py-1.5 rounded-md text-center text-[#71717A] hover:text-[#FAFAF8] transition"
          >
            Create Account
          </Link>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Identifier Input */}
          <div className="space-y-1">
            <label className="block font-mono text-xs text-[#71717A] uppercase tracking-wider">
              Email or Handle <span className="text-[#FF5A36]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#71717A]">
                <User size={14} />
              </div>
              <input
                type="text"
                autoFocus
                placeholder="name@example.com or @username"
                className={`w-full pl-9 pr-3.5 py-2.5 text-xs bg-[#18181B] text-[#FAFAF8] placeholder:text-[#71717A] rounded-md border transition-colors outline-none focus:border-[#FF5A36] ${
                  errors.identifier ? "border-rose-500 text-rose-300" : "border-white/10 hover:border-white/20"
                }`}
                {...register("identifier", {
                  required: "Email or username is required",
                })}
              />
            </div>
            {errors.identifier && (
              <p className="font-mono text-[11px] text-rose-500 mt-1">{errors.identifier.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="block font-mono text-xs text-[#71717A] uppercase tracking-wider">
              Password <span className="text-[#FF5A36]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#71717A]">
                <Lock size={14} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full pl-9 pr-10 py-2.5 text-xs bg-[#18181B] text-[#FAFAF8] placeholder:text-[#71717A] rounded-md border transition-colors outline-none focus:border-[#FF5A36] ${
                  errors.password ? "border-rose-500 text-rose-300" : "border-white/10 hover:border-white/20"
                }`}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#71717A] hover:text-[#FAFAF8] transition cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {errors.password && (
              <p className="font-mono text-[11px] text-rose-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-[#FF5A36] hover:bg-[#FF704E] text-[#0A0A0A] py-2.5 px-4 font-mono text-xs font-bold transition active:scale-[0.99] disabled:opacity-50 cursor-pointer shadow-sm mt-2"
          >
            <span>{isSubmitting ? "Authenticating..." : "Initialize Session"}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        {/* Footer */}
        <div className="pt-3 border-t border-white/6 text-center font-mono text-xs text-[#71717A]">
          Don't have a curator account?{" "}
          <Link
            to="/register"
            state={{ backgroundLocation, from: location.state?.from }}
            className="text-[#FF5A36] font-semibold hover:underline"
          >
            Register Handle →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
