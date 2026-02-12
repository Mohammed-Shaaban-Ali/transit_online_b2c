import { flightTypes } from '@/types/flightTypes';

/**
 * Merge flight data from two endpoints (iati and sabre)
 * Combines departure_flights and return_flights arrays
 */
export const mergeFlightData = (
  data1?: flightTypes,
  data2?: flightTypes,
): flightTypes => {
  if (!data1 && !data2) {
    return {
      departure_flights: [],
      return_flights: [],
    };
  }

  if (!data1) return data2!;
  if (!data2) return data1;

  // Merge departure flights
  const departureFlights = [
    ...(data1.departure_flights || []),
    ...(data2.departure_flights || []),
  ];

  // Merge return flights
  const returnFlights = [
    ...(data1.return_flights || []),
    ...(data2.return_flights || []),
  ];

  return {
    departure_flights: departureFlights,
    return_flights: returnFlights,
  };
};

