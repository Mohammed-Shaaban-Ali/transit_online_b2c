"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "./Sidebar";
import NoHotelsFound from "./NoHotelsFound";
import HotelProperties from "./HotelProperties";
import MobileSidebar from "./Sidebar/MobileSidebar";
import { SidebarSkeleton, HotelCardsSkeleton } from "./Skeletons";
import ErrorState from "../../../shared/ErrorState";
// import HotelSearchBox from "@/components/shared/HotelSearchBox";
import { useSearchHotelsMutation } from "@/redux/features/hotels/hotelsApi";
import { searchHotelsParams } from "@/types/hotels";
import { useHotelFilterRedux } from "@/hooks/useHotelFilterRedux";
import { getSearchParamsData } from "@/utils/getSearchParams";
import { useTranslations } from "next-intl";

import dynamic from "next/dynamic";
import { localStorageHotelSearchKey } from "@/constants";
const HotelSearchBox = dynamic(
  () => import("@/components/shared/HotelSearchBox"),
  {
    ssr: false,
    loading: () => (
      <div className="h-28 w-full bg-gray-200 animate-pulse rounded-xl" />
    ),
  }
);
const HotelsList = () => {
  const t = useTranslations("HotelsList.searchPrompt");
  const tMap = useTranslations("Components.Parts.Map");
  const { filteredHotels, setHotels } = useHotelFilterRedux();
  const [searchData, setSearchData] = useState<searchHotelsParams>();
  const hotelsSetRef = useRef(false);
  const searchParams = useSearchParams();
  const [searchHotels, { data, isLoading, isError, error }] = useSearchHotelsMutation();
  const [isFetching, setIsFetching] = useState(false);

  // Update searchData when URL search params change
  useEffect(() => {
    const searchParamsData = getSearchParamsData();
    if (searchParamsData) {
      setSearchData(searchParamsData);
    }
  }, [searchParams]);

  // Trigger search when searchData changes
  useEffect(() => {
    if (searchData) {
      setIsFetching(true);
      searchHotels(searchData)
        .unwrap()
        .finally(() => {
          setIsFetching(false);
        });
      hotelsSetRef.current = false; // Reset ref when new search is triggered
    }
  }, [searchData, searchHotels]);

  const { data: Hotels, uuid, filters } = data || {};
  const { chains, facilities, propertyTypes } = filters || {};

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Set hotels in Redux when Hotels data changes
  useEffect(() => {
    if (
      Hotels &&
      Array.isArray(Hotels) &&
      Hotels.length > 0 &&
      !hotelsSetRef.current
    ) {
      hotelsSetRef.current = true;
      setHotels(Hotels);
    }
  }, [Hotels, setHotels]);

  // Reset the ref when Hotels becomes null/undefined
  useEffect(() => {
    if (!Hotels) {
      hotelsSetRef.current = false;
    }
  }, [Hotels]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      hotelsSetRef.current = false;
    };
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  // Reset to first page when filtered results change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredHotels?.length]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedHotels = filteredHotels?.slice(startIndex, endIndex) || [];

  // Calculate nights, adults, and children from searchData
  const calculateNights = (checkIn: string, checkOut: string): number => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const nights = searchData
    ? calculateNights(searchData.checkIn, searchData.checkOut)
    : undefined;
  const adults = searchData
    ? searchData.rooms.reduce((sum, room) => sum + room.AdultsCount, 0)
    : undefined;
  const children = searchData
    ? searchData.rooms.reduce(
      (sum, room) => sum + (room.KidsAges?.length || 0),
      0
    )
    : undefined;

  // Loading state
  const isAnyLoading = searchData && (isLoading || isFetching);
  const showNoResults =
    searchData &&
    !isAnyLoading &&
    filteredHotels &&
    filteredHotels.length === 0;
  const showSearchPrompt = !searchData;

  // Get location name from localStorage
  const getLocationName = (): string => {
    if (typeof window === "undefined") return "";
    try {
      const storedSearch = localStorage.getItem(localStorageHotelSearchKey);
      if (storedSearch) {
        const parsed = JSON.parse(storedSearch);
        return parsed.searchValue || "";
      }
    } catch (error) {
      console.error("Error reading location name from localStorage:", error);
    }
    return "";
  };

  const locationName = getLocationName();
  return (
    <div className="container ">
      {/* Search Box at the top */}
      <div className="my-8">
        <HotelSearchBox defaultValues={searchData} />
      </div>

      {showSearchPrompt ? (
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
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
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8">
          {/* Sidebar - Hidden on mobile, visible on xl screens */}
          <div className={`
            
            ${isError && searchData ? "hidden" : "  xl:col-span-3 hidden xl:block"}
            `}>
            {isAnyLoading ? (
              <SidebarSkeleton />
            ) : (
              <Sidebar
                hotels={Hotels || []}
                chains={chains}
                facilities={facilities}
                propertyTypes={propertyTypes}
                displayedHotels={displayedHotels}
              />
            )}
          </div>

          {/* Mobile Sidebar - Offcanvas */}
          <div className="xl:hidden space-y-3">
            {isAnyLoading ? (
              <div className="h-12  bg-gray-200 rounded-lg w-full animate-pulse"></div>
            ) : (
              <>
                <MobileSidebar
                  hotels={Hotels || []}
                  chains={chains}
                  facilities={facilities}
                  propertyTypes={propertyTypes}
                  displayedHotels={displayedHotels}
                />
                {/* Hotels Found Message - Mobile Only */}
                {filteredHotels &&
                  filteredHotels.length > 0 &&
                  !isAnyLoading && (
                    <div className="text-sm text-gray-500 text-center font-medium">
                      {locationName
                        ? tMap("hotels_found_with_location", {
                          count: filteredHotels.length,
                          location: locationName,
                        })
                        : tMap("hotels_found", {
                          count: filteredHotels.length,
                        })}
                    </div>
                  )}
              </>
            )}
          </div>

          {/* Main Content */}
          <div className={`col-span-1 xl:col-span-9
              
              ${isError && searchData ? "col-span-1 xl:col-span-12" : "col-span-1 xl:col-span-9"}`}>
            {isAnyLoading ? (
              <HotelCardsSkeleton count={5} />
            ) : isError && searchData ? (
              <ErrorState error={error} />
            ) : showNoResults ? (
              <NoHotelsFound />
            ) : (
              <HotelProperties
                filteredHotels={filteredHotels || []}
                uuid={uuid || ""}
                displayedHotels={displayedHotels}
                handlePageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                isFetching={isFetching}
                nights={nights}
                adults={adults}
                children={children}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelsList;
