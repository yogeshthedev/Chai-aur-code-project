import React from "react";
import { Loader2 } from "lucide-react";

const variants = {
  primary: "bg-red-600 hover:bg-red-700 text-white font-medium shadow-sm focus:ring-red-500",
  secondary: "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 focus:ring-zinc-500",
  outline: "bg-transparent hover:bg-zinc-800 text-zinc-300 border border-zinc-700 hover:text-white focus:ring-zinc-600",
  ghost: "bg-transparent hover:bg-zinc-800/60 text-zinc-300 hover:text-white",
  danger: "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30",
};

const sizes = {
  sm: "px-2.5 py-1.5 text-xs rounded-md",
  md: "px-4 py-2 text-sm rounded-lg",
  lg: "px-5 py-2.5 text-base rounded-lg",
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
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
        variants[variant] || variants.primary
      } ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
