"use client";

import { useEffect, useState, useRef } from "react";
import { FiX } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import Sidebar from ".";
import { hotelSeachTypes } from "@/types/hotels";
import { useTranslations } from "next-intl";
import { useHotelFilterRedux } from "@/hooks/useHotelFilterRedux";
import { ArrowUpDown, SlidersHorizontal } from "lucide-react";
import useDebounce from "@/hooks/useDebounce";
import Checkbox from "@/components/shared/form/Checkbox";
import { SortOption } from "@/redux/features/hotels/hotelFilterSlice";

type MobileSidebarProps = {
  hotels: hotelSeachTypes[];
  chains?: { id: string; text: string; count: string }[];
  facilities?: { id: string; text: string; count: string }[];
  propertyTypes?: { id: string; text: string; count: string }[];
  displayedHotels: hotelSeachTypes[];
};

const MobileSidebar = (props: MobileSidebarProps) => {
  const t = useTranslations("HotelsList.MobileSidebar");
  const [isOpen, setIsOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const { hotelName, setHotelName, sortBy, setSortBy } = useHotelFilterRedux();

  // Initialize local state with Redux state value
  const [searchValue, setSearchValue] = useState(() => hotelName || "");

  // Sort options
  const sortOptions: { id: SortOption; label: string }[] = [
    { id: "price_low", label: t("sortPriceLow") },
    { id: "price_high", label: t("sortPriceHigh") },
    { id: "rating_low", label: t("sortRatingLow") },
    { id: "rating_high", label: t("sortRatingHigh") },
  ];

  // Handle sort selection (only one can be selected)
  const handleSortSelect = (option: SortOption) => {
    if (sortBy === option) {
      setSortBy(null); // Deselect if already selected
    } else {
      setSortBy(option);
    }
    setIsSortOpen(false);
  };

  // Close sort popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };

    if (isSortOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSortOpen]);

  // Track if update is from user input to prevent circular updates
  const isUserUpdateRef = useRef(false);

  // Debounce the search value
  const debouncedSearchValue = useDebounce(searchValue, 500);

  // Sync debounced value to Redux (only when it actually changes)
  useEffect(() => {
    if (debouncedSearchValue !== hotelName && isUserUpdateRef.current) {
      setHotelName(debouncedSearchValue);
      isUserUpdateRef.current = false;
    }
  }, [debouncedSearchValue, hotelName, setHotelName]);

  // Sync Redux state to local state when it changes externally (e.g., filter reset)
  // Only update if the change didn't come from our own debounced update
  useEffect(() => {
    // Only sync if the change came from external source (not from user input)
    if (!isUserUpdateRef.current && hotelName !== searchValue) {
      setSearchValue(hotelName || "");
    }
  }, [hotelName, searchValue]);

  // Handle user input
  const handleSearchChange = (value: string) => {
    isUserUpdateRef.current = true;
    setSearchValue(value);
  };
  return (
    <>
      {/* Search Bar with Filter and Sort Icons */}
      <div className="relative w-full">
        <div
          className="flex items-center gap-1 bg-white rounded-lg  border border-gray-300 
        px-2.5 py-2 h-12"
        >
          {/* Search Icon */}
          <div className="flex items-center justify-center text-primary p-1 ps-0">
            <FaSearch size={18} />
          </div>
          {/* Search Input */}
          <input
            type="text"
            placeholder={t("search")}
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="text-start flex-1 px-2 py-1 bg-transparent border-none outline-none 
            text-gray-700 placeholder:text-gray-400 text-sm"
          />
          {/* Sort Icon with Popup */}
          <div className="relative" ref={sortRef}>
            <button
              type="button"
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center cursor-pointer justify-center text-primary hover:text-primary-dark transition-colors p-1"
              aria-label={t("sort")}
            >
              <ArrowUpDown size={22} />
            </button>

            {/* Sort Popup */}
            {isSortOpen && (
              <div className="absolute top-full end-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-[200px]">
                <div className="p-3 border-b border-gray-200">
                  <h6 className="font-semibold text-gray-800">{t("sortBy")}</h6>
                </div>
                <div className="p-2">
                  {sortOptions.map((option) => (
                    <Checkbox
                      key={option.id}
                      name={option.id || ""}
                      checked={sortBy === option.id}
                      onChange={() => handleSortSelect(option.id)}
                      label={option.label}
                      count=""
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center cursor-pointer justify-center text-primary hover:text-primary-dark transition-colors p-1"
            aria-label={t("filters")}
          >
            <SlidersHorizontal size={22} />
          </button>
        </div>
      </div >

      {/* Overlay */}
      {
        isOpen && (
          <div
            className="fixed h-full w-full inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
        )
      }

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-96 bg-white z-100 shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h5 className="font-semibold text-lg">{t("filters")}</h5>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={t("close")}
          >
            <FiX size={24} />
          </button>
        </div>
        <div className="h-[calc(100%-73px)] overflow-y-auto p-4">
          <Sidebar
            hotels={props.hotels}
            chains={props.chains}
            facilities={props.facilities}
            propertyTypes={props.propertyTypes}
            displayedHotels={props.displayedHotels}
          />
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
