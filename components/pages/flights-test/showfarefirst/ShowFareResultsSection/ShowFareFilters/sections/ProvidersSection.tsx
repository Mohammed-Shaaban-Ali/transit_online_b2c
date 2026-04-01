"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { toggleProvider } from "@/redux/features/flights/flightFilterSlice";
import { useTranslations } from "next-intl";
import FilterCheckboxRow from "../FilterCheckboxRow";
import FilterSection from "../components/FilterSection";

type Props = {
  providers: { id: string; text: string; count: number }[];
  flightType?: "departure" | "return";
};

function ProvidersSection({ providers, flightType = "departure" }: Props) {
  const dispatch = useDispatch();
  const t = useTranslations("ShowFarePage.Filters");
  const selectedProviders = useSelector((state: RootState) =>
    flightType === "return"
      ? state.flightFilter.returnFilters.selectedProviders
      : state.flightFilter.departureFilters.selectedProviders
  );

  if (!providers.length) return null;

  return (
    <FilterSection title={t("providers")} collapsible defaultOpen className="mb-4">
      <div className="space-y-1">
        {providers.map((provider) => (
          <FilterCheckboxRow
            key={provider.id}
            label={`${provider.text} (${provider.count})`}
            checked={selectedProviders.includes(provider.id)}
            onCheckedChange={() =>
              dispatch(toggleProvider({ provider: provider.id, flightType }))
            }
          />
        ))}
      </div>
    </FilterSection>
  );
}

export default ProvidersSection;
