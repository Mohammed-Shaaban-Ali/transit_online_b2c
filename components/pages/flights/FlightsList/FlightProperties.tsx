"use client";

import {
  useState,
  useMemo,
  useCallback,
  lazy,
  Suspense,
  useEffect,
  useRef,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslations, useLocale } from "next-intl";
import { RootState } from "@/redux/app/store";
import { useFlightUtils, useFlightData } from "@/hooks/useFlightUtils";
import {
  useFlightPagination,
  useReturnFlightsMap,
} from "@/hooks/useFlightData";
// import LoadingScreen from "@/components/parts/LoadingScreen";
import {
  resetFilters,
  setCurrentFilterType,
  setMatchingReturnFlights,
  setSortBy,
} from "@/redux/features/flights/flightFilterSlice";
import Pagination from "@/components/shared/Pagination";
import FlightCard from "./FlightCard";
import NoResultsPage from "./NoResultsPage";
import SelectedFlightView from "./SelectedFlightView";
import ResultsSummary from "./ResultsSummary";
import RouteDisplay from "./RouteDisplay";
import dynamic from "next/dynamic";
import { FlightDirection } from "@/types/flightTypes";

// Lazy load heavy components
const FlightDetails = dynamic(() => import("./FlightDetails"), {
  ssr: false,
});
interface SelectedFlight {
  departureFareKey: string;
  returnFareKey?: string;
  adults: number;
  children: number;
  infants: number;
  cabinClass: string;
  departureFlightData?: FlightDirection;
  returnFlightData?: FlightDirection;
}

interface FlightPropertiesProps {
  data?: any;
  isFetching?: boolean;
  error?: any;
  fromAirport: string;
  toAirport: string;
  fromAirportCity?: string;
  toAirportCity?: string;
  adults: number;
  childrens: number;
  infants: number;
  returnDate: string;
  departureDate: string;
  childrenCount: number;
  cabinClass: string;
  apiPriceRange?: { min: number; max: number };
  isPartialLoading?: boolean;
}

