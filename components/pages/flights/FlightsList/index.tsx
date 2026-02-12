"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useDispatch } from "react-redux";
import {
  useSearchFlightsIatiQuery,
  useSearchFlightsSabreQuery,
} from "@/redux/features/flights/flightsApi";
import { skipToken } from "@reduxjs/toolkit/query/react";
import Sidebar from "./Sidebar";
import FlightProperties from "./FlightProperties";
import MobileSidebar from "./Sidebar/MobileSidebar";
import { SidebarSkeleton, FlightCardsSkeleton } from "./Skeletons";
import {
  setPriceRange,
  setReturnFlightsActualPriceRange,
  resetAllFilters,
} from "@/redux/features/flights/flightFilterSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { calculateReturnFlightFilterOptions } from "@/utils/returnFlightFilterUtils";
import { mergeFlightFilterOptions } from "@/utils/mergeFlightFilterOptions";
import { mergeFlightData } from "@/utils/mergeFlightData";
import FlightSearchBox from "@/components/shared/FlightSearchBox";
import { useTranslations } from "next-intl";
import { localStorageFlightSearchKey } from "@/constants";
import ErrorState from "@/components/shared/ErrorState";

// Get last search from localStorage
const getLastSearchFromStorage = (): {
  fromAirport: string;
  toAirport: string;
  departureDate: string;
  returnDate?: string;
  tripType: "roundTrip" | "oneWay";
  adults: number;
  children: number;
  infants: number;
  cabinClass: "ECONOMY" | "BUSINESS";
  fromAirportCity?: string;
  toAirportCity?: string;
} | null => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const storedSearch = localStorage.getItem(localStorageFlightSearchKey);
    if (storedSearch) {
      const parsed = JSON.parse(storedSearch);
      // Validate that it has required fields
      if (parsed.fromAirport && parsed.toAirport && parsed.departureDate) {
        return {
          fromAirport: parsed.fromAirport,
          toAirport: parsed.toAirport,
          departureDate: parsed.departureDate,
          returnDate: parsed.returnDate,
          tripType: parsed.tripType || "roundTrip",
          adults: parsed.adults ?? 1,
          children: parsed.children ?? 0,
          infants: parsed.infants ?? 0,
          cabinClass: parsed.cabinClass || "ECONOMY",
          fromAirportCity: parsed.fromAirportCity,
          toAirportCity: parsed.toAirportCity,
        };
      }
    }
  } catch (error) {
    console.error("Error reading last search from localStorage:", error);
  }
  return null;
};

