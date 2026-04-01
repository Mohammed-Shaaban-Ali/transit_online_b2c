"use client";

import { TripType } from "../types";
import { useTranslations } from "next-intl";

type Props = {
  tripType: TripType;
  nonstop: boolean;
  onTripTypeChange: (tripType: TripType) => void;
  onNonstopChange: (value: boolean) => void;
};

function TripOptionsRow({
  tripType,
  nonstop,
  onTripTypeChange,
  onNonstopChange,
}: Props) {
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
            name="tripTypeDesktop"
            value="roundTrip"
            checked={tripType === "roundTrip"}
            onChange={() => onTripTypeChange("roundTrip")}
          />
          {t("roundTripDesktop")}
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="tripTypeDesktop"
            value="oneWay"
            checked={tripType === "oneWay"}
            onChange={() => onTripTypeChange("oneWay")}
          />
          {t("oneWay")}
        </label>

        <label className="ms-2 flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={nonstop}
            onChange={(e) => onNonstopChange(e.target.checked)}
          />
          {t("nonstop")}
        </label>
      </div>
    </>
  );
}

export default TripOptionsRow;