const FlightProperties: React.FC<FlightPropertiesProps> = ({
  data,
  isFetching,
  error,
  fromAirport,
  toAirport,
  fromAirportCity,
  toAirportCity,
  adults,
  childrens,
  infants,
  returnDate,
  departureDate,
  childrenCount,
  cabinClass,
  apiPriceRange,
  isPartialLoading,
}) => {
  const t = useTranslations("Flights");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const { departureFilters } = useSelector(
    (state: RootState) => state.flightFilter
  );
  const dispatch = useDispatch();
  const filters = departureFilters;

  const { flights } = useFlightData(data);

  useEffect(() => {
    dispatch(resetFilters({ flightType: "departure" }));
  }, [dispatch]);

  useEffect(() => {
    if (data?.data?.departure_flights?.length > 0 && !filters.sortBy) {
      dispatch(setSortBy({ sortBy: "price", flightType: "departure" }));
    }
  }, [data?.data?.departure_flights?.length, filters.sortBy, dispatch]);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDeparture, setSelectedDeparture] = useState<string | null>(
    null
  );
  const [selectedFlight, setSelectedFlight] = useState<SelectedFlight | null>(
    null
  );
  const [selectedDepartureData, setSelectedDepartureData] =
    useState<FlightDirection | null>(null);

  const flightsPerPage = 10;

  const departureFlights = useMemo(
    () => flights?.departure_flights || [],
    [flights]
  );
  const returnFlights = useMemo(() => flights?.return_flights || [], [flights]);

  const filteredFlights = useMemo(() => {
    if (!departureFlights.length) return [];

    let filtered = [...departureFlights];

    const apiMin = apiPriceRange?.min || 0;
    const apiMax = apiPriceRange?.max || 10000;

    if (filters.priceRange.min > apiMin || filters.priceRange.max < apiMax) {
      filtered = filtered.filter((flight: any) => {
        const price = flight?.minimum_package_price;
        return (
          price >= filters.priceRange.min && price <= filters.priceRange.max
        );
      });
    }

    if (filters.selectedAirlines.length > 0) {
      filtered = filtered.filter((flight: any) => {
        const carrierCode = flight.legs?.[0]?.airline_info?.carrier_code;
        return carrierCode && filters.selectedAirlines.includes(carrierCode);
      });
    }

    if (filters?.selectedStops?.length > 0) {
      filtered = filtered.filter((flight: any) => {
        const legCount = flight.legs?.length - 1;
        return filters?.selectedStops?.includes(legCount);
      });
    }

    if (filters?.selectedProviders?.length > 0) {
      filtered = filtered.filter((flight: any) => {
        const provider_key = flight.provider_key;
        return filters?.selectedProviders?.includes(provider_key);
      });
    }

    // Time Range Filter
    if (filters?.timeRange) {
      const { departureMin, departureMax, arrivalMin, arrivalMax } =
        filters.timeRange;

      filtered = filtered.filter((flight: any) => {
        // Get departure time from first leg
        const departureDate = flight.legs?.[0]?.departure_info?.date;
        // Get arrival time from last leg
        const arrivalDate =
          flight.legs?.[flight.legs.length - 1]?.arrival_info?.date;

        if (!departureDate || !arrivalDate) return false;

        // Extract time from date string (format: "YYYY-MM-DDTHH:MM:SS" or similar)
        const getTimeFromDate = (dateString: string): string => {
          const date = new Date(dateString);
          const hours = date.getHours().toString().padStart(2, "0");
          const minutes = date.getMinutes().toString().padStart(2, "0");
          return `${hours}:${minutes}`;
        };

        const flightDepartureTime = getTimeFromDate(departureDate);
        const flightArrivalTime = getTimeFromDate(arrivalDate);

        // Check if departure time is within range
        const isDepartureInRange =
          flightDepartureTime >= departureMin &&
          flightDepartureTime <= departureMax;

        // Check if arrival time is within range
        const isArrivalInRange =
          flightArrivalTime >= arrivalMin && flightArrivalTime <= arrivalMax;

        return isDepartureInRange && isArrivalInRange;
      });
    }

    if (filters?.sortBy) {
      filtered.sort((a: any, b: any) => {
        let aValue, bValue;

        switch (filters?.sortBy) {
          case "price":
            aValue = a.minimum_package_price || 0;
            bValue = b.minimum_package_price || 0;
            break;
          case "duration":
            aValue =
              a.legs?.[0]?.time_info?.flight_time_hour * 60 +
              a.legs?.[0]?.time_info?.flight_time_minute || 0;
            bValue =
              b.legs?.[0]?.time_info?.flight_time_hour * 60 +
              b.legs?.[0]?.time_info?.flight_time_minute || 0;
            break;
          default:
            return 0;
        }

        return aValue - bValue;
      });
    }

    return filtered;
  }, [departureFlights, filters, apiPriceRange]);

  const { totalFlights, totalPages, paginatedFlights } = useFlightPagination({
    flights: filteredFlights,
    currentPage,
    flightsPerPage,
  });

  const { getMatchingReturnFlights } = useReturnFlightsMap({
    returnFlights,
  });

  useEffect(() => {
    setCurrentPage(1);
    setSelectedDeparture(null);
    setSelectedDepartureData(null);
    setSelectedFlight(null);
  }, [filters]);

  const prevSelectedDepartureRef = useRef<string | null>(null);

  useEffect(() => {
    if (selectedDeparture !== prevSelectedDepartureRef.current) {
      if (selectedDeparture && selectedDepartureData) {
        const packageKey = selectedDepartureData.package_info.package_key;
        const providerKey = selectedDepartureData.provider_key;
        const matchingReturns = getMatchingReturnFlights(
          packageKey,
          providerKey
        );
        dispatch(resetFilters({ flightType: "return" }));
        dispatch(setCurrentFilterType("return"));
        dispatch(setMatchingReturnFlights(matchingReturns));

        // Scroll to top when departure is selected for round trip
        if (
          returnDate &&
          returnDate.trim() !== "" &&
          matchingReturns.length > 0
        ) {
          // Use setTimeout to ensure DOM has updated before scrolling
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }, 100);
        }
      } else {
        dispatch(setCurrentFilterType("departure"));
        dispatch(setMatchingReturnFlights([]));
      }
      prevSelectedDepartureRef.current = selectedDeparture;
    }
  }, [
    selectedDeparture,
    selectedDepartureData,
    dispatch,
    getMatchingReturnFlights,
    returnDate,
  ]);

  const isOneWay = useMemo(() => {
    return !returnDate || returnDate.trim() === "";
  }, [returnDate]);

  const handleSelectFlight = useCallback(
    (
      departureFlightData: FlightDirection,
      returnFlightData?: FlightDirection
    ) => {
      setSelectedFlight({
        departureFareKey: departureFlightData?.fares?.[0]?.fare_key || "",
        returnFareKey: returnFlightData?.fares?.[0]?.fare_key,
        adults,
        children: childrens,
        infants,
        cabinClass,
        departureFlightData,
        returnFlightData,
      });
    },
    [adults, childrens, infants, cabinClass]
  );

  const handleSelectDeparture = useCallback(
    (departureFareKey: string, departureData: FlightDirection) => {
      if (selectedDeparture === departureFareKey) {
        setSelectedDeparture(null);
        setSelectedDepartureData(null);
        setSelectedFlight(null);
      } else {
        setSelectedFlight(null);
        if (isOneWay) {
          handleSelectFlight(departureData);
        } else {
          setSelectedDeparture(departureFareKey);
          setSelectedDepartureData(departureData);
        }
      }
    },
    [selectedDeparture, isOneWay, handleSelectFlight]
  );

  const handleCloseFlightDetails = useCallback(() => {
    setSelectedFlight(null);
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedDeparture(null);
    setSelectedDepartureData(null);
    setSelectedFlight(null);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setSelectedDeparture(null);
    setSelectedDepartureData(null);
    setSelectedFlight(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Render FlightDetails as overlay (Sheet) while keeping the list visible
  const shouldShowFlightDetails = !!selectedFlight;

  // If departure is selected and it's a round trip, show return flight selection
  const shouldShowReturnSelection =
    selectedDeparture && selectedDepartureData && !isOneWay;

  // Get matching return flights if we're in return selection mode
  const matchingReturns = useMemo(() => {
    if (!shouldShowReturnSelection) return [];
    const packageKey = selectedDepartureData!.package_info.package_key;
    const providerKey = selectedDepartureData!.provider_key;
    return returnFlights.filter(
      (returnFlight: any) =>
        returnFlight.package_info.package_key === packageKey &&
        returnFlight.provider_key === providerKey
    );
  }, [shouldShowReturnSelection, selectedDepartureData, returnFlights]);

  // Compute conditions for conditional rendering (no early returns after hooks)
  const isLoading = isFetching && !data;
  const hasErrorOrNoFlights =
    error || !departureFlights || departureFlights.length === 0;
  const hasNoFilteredFlights = filteredFlights.length === 0;
  const shouldShowNoResults = hasErrorOrNoFlights || hasNoFilteredFlights;

  // Single return statement with conditional rendering
  return (
    <>
      {/* Loading state */}
      {isLoading && (
        <div className="h-28 w-full bg-gray-200 animate-pulse rounded-xl">
          {t("loading")}
        </div>
      )}

      {/* Error or no results state */}
      {!isLoading && shouldShowNoResults && (
        <NoResultsPage
          adults={adults}
          cabinClass={cabinClass}
          childrenCount={childrenCount}
          departureDate={departureDate}
          infants={infants}
          error={error}
          returnDate={returnDate}
          fromAirport={fromAirport}
          toAirport={toAirport}
        />
      )}

      {/* Show return flight selection view if in return selection mode, otherwise show main list */}
      {!isLoading &&
        !shouldShowNoResults &&
        (shouldShowReturnSelection ? (
          <SelectedFlightView
            selectedDepartureData={selectedDepartureData!}
            matchingReturns={matchingReturns}
            onSelectFlight={handleSelectFlight}
            onBackToList={handleBackToList}
            adults={adults}
            childrens={childrens}
            infants={infants}
            fromAirport={fromAirport}
            toAirport={toAirport}
            fromAirportCity={fromAirportCity}
            toAirportCity={toAirportCity}
            apiPriceRange={apiPriceRange}
          />
        ) : (
          <div className="space-y-4" dir={isRTL ? "rtl" : "ltr"}>
            {/* <ResultsSummary
            totalFlights={totalFlights}
            totalUnfilteredFlights={departureFlights.length}
            currentPage={currentPage}
            totalPages={totalPages}
            flightsPerPage={flightsPerPage}
          /> */}

            <RouteDisplay
              fromAirport={fromAirport}
              toAirport={toAirport}
              fromAirportCity={fromAirportCity}
              toAirportCity={toAirportCity}
              flightsCount={totalFlights}
            />

            <div className="space-y-6">
              {paginatedFlights.map(
                (departureFlightData: FlightDirection, index: number) => {
                  const actualIndex =
                    (currentPage - 1) * flightsPerPage + index;
                  const packageKey =
                    departureFlightData.package_info.package_key;
                  const providerKey = departureFlightData.provider_key;
                  const departureFareKey =
                    departureFlightData.fares?.[0]?.fare_key || "";
                  const matchingReturns = getMatchingReturnFlights(
                    packageKey,
                    providerKey
                  );
                  const isSelected = selectedDeparture === departureFareKey;

                  return (
                    <FlightCard
                      key={departureFareKey}
                      flightData={departureFlightData}
                      isSelected={isSelected}
                      // matchingReturns={matchingReturns}
                      onSelectDeparture={handleSelectDeparture}
                    // onSelectFlight={handleSelectFlight}
                    />
                  );
                }
              )}
            </div>

            {totalFlights > flightsPerPage && (
              <Pagination
                totalItems={totalFlights}
                itemsPerPage={flightsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        ))}

      {/* FlightDetails Sheet - renders as overlay, keeping the underlying view visible */}
      {shouldShowFlightDetails && (
        <Suspense fallback={<div>{t("loading")}</div>}>
          <FlightDetails
            isOpen={shouldShowFlightDetails}
            onClose={handleCloseFlightDetails}
            departureFareKey={selectedFlight!.departureFareKey}
            returnFareKey={selectedFlight!.returnFareKey}
            adults={selectedFlight!.adults}
            childrens={selectedFlight!.children}
            infants={selectedFlight!.infants}
            cabinClass={selectedFlight!.cabinClass}
            departureFlightData={selectedFlight!.departureFlightData}
            returnFlightData={selectedFlight!.returnFlightData}
          />
        </Suspense>
      )}
    </>
  );
};

export default FlightProperties;
