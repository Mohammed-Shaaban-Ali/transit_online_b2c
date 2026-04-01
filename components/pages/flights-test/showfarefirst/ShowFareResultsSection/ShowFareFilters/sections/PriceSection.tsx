"use client";

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { RootState } from "@/redux/app/store";
import { setPriceRange } from "@/redux/features/flights/flightFilterSlice";
import { useTranslations } from "next-intl";
import FilterSection from "../components/FilterSection";
import CurrencySymbol from "@/components/shared/PriceCell/CurrencySymbol";
import { formatePrice } from "@/utils/formatePrice";

type Props = {
  apiPriceRange: { min: number; max: number };
  flightType?: "departure" | "return";
};

function PriceSection({ apiPriceRange, flightType = "departure" }: Props) {
  const dispatch = useDispatch();
  const t = useTranslations("ShowFarePage.Filters");
  const priceRange = useSelector((state: RootState) =>
    flightType === "return"
      ? state.flightFilter.returnFilters.priceRange
      : state.flightFilter.departureFilters.priceRange
  );

  const handleChange = useCallback(
    (value: [number, number]) => {
      dispatch(
        setPriceRange({
          priceRange: { min: value[0], max: value[1] },
          flightType,
        })
      );
    },
    [dispatch, flightType]
  );

  return (
    <FilterSection title={t("price")} className="mb-4">
      <div className="mb-3">
        <p className="text-[14px] text-gray-600 flex flex-wrap items-center gap-1 tabular-nums">
          <CurrencySymbol size="sm" />
          <span>
            {formatePrice(priceRange.min)} – {formatePrice(priceRange.max)}
          </span>
        </p>
      </div>

      {/* Force LTR so the slider always goes min → max left-to-right */}
      <div dir="ltr">
        <RangeSlider
          className="price-range-slider"
          min={apiPriceRange.min}
          max={apiPriceRange.max}
          step={1}
          value={[priceRange.min, priceRange.max]}
          onInput={(val) => handleChange(val as [number, number])}
        />

        <div className="mt-1 flex items-center justify-between gap-2 text-[13px] text-gray-600 tabular-nums">
          <span className="inline-flex items-center gap-0.5">
            <CurrencySymbol size="sm" />
            {formatePrice(apiPriceRange.min)}
          </span>
          <span className="inline-flex items-center gap-0.5">
            <CurrencySymbol size="sm" />
            {formatePrice(apiPriceRange.max)}
          </span>
        </div>
      </div>

      <style jsx global>{`
        .price-range-slider {
          width: 100%;
          height: 4px !important;
          background: #d1d5db !important;
          border-radius: 9999px;
        }
        .price-range-slider .range-slider__range {
          height: 4px !important;
          background: #111827 !important;
          border-radius: 9999px;
        }
        .price-range-slider .range-slider__thumb {
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

export default PriceSection;
