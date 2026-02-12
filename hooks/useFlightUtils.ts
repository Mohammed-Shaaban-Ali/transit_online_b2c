import { useCallback } from "react";
import { useLocale } from "next-intl";
import { CURRENCY_CONFIG, convertPrice } from "@/config/currency";

// Custom hook for flight utility functions
export const useFlightUtils = () => {
  const locale = useLocale();

  const formatTime = useCallback(
    (dateString: string): string => {
      return new Date(dateString).toLocaleTimeString(
        locale === "ar" ? "ar-EG" : "en-US",
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }
      );
    },
    [locale]
  );

  const formatDuration = useCallback(
    (minutes: number): string => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      if (locale === "ar") {
        return `${hours}س ${mins}د`;
      }
      return `${hours}h ${mins}m`;
    },
    [locale]
  );

  const formatDate = useCallback(
    (dateString: string): string => {
      return new Date(dateString).toLocaleDateString(
        locale === "ar" ? "ar-EG" : "en-US",
        {
          weekday: "short",
          month: "short",
          day: "numeric",
        }
      );
    },
    [locale]
  );

  const formatPrice = useCallback(
    (amount: number, currency: string = "EGP"): string => {
      const convertedAmount = convertPrice(amount);
      return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
        style: "currency",
        currency: CURRENCY_CONFIG.currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(convertedAmount);
    },
    [locale]
  );

  return {
    formatTime,
    formatDuration,
    formatDate,
    formatPrice,
  };
};

// Custom hook for flight data processing
export const useFlightData = (data: any) => {
  const flights = data?.data || { departure_flights: [], return_flights: [] };
  const flightsMeta = data?.meta || {};

  return {
    flights,
    flightsMeta,
  };
};

