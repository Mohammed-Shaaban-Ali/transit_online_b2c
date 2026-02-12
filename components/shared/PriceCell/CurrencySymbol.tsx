"use client";

import React from "react";
import { CURRENCY_CONFIG } from "@/config/currency";
import { useLocale } from "next-intl";

type Props = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

function CurrencySymbol({ className = "", size = "md" }: Props) {
  const locale = useLocale();
  const symbol =
    locale === "ar"
      ? CURRENCY_CONFIG.currencySymbolAr
      : CURRENCY_CONFIG.currencySymbolEn;

  const sizeClasses = {
    sm: "text-11 font-medium",
    md: "text-14 font-semibold",
    lg: "text-18 font-bold",
  };

  return (
    <span className={`${sizeClasses[size]} ${className}`}>{symbol}</span>
  );
}

export default CurrencySymbol;
