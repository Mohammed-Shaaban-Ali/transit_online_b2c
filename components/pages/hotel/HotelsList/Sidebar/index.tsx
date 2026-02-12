"use client";

import { hotelSeachTypes } from "@/types/hotels";
import RatingsFilter from "./RatingsFilter";
import PriceSlider from "./PriceSlider";
import ChainFilter from "./ChainFilter";
import FacilityFilter from "./FacilityFilter";
import PropertyTypeFilter from "./PropertyTypeFilter";
import SearchBox from "./SearchBox";
import Map from "./Map";
import SortFilter from "./SortFilter";
import { useTranslations } from "next-intl";

const Sidebar = ({
  hotels,
  chains,
  facilities,
  propertyTypes,
  displayedHotels,
}: {
  hotels: hotelSeachTypes[];
  chains?: { id: string; text: string; count: string }[];
  facilities?: { id: string; text: string; count: string }[];
  propertyTypes?: { id: string; text: string; count: string }[];
  displayedHotels: hotelSeachTypes[];
}) => {
  const t = useTranslations("HotelsList.Sidebar");
  return (
    <div className="space-y-5">
      {/* Map Section */}
      <div className="relative">
        <Map hotels={displayedHotels} autoFocus={true} />
      </div>

      {/* Filters Container */}
      <div className="bg-primary-light rounded-2xl p-4 space-y-6">
        {/* Search Box */}
        <div>
          <h5 className="text-18 font-bold mb-2.5">{t("searchHotel")}</h5>
          <SearchBox />
        </div>

        {/* Star Rating */}
        <div>
          <h5 className="text-18 font-bold mb-2.5">{t("starRating")}</h5>
          <RatingsFilter />
        </div>

        {/* Hotel Chain */}
        {chains && chains.length > 0 && (
          <div>
            <h5 className="text-18 font-bold mb-2.5">{t("hotelChain")}</h5>
            <ChainFilter chains={chains} />
          </div>
        )}

        {/* Property Type */}
        {propertyTypes && propertyTypes.length > 0 && (
          <div>
            <h5 className="text-18 font-bold mb-2.5">{t("propertyType")}</h5>
            <PropertyTypeFilter propertyTypes={propertyTypes} />
          </div>
        )}

        {/* Sort By */}
        <div>
          <h5 className="text-18 font-bold mb-2.5">{t("sortBy")}</h5>
          <SortFilter />
        </div>

        {/* Nightly Price */}
        <div>
          <h5 className="text-18 font-bold mb-4">{t("budgetPerNight")}</h5>
          <PriceSlider />
        </div>

        {/* Facilities */}
        {facilities && facilities.length > 0 && (
          <div>
            <h5 className="text-18 font-bold mb-2.5">{t("facilities")}</h5>
            <FacilityFilter facilities={facilities} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
