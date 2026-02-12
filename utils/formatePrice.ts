import { convertPrice } from "@/config/currency";

export const formatePrice = (price: number): number => {
  // return parseFloat(price?.toFixed(2));
  return Math.ceil(convertPrice(price));
};

// old way
export const formatePriceFixed = (price: number): number => {
  return parseFloat(convertPrice(price)?.toFixed(2));
};

/**
 * Format price WITHOUT conversion (for prices already converted)
 */
export const formatePriceRaw = (price: number): number => {
  return Math.ceil(price);
};
