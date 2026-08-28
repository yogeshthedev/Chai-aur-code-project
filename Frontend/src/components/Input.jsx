import React, { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      placeholder,
      error,
      icon: Icon,
      className = "",
      required = false,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full space-y-1 text-left">
        {label && (
          <label className="block text-xs font-medium text-zinc-300">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative rounded-lg">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            className={`w-full px-3 py-2 text-sm bg-zinc-800 text-white placeholder-zinc-500 rounded-lg border transition-all duration-200 outline-none focus:ring-2 focus:ring-red-500/50 ${
              Icon ? "pl-9" : ""
            } ${
              error
                ? "border-red-500 focus:border-red-500"
                : "border-zinc-700 focus:border-red-500 hover:border-zinc-600"
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
