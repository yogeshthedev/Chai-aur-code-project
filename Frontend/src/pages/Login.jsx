import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Play, Lock, User } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuthStore } from "../store/useAuthStore";
import ThemeToggle from "../components/common/ThemeToggle";

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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 relative">
      {/* Absolute top right theme toggle */}
      <div className="absolute top-5 right-5">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md p-8 sm:p-10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
        {/* Brand Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/25 mb-2">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
            Welcome back
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Sign in to your account to upload and explore videos
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email or Username"
            placeholder="name@example.com or username"
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
            className="w-full mt-2 rounded-2xl"
            isLoading={isSubmitting}
          >
            Sign In
          </Button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-500 dark:text-zinc-400 pt-2">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
