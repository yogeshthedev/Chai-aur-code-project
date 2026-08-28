import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Play, Mail, Lock, User } from "lucide-react";
import Input from "../components/Input";

import Button from "../components/Button";
import { useAuthStore } from "../store/useAuthStore";

const Login = () => {
  const { login, isSubmitting } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      identifier: "", // Can be email or username
      password: "",
    },
  });

  const onSubmit = async (data) => {
    const isEmail = data.identifier.includes("@");
    const payload = isEmail
      ? { email: data.identifier, password: data.password }
      : { username: data.identifier, password: data.password };

    const result = await login(payload);
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-zinc-950 text-white">
      <div className="w-full max-w-md p-8 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl space-y-6">
        {/* Brand Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-600/10 text-red-500 mb-2 border border-red-500/20">
            <Play className="w-6 h-6 fill-current" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-xs text-zinc-400">
            Sign in to your account to upload and explore videos
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email or Username"
            placeholder="Enter your email or @username"
            icon={User}
            required
            error={errors.identifier?.message}
            {...register("identifier", {
              required: "Email or username is required",
            })}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            required
            error={errors.password?.message}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            isLoading={isSubmitting}
          >
            Sign In
          </Button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs text-zinc-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-red-400 font-semibold hover:underline"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
