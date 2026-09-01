import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, User, AtSign, Camera, Image as ImageIcon, ArrowRight, Eye, EyeOff, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import ImageCropperModal from "../components/common/ImageCropperModal";
import Input from "../components/Input";
import toast from "react-hot-toast";

const Register = () => {
  const { register: registerUser, isSubmitting, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const backgroundLocation =
    location.state?.backgroundLocation || location.state?.from || { pathname: "/" };

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [fileError, setFileError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [cropperConfig, setCropperConfig] = useState({
    isOpen: false,
    imageSrc: "",
    cropType: "avatar",
    fileName: "",
  });

  // If user is already authenticated, close popup
  useEffect(() => {
    if (isAuthenticated) {
      navigate(backgroundLocation?.pathname || "/", { replace: true });
    }
  }, [isAuthenticated, navigate, backgroundLocation]);

  // Lock body scroll while modal is open & add Escape key listener
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (!cropperConfig.isOpen) {
          navigate(backgroundLocation?.pathname || "/");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate, backgroundLocation, cropperConfig.isOpen]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleClose = () => {
    navigate(backgroundLocation?.pathname || "/");
  };

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCropperConfig({
        isOpen: true,
        imageSrc: reader.result,
        cropType: "avatar",
        fileName: file.name || "avatar.jpg",
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCoverSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCropperConfig({
        isOpen: true,
        imageSrc: reader.result,
        cropType: "cover",
        fileName: file.name || "cover.jpg",
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCropComplete = (croppedBlob) => {
    const isAvatar = cropperConfig.cropType === "avatar";
    const file = new File(
      [croppedBlob],
      isAvatar ? "avatar.jpg" : "cover.jpg",
      { type: "image/jpeg" }
    );
    const previewUrl = URL.createObjectURL(croppedBlob);

    if (isAvatar) {
      setAvatarFile(file);
      setAvatarPreview(previewUrl);
      setFileError("");
    } else {
      setCoverFile(file);
      setCoverPreview(previewUrl);
    }
    setCropperConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const onSubmit = async (data) => {
    if (!avatarFile) {
      setFileError("Avatar image is required for your curator profile");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", data.fullName.trim());
    formData.append("email", data.email.trim());
    formData.append("username", data.username.toLowerCase().trim());
    formData.append("password", data.password);
    formData.append("avatar", avatarFile);
    if (coverFile) {
      formData.append("coverImage", coverFile);
    }

    const result = await registerUser(formData);
    if (result.success) {
      navigate("/login", { state: { backgroundLocation, from: location.state?.from } });
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
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-white/12 bg-[#121212] p-6 sm:p-7 shadow-2xl z-10 space-y-5 animate-in zoom-in-95 duration-200">
        {/* Header Strip */}
        <div className="flex items-start justify-between pb-3.5 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#18181B] border border-white/15 text-[#FAFAF8] font-display font-black text-sm">
              R<span className="text-[#FF5A36]">.</span>
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-[#FAFAF8]">
                Create Curator Account
              </h2>
              <p className="font-mono text-[11px] text-[#71717A]">
                Claim your channel handle and start sharing publications
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
          <Link
            to="/login"
            state={{ backgroundLocation, from: location.state?.from }}
            className="flex-1 py-1.5 rounded-md text-center text-[#71717A] hover:text-[#FAFAF8] transition"
          >
            Sign In
          </Link>
          <button
            type="button"
            className="flex-1 py-1.5 rounded-md bg-[#FF5A36] text-[#0A0A0A] font-bold shadow-xs cursor-default"
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          {/* Avatar & Banner Upload Dropzone */}
          <div className="space-y-1">
            <label className="block font-mono text-xs text-[#71717A] uppercase tracking-wider">
              Profile Images <span className="text-[#FF5A36]">*</span>
            </label>
            <div className="flex items-center gap-3 p-3 bg-[#18181B] rounded-md border border-white/8">
              {/* Avatar Picker */}
              <div className="relative shrink-0">
                <label className="cursor-pointer group flex flex-col items-center">
                  <div className="w-13 h-13 rounded-full bg-[#121212] border-2 border-dashed border-white/20 group-hover:border-[#FF5A36] flex items-center justify-center overflow-hidden transition-colors">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-4 h-4 text-[#71717A] group-hover:text-[#FF5A36] transition-colors" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarSelect}
                    className="hidden"
                  />
                  <span className="text-[10px] font-mono text-[#71717A] mt-1 group-hover:text-[#FF5A36]">
                    Avatar *
                  </span>
                </label>
              </div>

              {/* Banner Picker */}
              <div className="flex-1">
                <label className="cursor-pointer group block">
                  <div className="h-13 rounded-md bg-[#121212] border-2 border-dashed border-white/20 group-hover:border-[#FF5A36] flex items-center justify-center overflow-hidden transition-colors px-2">
                    {coverPreview ? (
                      <img
                        src={coverPreview}
                        alt="Cover"
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-[#71717A] group-hover:text-[#FF5A36] text-xs font-mono">
                        <ImageIcon size={14} />
                        <span>Cover Banner (Optional)</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverSelect}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            {fileError && <p className="font-mono text-[11px] text-rose-500">{fileError}</p>}
          </div>

          {/* Full Name */}
          <Input
            label="Full Name"
            placeholder="Elena Rostova"
            icon={User}
            required
            error={errors.fullName?.message}
            {...register("fullName", {
              required: "Full name is required",
            })}
          />

          {/* Email */}
          <Input
            label="Email Address"
            type="email"
            placeholder="elena@example.com"
            icon={Mail}
            required
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Please enter a valid email address",
              },
            })}
          />

          {/* Username */}
          <Input
            label="Channel Handle (@)"
            placeholder="cinematheque"
            icon={AtSign}
            required
            error={errors.username?.message}
            {...register("username", {
              required: "Channel handle is required",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters",
              },
            })}
          />

          {/* Password */}
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
                className={`w-full pl-9 pr-10 py-2 text-xs bg-[#18181B] text-[#FAFAF8] placeholder:text-[#71717A] rounded-md border transition-colors outline-none focus:border-[#FF5A36] ${
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

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-[#FF5A36] hover:bg-[#FF704E] text-[#0A0A0A] py-2.5 px-4 font-mono text-xs font-bold transition active:scale-[0.99] disabled:opacity-50 cursor-pointer shadow-sm mt-2"
          >
            <span>{isSubmitting ? "Creating Account..." : "Create Curator Account"}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        {/* Footer */}
        <div className="pt-2 border-t border-white/6 text-center font-mono text-xs text-[#71717A]">
          Already registered?{" "}
          <Link
            to="/login"
            state={{ backgroundLocation, from: location.state?.from }}
            className="text-[#FF5A36] font-semibold hover:underline"
          >
            Sign in to Studio →
          </Link>
        </div>
      </div>

      {/* Image Cropper Modal (z-60) */}
      <ImageCropperModal
        isOpen={cropperConfig.isOpen}
        onClose={() => setCropperConfig((prev) => ({ ...prev, isOpen: false }))}
        imageSrc={cropperConfig.imageSrc}
        cropType={cropperConfig.cropType}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
};

export default Register;
