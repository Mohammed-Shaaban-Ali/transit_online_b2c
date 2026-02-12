"use client";

import { useDispatch, useSelector } from "react-redux";
import { toggleStop } from "@/redux/features/flights/flightFilterSlice";
import { RootState } from "@/redux/app/store";
import Checkbox from "@/components/shared/form/Checkbox";
import { useTranslations } from "next-intl";

interface StopItem {
  id: number;
  text: string;
  count: number;
}

interface StopsProps {
  stops?: StopItem[];
  flightType?: "departure" | "return";
}

const Stops: React.FC<StopsProps> = ({
  stops = [],
  flightType = "departure",
}) => {
  const t = useTranslations("FlightSidebar");
  const dispatch = useDispatch();
  const { departureFilters, returnFilters } = useSelector(
    (state: RootState) => state.flightFilter
  );
  const filters = flightType === "departure" ? departureFilters : returnFilters;
  const selectedStops = filters?.selectedStops;

  const handleStopToggle = (stopId: number) => {
    dispatch(toggleStop({ stop: stopId, flightType }));
  };

  return (
    <div className="flex flex-col gap-1">
      {stops.map((stop, index) => {
        const isChecked = selectedStops?.includes(stop.id);

        return (
          <Checkbox
            key={index}
            name={stop.id || ""}
            checked={isChecked}
            onChange={() => handleStopToggle(stop.id)}
            label={stop.id === 0 ? t("direct") : stop.text || ""}
            count={stop.count || 0}
          />
        );
      })}
    </div>
  );
};

export default Stops;
