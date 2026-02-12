"use client";

import { useLocale } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import { setSortBy } from "@/redux/features/flights/flightFilterSlice";
import { RootState } from "@/redux/app/store";
import { ImRadioChecked, ImRadioUnchecked } from "react-icons/im";

interface SortingOptionsProps {
  sortingOptions?: {
    id: string;
    text: string;
  }[];
  flightType?: "departure" | "return";
}

const SortingOptions: React.FC<SortingOptionsProps> = ({
  sortingOptions = [],
  flightType = "departure",
}) => {
  const dispatch = useDispatch();
  const { departureFilters, returnFilters } = useSelector(
    (state: RootState) => state.flightFilter
  );
  const filters = flightType === "departure" ? departureFilters : returnFilters;
  const selectedSortBy = filters.sortBy;

  const handleSortToggle = (sortId: "price" | "duration") => {
    dispatch(setSortBy({ sortBy: sortId, flightType }));
  };

  const sortingOptionsToRender =
    sortingOptions.length > 0 ? sortingOptions : [];

  return (
    <div className="space-y-1">
      {sortingOptionsToRender.map((sortingOption, index) => {
        const isChecked = selectedSortBy === sortingOption.id;

        return (
          <label
            key={index}
            className="flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded px-2 py-1 transition-colors gap-2.5"
          >
            <div className="flex items-center gap-1.5 w-full">
              <div className="relative flex items-center">
                <input
                  type="radio"
                  name={`sort-${flightType}`}
                  checked={isChecked}
                  onChange={() => handleSortToggle(sortingOption.id as any)}
                  className="sr-only"
                />
                {isChecked ? (
                  <ImRadioChecked className="w-[18px] h-[18px] text-primary fill-primary" />
                ) : (
                  <ImRadioUnchecked className="w-[18px] h-[18px] text-gray-300 fill-gray-300 bg-white" />
                )}
              </div>
              <span className="text-gray-600">{sortingOption.text}</span>
            </div>
          </label>
        );
      })}
    </div>
  );
};

export default SortingOptions;
