"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPriceRange } from "@/redux/features/flights/flightFilterSlice";
import { RootState } from "@/redux/app/store";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { useTranslations } from "next-intl";

interface PriceSliderProps {
  minPrice: number;
  maxPrice: number;
  flightType?: "departure" | "return";
}

const PriceSlider: React.FC<PriceSliderProps> = ({
  minPrice,
  maxPrice,
  flightType = "departure",
}) => {
  const t = useTranslations("FlightPriceSlider");
  const dispatch = useDispatch();
  const { departureFilters, returnFilters, returnFlightsActualPriceRange } =
    useSelector((state: RootState) => state.flightFilter);
  const filters = flightType === "departure" ? departureFilters : returnFilters;

  const [localValue, setLocalValue] = useState<[number, number]>([
    filters.priceRange.min,
    filters.priceRange.max,
  ]);
  const [inputValues, setInputValues] = useState<[string, string]>([
    filters.priceRange.min.toString(),
    filters.priceRange.max.toString(),
  ]);

  const sliderRef = useRef<any>(null);

  // For return flights, use actual price range if available
  const actualMinPrice = useMemo(() => {
    if (flightType === "return" && returnFlightsActualPriceRange) {
      return returnFlightsActualPriceRange.min;
    }
    return minPrice;
  }, [flightType, returnFlightsActualPriceRange, minPrice]);

  const actualMaxPrice = useMemo(() => {
    if (flightType === "return" && returnFlightsActualPriceRange) {
      return returnFlightsActualPriceRange.max;
    }
    return maxPrice;
  }, [flightType, returnFlightsActualPriceRange, maxPrice]);

  // Calculate slider range: for return flights, slider max = (actualMax - actualMin)
  const sliderMax = useMemo(() => {
    if (flightType === "return" && returnFlightsActualPriceRange) {
      return (
        returnFlightsActualPriceRange.max - returnFlightsActualPriceRange.min
      );
    }
    return maxPrice - minPrice;
  }, [flightType, returnFlightsActualPriceRange, maxPrice, minPrice]);

  useEffect(() => {
    setLocalValue([filters.priceRange.min, filters.priceRange.max]);
    // Redux store already contains slider values (0 to sliderMax), use them directly
    setInputValues([
      filters.priceRange.min.toString(),
      filters.priceRange.max.toString(),
    ]);
  }, [filters.priceRange]);

  // Initialize price range when min/max prices change
  useEffect(() => {
    if (actualMinPrice > 0 && actualMaxPrice > actualMinPrice) {
      if (filters.priceRange.min === 0 && filters.priceRange.max === 500) {
        if (flightType === "return" && returnFlightsActualPriceRange) {
          // For return: set slider to 0 to sliderMax
          dispatch(
            setPriceRange({
              priceRange: {
                min: 0,
                max: sliderMax,
              },
              flightType: "return",
            })
          );
        } else {
          dispatch(
            setPriceRange({
              priceRange: {
                min: actualMinPrice,
                max: actualMaxPrice,
              },
              flightType: "departure",
            })
          );
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualMinPrice, actualMaxPrice, flightType]);

  const handleRangeChange = (value: number[]) => {
    setLocalValue([value[0], value[1]]);
    // For return flights, display slider values directly (not converted)
    setInputValues([value[0].toString(), value[1].toString()]);
  };

  const handleRangeChangeComplete = () => {
    dispatch(
      setPriceRange({
        priceRange: {
          min: localValue[0],
          max: localValue[1],
        },
        flightType,
      })
    );
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setInputValues([value, inputValues[1]]);
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setInputValues([inputValues[0], value]);
    }
  };

  const validateAndUpdateMinPrice = () => {
    const numValue = parseFloat(inputValues[0]);
    if (isNaN(numValue) || inputValues[0] === "") {
      setInputValues([localValue[0].toString(), inputValues[1]]);
      return;
    }
    // Input values are always in slider format (0 to sliderMax for return, actual prices for departure)
    const clampedValue = Math.max(0, Math.min(numValue, localValue[1]));
    setLocalValue([clampedValue, localValue[1]]);
    setInputValues([clampedValue.toString(), inputValues[1]]);

    // Dispatch slider values directly (Redux store stores slider values)
    dispatch(
      setPriceRange({
        priceRange: {
          min: clampedValue,
          max: localValue[1],
        },
        flightType,
      })
    );
  };

  const validateAndUpdateMaxPrice = () => {
    const numValue = parseFloat(inputValues[1]);
    if (isNaN(numValue) || inputValues[1] === "") {
      setInputValues([inputValues[0], localValue[1].toString()]);
      return;
    }
    // Input values are always in slider format (0 to sliderMax for return, actual prices for departure)
    const clampedValue = Math.min(sliderMax, Math.max(numValue, localValue[0]));
    setLocalValue([localValue[0], clampedValue]);
    setInputValues([inputValues[0], clampedValue.toString()]);

    // Dispatch slider values directly (Redux store stores slider values)
    dispatch(
      setPriceRange({
        priceRange: {
          min: localValue[0],
          max: clampedValue,
        },
        flightType,
      })
    );
  };

  return (
    <div className="space-y-4">
      {/* Slider Container */}
      <div className="relative">
        <RangeSlider
          ref={sliderRef}
          min={0}
          max={sliderMax}
          step={10}
          value={localValue}
          onInput={handleRangeChange}
          onThumbDragEnd={handleRangeChangeComplete}
          className="price-range-slider"
        />
      </div>

      {/* Min and Max Price Inputs */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={inputValues[0]}
              onChange={handleMinPriceChange}
              onBlur={validateAndUpdateMinPrice}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  validateAndUpdateMinPrice();
                  e.currentTarget.blur();
                }
              }}
              className="w-full px-3 py-2 border border-gray-400 rounded text-gray-600 placeholder:text-gray-400 focus:outline-none focus:border-primary"
              placeholder={t("minPrice")}
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={inputValues[1]}
              onChange={handleMaxPriceChange}
              onBlur={validateAndUpdateMaxPrice}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  validateAndUpdateMaxPrice();
                  e.currentTarget.blur();
                }
              }}
              className="w-full px-3 py-2 border border-gray-400 rounded text-gray-600 placeholder:text-gray-400 focus:outline-none focus:border-primary"
              placeholder={t("maxPrice")}
            />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .price-range-slider {
          width: 100%;
          height: 4px !important;
          background: #c4c4c4 !important;
          border-radius: 4px;
        }

        .price-range-slider .range-slider__range {
          background: var(--primary) !important;
          height: 2px;
          border-radius: 4px;
        }

        .price-range-slider .range-slider__thumb {
          width: 18px !important;
          height: 18px !important;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: none;
          transition: box-shadow 0.2s ease, transform 0.1s ease;
        }

        .price-range-slider .range-slider__thumb:first-of-type {
          background: white !important;
          border: 2px solid var(--primary) !important;
        }
        .range-slider .range-slider__thumb {
          background: var(--primary) !important;
        }
      `}</style>
    </div>
  );
};

export default PriceSlider;
