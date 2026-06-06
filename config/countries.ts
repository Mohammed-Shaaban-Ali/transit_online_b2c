// ====================================
// Country Configuration
// ====================================
// Supported countries with their API codes and currency info.
// Add new countries here to extend the app.
// ====================================

export const SUPPORTED_COUNTRIES = ["eg", "sa"] as const;
export type Country = (typeof SUPPORTED_COUNTRIES)[number];
export const DEFAULT_COUNTRY: Country = "eg";

export interface CountryConfig {
  code: Country;
  /** Uppercase country code sent to the API via x-country header */
  apiCode: string;
  /** Currency code sent to the API via x-currency header */
  apiCurrency: string;
  /** Display currency code (e.g. "EGP") */
  currencyCode: string;
  /** Currency symbol shown in Arabic locale (e.g. "ج.م") */
  currencySymbolAr: string;
  /** Currency symbol shown in English locale (e.g. "EGP") */
  currencySymbolEn: string;
  /** Price multiplier — 1 means no conversion (API already returns in local currency) */
  exchangeRate: number;
}

export const COUNTRIES_CONFIG: Record<Country, CountryConfig> = {
  eg: {
    code: "eg",
    apiCode: "EG",
    apiCurrency: "EGP",
    currencyCode: "EGP",
    currencySymbolAr: "ج.م",
    currencySymbolEn: "EGP",
    exchangeRate: 1,
  },
  sa: {
    code: "sa",
    apiCode: "SA",
    apiCurrency: "SAR",
    currencyCode: "SAR",
    currencySymbolAr: "ر.س",
    currencySymbolEn: "SAR",
    exchangeRate: 1,
  },
};
