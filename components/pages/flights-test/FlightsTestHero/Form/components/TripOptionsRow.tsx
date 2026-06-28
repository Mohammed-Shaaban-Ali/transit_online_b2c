"use client";

import { useId } from "react";
// import { Check } from "lucide-react";
import { TripType } from "../types";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Props = {
  tripType: TripType;
  onTripTypeChange: (tripType: TripType) => void;
};

function TripOptionsRow({
  tripType,
  onTripTypeChange,
}: Props) {
  const tripTypeGroupName = useId();
  const t = useTranslations("FlightsTestForm.TripOptions");

  const TRIP_TYPES: { value: TripType; label: string }[] = [
    { value: "oneWay", label: t("oneWay") },
    { value: "roundTrip", label: t("roundTrip") },
  ];

  return (
    <>
      {/* Mobile: tabs style */}
      <div className="mb-3 md:hidden">
        <div className="flex border-b border-gray-200">
          {TRIP_TYPES.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onTripTypeChange(opt.value)}
              className={`flex-1 py-2.5 text-[14px] font-medium transition-colors ${
                tripType === opt.value
                  ? "border-b-2 border-primary text-primary"
                  : "text-black"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: radio + checkbox style */}
      <div className="mb-5 hidden md:flex items-center gap-7 text-[14px] leading-none text-black">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={tripTypeGroupName}
            value="roundTrip"
            checked={tripType === "roundTrip"}
            onChange={() => onTripTypeChange("roundTrip")}
            className="peer sr-only"
          />
          <span
            className={cn(
              "flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors",
              tripType === "roundTrip"
                ? "border-primary bg-primary"
                : "border-gray-400 bg-white",
            )}
          >
            {tripType === "roundTrip" && (
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            )}
          </span>
          {t("roundTripDesktop")}
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={tripTypeGroupName}
            value="oneWay"
            checked={tripType === "oneWay"}
            onChange={() => onTripTypeChange("oneWay")}
            className="peer sr-only"
          />
          <span
            className={cn(
              "flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors",
              tripType === "oneWay"
                ? "border-primary bg-primary"
                : "border-gray-400 bg-white",
            )}
          >
            {tripType === "oneWay" && (
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            )}
          </span>
          {t("oneWay")}
        </label>

        {/* <label className="ms-2 flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={nonstop}
            onChange={(e) => onNonstopChange(e.target.checked)}
            className="peer sr-only"
          />
          <span
            className={cn(
              "flex h-4 w-4 items-center justify-center rounded-sm border-2 transition-colors",
              nonstop
                ? "border-primary bg-primary"
                : "border-gray-400 bg-white",
            )}
          >
            {nonstop && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
          </span>
          {t("nonstop")}
        </label> */}
      </div>
    </>
  );
}

export default TripOptionsRow;
