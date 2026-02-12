import { useMemo, useCallback } from "react";

interface UseFlightPaginationProps {
  flights: any[];
  currentPage: number;
  flightsPerPage: number;
}

export const useFlightPagination = ({
  flights,
  currentPage,
  flightsPerPage,
}: UseFlightPaginationProps) => {
  const totalFlights = useMemo(() => flights?.length || 0, [flights]);

  const totalPages = useMemo(
    () => Math.ceil(totalFlights / flightsPerPage),
    [totalFlights, flightsPerPage]
  );

  const paginatedFlights = useMemo(() => {
    const startIndex = (currentPage - 1) * flightsPerPage;
    const endIndex = startIndex + flightsPerPage;
    return flights?.slice(startIndex, endIndex) || [];
  }, [flights, currentPage, flightsPerPage]);

  return {
    totalFlights,
    totalPages,
    paginatedFlights,
  };
};

interface UseReturnFlightsMapProps {
  returnFlights: any[];
}

export const useReturnFlightsMap = ({
  returnFlights,
}: UseReturnFlightsMapProps) => {
  const returnFlightsMap = useMemo(() => {
    const map = new Map();
    returnFlights?.forEach((returnFlight: any) => {
      const packageKey = returnFlight.package_info.package_key;
      const providerKey = returnFlight.provider_key;
      const compositeKey = `${providerKey}:${packageKey}`;

      if (!map.has(compositeKey)) {
        map.set(compositeKey, []);
      }
      map.get(compositeKey).push(returnFlight);
    });
    return map;
  }, [returnFlights]);

  const getMatchingReturnFlights = useCallback(
    (packageKey: string, providerKey: string) => {
      const compositeKey = `${providerKey}:${packageKey}`;
      return returnFlightsMap.get(compositeKey) || [];
    },
    [returnFlightsMap]
  );

  return {
    returnFlightsMap,
    getMatchingReturnFlights,
  };
};

