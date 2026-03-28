"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { setSortBy } from "@/redux/features/flights/flightFilterSlice";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  nonstopCheapest: number;
  recommendedCheapest: number;
  overallCheapest: number;
};

type QuickFilterId = "nonstop" | "recommended" | "cheapest";

function QuickFilter({
  nonstopCheapest,
  recommendedCheapest,
  overallCheapest,
}: Props) {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState<QuickFilterId>("cheapest");
  const [sortOpen, setSortOpen] = useState(false);

  const formatPrice = (price: number) =>
    price > 0 && price < Infinity ? `$${price}` : "--";

  const quickFilters: { id: QuickFilterId; label: string; price: string }[] = [
    {
      id: "nonstop",
      label: "Nonstop first",
      price: formatPrice(nonstopCheapest),
    },
    {
      id: "recommended",
      label: "Recommended",
      price: formatPrice(recommendedCheapest),
    },
    { id: "cheapest", label: "Cheapest", price: formatPrice(overallCheapest) },
  ];

  const handleSelect = (id: QuickFilterId) => {
    setSelected(id);
    if (id === "recommended") {
      dispatch(setSortBy({ sortBy: "duration", flightType: "departure" }));
    } else {
      dispatch(setSortBy({ sortBy: "price", flightType: "departure" }));
    }
  };

  const sortOptions = [
    { id: "price", label: "Cheapest" },
    { id: "duration", label: "Fastest" },
  ];

  return (
    <div className="grid grid-cols-4 text-center text-sm bg-white mt-1">
      {quickFilters.map((item) => {
        const isSelected = selected === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => handleSelect(item.id)}
            className="group relative cursor-pointer px-3 py-2 bg-white w-full flex items-center justify-center text-center transition-all duration-300 hover:text-primary"
          >
            <div className="flex flex-col items-center">
              <p
                className={`text-[14px] leading-tight ${
                  isSelected
                    ? "font-semibold text-black"
                    : "font-medium text-gray-700 group-hover:text-primary"
                }`}
              >
                {item.label}
              </p>
              <p
                className={`mt-0.5 text-[13px] ${
                  isSelected
                    ? "font-medium text-black"
                    : "text-gray-500 group-hover:text-primary"
                }`}
              >
                {item.price}
              </p>
              <span
                className={`absolute bottom-0 left-0 h-[2px] w-full transition-colors ${
                  isSelected ? "bg-black" : "bg-transparent"
                }`}
              />
            </div>
            <span className="absolute end-0 top-1/2 h-8 w-px -translate-y-1/2 bg-gray-200" />
          </button>
        );
      })}

      <Popover open={sortOpen} onOpenChange={setSortOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="border-e-4 border-gray-200 w-full h-full py-2 cursor-pointer"
          >
            <p className="text-[14px]">Sort by</p>
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={0}
          className="w-80 p-0 rounded-b-lg rounded-t-none border-t-0 shadow-lg"
        >
          <ul>
            {sortOptions.map((option) => (
              <li
                key={option.id}
                onClick={() => {
                  dispatch(
                    setSortBy({ sortBy: option.id, flightType: "departure" }),
                  );
                  setSortOpen(false);
                }}
                className="flex cursor-pointer items-center justify-between px-4 py-3 border-b border-gray-100 last:border-b-0 transition-colors hover:bg-gray-50"
              >
                <p className="text-[14px] text-gray-800">{option.label}</p>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default QuickFilter;
