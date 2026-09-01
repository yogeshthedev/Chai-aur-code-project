import React from "react";
import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-[#FF5A36] hover:bg-[#FF704E] active:bg-[#E44824] text-[#0A0A0A] font-bold shadow-xs",
  secondary:
    "bg-[#18181B] hover:bg-[#222226] text-[#FAFAF8] border border-white/10",
  outline:
    "bg-transparent hover:bg-white/6 text-[#FAFAF8] border border-white/12 hover:border-white/25",
  ghost:
    "bg-transparent hover:bg-white/6 text-[#A1A1AA] hover:text-[#FAFAF8]",
  danger:
    "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-md gap-1.5 font-mono",
  md: "px-4 py-2 text-xs rounded-md gap-2 font-mono",
  lg: "px-5 py-2.5 text-sm rounded-md gap-2.5 font-mono",
};

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = "",
  onClick,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-[0.98] outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${
        variants[variant] || variants.primary
      } ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-3.5 h-3.5 shrink-0" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
