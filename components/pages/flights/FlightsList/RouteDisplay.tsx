"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { FaArrowRightLong } from "react-icons/fa6";
import { useTranslations } from "next-intl";

interface RouteDisplayProps {
  fromAirport: string;
  toAirport: string;
  fromAirportCity?: string;
  toAirportCity?: string;
  forceType?: "departure" | "return";
  flightsCount?: number;
}

const RouteDisplay: React.FC<RouteDisplayProps> = ({
  fromAirport,
  toAirport,
  fromAirportCity,
  toAirportCity,
  forceType = "departure",
  flightsCount = 0,
}) => {
  const t = useTranslations("RouteDisplay");
  const currentFilterType = useSelector(
    (state: RootState) => state.flightFilter.currentFilterType
  );

  const fromCity = fromAirportCity || fromAirport;
  const toCity = toAirportCity || toAirport;

  const displayRoute = useMemo(() => {
    if (forceType === "departure") {
      return {
        from: fromCity,
        to: toCity,
      };
    } else {
      return {
        from: toCity,
        to: fromCity,
      };
    }
  }, [forceType, currentFilterType, fromCity, toCity]);

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 justify-between">
        <div className="text-22 font-bold  flex items-center gap-2">
          {displayRoute.from}
          <FaArrowRightLong className="mx-2 rtl:rotate-180" />
          {displayRoute.to}
        </div>
        {flightsCount ? (
          <div className="text-15 font-medium text-gray-400">
            {flightsCount} {t("flights")}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default RouteDisplay;
