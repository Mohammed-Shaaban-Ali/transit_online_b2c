"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { searchHotelsParams } from "..";
import { FaCalendarAlt } from "react-icons/fa";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type Props = {
  form: UseFormReturn<searchHotelsParams & { searchValue?: string }>;
  hasDefaultValues?: boolean;
};

function CheckOut({ form, hasDefaultValues = false }: Props) {
  const t = useTranslations("Components.HotelSearchBox.CheckOut");
  const [isFocused, setIsFocused] = useState(false);
  const initialCheckInRef = useRef<string | null>(null);
  const previousCheckInRef = useRef<string | null>(null);

  const { register, watch, setValue, formState } = form;
  const checkOutValue = watch("checkOut");
  const checkInValue = watch("checkIn");
  const checkOutError = formState.errors.checkOut?.message as
    | string
    | undefined;

  const { ref: registerRef, ...registerProps } = register("checkOut");

  const hasValue = checkOutValue && checkOutValue.length > 0;
  const isActive = isFocused || hasValue;

  // Get minimum date (day after check-in) as Date object (timezone safe)
  const minDate = useMemo(() => {
    if (!checkInValue) {
      const today = new Date();
      today.setDate(today.getDate() + 1);
      today.setHours(0, 0, 0, 0);
      return today;
    }
    // Parse check-in date safely without timezone issues
    const [year, month, day] = checkInValue.split("-").map(Number);
    const checkInDate = new Date(year, month - 1, day);
    const nextDay = new Date(checkInDate);
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(0, 0, 0, 0);
    return nextDay;
  }, [checkInValue]);

  // Convert string date (YYYY-MM-DD) to Date object for Calendar (timezone safe)
  const selectedDate = useMemo(() => {
    if (!checkOutValue) return null;
    const [year, month, day] = checkOutValue.split("-").map(Number);
    return new Date(year, month - 1, day);
  }, [checkOutValue]);

  // Store initial check-in value on first render
  useEffect(() => {
    if (checkInValue && initialCheckInRef.current === null) {
      initialCheckInRef.current = checkInValue;
      previousCheckInRef.current = checkInValue;
    }
  }, [checkInValue]);

  // Update check-out date when check-in changes
  useEffect(() => {
    // Skip if initial value not set yet
    if (initialCheckInRef.current === null) {
      return;
    }

    // Skip if check-in hasn't actually changed (same as previous)
    if (checkInValue === previousCheckInRef.current) {
      return;
    }

    // Check if check-out is valid (after check-in)
    const checkOutIsValid = checkOutValue && checkOutValue > checkInValue;

    // If we have default values and check-out is valid, don't update unless check-in changed
    if (hasDefaultValues && checkOutIsValid) {
      const checkInChanged = checkInValue !== initialCheckInRef.current;
      if (!checkInChanged) {
        // Update previous check-in and return (don't update check-out)
        previousCheckInRef.current = checkInValue;
        return;
      }
    }

    // Update previous check-in
    previousCheckInRef.current = checkInValue;

    if (checkInValue) {
      const checkInChanged = checkInValue !== initialCheckInRef.current;
      const checkOutInvalid = !checkOutValue || checkOutValue <= checkInValue;

      // If we have default values, only update if user changed check-in or check-out is invalid
      if (hasDefaultValues) {
        if (checkInChanged || checkOutInvalid) {
          // Format date as YYYY-MM-DD without timezone conversion
          const year = minDate.getFullYear();
          const month = String(minDate.getMonth() + 1).padStart(2, "0");
          const day = String(minDate.getDate()).padStart(2, "0");
          const minDateString = `${year}-${month}-${day}`;
          setValue("checkOut", minDateString);
        }
      } else {
        // If no default values, always update check-out to be the day after check-in
        // Format date as YYYY-MM-DD without timezone conversion
        const year = minDate.getFullYear();
        const month = String(minDate.getMonth() + 1).padStart(2, "0");
        const day = String(minDate.getDate()).padStart(2, "0");
        const minDateString = `${year}-${month}-${day}`;
        setValue("checkOut", minDateString);
      }
    }
  }, [checkInValue, checkOutValue, minDate, setValue, hasDefaultValues]);

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      // Format date as YYYY-MM-DD without timezone conversion
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;
      // Ensure check-out is after check-in
      if (checkInValue && dateString <= checkInValue) {
        const minYear = minDate.getFullYear();
        const minMonth = String(minDate.getMonth() + 1).padStart(2, "0");
        const minDay = String(minDate.getDate()).padStart(2, "0");
        const minDateString = `${minYear}-${minMonth}-${minDay}`;
        setValue("checkOut", minDateString, { shouldValidate: true });
      } else {
        setValue("checkOut", dateString, { shouldValidate: true });
      }
    } else {
      setValue("checkOut", "", { shouldValidate: true });
    }
  };

  return (
    <div className="col-span-1 relative">
      <div>
        {/* label */}
        <div
          className="relative flex items-center px-4 h-16 bg-transparent
           transition-all duration-300"
        >
          <label
            htmlFor="checkOut"
            className={`absolute transition-all font-bold duration-200 pointer-events-none ${isActive
                ? "-top-0.5 text-gray-500"
                : "top-1/2 -translate-y-1/2 text-gray-500"
              }`}
          >
            {t("label")}
          </label>
          <div className="flex items-center gap-1 relative">
            <FaCalendarAlt
              size={20}
              className={` 
                  absolute top-[19px] start-0
                  ${isActive ? "text-gray-400" : "text-transparent"}`}
            />
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
            <Popover
              onOpenChange={(open) => {
                setIsFocused(open);
              }}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "w-full cursor-pointer font-bold text-black bg-transparent border-none outline-none p-0 text-start",
                    isActive ? "mt-4 ps-6" : ""
                  )}
                >
                  {selectedDate ? format(selectedDate, "dd/MM/yyyy") : ""}
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 cursor-pointer"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={selectedDate || undefined}
                  onSelect={handleDateChange}
                  disabled={(date) => {
                    const dateToCompare = new Date(date);
                    dateToCompare.setHours(0, 0, 0, 0);
                    return dateToCompare < minDate;
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      {/* Error message */}
      {checkOutError && (
        <p title={checkOutError} className="absolute -bottom-1.5 start-4 text-xs text-red-500 font-medium line-clamp-1">
          {checkOutError}
        </p>
      )}
    </div>
  );
}

export default CheckOut;
