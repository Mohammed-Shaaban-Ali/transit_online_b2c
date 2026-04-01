"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { toggleAirline } from "@/redux/features/flights/flightFilterSlice";
import { useTranslations } from "next-intl";
import FilterCheckboxRow from "../FilterCheckboxRow";
import FilterSection from "../components/FilterSection";

type Props = {
  airlines: { id?: string; text?: string; count?: string }[];
  flightType?: "departure" | "return";
};

function AirlinesSection({ airlines, flightType = "departure" }: Props) {
  const dispatch = useDispatch();
  const t = useTranslations("ShowFarePage.Filters");
  const selectedAirlines = useSelector((state: RootState) =>
    flightType === "return"
      ? state.flightFilter.returnFilters.selectedAirlines
      : state.flightFilter.departureFilters.selectedAirlines
  );

  if (!airlines.length) return null;

  return (
    <FilterSection title={t("airlines")} collapsible defaultOpen className="mb-4">
      <div className="space-y-1">
        {airlines.map((airline) => (
          <FilterCheckboxRow
            key={airline.id}
            label={`${airline.text || airline.id} (${airline.count || 0})`}
            checked={selectedAirlines.includes(airline.id || "")}
            onCheckedChange={() =>
              dispatch(toggleAirline({ airline: airline.id || "", flightType }))
            }
          />
        ))}
      </div>
    </FilterSection>
  );
}

export default AirlinesSection;