const FlightsList = () => {
  const t = useTranslations("FlightsList.searchPrompt");
  const tNoFlights = useTranslations("FlightsList.noFlights");
  const tLoading = useTranslations("FlightsList");
  const dispatch = useDispatch();
  const router = useRouter();
  const currentFilterType = useSelector(
    (state: RootState) => state.flightFilter.currentFilterType
  );

  // URL parameters for flight search
  const searchParams = useSearchParams();

  const fromAirport = searchParams.get("fromAirport") || "";
  const toAirport = searchParams.get("toAirport") || "";
  const fromAirportCity = searchParams.get("fromAirportCity") || "";
  const toAirportCity = searchParams.get("toAirportCity") || "";
  const departureDate = searchParams.get("departureDate") || "";
  const returnDate = searchParams.get("returnDate") || "";
  const adults = parseInt(searchParams.get("adults") || "1", 10);
  const children = parseInt(searchParams.get("children") || "0", 10);
  const infants = parseInt(searchParams.get("infants") || "0", 10);
  const cabinClass = searchParams.get("cabinClass") || "ECONOMY";

  // Check if we have search parameters
  const hasSearchParams = !!(fromAirport && toAirport && departureDate);

  // Auto-load from localStorage if no search params
  const [hasAutoLoaded, setHasAutoLoaded] = useState(false);
  useEffect(() => {
    if (!hasSearchParams && !hasAutoLoaded && typeof window !== "undefined") {
      const savedSearch = getLastSearchFromStorage();
      if (savedSearch) {
        // Build search params from saved search
        const newSearchParams = new URLSearchParams();
        newSearchParams.append("fromAirport", savedSearch.fromAirport);
        newSearchParams.append("toAirport", savedSearch.toAirport);
        newSearchParams.append("departureDate", savedSearch.departureDate);
        newSearchParams.append("tripType", savedSearch.tripType);

        if (savedSearch.returnDate && savedSearch.tripType === "roundTrip") {
          newSearchParams.append("returnDate", savedSearch.returnDate);
        }

        newSearchParams.append("adults", savedSearch.adults.toString());
        if (savedSearch.children > 0) {
          newSearchParams.append("children", savedSearch.children.toString());
        }
        if (savedSearch.infants > 0) {
          newSearchParams.append("infants", savedSearch.infants.toString());
        }
        newSearchParams.append("cabinClass", savedSearch.cabinClass);

        if (savedSearch.fromAirportCity) {
          newSearchParams.append(
            "fromAirportCity",
            savedSearch.fromAirportCity
          );
        }
        if (savedSearch.toAirportCity) {
          newSearchParams.append("toAirportCity", savedSearch.toAirportCity);
        }

        // Update URL with saved search params
        router.replace(`/flights?${newSearchParams.toString()}`, {
          scroll: false,
        });
        setHasAutoLoaded(true);
      }
    }
  }, [hasSearchParams, hasAutoLoaded, router]);

  // API calls - both endpoints
  const searchParamsIati = hasSearchParams
    ? {
      adults,
      children,
      infants,
      cabinClass,
      fromAirport,
      toAirport,
      departureDate,
      ...(returnDate && { returnDate }),
    }
    : skipToken;

  const searchParamsSabre = hasSearchParams
    ? {
      adults,
      children,
      infants,
      cabinClass,
      fromAirport,
      toAirport,
      departureDate,
      ...(returnDate && { returnDate }),
    }
    : skipToken;

  const {
    data: iatiData,
    isFetching: isIatiFetching,
    error: iatiError,
  } = useSearchFlightsIatiQuery(searchParamsIati);
  const {
    data: sabreData,
    isFetching: isSabreFetching,
    error: sabreError,
  } = useSearchFlightsSabreQuery(searchParamsSabre);

  // Merge data from both endpoints
  const mergedData = useMemo(() => {
    if (!iatiData && !sabreData) return undefined;

    const mergedFlights = mergeFlightData(iatiData?.data, sabreData?.data);
    const mergedFilteringOptions = mergeFlightFilterOptions(
      iatiData?.filteringOptions,
      sabreData?.filteringOptions
    );

    return {
      data: mergedFlights,
      filteringOptions: mergedFilteringOptions,
      sortingOptions:
        iatiData?.sortingOptions || sabreData?.sortingOptions || [],
      meta: iatiData?.meta || sabreData?.meta,
    };
  }, [iatiData, sabreData]);

  // Determine loading and error states
  const isFetching = isIatiFetching && isSabreFetching;
  // Only treat as error if BOTH providers failed - if one has data, show it
  const error = iatiError && sabreError ? (iatiError || sabreError) : undefined;


  // Get filtering options from merged data
  const filteringOptions = mergedData?.filteringOptions;

  // Get matching return flights from Redux
  const matchingReturnFlights = useSelector(
    (state: RootState) => state.flightFilter.matchingReturnFlights
  );

  // Calculate filtering options based on current filter type
  const currentFilteringOptions = useMemo(() => {
    if (currentFilterType === "return" && matchingReturnFlights.length > 0) {
      const returnOptions = calculateReturnFlightFilterOptions(
        matchingReturnFlights
      );
      return {
        airline: returnOptions.airline.map((a) => ({
          id: a.id,
          text: a.text,
          count: a.count.toString(),
        })),
        stops: returnOptions.stops,
        provider: returnOptions.provider.map((p) => ({
          id: p.id,
          text: p.text,
          count: p.count,
          logo: (p as any).logo || "",
        })),
        minPrice: returnOptions.minPrice,
        maxPrice: returnOptions.maxPrice,
      };
    } else {
      return {
        airline: filteringOptions?.airline || [],
        stops: filteringOptions?.stops || [],
        provider: (filteringOptions?.provider || []).map((p) => ({
          id: p.id,
          text: p.text,
          count: p.count,
          logo: (p as any).logo || "",
        })),
        minPrice: filteringOptions?.minPrice || 0,
        maxPrice: filteringOptions?.maxPrice || 50000,
      };
    }
  }, [currentFilterType, matchingReturnFlights, filteringOptions]);

  // Initialize price range from API when available (only for departure)
  useEffect(() => {
    if (
      currentFilterType === "departure" &&
      filteringOptions?.minPrice !== undefined &&
      filteringOptions?.maxPrice !== undefined
    ) {
      dispatch(
        setPriceRange({
          priceRange: {
            min: filteringOptions.minPrice,
            max: filteringOptions.maxPrice,
          },
          flightType: "departure",
        })
      );
    }
  }, [filteringOptions, dispatch, currentFilterType]);

  // Reset all filters when there are no search params
  useEffect(() => {
    if (!hasSearchParams) {
      dispatch(resetAllFilters());
    }
  }, [hasSearchParams, dispatch]);

  // Track previous matching return flights to prevent infinite loops
  const prevMatchingReturnsRef = useRef<string>("");
  const prevFilterTypeRef = useRef<"departure" | "return">("departure");

  // Track previous search parameters to detect new searches
  const prevSearchKeyRef = useRef<string>("");
  // Track the search key of the currently displayed data (using state to trigger re-renders)
  const [displayedDataSearchKey, setDisplayedDataSearchKey] =
    useState<string>("");
  const [isNewSearch, setIsNewSearch] = useState<boolean>(false);

  const currentSearchKey = useMemo(() => {
    if (!hasSearchParams) return "";
    return JSON.stringify({
      fromAirport,
      toAirport,
      departureDate,
      returnDate,
      adults,
      children,
      infants,
      cabinClass,
    });
  }, [
    hasSearchParams,
    fromAirport,
    toAirport,
    departureDate,
    returnDate,
    adults,
    children,
    infants,
    cabinClass,
  ]);

  // Check if mergedData matches the current search
  // Don't show old data if it's from a different search
  // Show data immediately when we have it from at least one endpoint for current search
  const isDataForCurrentSearch = useMemo(() => {
    if (!mergedData || !currentSearchKey || currentSearchKey === "")
      return false;

    // If displayedDataSearchKey matches current search, we have valid data
    return displayedDataSearchKey === currentSearchKey;
  }, [mergedData, currentSearchKey, displayedDataSearchKey]);

  // Check if we have actual flight data (not just empty response)
  const hasActualFlightData = useMemo(() => {
    return (
      mergedData?.data?.departure_flights &&
      mergedData.data.departure_flights.length > 0
    );
  }, [mergedData]);

  // Check if both providers have finished loading (regardless of data)
  const bothProvidersFinished = !isIatiFetching && !isSabreFetching;

  // Partial loading: we have actual flight data from at least one endpoint for current search, but one is still fetching
  const isPartialLoading = useMemo(() => {
    return (
      hasSearchParams &&
      isDataForCurrentSearch &&
      hasActualFlightData &&
      (isIatiFetching || isSabreFetching)
    );
  }, [
    hasSearchParams,
    isDataForCurrentSearch,
    hasActualFlightData,
    isIatiFetching,
    isSabreFetching,
  ]);

  // Detect if this is a new search (search params changed)
  useEffect(() => {
    if (!hasSearchParams) {
      setIsNewSearch(false);
      prevSearchKeyRef.current = "";
      setDisplayedDataSearchKey("");
      return;
    }

    const isNew = currentSearchKey !== prevSearchKeyRef.current;

    if (isNew) {
      // New search detected - show loading and clear displayed data key
      setIsNewSearch(true);
      setDisplayedDataSearchKey(""); // Clear old data reference
      prevSearchKeyRef.current = currentSearchKey; // Update prev key to prevent re-triggering
    }

    // Check if merged data has actual flights
    const hasFlights =
      mergedData?.data?.departure_flights &&
      mergedData.data.departure_flights.length > 0;

    // Check if both providers finished loading
    const allProvidersFinished = !isIatiFetching && !isSabreFetching;

    // Only update displayedDataSearchKey when:
    // 1. We have actual flight data from at least one endpoint, OR
    // 2. Both providers have finished loading (even if no results)
    // AND we're not in the middle of detecting a new search
    if (
      !isNew && // Not a new search (we already updated prevSearchKeyRef)
      mergedData &&
      (iatiData || sabreData) &&
      currentSearchKey !== "" &&
      currentSearchKey === prevSearchKeyRef.current &&
      (hasFlights || allProvidersFinished) // Show data only if we have flights OR both finished
    ) {
      // If we have data for the current search, update the displayed data key
      setDisplayedDataSearchKey((prev) => {
        if (prev !== currentSearchKey) {
          setIsNewSearch(false);
          return currentSearchKey;
        }
        return prev;
      });
    }
  }, [
    currentSearchKey,
    hasSearchParams,
    mergedData,
    iatiData,
    sabreData,
    isIatiFetching,
    isSabreFetching,
  ]);

  // Initialize price range for return flights when matching returns are available
  useEffect(() => {
    const matchingReturnsKey = JSON.stringify(
      matchingReturnFlights.map((f: any) => f.fares?.[0]?.fare_key || "")
    );
    const hasChanged =
      matchingReturnsKey !== prevMatchingReturnsRef.current ||
      currentFilterType !== prevFilterTypeRef.current;

    if (
      hasChanged &&
      currentFilterType === "return" &&
      matchingReturnFlights.length > 0
    ) {
      const returnOptions = calculateReturnFlightFilterOptions(
        matchingReturnFlights
      );
      dispatch(
        setPriceRange({
          priceRange: {
            min: returnOptions.minPrice,
            max: returnOptions.maxPrice,
          },
          flightType: "return",
        })
      );
      if (
        returnOptions.actualMinPrice !== undefined &&
        returnOptions.actualMaxPrice !== undefined
      ) {
        dispatch(
          setReturnFlightsActualPriceRange({
            min: returnOptions.actualMinPrice,
            max: returnOptions.actualMaxPrice,
          })
        );
      }
      prevMatchingReturnsRef.current = matchingReturnsKey;
      prevFilterTypeRef.current = currentFilterType;
    } else if (
      currentFilterType !== "return" ||
      matchingReturnFlights.length === 0
    ) {
      if (prevFilterTypeRef.current === "return") {
        dispatch(setReturnFlightsActualPriceRange(null));
      }
      prevFilterTypeRef.current = currentFilterType;
      prevMatchingReturnsRef.current = "";
    }
  }, [currentFilterType, matchingReturnFlights, dispatch]);

  // Calculate total flight count
  const flightCount =
    currentFilterType === "return"
      ? matchingReturnFlights.length
      : mergedData?.data?.departure_flights?.length || 0;

  // Calculate price range
  const priceRange = {
    min: currentFilteringOptions.minPrice,
    max: currentFilteringOptions.maxPrice,
  };

  // Loading state - show full loading skeleton if:
  // 1. We have search params and are fetching, AND
  // 2. We have no actual flight data from either endpoint for current search
  // 3. At least one provider is still loading
  // OR if it's a new search (isNewSearch is true)
  const isAnyLoading =
    hasSearchParams &&
    (isNewSearch ||
      ((isIatiFetching || isSabreFetching) &&
        (!isDataForCurrentSearch || !hasActualFlightData)));

  // Show no results only when both providers finished and no flights found
  const showNoResults =
    hasSearchParams &&
    !isAnyLoading &&
    bothProvidersFinished &&
    isDataForCurrentSearch &&
    !hasActualFlightData;
  const showSearchPrompt = !hasSearchParams;

  // Check if we have any data to display (only if it matches current search and has actual flights)
  const hasData = isDataForCurrentSearch && hasActualFlightData;

  // Prepare defaultValues for FlightSearchBox from URL params
  const flightSearchDefaultValues = hasSearchParams
    ? {
      fromAirport,
      toAirport,
      departureDate,
      returnDate: returnDate || undefined,
      tripType: (searchParams.get("tripType") || "roundTrip") as
        | "roundTrip"
        | "oneWay",
      adults,
      children,
      infants,
      cabinClass: cabinClass as "ECONOMY" | "BUSINESS",
      fromAirportCity,
      toAirportCity,
    }
    : undefined;

  return (
    <div className="container mb-8">
      {/* Search Box at the top */}
      <div className="my-8">
        <FlightSearchBox
          defaultValues={flightSearchDefaultValues}
          isLoading={isIatiFetching || isSabreFetching}
        />
      </div>

      {(iatiError && sabreError) ?
        <ErrorState error={iatiError || sabreError} isHotel={false} />
        : showSearchPrompt ? (
          /* Search Prompt Section */
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-center max-w-md">
              <div className="mb-6">
                <svg
                  className="mx-auto h-24 w-24 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                {t("title")}
              </h2>
              <p className="text-gray-600 mb-6">{t("description")}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-12 md:gap-6 gap-4">
            {/* Sidebar - Hidden on mobile, visible on xl screens */}
            <div className="xl:col-span-3 hidden xl:block border border-gray-200 rounded-lg p-2 md:p-4 h-fit">
              {isAnyLoading ? (
                <SidebarSkeleton />
              ) : hasData ? (
                <Sidebar
                  availableAirlines={currentFilteringOptions.airline}
                  stops={currentFilteringOptions.stops}
                  providers={currentFilteringOptions.provider}
                  priceRange={priceRange}
                  flightCount={flightCount}
                  sortingOptions={mergedData?.sortingOptions}
                  flightType={currentFilterType}
                  fromCity={fromAirportCity}
                  toCity={toAirportCity}
                />
              ) : null}
            </div>

            {/* Mobile Sidebar - Offcanvas */}
            <div className="xl:hidden">
              {isAnyLoading ? (
                <div className="mb-4">
                  <div className="h-12 bg-gray-200 rounded-lg w-[150px] animate-pulse"></div>
                </div>
              ) : hasData ? (
                <MobileSidebar
                  availableAirlines={currentFilteringOptions.airline}
                  stops={currentFilteringOptions.stops}
                  providers={currentFilteringOptions.provider}
                  priceRange={priceRange}
                  flightCount={flightCount}
                  sortingOptions={mergedData?.sortingOptions}
                  flightType={currentFilterType}
                  fromCity={fromAirportCity}
                  toCity={toAirportCity}
                />
              ) : null}
            </div>

            {/* Main Content */}
            <div className="col-span-1 xl:col-span-9 border border-gray-200 rounded-lg p-2 md:p-4 h-fit">
              {isAnyLoading ? (
                <FlightCardsSkeleton count={5} />
              ) : showNoResults ? (
                <div className="text-center py-16">
                  <p className="text-gray-600 text-lg">
                    {tNoFlights("description")}
                  </p>
                </div>
              ) : hasData ? (
                <div>
                  {/* Partial Loading Indicator */}
                  {isPartialLoading && (
                    <div className="mb-4 p-3 bg-primary-light border border-primary/20 rounded-lg flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <p className="text-sm text-primary">
                        {tLoading("loadingMore")}
                      </p>
                    </div>
                  )}
                  <FlightProperties
                    data={mergedData}
                    isFetching={isFetching}
                    error={error}
                    cabinClass={cabinClass}
                    childrenCount={children}
                    departureDate={departureDate}
                    returnDate={returnDate}
                    fromAirport={fromAirport}
                    toAirport={toAirport}
                    fromAirportCity={fromAirportCity}
                    toAirportCity={toAirportCity}
                    adults={adults}
                    childrens={children}
                    infants={infants}
                    apiPriceRange={priceRange}
                    isPartialLoading={isPartialLoading}
                  />
                </div>
              ) : null}
            </div>
          </div>
        )}
    </div>
  );
};

export default FlightsList;
