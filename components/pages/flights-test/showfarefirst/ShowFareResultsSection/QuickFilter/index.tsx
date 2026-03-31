"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { setSortBy } from "@/redux/features/flights/flightFilterSlice";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatePrice } from "@/utils/formatePrice";
import CurrencySymbol from "@/components/shared/PriceCell/CurrencySymbol";
import { ChevronsUpDown, SlidersHorizontal } from "lucide-react";

type Props = {
  nonstopCheapest: number;
  recommendedCheapest: number;
  overallCheapest: number;
  onOpenFilters?: () => void;
  /** Redux slice key — departure list vs return list */
  flightType?: "departure" | "return";
};

type QuickFilterId = "nonstop" | "recommended" | "cheapest";

function QuickFilter({
  nonstopCheapest,
  recommendedCheapest,
  overallCheapest,
  onOpenFilters,
  flightType = "departure",
}: Props) {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState<QuickFilterId>("cheapest");
  const [sortOpen, setSortOpen] = useState(false);

  const quickFilters: { id: QuickFilterId; label: string; price: number }[] = [
    {
      id: "nonstop",
      label: "Nonstop first",
      price: formatePrice(nonstopCheapest),
    },
    {
      id: "recommended",
      label: "Recommended",
      price: formatePrice(recommendedCheapest),
    },
    { id: "cheapest", label: "Cheapest", price: formatePrice(overallCheapest) },
  ];

  const handleSelect = (id: QuickFilterId) => {
    setSelected(id);
    if (id === "recommended") {
      dispatch(setSortBy({ sortBy: "duration", flightType }));
    } else {
      dispatch(setSortBy({ sortBy: "price", flightType }));
    }
  };

  const sortOptions = [
    { id: "price", label: "Cheapest" },
    { id: "duration", label: "Fastest" },
  ];

  const selectedFilter = quickFilters.find((f) => f.id === selected);

  return (
    <>
      {/* Desktop layout */}
      <div className="hidden sm:grid grid-cols-4 text-center text-sm bg-white mt-1">
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
                  className={`mt-0.5 text-[13px] flex items-center gap-1 ${
                    isSelected
                      ? "font-medium text-black"
                      : "text-gray-500 group-hover:text-primary"
                  }`}
                >
                  <CurrencySymbol size="sm" />
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
                    dispatch(setSortBy({ sortBy: option.id, flightType }));
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

      {/* Mobile: white pill, no stroke — contrast + soft shadow only */}
      <div
        className="mt-2 flex sm:hidden items-center justify-between gap-3 
      rounded-lg bg-white px-4 py-3.5 mb-3
      "
      >
        <Select
          value={selected}
          onValueChange={(val) => handleSelect(val as QuickFilterId)}
        >
          <SelectTrigger
            className={
              "h-auto min-w-0 flex-1 border-0 bg-transparent px-0 py-0 shadow-none text-black font-semibold " +
              "ring-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 " +
              "data-[size=default]:h-auto [&>svg]:hidden"
            }
          >
            <div className="flex min-w-0 items-center gap-1">
              <ChevronsUpDown
                className="h-4 w-4 shrink-0 text-black"
                strokeWidth={2}
                aria-hidden
              />
              <SelectValue className="truncate text-left text-[16px] font-semibold text-black">
                {selectedFilter?.label}
              </SelectValue>
            </div>
          </SelectTrigger>
          <SelectContent>
            {quickFilters.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                <div className="flex flex-col py-0.5">
                  <span className="text-[14px] font-medium">{item.label}</span>
                  <span className="flex items-center gap-0.5 text-[12px] text-gray-500">
                    <CurrencySymbol size="sm" />
                    {item.price}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {onOpenFilters && (
          <button
            type="button"
            onClick={onOpenFilters}
            className="flex shrink-0 items-center gap-2 border-0 bg-transparent p-0 text-[15px] font-medium text-gray-900 outline-none transition-colors hover:text-gray-700"
          >
            <SlidersHorizontal className="h-4 w-4 shrink-0" aria-hidden />
            Filters
          </button>
        )}
      </div>
    </>
  );
}

export default QuickFilter;
