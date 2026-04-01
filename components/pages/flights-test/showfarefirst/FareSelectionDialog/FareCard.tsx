"use client";

import { Check, X } from "lucide-react";
import CurrencySymbol from "@/components/shared/PriceCell/CurrencySymbol";
import { formatePrice } from "@/utils/formatePrice";
import type { FareOption } from "../data/flights";
import { useTranslations } from "next-intl";

type Props = {
  fare: FareOption;
  isSelected: boolean;
  onSelect: () => void;
  /** Small label under price (e.g. segment / trip type). */
  tripLabel?: string;
  className?: string;
};

/**
 * Fare package card — same layout for Swiper slides and default API offers.
 * Price matches OfferCard / FlightDetails: CurrencySymbol + formatePrice(amount).
 */
export function FareCard({
  fare,
  isSelected,
  onSelect,
  tripLabel,
  className = "",
}: Props) {
  const t = useTranslations("ShowFarePage.FareDialog.fareCard");
  return (
    <div
      onClick={onSelect}
      className={`relative flex h-full cursor-pointer select-none flex-col rounded-lg border-2 p-3 transition-all sm:p-4 ${className} ${
        isSelected
          ? "border-primary shadow-md"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0">
          <p className="text-[14px] sm:text-[16px] font-bold truncate">{fare.cabinClass}</p>
          {fare.fareType?.trim() ? (
            <p className="text-[12px] sm:text-[14px] text-gray-500 truncate">
              {fare.fareType}
            </p>
          ) : null}
        </div>
        <div
          className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
            isSelected ? "border-primary bg-primary" : "border-gray-300"
          }`}
        >
          {isSelected && (
            <Check size={11} className="text-white" strokeWidth={3} />
          )}
        </div>
      </div>

      <div className="space-y-4 flex-1 min-h-0 min-w-0">
        <div>
          <p className="text-[12px] sm:text-[14px] font-semibold text-gray-700 mb-1.5">
            {t("baggage")}
          </p>
          <ul className="space-y-1.5">
            <li
              className={`flex items-start gap-1.5 text-[12px] sm:text-[14px] ${fare.baggage.carryOn ? "text-gray-700" : "text-gray-400"}`}
            >
              {fare.baggage.carryOn ? (
                <Check size={13} className="text-green-500 shrink-0 mt-0.5" />
              ) : (
                <X size={13} className="text-gray-400 shrink-0 mt-0.5" />
              )}
              {t("carryOn")}:{" "}
              <span
                className={`font-semibold ${!fare.baggage.carryOn ? "line-through" : ""}`}
              >
                {fare.baggage.carryOn || t("notIncluded")}
              </span>
            </li>
            <li
              className={`flex items-start gap-1.5 text-[12px] sm:text-[14px] ${fare.baggage.checked ? "text-gray-700" : "text-gray-400"}`}
            >
              {fare.baggage.checked ? (
                <Check size={13} className="text-green-500 shrink-0 mt-0.5" />
              ) : (
                <X size={13} className="text-gray-400 shrink-0 mt-0.5" />
              )}
              {t("checked")}:{" "}
              <span
                className={`font-semibold ${!fare.baggage.checked ? "line-through" : ""}`}
              >
                {fare.baggage.checked || t("notIncluded")}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 shrink-0">
        <div className="flex items-baseline gap-0.5 text-[20px] font-bold text-primary rtl:flex-row-reverse sm:text-[28px]">
          <CurrencySymbol size="md" className="font-bold sm:text-[18px]!" />
          <span className="tabular-nums">
            {formatePrice(fare.price ?? 0)}
            {fare.priceSuffix ?? ""}
          </span>
        </div>
        {tripLabel ? (
          <p className="text-[10px] sm:text-[11px] text-gray-500 mt-0.5">{tripLabel}</p>
        ) : null}
      </div>

      {isSelected && (
        <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-lg bg-primary" />
      )}
    </div>
  );
}
