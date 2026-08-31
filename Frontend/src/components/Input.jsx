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
          <label className="block text-xs font-semibold tracking-wide text-slate-600 dark:text-zinc-400 uppercase">
            {label} {required && <span className="text-indigo-600 dark:text-indigo-400">*</span>}
          </label>
        )}
        <div className="relative rounded-2xl">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            className={`w-full px-4 py-2.5 text-sm bg-slate-50/80 dark:bg-zinc-850 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 rounded-2xl border transition-all duration-200 outline-none focus:ring-2 focus:ring-indigo-500/20 ${
              Icon ? "pl-10" : ""
            } ${
              error
                ? "border-rose-500 focus:border-rose-500 text-rose-900 dark:text-rose-200"
                : "border-slate-200 dark:border-zinc-700/80 focus:border-indigo-500/80 hover:border-slate-300 dark:hover:border-zinc-600"
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;


