"use client";

import React, { useState, useRef, ReactNode } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";

interface FloatingLabelInputProps {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  icon?: ReactNode;
  error?: string;
  register: UseFormRegisterReturn;
  watchValue?: string | number;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  containerClassName?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  rows?: number;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  defaultValue?: string | number;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  // Date picker specific props
  onDateChange?: (date: Date | null) => void;
  selectedDate?: Date | null;
  minDate?: Date;
  maxDate?: Date;
  isRTL?: boolean;
  dateFormat?: string;
}

export default function FloatingLabelInput({
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
  placeholder,
  disabled = false,
  readOnly = false,
  rows,
  min,
  max,
  step,
  defaultValue,
  onChange,
  onDateChange,
  selectedDate,
  minDate,
  maxDate,
  isRTL = false,
  dateFormat = "yyyy-MM-dd",
}: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const hasValue =
    (watchValue !== "" && watchValue !== null && watchValue !== undefined) ||
    (defaultValue !== "" &&
      defaultValue !== null &&
      defaultValue !== undefined) ||
    (type === "date" && selectedDate !== null && selectedDate !== undefined);
  const isActive = isFocused || hasValue || calendarOpen;

  const { ref: registerRef, ...registerProps } = register;

  const isTextarea = type === "textarea";
  const isDatePicker = type === "date";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    registerProps.onChange?.(e);
    onChange?.(e);
  };

  const formatDisplayDate = (date: Date | null | undefined) => {
    if (!date) return "";
    try {
      return format(date, dateFormat, {
        locale: isRTL ? ar : enUS,
      });
    } catch {
      return "";
    }
  };

  if (isDatePicker) {
    return (
      <div className={`relative ${className}`}>
        <input
          type="hidden"
          {...registerProps}
          ref={(e) => {
            if (typeof registerRef === "function") {
              registerRef(e);
            } else if (registerRef && "current" in registerRef) {
              (
                registerRef as React.MutableRefObject<HTMLInputElement | null>
              ).current = e;
            }
          }}
        />
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild disabled={disabled || readOnly}>
            <button
              type="button"
              className={`relative flex items-center px-3 bg-transparent transition-all duration-300 h-16! border border-gray-300 rounded-md w-full cursor-pointer text-start ${containerClassName}`}
            >
              <label
                className={`absolute transition-all font-bold duration-200 pointer-events-none ${isActive
                  ? "top-1 text-gray-500"
                  : "top-1/2 -translate-y-1/2 text-gray-500"
                  } ${labelClassName}`}
              >
                {label}
              </label>
              <span
                className={`font-bold text-black ${isActive ? "mt-4" : ""
                  } ${inputClassName}`}
              >
                {selectedDate ? formatDisplayDate(selectedDate) : ""}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0"
            align={isRTL ? "end" : "start"}
          >
            <Calendar
              mode="single"
              captionLayout="dropdown"
              selected={selectedDate || undefined}
              onSelect={(date) => {
                if (date) {
                  const adjusted = new Date(date);
                  adjusted.setHours(12, 0, 0, 0);
                  onDateChange?.(adjusted);
                } else {
                  onDateChange?.(null);
                }
                setCalendarOpen(false);
              }}
              disabled={(date) => {
                if (minDate && date < minDate) return true;
                if (maxDate && date > maxDate) return true;
                return false;
              }}
              defaultMonth={selectedDate || undefined}
              startMonth={minDate || new Date(1950, 0)}
              endMonth={maxDate || new Date(2060, 11)}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </PopoverContent>
        </Popover>
        {error && (
          <p
            title={error}
            className="absolute -bottom-4 start-4 text-xs text-red-500 font-medium line-clamp-1"
          >
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div
        className={`relative flex items-center px-3 bg-transparent transition-all duration-300 ${isTextarea ? "min-h-[80px] py-4" : "h-16!"
          } border  border-gray-300 rounded-md ${containerClassName}`}
      >
        <label
          htmlFor={id}
          className={`absolute transition-all font-bold duration-200 pointer-events-none ${isActive
            ? "top-1 text-gray-500"
            : "top-1/2 -translate-y-1/2 text-gray-500"
            } ${labelClassName}`}
        >
          {label}
        </label>
        <div className="flex items-center gap-1 relative w-full">
          {icon && !isTextarea && (
            <div
              className={`absolute top-[19px] start-0 ${isActive ? "text-gray-400" : "text-transparent"
                }`}
            >
              {icon}
            </div>
          )}
          {isTextarea ? (
            <textarea
              id={id}
              rows={rows || 3}
              autoComplete={autoComplete}
              className={`w-full font-bold text-black bg-transparent border-none outline-none p-0 ${isActive ? "mt-4 ps-6" : ""
                } ${inputClassName}`}
              {...registerProps}
              defaultValue={defaultValue}
              ref={(e) => {
                inputRef.current = e;
                if (typeof registerRef === "function") {
                  registerRef(e);
                } else if (registerRef && "current" in registerRef) {
                  (
                    registerRef as React.MutableRefObject<HTMLTextAreaElement | null>
                  ).current = e;
                }
              }}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={disabled}
              readOnly={readOnly}
              placeholder={placeholder}
            />
          ) : (
            <input
              id={id}
              type={type}
              autoComplete={autoComplete}
              className={`w-full text-start font-bold text-black bg-transparent border-none outline-none p-0 ${isActive ? "mt-4 " : ""
                }
                ${icon ? "ps-6" : ""}
                ${inputClassName}`}
              {...registerProps}
              defaultValue={defaultValue}
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
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={disabled}
              readOnly={readOnly}
              placeholder={placeholder}
              min={min}
              max={max}
              step={step}
            />
          )}
        </div>
      </div>
      {error && (
        <p
          title={error}
          className="absolute -bottom-4 start-4 text-xs text-red-500 font-medium line-clamp-1"
        >
          {error}
        </p>
      )}
    </div>
  );
}
