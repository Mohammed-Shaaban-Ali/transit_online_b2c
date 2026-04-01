"use client";

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { RootState } from "@/redux/app/store";
import { setTimeRange } from "@/redux/features/flights/flightFilterSlice";
import { useTranslations } from "next-intl";
import FilterSection from "../components/FilterSection";

const MIN_HOUR = 0;
const MAX_HOUR = 24;

const formatHour = (value: number) => `${String(value).padStart(2, "0")}:00`;

type RangeProps = {
  title: string;
  value: [number, number];
  onChange: (value: [number, number]) => void;
};

function TimeRangeSlider({ title, value, onChange }: RangeProps) {
  const [min, max] = value;

  return (
    <div className="mb-5">
      <p className="mb-3 text-[14px]">
        <span className="font-semibold">{title}</span>{" "}
        <span className="text-gray-600">
          {formatHour(min)}-{formatHour(max)}
        </span>
      </p>

      {/* Force LTR so the slider always goes 00:00 → 24:00 left-to-right */}
      <div dir="ltr">
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
    </div>
  );
}

function TimesSection({ flightType = "departure" }: { flightType?: "departure" | "return" }) {
  const dispatch = useDispatch();
  const t = useTranslations("ShowFarePage.Filters");
  const timeRange = useSelector((state: RootState) =>
    flightType === "return"
      ? state.flightFilter.returnFilters.timeRange
      : state.flightFilter.departureFilters.timeRange
  );

  const depRange: [number, number] = timeRange
    ? [parseInt(timeRange.departureMin), parseInt(timeRange.departureMax)]
    : [0, 24];

  const arrRange: [number, number] = timeRange
    ? [parseInt(timeRange.arrivalMin), parseInt(timeRange.arrivalMax)]
    : [0, 24];

  const handleDepartureChange = useCallback(
    (value: [number, number]) => {
      dispatch(
        setTimeRange({
          timeRange: {
            departureMin: formatHour(value[0]),
            departureMax: formatHour(value[1]),
            arrivalMin: timeRange?.arrivalMin || "00:00",
            arrivalMax: timeRange?.arrivalMax || "24:00",
          },
          flightType,
        })
      );
    },
    [dispatch, timeRange, flightType]
  );

  const handleArrivalChange = useCallback(
    (value: [number, number]) => {
      dispatch(
        setTimeRange({
          timeRange: {
            departureMin: timeRange?.departureMin || "00:00",
            departureMax: timeRange?.departureMax || "24:00",
            arrivalMin: formatHour(value[0]),
            arrivalMax: formatHour(value[1]),
          },
          flightType,
        })
      );
    },
    [dispatch, timeRange, flightType]
  );

  return (
    <FilterSection title={t("times")} className="mb-4">
      <TimeRangeSlider
        title={t("departureTime")}
        value={depRange}
        onChange={handleDepartureChange}
      />
      <TimeRangeSlider
        title={t("arrivalTime")}
        value={arrRange}
        onChange={handleArrivalChange}
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
