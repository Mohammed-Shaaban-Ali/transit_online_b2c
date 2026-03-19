"use client";

import { useState } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import FilterSection from "../components/FilterSection";

type RangeProps = {
  title: string;
  value: [number, number];
  onChange: (value: [number, number]) => void;
};

const MIN_HOUR = 0;
const MAX_HOUR = 24;

const formatHour = (value: number) => `${String(value).padStart(2, "0")}:00`;

function TimeRangeSlider({ title, value, onChange }: RangeProps) {
  const [min, max] = value;
  return (
    <div className="mb-5">
      <p className="mb-3 text-[14px]">
        <span className="font-semibold">{title}</span>{" "}
        <span className="text-gray-600">
          {formatHour(min)}–{formatHour(max)}
        </span>
      </p>

      <RangeSlider
        className="time-range-slider"
        min={MIN_HOUR}
        max={MAX_HOUR}
        step={1}
        value={value}
        onInput={(nextValue) => onChange(nextValue as [number, number])}
      />

      <div className="mt-1 flex items-center justify-between text-[13px] text-gray-600">
        <span>{formatHour(min)}</span>
        <span>{formatHour(max)}</span>
      </div>
    </div>
  );
}

function TimesSection() {
  const [departureRange, setDepartureRange] = useState<[number, number]>([
    0, 24,
  ]);
  const [arrivalRange, setArrivalRange] = useState<[number, number]>([0, 24]);

  return (
    <FilterSection title="Times" className="mb-4">
      <TimeRangeSlider
        title="Departure time"
        value={departureRange}
        onChange={setDepartureRange}
      />
      <TimeRangeSlider
        title="Arrival time"
        value={arrivalRange}
        onChange={setArrivalRange}
      />

      <style jsx global>{`
        .time-range-slider {
          width: 100%;
          height: 4px !important;
          background: #d1d5db !important;
          border-radius: 9999px;
        }

        .time-range-slider .range-slider__range {
          height: 4px !important;
          background: #111827 !important;
          border-radius: 9999px;
        }

        .time-range-slider .range-slider__thumb {
          width: 18px !important;
          height: 18px !important;
          border-radius: 50%;
          border: 2px solid #111827 !important;
          background: #fff !important;
          box-shadow: none !important;
          cursor: pointer;
        }
      `}</style>
    </FilterSection>
  );
}

export default TimesSection;
