import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FlightFilters {
  selectedAirlines: string[];
  selectedStops: number[];
  selectedProviders: string[];
  priceRange: {
    min: number;
    max: number;
  };
  timeRange: {
    departureMin: string; // Format: "HH:MM"
    departureMax: string;
    arrivalMin: string;
    arrivalMax: string;
  } | null;
  sortBy: string | null;
  flightNumberFilter: boolean; // true = filter by flight number (revalidate mode)
}

interface FlightFilterState {
  currentFilterType: "departure" | "return";
  departureFilters: FlightFilters;
  returnFilters: FlightFilters;
  matchingReturnFlights: any[];
  availableAirlines: any[];
  returnFlightsActualPriceRange: { min: number; max: number } | null;
}

const initialFilters: FlightFilters = {
  selectedAirlines: [],
  selectedStops: [],
  selectedProviders: [],
  priceRange: {
    min: 0,
    max: 50000,
  },
  timeRange: null,
  sortBy: null,
  flightNumberFilter: true,
};

const initialState: FlightFilterState = {
  currentFilterType: "departure",
  departureFilters: { ...initialFilters },
  returnFilters: { ...initialFilters },
  matchingReturnFlights: [],
  availableAirlines: [],
  returnFlightsActualPriceRange: null,
};

const flightFilterSlice = createSlice({
  name: "flightFilter",
  initialState,
  reducers: {
    setCurrentFilterType: (
      state,
      action: PayloadAction<"departure" | "return">
    ) => {
      state.currentFilterType = action.payload;
    },
    setPriceRange: (
      state,
      action: PayloadAction<{
        priceRange: { min: number; max: number };
        flightType: "departure" | "return";
      }>
    ) => {
      if (action.payload.flightType === "departure") {
        state.departureFilters.priceRange = action.payload.priceRange;
      } else {
        state.returnFilters.priceRange = action.payload.priceRange;
      }
    },
    setReturnFlightsActualPriceRange: (
      state,
      action: PayloadAction<{ min: number; max: number } | null>
    ) => {
      state.returnFlightsActualPriceRange = action.payload;
    },
    toggleAirline: (
      state,
      action: PayloadAction<{
        airline: string;
        flightType: "departure" | "return";
      }>
    ) => {
      const filters =
        action.payload.flightType === "departure"
          ? state.departureFilters
          : state.returnFilters;
      const index = filters.selectedAirlines.indexOf(action.payload.airline);
      if (index > -1) {
        filters.selectedAirlines.splice(index, 1);
      } else {
        filters.selectedAirlines.push(action.payload.airline);
      }
    },
    setAvailableAirlines: (state, action: PayloadAction<any[]>) => {
      state.availableAirlines = action.payload;
    },
    toggleStop: (
      state,
      action: PayloadAction<{
        stop: number;
        flightType: "departure" | "return";
      }>
    ) => {
      const filters =
        action.payload.flightType === "departure"
          ? state.departureFilters
          : state.returnFilters;
      const index = filters.selectedStops.indexOf(action.payload.stop);
      if (index > -1) {
        filters.selectedStops.splice(index, 1);
      } else {
        filters.selectedStops.push(action.payload.stop);
      }
    },
    toggleProvider: (
      state,
      action: PayloadAction<{
        provider: string;
        flightType: "departure" | "return";
      }>
    ) => {
      const filters =
        action.payload.flightType === "departure"
          ? state.departureFilters
          : state.returnFilters;
      const index = filters.selectedProviders.indexOf(action.payload.provider);
      if (index > -1) {
        filters.selectedProviders.splice(index, 1);
      } else {
        filters.selectedProviders.push(action.payload.provider);
      }
    },
    setSortBy: (
      state,
      action: PayloadAction<{
        sortBy: string;
        flightType: "departure" | "return";
      }>
    ) => {
      const filters =
        action.payload.flightType === "departure"
          ? state.departureFilters
          : state.returnFilters;
      filters.sortBy = action.payload.sortBy;
    },
    resetFilters: (
      state,
      action: PayloadAction<{ flightType: "departure" | "return" }>
    ) => {
      if (action.payload.flightType === "departure") {
        state.departureFilters = { ...initialFilters };
      } else {
        state.returnFilters = { ...initialFilters };
      }
    },
    setMatchingReturnFlights: (state, action: PayloadAction<any[]>) => {
      state.matchingReturnFlights = action.payload;
    },
    setTimeRange: (
      state,
      action: PayloadAction<{
        timeRange: {
          departureMin: string;
          departureMax: string;
          arrivalMin: string;
          arrivalMax: string;
        } | null;
        flightType: "departure" | "return";
      }>
    ) => {
      if (action.payload.flightType === "departure") {
        state.departureFilters.timeRange = action.payload.timeRange;
      } else {
        state.returnFilters.timeRange = action.payload.timeRange;
      }
    },
    setFlightNumberFilter: (
      state,
      action: PayloadAction<{
        enabled: boolean;
        flightType: "departure" | "return";
      }>
    ) => {
      if (action.payload.flightType === "departure") {
        state.departureFilters.flightNumberFilter = action.payload.enabled;
      } else {
        state.returnFilters.flightNumberFilter = action.payload.enabled;
      }
    },
    resetAllFilters: (state) => {
      // Reset all filters when there are no search params
      state.departureFilters = { ...initialFilters };
      state.returnFilters = { ...initialFilters };
      state.currentFilterType = "departure";
      state.matchingReturnFlights = [];
      state.availableAirlines = [];
      state.returnFlightsActualPriceRange = null;
    },
  },
});

export const {
  setCurrentFilterType,
  setPriceRange,
  setReturnFlightsActualPriceRange,
  toggleAirline,
  setAvailableAirlines,
  toggleStop,
  toggleProvider,
  setSortBy,
  resetFilters,
  setMatchingReturnFlights,
  setTimeRange,
  setFlightNumberFilter,
  resetAllFilters,
} = flightFilterSlice.actions;

export default flightFilterSlice;
