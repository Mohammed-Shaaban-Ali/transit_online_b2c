import { flightTypes } from '@/types/flightTypes';

/**
 * Merge flight data from multiple provider endpoints.
 * Combines departure_flights and return_flights arrays.
 */
export const mergeFlightData = (
  ...datasets: (flightTypes | undefined)[]
): flightTypes => {
  const valid = datasets.filter(Boolean) as flightTypes[];

  if (!valid.length) {
    return {
      departure_flights: [],
      return_flights: [],
    };
  }

  if (valid.length === 1) return valid[0];

  return {
    departure_flights: valid.flatMap((d) => d.departure_flights || []),
    return_flights: valid.flatMap((d) => d.return_flights || []),
  };
};
