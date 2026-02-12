"use client";

import { useDispatch, useSelector } from "react-redux";
import { setFlightNumberFilter } from "@/redux/features/flights/flightFilterSlice";
import { RootState } from "@/redux/app/store";
import { useEffect } from "react";
import Checkbox from "@/components/shared/form/Checkbox";

interface FlightNumberFilterProps {
  flightType?: "departure" | "return";
  flightNumber: string;
}

const FlightNumberFilter: React.FC<FlightNumberFilterProps> = ({
  flightType = "departure",
  flightNumber,
}) => {
  const dispatch = useDispatch();
  const { departureFilters, returnFilters } = useSelector(
    (state: RootState) => state.flightFilter
  );
  const filters = flightType === "departure" ? departureFilters : returnFilters;
  const isEnabled = filters.flightNumberFilter;

  // Enable flight number filter by default when component mounts
  useEffect(() => {
    dispatch(setFlightNumberFilter({ enabled: true, flightType }));
  }, [dispatch, flightType]);

  const handleToggle = () => {
    dispatch(setFlightNumberFilter({ enabled: !isEnabled, flightType }));
  };

  return (
    <div className="flex flex-col gap-1">
      <Checkbox
        name={`flightNumber-${flightType}`}
        checked={isEnabled}
        onChange={handleToggle}
        label={flightNumber}
        count=""
      />
    </div>
  );
};

export default FlightNumberFilter;
