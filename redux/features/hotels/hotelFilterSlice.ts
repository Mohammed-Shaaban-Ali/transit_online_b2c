import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { hotelSeachTypes } from "@/types/hotels";
import { convertPrice } from "@/config/currency";

export type SortOption = "price_low" | "price_high" | "rating_low" | "rating_high" | null;

interface HotelFilterState {
  hotels: hotelSeachTypes[];
  filteredHotels: hotelSeachTypes[];
  selectedRating: number[];
  selectedChains: string[];
  selectedPropertyTypes: string[];
  selectedFacilities: string[];
  hotelName: string;
  priceRange: {
    min: number;
    max: number;
  };
  sortBy: SortOption;
}

const initialState: HotelFilterState = {
  hotels: [],
  filteredHotels: [],
  selectedRating: [],
  selectedChains: [],
  selectedPropertyTypes: [],
  selectedFacilities: [],
  hotelName: "",
  priceRange: {
    min: 0,
    max: 500,
  },
  sortBy: null,
};

const hotelFilterSlice = createSlice({
  name: "hotelFilter",
  initialState,
  reducers: {
    setHotels: (state, action: PayloadAction<hotelSeachTypes[]>) => {
      state.hotels = action.payload;
      state.filteredHotels = action.payload;
      // Apply filters when hotels are set
      applyFilters(state);
    },
    toggleRating: (state, action: PayloadAction<number>) => {
      const rating = action.payload;
      const index = state.selectedRating.indexOf(rating);
      if (index > -1) {
        state.selectedRating.splice(index, 1);
      } else {
        state.selectedRating.push(rating);
      }
      applyFilters(state);
    },
    toggleChain: (state, action: PayloadAction<string>) => {
      const chainId = action.payload;
      const index = state.selectedChains.indexOf(chainId);
      if (index > -1) {
        state.selectedChains.splice(index, 1);
      } else {
        state.selectedChains.push(chainId);
      }
      applyFilters(state);
    },
    togglePropertyType: (state, action: PayloadAction<string>) => {
      const propertyTypeId = action.payload;
      const index = state.selectedPropertyTypes.indexOf(propertyTypeId);
      if (index > -1) {
        state.selectedPropertyTypes.splice(index, 1);
      } else {
        state.selectedPropertyTypes.push(propertyTypeId);
      }
      applyFilters(state);
    },
    toggleFacility: (state, action: PayloadAction<string>) => {
      const facilityId = action.payload;
      const index = state.selectedFacilities.indexOf(facilityId);
      if (index > -1) {
        state.selectedFacilities.splice(index, 1);
      } else {
        state.selectedFacilities.push(facilityId);
      }
      applyFilters(state);
    },
    setHotelName: (state, action: PayloadAction<string>) => {
      state.hotelName = action.payload;
      applyFilters(state);
    },
    setPriceRange: (
      state,
      action: PayloadAction<{ min: number; max: number }>
    ) => {
      state.priceRange = action.payload;
      applyFilters(state);
    },
    resetFilters: (state) => {
      state.selectedRating = [];
      state.selectedChains = [];
      state.selectedPropertyTypes = [];
      state.selectedFacilities = [];
      state.hotelName = "";
      state.priceRange = { min: 0, max: 500 };
      state.sortBy = null;
      state.filteredHotels = state.hotels;
    },
    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.sortBy = action.payload;
      applyFilters(state);
    },
  },
});

// Helper function to apply all filters
function applyFilters(state: HotelFilterState) {
  let filtered = [...state.hotels];

  // Filter by rating
  if (state.selectedRating.length > 0) {
    filtered = filtered.filter((hotel) => {
      const rating = Number(hotel.starRating);
      return !isNaN(rating) && state.selectedRating.includes(rating);
    });
  }

  // Filter by hotel name
  if (state.hotelName.trim() !== "") {
    const searchTerm = state.hotelName.toLowerCase();
    filtered = filtered.filter(
      (hotel) =>
        hotel.displayName?.toLowerCase().includes(searchTerm) ||
        hotel.displayNameAr?.toLowerCase().includes(searchTerm) ||
        hotel.address?.toLowerCase().includes(searchTerm)
    );
  }

  // Filter by price range (prices converted to display currency)
  filtered = filtered.filter((hotel) => {
    const price = convertPrice(
      parseFloat(hotel.price?.toString().replace(/[^\d.]/g, "") || "0")
    );
    return price >= state.priceRange.min && price <= state.priceRange.max;
  });

  // Filter by chains
  if (state.selectedChains.length > 0) {
    filtered = filtered.filter((hotel) => {
      // Check if hotel has a chain property that matches selected chains
      const hotelChainId =
        hotel.chainId ||
        hotel.chain?.id ||
        (typeof hotel.chain === "string" ? hotel.chain : undefined);
      return (
        hotelChainId && state.selectedChains.includes(String(hotelChainId))
      );
    });
  }

  // Filter by property types
  if (state.selectedPropertyTypes.length > 0) {
    filtered = filtered.filter((hotel) => {
      // Check if hotel has a propertyType property that matches selected property types
      const hotelPropertyTypeId =
        hotel.propertyTypeId ||
        hotel.propertyType?.id ||
        (typeof hotel.propertyType === "string"
          ? hotel.propertyType
          : undefined);
      return (
        hotelPropertyTypeId &&
        state.selectedPropertyTypes.includes(String(hotelPropertyTypeId))
      );
    });
  }

  // Filter by facilities
  if (state.selectedFacilities.length > 0) {
    filtered = filtered.filter((hotel) => {
      // Check if hotel has facilities that match selected facilities
      if (!hotel.facilities || !Array.isArray(hotel.facilities)) {
        return false;
      }
      const hotelFacilityIds = hotel.facilities
        .map((facility) => facility?.id)
        .filter((id) => id !== undefined && id !== null)
        .map((id) => String(id));
      // Hotel must have at least one of the selected facilities
      return state.selectedFacilities.some((selectedId) =>
        hotelFacilityIds.includes(String(selectedId))
      );
    });
  }

  // Apply sorting
  if (state.sortBy) {
    filtered = [...filtered].sort((a, b) => {
      const priceA = convertPrice(parseFloat(a.price?.toString().replace(/[^\d.]/g, "") || "0"));
      const priceB = convertPrice(parseFloat(b.price?.toString().replace(/[^\d.]/g, "") || "0"));
      const ratingA = Number(a.starRating) || 0;
      const ratingB = Number(b.starRating) || 0;

      switch (state.sortBy) {
        case "price_low":
          return priceA - priceB;
        case "price_high":
          return priceB - priceA;
        case "rating_low":
          return ratingA - ratingB;
        case "rating_high":
          return ratingB - ratingA;
        default:
          return 0;
      }
    });
  }

  state.filteredHotels = filtered;
}

export const {
  setHotels,
  toggleRating,
  toggleChain,
  togglePropertyType,
  toggleFacility,
  setHotelName,
  setPriceRange,
  resetFilters,
  setSortBy,
} = hotelFilterSlice.actions;

export default hotelFilterSlice;
