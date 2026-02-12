"use client";

import { useLocale } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleAirline,
  setAvailableAirlines,
} from "@/redux/features/flights/flightFilterSlice";
import { RootState } from "@/redux/app/store";
import { useEffect } from "react";
import Checkbox from "@/components/shared/form/Checkbox";

interface AirlinesProps {
  flightType?: "departure" | "return";
  availableAirlines?: {
    id?: string;
    count?: string;
    text?: string;
  }[];
}

const Airlines: React.FC<AirlinesProps> = ({
  availableAirlines,
  flightType = "departure",
}) => {
  const locale = useLocale();

  const dispatch = useDispatch();
  const { departureFilters, returnFilters } = useSelector(
    (state: RootState) => state.flightFilter
  );
  const filters = flightType === "departure" ? departureFilters : returnFilters;
  const selectedAirlines = filters.selectedAirlines;

  // Update available options when props change
  useEffect(() => {
    if (availableAirlines && availableAirlines.length > 0) {
      dispatch(setAvailableAirlines(availableAirlines as any));
    }
  }, [dispatch, availableAirlines]);

  const handleAirlineToggle = (airlineName: string) => {
    dispatch(toggleAirline({ airline: airlineName, flightType }));
  };

  return (
    <div className="flex flex-col gap-1">
      {availableAirlines?.map((airline, index) => {
        const isSelected = selectedAirlines.includes(airline.id || "");
        return (
          <Checkbox
            key={index}
            name={airline.id || ""}
            checked={isSelected}
            onChange={() => handleAirlineToggle(airline.id || "")}
            label={airline.text || ""}
            count={airline.count || 0}
          />
        );
      })}
    </div>
  );
};

export default Airlines;
