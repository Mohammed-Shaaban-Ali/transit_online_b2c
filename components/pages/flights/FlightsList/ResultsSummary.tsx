"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { MdOutlineFilterAltOff, MdFilterList } from "react-icons/md";
import { resetFilters } from "@/redux/features/flights/flightFilterSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";

interface ResultsSummaryProps {
  totalFlights: number;
  totalUnfilteredFlights?: number;
  currentPage: number;
  totalPages: number;
  flightsPerPage: number;
}

const ResultsSummary = memo<ResultsSummaryProps>(
  ({
    totalFlights,
    totalUnfilteredFlights,
    currentPage,
    totalPages,
    flightsPerPage,
  }) => {
    const dispatch = useDispatch();

    const { currentFilterType, departureFilters, returnFilters } = useSelector(
      (state: RootState) => state.flightFilter
    );
    const currentFilters =
      currentFilterType === "departure" ? departureFilters : returnFilters;

    // Calculate applied filters count
    const appliedFiltersCount = currentFilters
      ? (currentFilters.selectedAirlines.length > 0 ? 1 : 0) +
        (currentFilters.selectedStops.length > 0 ? 1 : 0) +
        (currentFilters.selectedProviders.length > 0 ? 1 : 0) +
        (currentFilters.priceRange.min > 0 ||
        currentFilters.priceRange.max < 50000
          ? 1
          : 0) +
        (currentFilters.timeRange !== null ? 1 : 0) +
        (currentFilters.sortBy !== null ? 1 : 0)
      : 0;

    const filtersActive = appliedFiltersCount > 0;

    const handleResetFilters = () => {
      dispatch(resetFilters({ flightType: currentFilterType }));
    };

    const firstResult = (currentPage - 1) * flightsPerPage + 1;
    const lastResult = Math.min(currentPage * flightsPerPage, totalFlights);

    return (
      <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-primary text-xl">✈</div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {totalFlights} {totalFlights === 1 ? "flight" : "flights"} found
                {filtersActive &&
                  totalUnfilteredFlights &&
                  totalFlights !== totalUnfilteredFlights && (
                    <span className="text-sm text-gray-500 ml-2">
                      (filtered from {totalUnfilteredFlights})
                    </span>
                  )}
              </div>
              <div className="text-sm text-gray-600">
                Showing {firstResult} to {lastResult} of {totalFlights} results
                {filtersActive && (
                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-white">
                    {appliedFiltersCount}{" "}
                    {appliedFiltersCount === 1 ? "filter" : "filters"} applied
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {filtersActive && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                <MdOutlineFilterAltOff size={16} />
                Reset Filters
              </button>
            )}

            <button
              data-bs-toggle="offcanvas"
              data-bs-target="#listingSidebar"
              className="xl:hidden flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
            >
              <MdFilterList size={16} />
              Filter Flights
            </button>
          </div>
        </div>
      </div>
    );
  }
);

ResultsSummary.displayName = "ResultsSummary";

export default ResultsSummary;
