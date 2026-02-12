// ====================================
// Currency Configuration
// ====================================
// Change the exchange rate here to update all prices across the app.
// All prices from the API are in SAR (Saudi Riyal).
// They will be converted to EGP (Egyptian Pound) using this rate.
// ====================================

export const CURRENCY_CONFIG = {
  /** Exchange rate: 1 SAR = X EGP */
  exchangeRate: 12.5,

  /** Currency code for display (e.g., "EGP") */
  currencyCode: "EGP",

  /** Currency symbol for Arabic (e.g., "ج.م") */
  currencySymbolAr: "ج.م",

  /** Currency symbol for English (e.g., "EGP") */
  currencySymbolEn: "EGP",
};

/**
 * Convert a price from SAR to EGP (or whatever target currency is configured).
 * @param priceInSAR - The price in Saudi Riyal
 * @returns The converted price
 */
export const convertPrice = (priceInSAR: number): number => {
  return priceInSAR * CURRENCY_CONFIG.exchangeRate;
};
