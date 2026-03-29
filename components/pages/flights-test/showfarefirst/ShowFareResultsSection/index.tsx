"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useSearchFlightsIatiQuery,
  useSearchFlightsSabreQuery,
} from "@/redux/features/flights/flightsApi";
import { RootState } from "@/redux/app/store";
import {
  setPriceRange,
  resetFilters,
  setSortBy,
  setCurrentFilterType,
  setMatchingReturnFlights,
  setReturnFlightsActualPriceRange,
} from "@/redux/features/flights/flightFilterSlice";
import { mergeFlightData } from "@/utils/mergeFlightData";
import { mergeFlightFilterOptions } from "@/utils/mergeFlightFilterOptions";
import { useReturnFlightsMap } from "@/hooks/useFlightData";
import { calculateReturnFlightFilterOptions } from "@/utils/returnFlightFilterUtils";
import { FlightDirection } from "@/types/flightTypes";
import ShowFareFilters from "./ShowFareFilters";
import QuickFilter from "./QuickFilter";
import FlightCard from "../FlightCard";
import FlightSectionHeader from "./FlightSectionHeader";
import FareSelectionDialog from "../FareSelectionDialog";
import headerImage from "@/public/images/flights/headerImage.jpg";

type Props = {
  fromAirport: string;
  toAirport: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  cabinClass: string;
  nonstop: boolean;
};

const FLIGHTS_PER_PAGE = 15;

