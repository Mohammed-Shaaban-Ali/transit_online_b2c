/**
 * Calculate filtering options from matching return flights
 */
export const calculateReturnFlightFilterOptions = (matchingReturns: any[]) => {
  if (!matchingReturns || matchingReturns.length === 0) {
    return {
      airline: [],
      stops: [],
      provider: [],
      minPrice: 0,
      maxPrice: 50000,
    };
  }

  // Calculate airlines
  const airlinesMap = new Map<
    string,
    { id: string; text: string; count: number }
  >();

  // Calculate providers
  const providersMap = new Map<
    string,
    { id: string; text: string; count: number }
  >();

  // Calculate stops
  const stopsMap = new Map<
    number,
    { id: number; text: string; count: number }
  >();

  // Calculate price range
  let actualMinPrice = Infinity;
  let actualMaxPrice = 0;

  matchingReturns.forEach((flight: any) => {
    // Extract airline
    const carrierCode = flight.legs?.[0]?.airline_info?.carrier_code;
    const carrierName = flight.legs?.[0]?.airline_info?.carrier_name;

    if (carrierCode && carrierName) {
      if (airlinesMap.has(carrierCode)) {
        airlinesMap.get(carrierCode)!.count++;
      } else {
        airlinesMap.set(carrierCode, {
          id: carrierCode,
          text: carrierName,
          count: 1,
        });
      }
    }

    // Extract provider
    const providerKey = flight.provider_key;
    if (providerKey) {
      if (providersMap.has(providerKey)) {
        providersMap.get(providerKey)!.count++;
      } else {
        providersMap.set(providerKey, {
          id: providerKey,
          text: providerKey,
          count: 1,
        });
      }
    }

    // Extract stops
    const legCount = flight.legs?.length - 1 || 0;
    const stopText =
      legCount === 0
        ? "Direct"
        : legCount === 1
        ? "1 Stop"
        : `${legCount} Stops`;

    if (stopsMap.has(legCount)) {
      stopsMap.get(legCount)!.count++;
    } else {
      stopsMap.set(legCount, {
        id: legCount,
        text: stopText,
        count: 1,
      });
    }

    // Extract price
    const price =
      flight.fares?.[0]?.fare_info?.fare_detail?.price_info?.total_fare || 0;
    if (price > 0) {
      actualMinPrice = Math.floor(Math.min(actualMinPrice, price));
      actualMaxPrice = Math.ceil(Math.max(actualMaxPrice, price));
    }
  });

  // For return flights: min = 0, max = (actualMax - actualMin)
  const minPrice = 0;
  const maxPrice =
    actualMinPrice === Infinity || actualMaxPrice === 0
      ? 50000
      : Math.ceil(actualMaxPrice - actualMinPrice);

  const actualMin =
    actualMinPrice === Infinity ? 0 : Math.floor(actualMinPrice);
  const actualMax = actualMaxPrice === 0 ? 50000 : Math.ceil(actualMaxPrice);

  return {
    airline: Array.from(airlinesMap.values()).sort((a, b) =>
      a.text.localeCompare(b.text)
    ),
    stops: Array.from(stopsMap.values()).sort((a, b) => a.id - b.id),
    provider: Array.from(providersMap.values()).sort((a, b) =>
      a.text.localeCompare(b.text)
    ),
    minPrice,
    maxPrice,
    // Store actual prices for reference (needed for filtering)
    actualMinPrice: actualMin,
    actualMaxPrice: actualMax,
  };
};
