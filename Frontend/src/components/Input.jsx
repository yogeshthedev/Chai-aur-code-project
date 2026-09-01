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
          <label className="block font-mono text-xs text-[#71717A] uppercase tracking-wider">
            {label} {required && <span className="text-[#FF5A36]">*</span>}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#71717A]">
              <Icon className="w-3.5 h-3.5" />
            </div>
          )}
          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            className={`w-full px-3.5 py-2 text-xs bg-[#18181B] text-[#FAFAF8] placeholder:text-[#71717A] rounded-md border transition-colors outline-none focus:border-[#FF5A36] ${
              Icon ? "pl-9" : ""
            } ${
              error
                ? "border-rose-500 text-rose-300"
                : "border-white/10 hover:border-white/20"
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="font-mono text-[11px] text-rose-500 mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
