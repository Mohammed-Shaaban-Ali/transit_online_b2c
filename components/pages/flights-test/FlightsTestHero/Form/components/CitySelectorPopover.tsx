"use client";

import { ReactNode, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { recentSearches, popularCities, asiaCities } from "../constants";

type Props = {
  label: string;
  value: string;
  icon?: ReactNode;
  onChange: (value: string) => void;
  panelWidthClassName?: string;
  triggerClassName?: string;
  valueClassName?: string;
};

function CitySelectorPopover({
  label,
  value,
  icon,
  onChange,
  panelWidthClassName = "w-[320px]",
  triggerClassName = "",
  valueClassName = "text-[16px] text-gray-500",
}: Props) {
  const [open, setOpen] = useState(false);

  const selectCity = (city: string) => {
    onChange(city);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`flex h-[58px] w-full items-center gap-2 rounded-sm border border-gray-300 px-3 text-start ${triggerClassName}`}
        >
          {icon}
          <span className={valueClassName}>{value || label}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={-58}
        avoidCollisions={false}
        className=" border-none bg-transparent p-0 shadow-none"
      >
        <div
          className={`${panelWidthClassName} rounded-md border border-gray-200 bg-white shadow-xl`}
        >
          <div className="border-b border-gray-200 px-4 py-3">
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={label}
              className="h-[58px] w-full rounded-sm border border-gray-300 px-3 text-[15px] font-medium outline-none placeholder:text-gray-500"
            />
          </div>

          <div className="max-h-[360px] overflow-y-auto p-4 text-black">
            <h4 className="mb-3 text-[14px] font-semibold">Recent Searches</h4>
            <div className="mb-5 space-y-2">
              {recentSearches.map((city) => (
                <button
                  key={`recent-${city}`}
                  type="button"
                  onClick={() => selectCity(city)}
                  className="text-start text-[14px] leading-[1.15] hover:bg-blue-100 rounded-sm p-2 py-3.5"
                >
                  {city}
                </button>
              ))}
            </div>

            {[
              {
                title: "Popular cities",
                cities: popularCities,
              },
              {
                title: "Asia",
                cities: asiaCities,
              },
            ].map((item) => (
              <div key={item.title}>
                <h4 className="mb-3 text-[14px] text-gray-500 first:border-t border-gray-200 pt-3">
                  {item.title}
                </h4>
                <div className="mb-5 grid grid-cols-3 gap-y-2">
                  {item.cities.map((city) => (
                    <button
                      key={`popular-${city}`}
                      type="button"
                      onClick={() => selectCity(city)}
                      className="text-start text-[14px] leading-[1.15] hover:bg-blue-100 rounded-sm p-2 py-3.5"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default CitySelectorPopover;
