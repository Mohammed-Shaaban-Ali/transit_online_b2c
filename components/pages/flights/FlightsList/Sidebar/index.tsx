"use client";

import Providers from "./Providers";
import Stops from "./Stops";
import Airlines from "./Airlines";
import PriceSlider from "./PriceSlider";
import SortingOptions from "./SortingOptions";
import TimeFilter from "./TimeFilter";
import { useTranslations } from "next-intl";

interface SidebarProps {
  availableAirlines?: { id?: string; count?: string; text?: string }[];
  stops?: { id: number; text: string; count: number }[];
  priceRange?: { min: number; max: number };
  flightCount?: number;
  providers?: { id: string; text: string; count: number; logo: string }[];
  sortingOptions?: { id: "price" | "duration"; text: string }[];
  flightType?: "departure" | "return";
  fromCity?: string;
  toCity?: string;
}
const Sidebar: React.FC<SidebarProps> = ({
  availableAirlines = [],
  stops = [],
  priceRange = { min: 0, max: 5000 },
  providers = [],
  sortingOptions = [],
  flightType = "departure",
  flightCount = 0,
  fromCity = "",
  toCity = "",
}) => {
  const t = useTranslations("FlightSidebar");
  return (
    <div className="space-y-5 ">
      {/* <div>
        <h5 className="text-lg font-bold mb-1.5">{t("filterResults")}</h5>
        <div className="text-sm text-gray-600 px-1.5 ">
          {t("flightsFound", {
            count: flightCount,
            flightLabel: flightCount === 1 ? t("flight") : t("flights"),
          })}
        </div>
      </div> */}

      {/* Stops */}
      {stops.length > 0 && (
        <div>
          <h5 className="text-lg font-bold mb-1.5">{t("stops")}</h5>
          <Stops stops={stops} flightType={flightType} />
        </div>
      )}

      {/* Time Filter */}
      <div>
        <h5 className="text-lg font-bold mb-1.5">{t("travelTime")}</h5>
        <TimeFilter
          flightType={flightType}
          fromCity={fromCity}
          toCity={toCity}
        />
      </div>

      {/* Providers */}
      {providers.length > 0 && (
        <div>
          <h5 className="text-lg font-bold mb-1.5">{t("providers")}</h5>
          <Providers providers={providers} flightType={flightType} />
        </div>
      )}

      {/* Sort By */}
      {sortingOptions.length > 0 && (
        <div>
          <h5 className="text-lg font-bold mb-1.5">{t("sortBy")}</h5>
          <SortingOptions
            sortingOptions={sortingOptions}
            flightType={flightType}
          />
        </div>
      )}

      {/* Price Range */}
      <div>
        <h5 className="text-lg font-bold mb-4">{t("priceRange")}</h5>
        <PriceSlider
          minPrice={priceRange?.min}
          maxPrice={priceRange?.max}
          flightType={flightType}
        />
      </div>

      {/* Airlines */}
      {availableAirlines.length > 0 && (
        <div>
          <h5 className="text-lg font-bold mb-1.5">{t("airlines")}</h5>
          <Airlines
            availableAirlines={availableAirlines}
            flightType={flightType}
          />
        </div>
      )}

      {/* Flight Count */}
      {/* {flightCount > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {flightCount} {flightCount === 1 ? "flight" : "flights"} found
            </div>
          </div>
        )} */}
    </div>
  );
};

export default Sidebar;
