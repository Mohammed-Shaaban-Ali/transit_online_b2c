// ====================================
// Currency Configuration
// ====================================
// Currency helpers based on the active country.
// Country-specific values live in config/countries.ts.
// ====================================

import {
  COUNTRIES_CONFIG,
  Country,
  DEFAULT_COUNTRY,
} from "./countries";

export interface CurrencyConfig {
  exchangeRate: number;
  currencyCode: string;
  currencySymbolAr: string;
  currencySymbolEn: string;
}

/** Return the currency config for a given country code (case-insensitive). */
export function getCurrencyConfig(
  country: string = DEFAULT_COUNTRY
): CurrencyConfig {
  const key = country.toLowerCase() as Country;
  const config = COUNTRIES_CONFIG[key] ?? COUNTRIES_CONFIG[DEFAULT_COUNTRY];
  return {
    exchangeRate: config.exchangeRate,
    currencyCode: config.currencyCode,
    currencySymbolAr: config.currencySymbolAr,
    currencySymbolEn: config.currencySymbolEn,
  };
}

/** Default currency config (Egypt) — kept for backward compatibility. */
export const CURRENCY_CONFIG: CurrencyConfig = getCurrencyConfig(DEFAULT_COUNTRY);

/**
 * Convert a price using the exchange rate of a given country.
 * With the current setup the API already returns prices in the local
 * currency, so the rate defaults to 1.
 */
export const convertPrice = (price: number): number => {
  return price * CURRENCY_CONFIG.exchangeRate;
};
