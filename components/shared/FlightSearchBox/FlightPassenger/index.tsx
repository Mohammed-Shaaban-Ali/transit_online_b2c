"use client";

import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { RiUserFill } from "react-icons/ri";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import usePerfectScrollbar from "@/hooks/usePerfectScrollbar";

interface FlightSearchParams {
  fromAirport: string;
  toAirport: string;
  departureDate: string;
  returnDate?: string;
  tripType: "roundTrip" | "oneWay";
  adults: number;
  children: number;
  infants: number;
  cabinClass: "ECONOMY" | "BUSINESS";
}

interface GuestSearchProps {
  form: UseFormReturn<FlightSearchParams>;
}

const FlightPassenger = ({ form }: GuestSearchProps) => {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const t = useTranslations("Components.FlightSearchBox.FlightPassenger");
  const [open, setOpen] = useState(false);
  const scrollRef = usePerfectScrollbar({
    suppressScrollX: true,
    wheelPropagation: false,
  });

  const { setValue, watch } = form;
  const adults = watch("adults") || 1;
  const children = watch("children") || 0;
  const infants = watch("infants") || 0;
  const cabinClass = watch("cabinClass") || "ECONOMY";

  const MAX_ADULTS = 9;
  const MAX_CHILDREN = 9;
  const MAX_INFANTS = 9;

  const handleAdultChange = (value: number) => {
    const newAdults = Math.max(1, Math.min(MAX_ADULTS, value));
    setValue("adults", newAdults);
    if (newAdults < infants) {
      setValue("infants", newAdults);
    }
  };

  const handleChildrenChange = (value: number) => {
    setValue("children", Math.max(0, Math.min(MAX_CHILDREN, value)));
  };

  const handleInfantsChange = (value: number) => {
    const newInfants = Math.max(0, Math.min(MAX_INFANTS, adults, value));
    setValue("infants", newInfants);
  };

  const handleCabinClassChange = (value: "ECONOMY" | "BUSINESS") => {
    setValue("cabinClass", value);
  };

  const getTotalPassengers = () => {
    return adults + children + infants;
  };

  const getPassengersText = () => {
    const parts: string[] = [];
    // if (adults > 0) {
    //   const adultText = adults === 1 ? "adult" : "adults";
    //   parts.push(`${adults} ${adultText}`);
    // }
    // if (children > 0) {
    //   const childText = children === 1 ? "child" : "children";
    //   parts.push(`${children} ${childText}`);
    // }
    // if (infants > 0) {
    //   const infantText = infants === 1 ? "infant" : "infants";
    //   parts.push(`${infants} ${infantText}`);
    // }
    return parts.length > 0
      ? parts.join(", ")
      : `${getTotalPassengers()} ${t("guests")}`;
  };

  const getCabinText = () => {
    return cabinClass === "ECONOMY" ? t("economy") : t("business");
  };

  const displayText = `${getPassengersText()}, ${getCabinText()}`;
  const hasValue = adults > 0;
  const isActive = open || hasValue;

  return (
    <div className="col-span-1 relative lg:border-x-2 border-gray-200 ">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative flex items-center px-4 h-16 bg-transparent transition-all duration-300 cursor-pointer">
            <label
              className={`absolute transition-all font-bold duration-200 pointer-events-none ${isActive
                ? "-top-0.5 text-gray-500"
                : "top-1/2 -translate-y-1/2 text-gray-500"
                }`}
            >
              {t("passengers")}
            </label>
            <div className="flex items-center gap-1 relative">
              <RiUserFill
                size={20}
                className={`absolute top-[19px] start-0 ${isActive ? "text-gray-400" : "text-transparent"
                  }`}
              />
              <div
                className={`w-full font-bold text-black bg-transparent border-none outline-none p-0 ${isActive ? "mt-4 ps-6" : ""
                  }`}
              >
                {displayText}
              </div>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-full sm:min-w-[400px] p-0 shadow-2xl"
          align="start"
          sideOffset={8}
        >
          <div
            className="bg-white p-4 rounded-lg custom-scrollbar"
            style={{
              maxHeight: "500px",
              position: "relative",
              overflowY: "auto",
              overflowX: "hidden",
            }}
            ref={scrollRef}
          >
            {/* Adults */}
            <div className="flex items-center gap-3 mb-4">
              <div className="shrink-0">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{t("adults")}</div>
                <div className="text-xs text-gray-500">{t("adultsDescription")}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${adults <= 1
                    ? "bg-gray-100 cursor-not-allowed opacity-50"
                    : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  onClick={() => handleAdultChange(adults - 1)}
                  disabled={adults <= 1}
                >
                  <span className="text-gray-700 text-lg font-bold">−</span>
                </button>
                <span className="w-8 text-center text-sm font-semibold">
                  {adults}
                </span>
                <button
                  type="button"
                  className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${adults >= MAX_ADULTS
                    ? "bg-gray-100 cursor-not-allowed opacity-50"
                    : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  onClick={() => handleAdultChange(adults + 1)}
                  disabled={adults >= MAX_ADULTS}
                >
                  <span className="text-gray-700 text-lg font-bold">+</span>
                </button>
              </div>
            </div>

            {/* Children */}
            <div className="flex items-center gap-3 mb-4">
              <div className="shrink-0">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{t("children")}</div>
                <div className="text-xs text-gray-500">{t("childrenDescription")}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${children <= 0
                    ? "bg-gray-100 cursor-not-allowed opacity-50"
                    : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  onClick={() => handleChildrenChange(children - 1)}
                  disabled={children <= 0}
                >
                  <span className="text-gray-700 text-lg font-bold">−</span>
                </button>
                <span className="w-8 text-center text-sm font-semibold">
                  {children}
                </span>
                <button
                  type="button"
                  className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${children >= MAX_CHILDREN
                    ? "bg-gray-100 cursor-not-allowed opacity-50"
                    : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  onClick={() => handleChildrenChange(children + 1)}
                  disabled={children >= MAX_CHILDREN}
                >
                  <span className="text-gray-700 text-lg font-bold">+</span>
                </button>
              </div>
            </div>

            {/* Infants */}
            <div className="flex items-center gap-3 mb-4">
              <div className="shrink-0">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{t("infants")}</div>
                <div className="text-xs text-gray-500">{t("infantsDescription")}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${infants <= 0
                    ? "bg-gray-100 cursor-not-allowed opacity-50"
                    : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  onClick={() => handleInfantsChange(infants - 1)}
                  disabled={infants <= 0}
                >
                  <span className="text-gray-700 text-lg font-bold">−</span>
                </button>
                <span className="w-8 text-center text-sm font-semibold">
                  {infants}
                </span>
                <button
                  type="button"
                  className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${infants >= MAX_INFANTS || infants >= adults
                    ? "bg-gray-100 cursor-not-allowed opacity-50"
                    : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  onClick={() => handleInfantsChange(infants + 1)}
                  disabled={infants >= MAX_INFANTS || infants >= adults}
                >
                  <span className="text-gray-700 text-lg font-bold">+</span>
                </button>
              </div>
            </div>

            {/* Cabin Class Selection */}
            <div className="mt-4 pt-4 border-t border-gray-300">
              <div className="text-sm font-medium mb-2">{t("cabinClass")}</div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`flex-1 p-2 rounded-lg transition-all duration-300 text-sm font-medium ${cabinClass === "ECONOMY"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  onClick={() => handleCabinClassChange("ECONOMY")}
                >
                  {t("economy")}
                </button>
                <button
                  type="button"
                  className={`flex-1 p-2 rounded-lg transition-all duration-300 text-sm font-medium ${cabinClass === "BUSINESS"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  onClick={() => handleCabinClassChange("BUSINESS")}
                >
                  {t("business")}
                </button>
              </div>
            </div>

            {/* Apply button */}
            <div className="flex justify-end mt-4 border-t border-gray-300 pt-2">
              <button
                type="button"
                className="px-4 py-2 bg-primary hover:bg-primary/80 rounded-lg transition-all duration-300 text-white text-sm font-medium"
                onClick={() => setOpen(false)}
              >
                {t("apply")}
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FlightPassenger;
