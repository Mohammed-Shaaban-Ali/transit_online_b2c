"use client";

import React, { useState, useRef, ReactNode } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface CustomInputProps {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  icon?: ReactNode;
  error?: string;
  register: UseFormRegisterReturn;
  watchValue?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  containerClassName?: string;
}

export default function CustomInput({
  id,
  label,
  type = "text",
  autoComplete,
  icon,
  error,
  register,
  watchValue = "",
  className = "",
  labelClassName = "",
  inputClassName = "",
  containerClassName = "",
}: CustomInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasValue = watchValue && watchValue.length > 0;
  const isActive = isFocused || hasValue;

  const { ref: registerRef, ...registerProps } = register;

  return (
    <div className={`relative ${className}`}>
      <div
        className={`relative flex items-center px-4 h-16  transition-all duration-300 bg-gray-100 rounded-md ${containerClassName}`}
      >
        <label
          htmlFor={id}
          className={`absolute transition-all font-bold duration-200 pointer-events-none ${isActive
              ? "top-[3px] text-gray-500"
              : "top-1/2 -translate-y-1/2 text-gray-500"
            } ${labelClassName}`}
        >
          {label}
        </label>
        <div className="flex items-center gap-1 relative w-full">
          {icon && (
            <div
              className={`absolute top-[22px] start-0 ${isActive ? "text-gray-400" : "text-transparent"
                }`}
            >
              {icon}
            </div>
          )}
          <input
            id={id}
            type={type}
            autoComplete={autoComplete}
            className={`w-full font-bold text-black bg-transparent border-none outline-none p-0 ${isActive ? "mt-4 ps-6" : ""
              } ${inputClassName}`}
            {...registerProps}
            ref={(e) => {
              inputRef.current = e;
              if (typeof registerRef === "function") {
                registerRef(e);
              } else if (registerRef && "current" in registerRef) {
                (
                  registerRef as React.MutableRefObject<HTMLInputElement | null>
                ).current = e;
              }
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
      </div>
      {error && (
        <p className="absolute -bottom-5 left-2 text-[13px] text-red-500 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
