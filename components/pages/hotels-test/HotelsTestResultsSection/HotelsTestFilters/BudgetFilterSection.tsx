"use client";

import { useMemo, useState } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { convertPrice } from "@/config/currency";
import { formatePriceRaw } from "@/utils/formatePrice";
import CurrencySymbol from "@/components/shared/PriceCell/CurrencySymbol";
import { hotelSeachTypes } from "@/types/hotels";

type PriceRange = { min: number; max: number };

type Props = {
  hotels: hotelSeachTypes[];
  priceRange: PriceRange;
  setPriceRange: (v: PriceRange) => void;
  minPrice: number;
  maxPrice: number;
  currencySymbol: string;
};

function BudgetSlider({
  min,
  max,
  value,
  onChange,
  currencySymbol,
}: {
  min: number;
  max: number;
  value: PriceRange;
  onChange: (v: PriceRange) => void;
  currencySymbol: string;
}) {
  const [hoveredThumb, setHoveredThumb] = useState<0 | 1 | null>(null);
  const range = max - min || 1;
  const leftPct = ((value.min - min) / range) * 100;
  const rightPct = ((value.max - min) / range) * 100;

  return (
    <div className="relative" dir="ltr">
      {hoveredThumb === 0 && (
        <div
          className="absolute -top-10 z-10 -translate-x-1/2 rounded bg-gray-900 px-2 py-0.5 text-[12px] text-white whitespace-nowrap pointer-events-none"
          style={{ left: `${leftPct}%` }}
        >
          {currencySymbol}
          {formatePriceRaw(value.min).toLocaleString()}
          <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
      {hoveredThumb === 1 && (
        <div
          className="absolute -top-10 z-10 -translate-x-1/2 rounded bg-gray-900 px-2 py-0.5 text-[12px] text-white whitespace-nowrap pointer-events-none"
          style={{ left: `${rightPct}%` }}
        >
          {currencySymbol}
          {formatePriceRaw(value.max).toLocaleString()}
          <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
      <div
        onMouseLeave={() => setHoveredThumb(null)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = (e.clientX - rect.left) / rect.width;
          const leftDiff = Math.abs(pct - leftPct / 100);
          const rightDiff = Math.abs(pct - rightPct / 100);
          setHoveredThumb(leftDiff < rightDiff ? 0 : 1);
        }}
      >
        <RangeSlider
          className="hotels-test-fare-price-slider"
          min={min}
          max={max}
          step={10}
          value={[value.min, value.max]}
          onInput={(val) =>
            onChange({ min: (val as number[])[0], max: (val as number[])[1] })
          }
        />
      </div>
    </div>
  );
}

export default function BudgetFilterSection({
  hotels,
  priceRange,
  setPriceRange,
  minPrice,
  maxPrice,
  currencySymbol,
}: Props) {
  const chips = useMemo(() => {
    const CHIP_COUNT = 4;
    const sortedPrices = (hotels ?? [])
      .map((h) =>
        convertPrice(parseFloat(h.price?.toString().replace(/[^\d.]/g, "") || "0")),
      )
      .filter((p) => !isNaN(p) && p > 0)
      .sort((a, b) => a - b);

    const priceChips: {
      min: number;
      max: number;
      isLast: boolean;
      count: number;
    }[] = [];

    if (sortedPrices.length >= CHIP_COUNT) {
      const chunkSize = Math.ceil(sortedPrices.length / CHIP_COUNT);
      for (let i = 0; i < CHIP_COUNT; i++) {
        const slice = sortedPrices.slice(i * chunkSize, (i + 1) * chunkSize);
        if (!slice.length) continue;
        priceChips.push({
          min: Math.floor(slice[0]),
          max: Math.ceil(slice[slice.length - 1]),
          isLast: i === CHIP_COUNT - 1,
          count: slice.length,
        });
      }
    }

    return priceChips;
  }, [hotels]);

  const fmtK = (n: number) => {
    const v = formatePriceRaw(n);
    if (v >= 1000) {
      const k = v / 1000;
      return `${k % 1 === 0 ? k : k.toFixed(1)}k`;
    }
    return v.toLocaleString();
  };

  return (
    <section className="border-b border-gray-300 pb-4 mb-4">
      <div className="mb-5 flex items-center justify-between">
        <h4 className="text-[16px] font-semibold">
          Budget{" "}
          <span className="font-normal text-gray-600 text-[14px]">
            ({currencySymbol}
            {formatePriceRaw(priceRange.min).toLocaleString()} - {currencySymbol}
            {formatePriceRaw(priceRange.max).toLocaleString()})
          </span>
        </h4>
      </div>

      <BudgetSlider
        min={minPrice}
        max={maxPrice}
        value={priceRange}
        onChange={setPriceRange}
        currencySymbol={currencySymbol}
      />

      <div className="mt-6 flex flex-wrap gap-1.5">
        {chips.map((chip) => {
          const active = priceRange.min === chip.min && priceRange.max === chip.max;
          return (
            <button
              key={`${chip.min}-${chip.max}`}
              type="button"
              onClick={() =>
                setPriceRange(
                  active
                    ? { min: minPrice, max: maxPrice }
                    : { min: chip.min, max: chip.max },
                )
              }
              className={`rounded flex-1 px-2 py-1.5 text-[11px] font-medium border transition-colors flex items-center justify-center gap-0.5 whitespace-nowrap ${
                active
                  ? "bg-primary/10 text-primary border-primary"
                  : "bg-gray-100 text-gray-700 border-gray-200 hover:border-gray-400"
              }`}
            >
              <span className="flex flex-col items-center leading-tight gap-0.5">
                <span className="flex items-center gap-0.5">
                  {chip.isLast && <>&gt;&nbsp;</>}
                  <CurrencySymbol size="sm" className={active ? "text-primary" : ""} />
                  {fmtK(chip.min)}
                  {!chip.isLast && (
                    <>
                      &nbsp;-&nbsp;
                      <CurrencySymbol
                        size="sm"
                        className={active ? "text-primary" : ""}
                      />
                      {fmtK(chip.max)}
                    </>
                  )}
                </span>
                <span
                  className={`text-[10px] ${active ? "text-primary/70" : "text-gray-400"}`}
                >
                  {chip.count} {chip.count === 1 ? "hotel" : "hotels"}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <style jsx global>{`
        .hotels-test-fare-price-slider {
          width: 100%;
          height: 4px !important;
          background: #d1d5db !important;
          border-radius: 9999px;
        }
        .hotels-test-fare-price-slider .range-slider__range {
          height: 4px !important;
          background: #111827 !important;
          border-radius: 9999px;
        }
        .hotels-test-fare-price-slider .range-slider__thumb {
          width: 20px !important;
          height: 20px !important;
          border-radius: 50%;
          border: 2px solid #111827 !important;
          background: #fff !important;
          box-shadow: none !important;
          cursor: pointer;
        }
      `}</style>
    </section>
  );
}
