import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Play, Mail, Lock, User, AtSign, Camera, Image as ImageIcon } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuthStore } from "../store/useAuthStore";
import ThemeToggle from "../components/common/ThemeToggle";

const Register = () => {
  const { register: registerUser, isSubmitting } = useAuthStore();
  const navigate = useNavigate();

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [fileError, setFileError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setFileError("");
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    if (!avatarFile) {
      setFileError("Avatar image is required");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("username", data.username.toLowerCase());
    formData.append("password", data.password);
    formData.append("avatar", avatarFile);
    if (coverFile) {
      formData.append("coverImage", coverFile);
    }

    const result = await registerUser(formData);
    if (result.success) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 relative">
      {/* Absolute top right theme toggle */}
      <div className="absolute top-5 right-5">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-lg p-8 sm:p-10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/25 mb-2">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
            Create your account
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Join VideoFlow to share videos, create playlists, and build your audience
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Avatar & Cover Upload Row */}
          <div className="flex items-center gap-4 p-3.5 bg-slate-50 dark:bg-zinc-800/40 rounded-2xl border border-slate-200 dark:border-zinc-700/80">
            {/* Avatar Picker */}
            <div className="relative shrink-0">
              <label className="cursor-pointer group flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-800 border-2 border-dashed border-slate-300 dark:border-zinc-700 group-hover:border-indigo-500 flex items-center justify-center overflow-hidden transition-all shadow-xs">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-5 h-5 text-slate-400 dark:text-zinc-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <span className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1 font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  Avatar *
                </span>
              </label>
            </div>

            {/* Cover Image Picker */}
            <div className="flex-1">
              <label className="cursor-pointer group block">
                <div className="h-16 rounded-xl bg-slate-100 dark:bg-zinc-800 border-2 border-dashed border-slate-300 dark:border-zinc-700 group-hover:border-indigo-500 flex items-center justify-center overflow-hidden transition-all shadow-xs">
                  {coverPreview ? (
                    <img
                      src={coverPreview}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 text-xs font-medium">
                      <ImageIcon className="w-4 h-4" />
                      <span>Optional Cover Banner</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          {fileError && <p className="text-xs text-rose-500">{fileError}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Full Name"
              placeholder="John Doe"
              icon={User}
              required
              error={errors.fullName?.message}
              {...register("fullName", {
                required: "Full name is required",
              })}
            />

            <Input
              label="Username"
              placeholder="johndoe"
              icon={AtSign}
              required
              error={errors.username?.message}
              {...register("username", {
                required: "Username is required",
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: "Letters, numbers, & underscores only",
                },
              })}
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            icon={Mail}
            required
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Enter a valid email address",
              },
            })}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Minimum 6 characters"
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
            Create Account
          </Button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-500 dark:text-zinc-400 pt-2">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
