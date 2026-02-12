"use client";

import { useHotelFilterRedux } from "@/hooks/useHotelFilterRedux";
import { useState, useEffect, useMemo, useRef } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { useTranslations } from "next-intl";
import { convertPrice } from "@/config/currency";

const PriceSlider = () => {
  const t = useTranslations("HotelsList.PriceSlider");
  const { priceRange, setPriceRange, hotels } = useHotelFilterRedux();
  const [localValue, setLocalValue] = useState<[number, number]>([
    priceRange.min,
    priceRange.max,
  ]);
  const [inputValues, setInputValues] = useState<[string, string]>([
    priceRange.min.toString(),
    priceRange.max.toString(),
  ]);

  const sliderRef = useRef<any>(null);

  // Calculate min and max prices from hotels
  const { minPrice, maxPrice } = useMemo(() => {
    if (!hotels || hotels.length === 0) {
      return { minPrice: 0, maxPrice: 15000 };
    }

    const prices = hotels
      .map((hotel) => {
        const price = parseFloat(
          hotel.price?.toString().replace(/[^\d.]/g, "") || "0"
        );
        return convertPrice(price);
      })
      .filter((price) => !isNaN(price) && price > 0);

    if (prices.length === 0) {
      return { minPrice: 0, maxPrice: 15000 };
    }

    const min = Math.floor(Math.min(...prices));
    const max = Math.ceil(Math.max(...prices));

    return { minPrice: min, maxPrice: max };
  }, [hotels]);

  useEffect(() => {
    setLocalValue([priceRange.min, priceRange.max]);
    setInputValues([priceRange.min.toString(), priceRange.max.toString()]);
  }, [priceRange]);

  // Update price range when min/max prices change (when hotels load)
  useEffect(() => {
    if (minPrice > 0 && maxPrice > minPrice) {
      // If using default values (0-500), initialize to full range
      if (priceRange.min === 0 && priceRange.max === 500) {
        setPriceRange({
          min: minPrice,
          max: maxPrice,
        });
      } else {
        // Only update if current range is outside the new bounds
        if (priceRange.min < minPrice || priceRange.max > maxPrice) {
          setPriceRange({
            min: Math.max(minPrice, priceRange.min),
            max: Math.min(maxPrice, priceRange.max),
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minPrice, maxPrice]);

  const handleRangeChange = (value: number[]) => {
    setLocalValue([value[0], value[1]]);
    setInputValues([value[0].toString(), value[1].toString()]);
  };

  const handleRangeChangeComplete = () => {
    setPriceRange({
      min: localValue[0],
      max: localValue[1],
    });
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string or any number input while typing
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setInputValues([value, inputValues[1]]);
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string or any number input while typing
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setInputValues([inputValues[0], value]);
    }
  };

  const validateAndUpdateMinPrice = () => {
    const numValue = parseFloat(inputValues[0]);
    if (isNaN(numValue) || inputValues[0] === "") {
      // Reset to current localValue if invalid
      setInputValues([localValue[0].toString(), inputValues[1]]);
      return;
    }
    const clampedValue = Math.max(minPrice, Math.min(numValue, localValue[1]));
    setLocalValue([clampedValue, localValue[1]]);
    setInputValues([clampedValue.toString(), inputValues[1]]);
    setPriceRange({
      min: clampedValue,
      max: localValue[1],
    });
  };

  const validateAndUpdateMaxPrice = () => {
    const numValue = parseFloat(inputValues[1]);
    if (isNaN(numValue) || inputValues[1] === "") {
      // Reset to current localValue if invalid
      setInputValues([inputValues[0], localValue[1].toString()]);
      return;
    }
    const clampedValue = Math.min(maxPrice, Math.max(numValue, localValue[0]));
    setLocalValue([localValue[0], clampedValue]);
    setInputValues([inputValues[0], clampedValue.toString()]);
    setPriceRange({
      min: localValue[0],
      max: clampedValue,
    });
  };

  const handleMinPriceBlur = () => {
    validateAndUpdateMinPrice();
  };

  const handleMaxPriceBlur = () => {
    validateAndUpdateMaxPrice();
  };

  const handleMinPriceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      validateAndUpdateMinPrice();
      e.currentTarget.blur();
    }
  };

  const handleMaxPriceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      validateAndUpdateMaxPrice();
      e.currentTarget.blur();
    }
  };

  return (
    <div className="space-y-4">
      {/* Slider Container */}
      <div className="relative">
        <RangeSlider
          ref={sliderRef}
          min={minPrice}
          max={maxPrice}
          step={10}
          value={localValue}
          onInput={handleRangeChange}
          onThumbDragStart={() => {
            // Track when dragging starts if needed
          }}
          onThumbDragEnd={handleRangeChangeComplete}
          className="price-range-slider"
        />
      </div>

      {/* Min and Max Price Inputs */}
      <div className="flex gap-4  ">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={inputValues[0]}
              onChange={handleMinPriceChange}
              onBlur={handleMinPriceBlur}
              onKeyDown={handleMinPriceKeyDown}
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
              onBlur={handleMaxPriceBlur}
              onKeyDown={handleMaxPriceKeyDown}
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

        /* First thumb (lower/min) - white with border */
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
