import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import {
  setHotels,
  toggleRating,
  toggleChain,
  togglePropertyType,
  toggleFacility,
  setHotelName,
  setPriceRange,
  resetFilters,
  setSortBy,
  SortOption,
} from "@/redux/features/hotels/hotelFilterSlice";

export const useHotelFilterRedux = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.hotelFilter);

  return {
    hotels: state.hotels,
    filteredHotels: state.filteredHotels,
    selectedRating: state.selectedRating,
    selectedChains: state.selectedChains,
    selectedPropertyTypes: state.selectedPropertyTypes,
    selectedFacilities: state.selectedFacilities,
    hotelName: state.hotelName,
    priceRange: state.priceRange,
    sortBy: state.sortBy,
    setHotels: (hotels: typeof state.hotels) => dispatch(setHotels(hotels)),
    toggleRating: (rating: number) => dispatch(toggleRating(rating)),
    toggleChain: (chainId: string) => dispatch(toggleChain(chainId)),
    togglePropertyType: (propertyTypeId: string) =>
      dispatch(togglePropertyType(propertyTypeId)),
    toggleFacility: (facilityId: string) => dispatch(toggleFacility(facilityId)),
    setHotelName: (name: string) => dispatch(setHotelName(name)),
    setPriceRange: (range: { min: number; max: number }) =>
      dispatch(setPriceRange(range)),
    resetFilters: () => dispatch(resetFilters()),
    setSortBy: (sortOption: SortOption) => dispatch(setSortBy(sortOption)),
  };
};

