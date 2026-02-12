"use client";

import { useDispatch, useSelector } from "react-redux";
import { toggleProvider } from "@/redux/features/flights/flightFilterSlice";
import { RootState } from "@/redux/app/store";
import Checkbox from "@/components/shared/form/Checkbox";

interface ProvidersProps {
  providers?: {
    id: string;
    text: string;
    count: number;
  }[];
  flightType?: "departure" | "return";
}

const Providers: React.FC<ProvidersProps> = ({
  providers = [],
  flightType = "departure",
}) => {
  const dispatch = useDispatch();
  const { departureFilters, returnFilters } = useSelector(
    (state: RootState) => state.flightFilter
  );
  const filters = flightType === "departure" ? departureFilters : returnFilters;
  const selectedProviders = filters?.selectedProviders;

  const handleProviderToggle = (providerId: string) => {
    dispatch(toggleProvider({ provider: providerId, flightType }));
  };

  return (
    <div className="flex flex-col gap-1">
      {providers.map((provider, index) => {
        const isChecked = selectedProviders?.includes(provider.id);

        return (
          <Checkbox
            key={index}
            name={provider.id || ""}
            checked={isChecked}
            onChange={() => handleProviderToggle(provider.id)}
            label={provider.text || ""}
            count={provider.count || 0}
          />
        );
      })}
    </div>
  );
};

export default Providers;