function applyFilters(
  flights: FlightDirection[],
  filters: any,
  apiPriceRange: { min: number; max: number },
) {
  let filtered = [...flights];

  if (
    filters.priceRange.min > apiPriceRange.min ||
    filters.priceRange.max < apiPriceRange.max
  ) {
    filtered = filtered.filter((f: any) => {
      const price = f.minimum_package_price;
      return price >= filters.priceRange.min && price <= filters.priceRange.max;
    });
  }

  if (filters.selectedAirlines.length > 0) {
    filtered = filtered.filter((f: any) => {
      const code = f.legs?.[0]?.airline_info?.carrier_code;
      return code && filters.selectedAirlines.includes(code);
    });
  }

  if (filters.selectedStops.length > 0) {
    filtered = filtered.filter((f: any) => {
      const legCount = (f.legs?.length ?? 1) - 1;
      return filters.selectedStops.includes(legCount);
    });
  }

  if (filters.selectedProviders.length > 0) {
    filtered = filtered.filter((f: any) =>
      filters.selectedProviders.includes(f.provider_key),
    );
  }

  if (filters.timeRange) {
    const { departureMin, departureMax, arrivalMin, arrivalMax } =
      filters.timeRange;
    filtered = filtered.filter((f: any) => {
      const depDate = f.legs?.[0]?.departure_info?.date;
      const arrDate = f.legs?.[f.legs.length - 1]?.arrival_info?.date;
      if (!depDate || !arrDate) return false;
      const getTime = (d: string) => {
        const dt = new Date(d);
        return `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
      };
      const depTime = getTime(depDate);
      const arrTime = getTime(arrDate);
      return (
        depTime >= departureMin &&
        depTime <= departureMax &&
        arrTime >= arrivalMin &&
        arrTime <= arrivalMax
      );
    });
  }

  if (filters.sortBy) {
    filtered.sort((a: any, b: any) => {
      if (filters.sortBy === "price") {
        return (a.minimum_package_price || 0) - (b.minimum_package_price || 0);
      }
      if (filters.sortBy === "duration") {
        const durA =
          (a.legs?.[0]?.time_info?.flight_time_hour || 0) * 60 +
          (a.legs?.[0]?.time_info?.flight_time_minute || 0);
        const durB =
          (b.legs?.[0]?.time_info?.flight_time_hour || 0) * 60 +
          (b.legs?.[0]?.time_info?.flight_time_minute || 0);
        return durA - durB;
      }
      return 0;
    });
  }

  return filtered;
}

function ShowFareResultsSection({
  fromAirport,
  toAirport,
  departureDate,
  returnDate,
  adults,
  children,
  infants,
  cabinClass,
  nonstop,
}: Props) {
  const dispatch = useDispatch();
  const { departureFilters, returnFilters, currentFilterType } = useSelector(
    (state: RootState) => state.flightFilter,
  );

  const isRoundTrip = !!(returnDate && returnDate.trim() !== "");

  const [selectedDepartureData, setSelectedDepartureData] =
    useState<FlightDirection | null>(null);

  const [fareDialogOpen, setFareDialogOpen] = useState(false);
  const [fareDepartureFlight, setFareDepartureFlight] =
    useState<FlightDirection | null>(null);
  const [fareReturnFlight, setFareReturnFlight] =
    useState<FlightDirection | null>(null);

  const handleOpenFare = useCallback(
    (departure: FlightDirection, returnFlight: FlightDirection | null) => {
      setFareDepartureFlight(departure);
      setFareReturnFlight(returnFlight);
      setFareDialogOpen(true);
    },
    [],
  );

  const handleCloseFareDialog = useCallback(() => {
    setFareDialogOpen(false);
    setFareDepartureFlight(null);
    setFareReturnFlight(null);
  }, []);

  const searchBody = useMemo(
    () => ({
      fromAirport,
      toAirport,
      departureDate,
      ...(returnDate && { returnDate }),
      adults,
      children,
      infants,
      cabinClass,
    }),
    [
      fromAirport,
      toAirport,
      departureDate,
      returnDate,
      adults,
      children,
      infants,
      cabinClass,
    ],
  );

  const { data: iatiData, isFetching: isIatiFetching } =
    useSearchFlightsIatiQuery(searchBody);

  const { data: sabreData, isFetching: isSabreFetching } =
    useSearchFlightsSabreQuery(searchBody);

  const mergedData = useMemo(() => {
    if (!iatiData && !sabreData) return undefined;
    const mergedFlights = mergeFlightData(iatiData?.data, sabreData?.data);
    const mergedFilterOptions = mergeFlightFilterOptions(
      iatiData?.filteringOptions,
      sabreData?.filteringOptions,
    );
    return {
      data: mergedFlights,
      filteringOptions: mergedFilterOptions,
    };
  }, [iatiData, sabreData]);

  const isAnyFetching = isIatiFetching || isSabreFetching;
  const isBothDone = !isIatiFetching && !isSabreFetching;
  const hasAnyData = !!(iatiData || sabreData);
  const isFullLoading = isAnyFetching && !hasAnyData;
  const isPartialLoading = isAnyFetching && hasAnyData;

  const departureFlights = useMemo(
    () => mergedData?.data?.departure_flights || [],
    [mergedData],
  );

  const returnFlights = useMemo(
    () => mergedData?.data?.return_flights || [],
    [mergedData],
  );

  const { getMatchingReturnFlights } = useReturnFlightsMap({ returnFlights });

  const departureFilteringOptions = mergedData?.filteringOptions;

  // Reset filters on new search
  useEffect(() => {
    dispatch(resetFilters({ flightType: "departure" }));
    dispatch(resetFilters({ flightType: "return" }));
    dispatch(setCurrentFilterType("departure"));
    dispatch(setMatchingReturnFlights([]));
    setSelectedDepartureData(null);
  }, [dispatch, fromAirport, toAirport, departureDate]);

  useEffect(() => {
    if (departureFlights.length > 0 && !departureFilters.sortBy) {
      dispatch(setSortBy({ sortBy: "price", flightType: "departure" }));
    }
  }, [departureFlights.length, departureFilters.sortBy, dispatch]);

  useEffect(() => {
    if (
      departureFilteringOptions?.minPrice !== undefined &&
      departureFilteringOptions?.maxPrice !== undefined
    ) {
      dispatch(
        setPriceRange({
          priceRange: {
            min: departureFilteringOptions.minPrice,
            max: departureFilteringOptions.maxPrice,
          },
          flightType: "departure",
        }),
      );
    }
  }, [departureFilteringOptions, dispatch]);

  const departureApiPriceRange = useMemo(
    () => ({
      min: departureFilteringOptions?.minPrice || 0,
      max: departureFilteringOptions?.maxPrice || 50000,
    }),
    [departureFilteringOptions],
  );

  // Matching return flights for selected departure
  const matchingReturns = useMemo(() => {
    if (!selectedDepartureData) return [];
    return getMatchingReturnFlights(
      selectedDepartureData.package_info.package_key,
      selectedDepartureData.provider_key,
    );
  }, [selectedDepartureData, getMatchingReturnFlights]);

  // Return flight filtering options
  const returnFilteringOptions = useMemo(() => {
    if (matchingReturns.length === 0) return undefined;
    return calculateReturnFlightFilterOptions(matchingReturns);
  }, [matchingReturns]);

  const returnApiPriceRange = useMemo(() => {
    if (!returnFilteringOptions) return { min: 0, max: 50000 };
    return {
      min: returnFilteringOptions.minPrice,
      max: returnFilteringOptions.maxPrice,
    };
  }, [returnFilteringOptions]);

  // Init return filters when matching returns change
  useEffect(() => {
    if (matchingReturns.length > 0 && returnFilteringOptions) {
      dispatch(
        setPriceRange({
          priceRange: {
            min: returnFilteringOptions.minPrice,
            max: returnFilteringOptions.maxPrice,
          },
          flightType: "return",
        }),
      );
      if (
        returnFilteringOptions.actualMinPrice !== undefined &&
        returnFilteringOptions.actualMaxPrice !== undefined
      ) {
        dispatch(
          setReturnFlightsActualPriceRange({
            min: returnFilteringOptions.actualMinPrice,
            max: returnFilteringOptions.actualMaxPrice,
          }),
        );
      }
    }
  }, [matchingReturns, returnFilteringOptions, dispatch]);

  // Handle departure selection
  const handleSelectDeparture = useCallback(
    (flight: FlightDirection) => {
      setSelectedDepartureData(flight);
      dispatch(resetFilters({ flightType: "return" }));
      dispatch(setCurrentFilterType("return"));

      const matching = getMatchingReturnFlights(
        flight.package_info.package_key,
        flight.provider_key,
      );
      dispatch(setMatchingReturnFlights(matching));
      dispatch(setSortBy({ sortBy: "price", flightType: "return" }));
      setReturnVisibleCount(FLIGHTS_PER_PAGE);
    },
    [dispatch, getMatchingReturnFlights],
  );

  const handleChangeDeparture = useCallback(() => {
    setSelectedDepartureData(null);
    dispatch(setCurrentFilterType("departure"));
    dispatch(setMatchingReturnFlights([]));
    dispatch(setReturnFlightsActualPriceRange(null));
  }, [dispatch]);

  // Determine what to show
  const showingReturns = isRoundTrip && selectedDepartureData !== null;

  // Current filtering options for sidebar
  const currentFilteringOptions = useMemo(() => {
    if (showingReturns && returnFilteringOptions) {
      return {
        airline: returnFilteringOptions.airline.map((a: any) => ({
          id: a.id,
          text: a.text,
          count: String(a.count),
        })),
        stops: returnFilteringOptions.stops,
        provider: returnFilteringOptions.provider,
        minPrice: returnFilteringOptions.minPrice,
        maxPrice: returnFilteringOptions.maxPrice,
      };
    }
    return departureFilteringOptions;
  }, [showingReturns, returnFilteringOptions, departureFilteringOptions]);

  const currentApiPriceRange = showingReturns
    ? returnApiPriceRange
    : departureApiPriceRange;

  // Departure filtering
  const filteredDepartureFlights = useMemo(() => {
    if (!departureFlights.length) return [];
    return applyFilters(
      departureFlights,
      departureFilters,
      departureApiPriceRange,
    );
  }, [departureFlights, departureFilters, departureApiPriceRange]);

  // Return filtering
  const filteredReturnFlights = useMemo(() => {
    if (!matchingReturns.length) return [];
    return applyFilters(matchingReturns, returnFilters, returnApiPriceRange);
  }, [matchingReturns, returnFilters, returnApiPriceRange]);

  // Departure infinite scroll
  const [depVisibleCount, setDepVisibleCount] = useState(FLIGHTS_PER_PAGE);
  const depSentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setDepVisibleCount(FLIGHTS_PER_PAGE);
  }, [departureFilters, fromAirport, toAirport, departureDate]);

  useEffect(() => {
    const sentinel = depSentinelRef.current;
    if (!sentinel || showingReturns) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          depVisibleCount < filteredDepartureFlights.length
        ) {
          setDepVisibleCount((prev) =>
            Math.min(prev + FLIGHTS_PER_PAGE, filteredDepartureFlights.length),
          );
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [depVisibleCount, filteredDepartureFlights.length, showingReturns]);

  // Return infinite scroll
  const [returnVisibleCount, setReturnVisibleCount] =
    useState(FLIGHTS_PER_PAGE);
  const returnSentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setReturnVisibleCount(FLIGHTS_PER_PAGE);
  }, [returnFilters, selectedDepartureData]);

  useEffect(() => {
    const sentinel = returnSentinelRef.current;
    if (!sentinel || !showingReturns) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          returnVisibleCount < filteredReturnFlights.length
        ) {
          setReturnVisibleCount((prev) =>
            Math.min(prev + FLIGHTS_PER_PAGE, filteredReturnFlights.length),
          );
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [returnVisibleCount, filteredReturnFlights.length, showingReturns]);

  const visibleDepartureFlights = filteredDepartureFlights.slice(
    0,
    depVisibleCount,
  );
  const visibleReturnFlights = filteredReturnFlights.slice(
    0,
    returnVisibleCount,
  );

  // QuickFilter stats (departure)
  const nonstopFlights = useMemo(
    () => departureFlights.filter((f: any) => (f.legs?.length ?? 0) <= 1),
    [departureFlights],
  );

  const overallCheapest = useMemo(() => {
    if (!departureFlights.length) return 0;
    return Math.min(
      ...departureFlights.map((f: any) => f.minimum_package_price || Infinity),
    );
  }, [departureFlights]);

  const nonstopCheapest = useMemo(() => {
    if (!nonstopFlights.length) return 0;
    return Math.min(
      ...nonstopFlights.map((f: any) => f.minimum_package_price || Infinity),
    );
  }, [nonstopFlights]);

  const recommendedCheapest = useMemo(() => {
    if (!departureFlights.length) return 0;
    const getDuration = (f: any) =>
      (f.legs?.[0]?.time_info?.flight_time_hour || 0) * 60 +
      (f.legs?.[0]?.time_info?.flight_time_minute || 0);
    const minDuration = Math.min(...departureFlights.map(getDuration));
    const shortestFlights = departureFlights.filter(
      (f: any) => getDuration(f) === minDuration,
    );
    return Math.min(
      ...shortestFlights.map((f: any) => f.minimum_package_price || Infinity),
    );
  }, [departureFlights]);

  // Selected departure summary for header
  const selectedDepartureSummary = useMemo(() => {
    if (!selectedDepartureData) return null;
    const first = selectedDepartureData.legs?.[0];
    const last =
      selectedDepartureData.legs?.[selectedDepartureData.legs.length - 1];
    if (!first) return null;

    const depTime = first.departure_info?.date
      ? new Date(first.departure_info.date).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : "--:--";
    const arrTime = last?.arrival_info?.date
      ? new Date(last.arrival_info.date).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : "--:--";
    const stopsCount = (selectedDepartureData.legs?.length || 1) - 1;

    const firstDep = new Date(first.departure_info.date).getTime();
    const lastArr = new Date(last!.arrival_info.date).getTime();
    const totalMin = Math.round((lastArr - firstDep) / 60000);
    const dH = Math.floor(totalMin / 60);
    const dM = totalMin % 60;

    const depDateObj = new Date(first.departure_info.date);
    const formattedDate = depDateObj.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    return {
      from: first.departure_info?.airport_code || "---",
      to: last?.arrival_info?.airport_code || "---",
      fromCity:
        first.departure_info?.city_name ||
        first.departure_info?.airport_name ||
        fromAirport,
      toCity:
        last?.arrival_info?.city_name ||
        last?.arrival_info?.airport_name ||
        toAirport,
      date: formattedDate,
      timeRange: `${depTime} - ${arrTime}`,
      duration: `${dH}h ${dM}m`,
      stops:
        stopsCount === 0
          ? "Nonstop"
          : stopsCount === 1
            ? "1 Stop"
            : `${stopsCount} Stops`,
    };
  }, [selectedDepartureData, departureDate]);

  if (isFullLoading) {
    return (
      <section className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[300px_1fr]">
        <div className="rounded-md bg-white p-4 animate-pulse space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-6 w-24 rounded bg-gray-200" />
              <div className="space-y-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-5 rounded bg-gray-200" />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="h-[60px] animate-pulse rounded-t-md bg-gray-300" />
          <div className="grid grid-cols-3 gap-2 bg-white px-4 py-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-11  rounded-md bg-gray-200" />
            ))}
          </div>
          <div className="mt-1.5 space-y-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded bg-white p-4 animate-pulse"
              >
                <div className="hidden shrink-0 flex-col items-center md:flex">
                  <div className="h-10 w-10 rounded bg-gray-200" />
                  <div className="mt-1 h-3 w-16 rounded bg-gray-200" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="mb-1 h-6 w-14 rounded bg-gray-200" />
                      <div className="h-3 w-10 rounded bg-gray-200" />
                    </div>
                    <div className="flex-1">
                      <div className="mx-auto h-0.5 rounded-full bg-gray-200" />
                    </div>
                    <div className="text-center">
                      <div className="mb-1 h-6 w-14 rounded bg-gray-200" />
                      <div className="h-3 w-10 rounded bg-gray-200" />
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end">
                  <div className="mb-1 h-3 w-16 rounded bg-gray-200" />
                  <div className="mb-2 h-6 w-20 rounded bg-gray-200" />
                  <div className="h-8 w-24 rounded-full bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-5 pb-5 grid grid-cols-1 gap-4 lg:grid-cols-[300px_1fr]">
      <ShowFareFilters
        filteringOptions={currentFilteringOptions}
        apiPriceRange={currentApiPriceRange}
        flightType={currentFilterType}
      />

      <div className="overflow-hidden rounded-md">
        {/* Departure header - always visible */}
        {!showingReturns && (
          <FlightSectionHeader
            phase="departure"
            stepNumber={1}
            title={`Departures from ${fromAirport}`}
            flightsCount={filteredDepartureFlights.length}
            backgroundImage={headerImage}
          />
        )}

        {!showingReturns && (
          <>
            <QuickFilter
              nonstopCheapest={nonstopCheapest}
              recommendedCheapest={recommendedCheapest}
              overallCheapest={overallCheapest}
            />

            {isPartialLoading && (
              <div className="mb-2 mt-1.5 flex items-center gap-2 rounded bg-blue-50 px-4 py-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="text-sm text-primary">Loading more results...</p>
              </div>
            )}

            {filteredDepartureFlights.length === 0 && isBothDone && (
              <div className="mt-4 rounded bg-white px-6 py-12 text-center">
                <p className="text-lg text-gray-500">
                  No flights found for your search.
                </p>
              </div>
            )}

            {visibleDepartureFlights.length > 0 && (
              <div className="space-y-1.5 mt-1.5">
                {visibleDepartureFlights.map((flight: FlightDirection) => {
                  const fareKey =
                    flight.fares?.[0]?.fare_key ||
                    flight.package_info?.package_key ||
                    "";
                  return (
                    <FlightCard
                      key={fareKey}
                      flightData={flight}
                      onSelectDeparture={
                        isRoundTrip ? handleSelectDeparture : undefined
                      }
                      onOpenFare={
                        !isRoundTrip
                          ? (f) => handleOpenFare(f, null)
                          : undefined
                      }
                    />
                  );
                })}
              </div>
            )}

            {depVisibleCount < filteredDepartureFlights.length && (
              <div ref={depSentinelRef} className="h-10" />
            )}
          </>
        )}

        {/* Return flights section */}
        {showingReturns && (
          <>
            <FlightSectionHeader
              phase="return"
              stepNumber={2}
              title={`Returns from ${toAirport}`}
              flightsCount={filteredReturnFlights.length}
              backgroundImage={headerImage}
              selectedDeparture={selectedDepartureSummary}
              onChangeFlight={handleChangeDeparture}
            />

            {filteredReturnFlights.length === 0 && (
              <div className="mt-4 rounded bg-white px-6 py-12 text-center">
                <p className="text-lg text-gray-500">
                  No return flights found for this departure.
                </p>
              </div>
            )}

            {visibleReturnFlights.length > 0 && (
              <div className="space-y-1.5 mt-1.5">
                {visibleReturnFlights.map((flight: FlightDirection) => {
                  const fareKey =
                    flight.fares?.[0]?.fare_key ||
                    flight.package_info?.package_key ||
                    "";
                  return (
                    <FlightCard
                      key={fareKey}
                      flightData={flight}
                      isReturn
                      selectedDepartureData={selectedDepartureData}
                      onOpenFare={
                        selectedDepartureData
                          ? (f) => handleOpenFare(selectedDepartureData, f)
                          : undefined
                      }
                    />
                  );
                })}
              </div>
            )}

            {returnVisibleCount < filteredReturnFlights.length && (
              <div ref={returnSentinelRef} className="h-10" />
            )}
          </>
        )}
      </div>

      {fareDepartureFlight && (
        <FareSelectionDialog
          open={fareDialogOpen}
          onClose={handleCloseFareDialog}
          departureFlight={fareDepartureFlight}
          returnFlight={fareReturnFlight}
          adults={adults}
          children={children}
          infants={infants}
          cabinClass={cabinClass}
        />
      )}
    </section>
  );
}

export default ShowFareResultsSection;
