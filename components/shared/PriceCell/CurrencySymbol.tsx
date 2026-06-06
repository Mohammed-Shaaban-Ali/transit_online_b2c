"use client";

import React from "react";
import { useCurrencyConfig } from "@/hooks/useCurrencyConfig";
import { useLocale } from "next-intl";

type Props = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

function CurrencySymbol({ className = "", size = "md" }: Props) {
  const locale = useLocale();
  const currencyConfig = useCurrencyConfig();
  const symbol =
    locale === "ar"
      ? currencyConfig.currencySymbolAr
      : currencyConfig.currencySymbolEn;

  const sizeClasses = {
    sm: "text-11 rtl:text-12 font-medium",
    md: "text-14 rtl:text-16 font-semibold",
    lg: "text-18  font-bold",
  };

  return (
    <span className={`${sizeClasses[size]} ${className}`}>{symbol}</span>
  );
}

export default CurrencySymbol;
