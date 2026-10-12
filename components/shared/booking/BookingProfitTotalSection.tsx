"use client";

import { useEffect, useState } from "react";
import { formatePrice } from "@/utils/formatePrice";
import CurrencySymbol from "@/components/shared/PriceCell/CurrencySymbol";

export const parseNonNegativeNumber = (raw: string): number => {
  if (raw.trim() === "") return 0;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return parsed;
};

type BookingProfitTotalSectionProps = {
  inputId: string;
  profitLabel: string;
  totalLabel: string;
  baseTotal: number;
  profit: number;
  onProfitChange: (value: number) => void;
  isCalculating?: boolean;
  showProfitInput?: boolean;
  totalSize?: "md" | "lg";
  totalValueClassName?: string;
  className?: string;
};

const totalSizeClasses = {
  md: {
    label: "text-lg font-bold",
    value: "text-lg font-bold",
    symbol: "md" as const,
  },
  lg: {
    label: "text-24 font-bold",
    value: "text-24 font-bold",
    symbol: "md" as const,
  },
};

export default function BookingProfitTotalSection({
  inputId,
  profitLabel,
  totalLabel,
  baseTotal,
  profit,
  onProfitChange,
  isCalculating = false,
  showProfitInput = true,
  totalSize = "lg",
  totalValueClassName = "",
  className = "",
}: BookingProfitTotalSectionProps) {
  const [profitInput, setProfitInput] = useState(
    profit > 0 ? String(profit) : "",
  );
  const total = baseTotal + profit;
  const sizeClasses = totalSizeClasses[totalSize];

  useEffect(() => {
    const nextValue = profit > 0 ? String(profit) : "";
    setProfitInput((current) =>
      parseNonNegativeNumber(current) === profit ? current : nextValue,
    );
  }, [profit]);

  return (
    <div
      className={
        showProfitInput
          ? `space-y-3 rounded-xl border border-gray-200 bg-gray-50/70 p-3 ${className}`.trim()
          : className
      }
    >
      {showProfitInput && (
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor={inputId}
            className="text-14 font-semibold text-gray-800"
          >
            {profitLabel}
          </label>
          <div
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 shadow-sm transition-[border-color,box-shadow] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15"
            dir="ltr"
          >
            <CurrencySymbol size="sm" className="shrink-0 text-gray-500" />
            <input
              id={inputId}
              type="text"
              inputMode="decimal"
              value={profitInput}
              placeholder="0"
              aria-label={profitLabel}
              onKeyDown={(event) => {
                if (
                  event.key === "-" ||
                  event.key === "e" ||
                  event.key === "E" ||
                  event.key === "+"
                ) {
                  event.preventDefault();
                }
              }}
              onChange={(event) => {
                const raw = event.target.value;
                if (raw !== "" && !/^\d*\.?\d*$/.test(raw)) return;
                setProfitInput(raw);
                onProfitChange(parseNonNegativeNumber(raw));
              }}
              className="h-full w-24 min-w-0 border-0 bg-transparent p-0 text-end text-16 font-semibold text-gray-900 tabular-nums outline-none placeholder:font-normal placeholder:text-gray-400"
            />
          </div>
        </div>
      )}

      <div
        className={`flex items-center justify-between gap-3 ${
          showProfitInput ? "border-t border-dashed border-gray-300 pt-3" : ""
        }`}
      >
        <span className={sizeClasses.label}>{totalLabel}</span>
        {isCalculating ? (
          <div className="h-8 w-32 animate-pulse rounded-lg bg-gray-200" />
        ) : (
          <span
            className={`inline-flex items-center gap-1 ${sizeClasses.value} ${totalValueClassName}`.trim()}
            dir="ltr"
          >
            <CurrencySymbol size={sizeClasses.symbol} />
            <span>{formatePrice(total)}</span>
          </span>
        )}
      </div>

      {showProfitInput && profit > 0 && !isCalculating && (
        <p className="text-12 text-end text-gray-500" dir="ltr">
          {formatePrice(baseTotal)} + {formatePrice(profit)} ={" "}
          {formatePrice(total)}
        </p>
      )}
    </div>
  );
}
