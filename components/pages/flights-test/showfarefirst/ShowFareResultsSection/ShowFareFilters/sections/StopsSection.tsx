"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { toggleStop } from "@/redux/features/flights/flightFilterSlice";
import FilterCheckboxRow from "../FilterCheckboxRow";
import FilterSection from "../components/FilterSection";

type Props = {
  stops: { id: number; text: string; count: number }[];
  flightType?: "departure" | "return";
};

function StopsSection({ stops, flightType = "departure" }: Props) {
  const dispatch = useDispatch();
  const selectedStops = useSelector((state: RootState) =>
    flightType === "return"
      ? state.flightFilter.returnFilters.selectedStops
      : state.flightFilter.departureFilters.selectedStops
  );

  if (!stops.length) return null;

  return (
    <FilterSection title="Stops" className="mb-4">
      <div className="space-y-1">
        {stops.map((stop) => (
          <FilterCheckboxRow
            key={stop.id}
            label={`${stop.text} (${stop.count})`}
            checked={selectedStops.includes(stop.id)}
            onCheckedChange={() =>
              dispatch(toggleStop({ stop: stop.id, flightType }))
            }
          />
        ))}
      </div>
    </FilterSection>
  );
}

export default StopsSection;
