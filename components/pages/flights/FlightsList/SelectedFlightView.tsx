"use client";

import { Button } from "@/components/ui/button";
import { FlightDirection } from "@/types/flightTypes";
import { memo, useMemo, useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import FlightCard from "./FlightCard";
import RouteDisplay from "./RouteDisplay";
import Pagination from "@/components/shared/Pagination";
import { IoArrowBackSharp } from "react-icons/io5";
import { useTranslations } from "next-intl";

interface SelectedFlightViewProps {
  selectedDepartureData: FlightDirection;
  matchingReturns: FlightDirection[];
  onSelectFlight: (
    departureFlightData: FlightDirection,
    returnFlightData?: FlightDirection
  ) => void;
  onBackToList: () => void;

  adults: number;
  childrens: number;
  infants: number;
  fromAirport: string;
  toAirport: string;
  fromAirportCity?: string;
  toAirportCity?: string;
  apiPriceRange?: { min: number; max: number };
}

const SelectedFlightView = memo<SelectedFlightViewProps>(
  ({
    selectedDepartureData,
    matchingReturns,
    onSelectFlight,
    onBackToList,

    adults,
    childrens,
    infants,
    fromAirport,
    toAirport,
    fromAirportCity,
    toAirportCity,
    apiPriceRange,
  }) => {
    const t = useTranslations("SelectedFlightView");
    const departureFareKey = selectedDepartureData?.fares?.[0]?.fare_key || "";

    // Get return filters from Redux
    const { returnFilters, returnFlightsActualPriceRange } = useSelector(
      (state: RootState) => state.flightFilter
    );

    const [currentPage, setCurrentPage] = useState(1);
    const flightsPerPage = 10;

    // Apply filters to return flights
    const filteredReturnFlights = useMemo(() => {
      if (!matchingReturns.length) return [];

      let filtered = [...matchingReturns];

      // Price filter
      // For return flights, priceRange uses relative values (0 to max-min)
      // We need to convert them to actual prices
      // const actualMinPrice =
      //   returnFlightsActualPriceRange?.min || apiPriceRange?.min || 0;
      // const actualMaxPrice =
      //   returnFlightsActualPriceRange?.max || apiPriceRange?.max || 10000;
      // const relativeMax = actualMaxPrice - actualMinPrice;

      // // Convert relative filter values to actual prices
      // const filterMinPrice = actualMinPrice + returnFilters.priceRange.min;
      // const filterMaxPrice = actualMinPrice + returnFilters.priceRange.max;

      // // Only apply filter if it's different from the full range
      // if (
      //   returnFilters.priceRange.min > 0 ||
      //   returnFilters.priceRange.max < relativeMax
      // ) {
      //   filtered = filtered.filter((flight: any) => {
      //     // Get actual price from return flight
      //     const returnPrice =
      //       flight?.fares?.[0]?.fare_info?.fare_detail?.price_info
      //         ?.total_fare || 0;
      //     return returnPrice >= filterMinPrice && returnPrice <= filterMaxPrice;
      //   });
      // }
      // Price filter - convert slider value to actual price
      if (returnFlightsActualPriceRange) {
        const actualMin = returnFlightsActualPriceRange.min;
        const sliderMax = returnFilters.priceRange.max; // This is (actualMax - actualMin)

        // Convert slider values to actual prices
        const minActualPrice = Math.floor(
          actualMin + returnFilters.priceRange.min
        );
        const maxActualPrice = Math.ceil(
          actualMin + returnFilters.priceRange.max
        );

        // if (minActualPrice == maxActualPrice) return filtered;

        if (
          returnFilters.priceRange.min >= 0 ||
          returnFilters.priceRange.max < sliderMax
        ) {
          // Only filter if not at default range
          filtered = filtered.filter((flight: any) => {
            const price =
              flight.fares?.[0]?.fare_info?.fare_detail?.price_info
                ?.total_fare || 0;
            return price >= minActualPrice && price <= maxActualPrice;
          });
        }
      } else {
        // Fallback to direct price comparison if actual range not available
        const apiMin = 0;
        const apiMax = 10000;
        if (
          returnFilters.priceRange.min > apiMin ||
          returnFilters.priceRange.max < apiMax
        ) {
          filtered = filtered.filter((flight: any) => {
            const price =
              flight.fares?.[0]?.fare_info?.fare_detail?.price_info
                ?.total_fare || 0;
            return (
              price >= returnFilters.priceRange.min &&
              price <= returnFilters.priceRange.max
            );
          });
        }
      }
      // Airline filter
      if (returnFilters.selectedAirlines.length > 0) {
        filtered = filtered.filter((flight: any) => {
          const carrierCode = flight.legs?.[0]?.airline_info?.carrier_code;
          return (
            carrierCode && returnFilters.selectedAirlines.includes(carrierCode)
          );
        });
      }

      // Stops filter
      if (returnFilters?.selectedStops?.length > 0) {
        filtered = filtered.filter((flight: any) => {
          const legCount = flight.legs?.length - 1;
          return returnFilters?.selectedStops?.includes(legCount);
        });
      }

      // Provider filter
      if (returnFilters?.selectedProviders?.length > 0) {
        filtered = filtered.filter((flight: any) => {
          const provider_key = flight.provider_key;
          return returnFilters?.selectedProviders?.includes(provider_key);
        });
      }

      // Time Range Filter
      if (returnFilters?.timeRange) {
        const { departureMin, departureMax, arrivalMin, arrivalMax } =
          returnFilters.timeRange;

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

      // Sorting
      if (returnFilters?.sortBy) {
        filtered.sort((a: any, b: any) => {
          let aValue, bValue;

          switch (returnFilters?.sortBy) {
            case "price":
              aValue =
                a?.fares?.[0]?.fare_info?.fare_detail?.price_info?.total_fare ||
                0;
              bValue =
                b?.fares?.[0]?.fare_info?.fare_detail?.price_info?.total_fare ||
                0;
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
    }, [
      matchingReturns,
      returnFilters,
      returnFlightsActualPriceRange,
      apiPriceRange,
    ]);

    // Pagination
    const totalFlights = filteredReturnFlights.length;
    const totalPages = Math.ceil(totalFlights / flightsPerPage);
    const paginatedFlights = useMemo(() => {
      const startIndex = (currentPage - 1) * flightsPerPage;
      const endIndex = startIndex + flightsPerPage;
      return filteredReturnFlights.slice(startIndex, endIndex);
    }, [filteredReturnFlights, currentPage, flightsPerPage]);

    const handlePageChange = useCallback((page: number) => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    // Reset page when filters change
    useEffect(() => {
      setCurrentPage(1);
    }, [returnFilters]);

    // Handler for return flight cards - when clicked, select the flight pair
    const handleReturnFlightClick = (
      returnFareKey: string,
      returnFlightData: FlightDirection
    ) => {
      onSelectFlight(selectedDepartureData, returnFlightData);
    };

    // Handler for departure flight card - prevent deselection in this view
    const handleDepartureSelect = () => {
      // Do nothing - departure is already selected and should stay selected
    };

    return (
      <div className="space-y-4">
        <Button
          onClick={onBackToList}
          variant="outline-primary"
          className="gap-1 px-4! rounded-md"
        >
          <IoArrowBackSharp className="rtl:rotate-180" />
          {t("backToList")}
        </Button>

        <div className="space-y-4">
          <RouteDisplay
            fromAirport={fromAirport}
            toAirport={toAirport}
            fromAirportCity={fromAirportCity}
            toAirportCity={toAirportCity}

          // flightsCount={totalFlights}
          />
          <FlightCard
            flightData={selectedDepartureData}
            isSelected={true}
            // matchingReturns={[]}
            onSelectDeparture={handleDepartureSelect}
          // onSelectFlight={onSelectFlight}
          // selectedDepartureData={selectedDepartureData}
          />

          {matchingReturns?.length > 0 && (
            <div className="pt-2.5">
              <RouteDisplay
                fromAirport={fromAirport}
                toAirport={toAirport}
                fromAirportCity={fromAirportCity}
                toAirportCity={toAirportCity}
                forceType="return"
                flightsCount={totalFlights}
              />
              {filteredReturnFlights.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 text-lg">
                    {t("noReturnFlights")}
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {paginatedFlights?.map(
                      (returnFlight: FlightDirection, index: number) => {
                        const returnFareKey =
                          returnFlight?.fares?.[0]?.fare_key || "";
                        return (
                          <div
                            key={returnFareKey || index}
                            onClick={() =>
                              handleReturnFlightClick(
                                returnFareKey,
                                returnFlight
                              )
                            }
                          >
                            <FlightCard
                              flightData={returnFlight}
                              isSelected={false}
                              isReturn={true}
                              selectedDepartureData={selectedDepartureData}
                              // matchingReturns={[]}
                              onSelectDeparture={() =>
                                handleReturnFlightClick(
                                  returnFareKey,
                                  returnFlight
                                )
                              }
                            // onSelectFlight={onSelectFlight}
                            />
                          </div>
                        );
                      }
                    )}
                  </div>
                  {totalFlights > flightsPerPage && (
                    <div className="mt-6">
                      <Pagination
                        totalItems={totalFlights}
                        itemsPerPage={flightsPerPage}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

SelectedFlightView.displayName = "SelectedFlightView";

export default SelectedFlightView;
