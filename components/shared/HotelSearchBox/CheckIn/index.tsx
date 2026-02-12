"use client";

import React, { useState, useRef, useMemo } from "react";
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
};

function CheckIn({ form }: Props) {
  const t = useTranslations("Components.HotelSearchBox.CheckIn");
  const [isFocused, setIsFocused] = useState(false);

  const { register, watch, setValue, formState } = form;
  const checkInValue = watch("checkIn");
  const checkInError = formState.errors.checkIn?.message as string | undefined;

  const { ref: registerRef, ...registerProps } = register("checkIn");

  // Convert string date (YYYY-MM-DD) to Date object for Calendar (timezone safe)
  const selectedDate = useMemo(() => {
    if (!checkInValue) return null;
    const [year, month, day] = checkInValue.split("-").map(Number);
    return new Date(year, month - 1, day);
  }, [checkInValue]);

  const hasValue = checkInValue && checkInValue.length > 0;
  const isActive = isFocused || hasValue;

  // Get today's date for minDate
  const minDate = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }, []);

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      // Format date as YYYY-MM-DD without timezone conversion
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;
      setValue("checkIn", dateString, { shouldValidate: true });
    } else {
      setValue("checkIn", "", { shouldValidate: true });
    }
  };

  return (
    <div className="col-span-1 relative md:border-x-2 border-gray-200 ">
      <div>
        {/* label */}
        <div
          className="relative flex items-center px-4 h-16 bg-transparent
           transition-all duration-300 "
        >
          <label
            htmlFor="checkIn"
            className={`absolute transition-all font-bold duration-200 pointer-events-none ${isActive
                ? "-top-0.5 text-gray-500"
                : "top-1/2 -translate-y-1/2 text-gray-500"
              }`}
          >
            {t("label")}
          </label>
          <div className="flex items-center gap-1 relative w-full cursor-pointer">
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
      {checkInError && (
        <p title={checkInError} className="absolute -bottom-1.5 start-4 text-xs text-red-500 font-medium line-clamp-1">
          {checkInError}
        </p>
      )}
    </div>
  );
}

export default CheckIn;
