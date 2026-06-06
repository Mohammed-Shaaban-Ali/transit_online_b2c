"use client";

import { getCurrencyConfig, CurrencyConfig } from "@/config/currency";
import { useCountry } from "./useCountry";

/** Returns the currency config (symbols, code, rate) for the active country. */
export function useCurrencyConfig(): CurrencyConfig {
  const country = useCountry();
  return getCurrencyConfig(country);
}
