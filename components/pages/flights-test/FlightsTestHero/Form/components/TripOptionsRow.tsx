"use client";

import { TripType } from "../types";

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
  return (
    <div className="mb-5 flex items-center gap-7 text-[14px] leading-none text-black">
      <label className="flex items-center gap-2">
        <input
          type="radio"
          name="tripType"
          checked={tripType === "roundTrip"}
          onChange={() => onTripTypeChange("roundTrip")}
        />
        Round-trip
      </label>
      <label className="flex items-center gap-2">
        <input
          type="radio"
          name="tripType"
          checked={tripType === "oneWay"}
          onChange={() => onTripTypeChange("oneWay")}
        />
        One-way
      </label>

      <label className="ms-2 flex items-center gap-2">
        <input
          type="checkbox"
          checked={nonstop}
          onChange={(e) => onNonstopChange(e.target.checked)}
        />
        Nonstop
      </label>
    </div>
  );
}

export default TripOptionsRow;
