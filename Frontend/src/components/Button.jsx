import React from "react";
import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-medium shadow-sm shadow-red-500/20 focus-visible:ring-2 focus-visible:ring-red-500/40",
  secondary:
    "bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 text-zinc-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:active:bg-zinc-600 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700/80 focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600",
  outline:
    "bg-transparent hover:bg-zinc-100 active:bg-zinc-200 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:active:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600",
  ghost:
    "bg-transparent hover:bg-zinc-100 active:bg-zinc-200 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800/70 dark:active:bg-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-400",
  danger:
    "bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-600 border border-red-200 dark:bg-red-950/30 dark:hover:bg-red-950/50 dark:active:bg-red-950/70 dark:text-red-400 dark:border-red-900/40 focus-visible:ring-2 focus-visible:ring-red-500/40",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-4 py-2 text-sm rounded-xl gap-2",
  lg: "px-5 py-2.5 text-base rounded-xl gap-2.5",
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
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
