import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {};

const quickFilters = [
  { id: 0, label: "Nonstop first", price: "US$93" },
  { id: 1, label: "Recommended", price: "US$93" },
  { id: 2, label: "Cheapest", price: "US$93" },
];

const sortOptions = [
  { id: "fastest", label: "Fastest", price: "US$228" },
  { id: "dep-earliest", label: "Departure (Earliest)", price: "US$408" },
  { id: "dep-latest", label: "Departure (Latest)", price: "US$222" },
  { id: "arr-earliest", label: "Arrival (Earliest)", price: "US$383" },
  { id: "arr-latest", label: "Arrival (Latest)", price: "US$267" },
];

function QuickFilter({}: Props) {
  const [selectedId, setSelectedId] = useState(0);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-5 text-center text-sm bg-white mt-1">
      {quickFilters.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => setSelectedId(item.id)}
          className={`group relative cursor-pointer px-3 py-2 bg-white w-full flex items-center justify-center 
                 text-center transition-all duration-300 hover:text-primary`}
        >
          <div className="flex flex-col items-center">
            <p
              className={`text-[14px] leading-tight ${
                selectedId === item.id
                  ? "font-semibold text-black"
                  : "font-medium text-gray-700 group-hover:text-primary"
              }`}
            >
              {item.label}
            </p>
            <p
              className={`mt-0.5 text-[13px] ${
                selectedId === item.id
                  ? "font-medium text-black"
                  : "text-gray-500 group-hover:text-primary"
              }`}
            >
              {item.price}
            </p>
            <span
              className={`absolute bottom-0 left-0 h-[2px] w-full transition-colors ${
                selectedId === item.id ? "bg-black" : "bg-transparent"
              }`}
            />
          </div>
          <span className="absolute end-0 top-1/2 h-8 w-px -translate-y-1/2 bg-gray-200" />
        </button>
      ))}

      <Popover open={sortOpen} onOpenChange={setSortOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="border-e-4 border-gray-200 w-full h-full 
            py-2 cursor-pointer"
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
            {sortOptions.map((option) => {
              const isSelected = selectedSort === option.id;
              return (
                <li
                  key={option.id}
                  className="group/item flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-b-0 transition-colors hover:bg-gray-50"
                >
                  <p className="text-[14px] text-gray-800">{option.label}</p>
                  <p className="text-[14px] text-gray-500">{option.price}</p>
                </li>
              );
            })}
          </ul>
        </PopoverContent>
      </Popover>

      <button type="button" className="py-2 font-semibold text-primary">
        Create price alert
      </button>
    </div>
  );
}

export default QuickFilter;
