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
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label className="block text-xs font-semibold tracking-wide text-(--text-secondary) uppercase">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative rounded-xl">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-(--text-muted)">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            className={`w-full px-3.5 py-2.5 text-sm bg-zinc-50/70 dark:bg-zinc-900 text-(--text-primary) placeholder:text-(--text-muted) rounded-xl border transition-all duration-200 outline-none focus:ring-2 focus:ring-red-500/20 ${
              Icon ? "pl-10" : ""
            } ${
              error
                ? "border-red-500 focus:border-red-500"
                : "border-zinc-200 dark:border-zinc-800 focus:border-red-500/80 hover:border-zinc-300 dark:hover:border-zinc-700"
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;


