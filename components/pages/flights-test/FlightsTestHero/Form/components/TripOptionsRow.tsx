"use client";

import { TripType } from "../types";

type Props = {
  tripType: TripType;
  nonstop: boolean;
  onTripTypeChange: (tripType: TripType) => void;
  onNonstopChange: (value: boolean) => void;
};

const TRIP_TYPES: { value: TripType; label: string }[] = [
  { value: "oneWay", label: "One-way" },
  { value: "roundTrip", label: "Round trip" },
];

function TripOptionsRow({
  tripType,
  nonstop,
  onTripTypeChange,
  onNonstopChange,
}: Props) {
  return (
    <>
      {/* Mobile: tabs style */}
      <div className="mb-4 md:hidden">
        <div className="flex border-b border-gray-200">
          {TRIP_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => onTripTypeChange(t.value)}
              className={`flex-1 py-3 text-[14px] font-medium transition-colors ${
                tripType === t.value
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500"
              }`}
            >
              {t.label}
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
          Round-trip
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="tripTypeDesktop"
            value="oneWay"
            checked={tripType === "oneWay"}
            onChange={() => onTripTypeChange("oneWay")}
          />
          One-way
        </label>

        <label className="ms-2 flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={nonstop}
            onChange={(e) => onNonstopChange(e.target.checked)}
          />
          Nonstop
        </label>
      </div>
    </>
  );
}

export default TripOptionsRow;
