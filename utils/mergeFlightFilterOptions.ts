import { FlightFilteringOptions } from "@/types/flightTypes";

const emptyOptions: FlightFilteringOptions = {
  minPrice: 0,
  maxPrice: 50000,
  airline: [],
  stops: [],
  provider: [],
};

/**
 * Merge filtering options from two provider responses.
 */
const mergeTwoFilterOptions = (
  options1: FlightFilteringOptions,
  options2: FlightFilteringOptions
): FlightFilteringOptions => {
  const providersMap = new Map<
    string,
    { id: string; text: string; count: number }
  >();

  options1.provider?.forEach((provider) => {
    providersMap.set(provider.id, {
      id: provider.id,
      text: provider.text,
      count: provider.count || 0,
    });
  });

  options2.provider?.forEach((provider) => {
    if (providersMap.has(provider.id)) {
      const existing = providersMap.get(provider.id)!;
      existing.count += provider.count || 0;
    } else {
      providersMap.set(provider.id, {
        id: provider.id,
        text: provider.text,
        count: provider.count || 0,
      });
    }
  });

  const airlinesMap = new Map<
    string,
    { id?: string; count?: string; text?: string }
  >();

  options1.airline?.forEach((airline) => {
    airlinesMap.set(airline.id || "", {
      id: airline.id,
      text: airline.text,
      count: airline.count,
    });
  });

  options2.airline?.forEach((airline) => {
    if (airlinesMap.has(airline.id || "")) {
      const existing = airlinesMap.get(airline.id || "")!;
      const existingCount = parseInt(existing.count || "0", 10);
      const newCount = parseInt(airline.count || "0", 10);
      existing.count = (existingCount + newCount).toString();
    } else {
      airlinesMap.set(airline.id || "", {
        id: airline.id,
        text: airline.text,
        count: airline.count,
      });
    }
  });

  const stopsMap = new Map<
    number,
    { id: number; text: string; count: number }
  >();

  options1.stops?.forEach((stop) => {
    stopsMap.set(stop.id, {
      id: stop.id,
      text: stop.text,
      count: stop.count || 0,
    });
  });

  options2.stops?.forEach((stop) => {
    if (stopsMap.has(stop.id)) {
      const existing = stopsMap.get(stop.id)!;
      existing.count += stop.count || 0;
    } else {
      stopsMap.set(stop.id, {
        id: stop.id,
        text: stop.text,
        count: stop.count || 0,
      });
    }
  });

  const minPrice1 = options1.minPrice ?? Infinity;
  const minPrice2 = options2.minPrice ?? Infinity;
  const maxPrice1 = options1.maxPrice ?? 0;
  const maxPrice2 = options2.maxPrice ?? 0;

  const minPrice =
    minPrice1 === Infinity && minPrice2 === Infinity
      ? 0
      : Math.min(minPrice1, minPrice2);
  const maxPrice =
    maxPrice1 === 0 && maxPrice2 === 0 ? 50000 : Math.max(maxPrice1, maxPrice2);

  return {
    minPrice,
    maxPrice,
    airline: Array.from(airlinesMap.values()),
    stops: Array.from(stopsMap.values()).sort((a, b) => a.id - b.id),
    provider: Array.from(providersMap.values()).sort((a, b) =>
      a.text.localeCompare(b.text)
    ),
  };
};

/**
 * Merge filtering options from multiple provider endpoints.
 * - Providers: merge and add counts if same provider exists in both
 * - minPrice: take the minimum of all
 * - maxPrice: take the maximum of all
 * - airline: merge and add counts
 * - stops: merge and add counts
 */
export const mergeFlightFilterOptions = (
  ...allOptions: (FlightFilteringOptions | undefined)[]
): FlightFilteringOptions => {
  const valid = allOptions.filter(Boolean) as FlightFilteringOptions[];

  if (!valid.length) return emptyOptions;
  if (valid.length === 1) return valid[0];

  return valid.slice(1).reduce(mergeTwoFilterOptions, valid[0]);
};
