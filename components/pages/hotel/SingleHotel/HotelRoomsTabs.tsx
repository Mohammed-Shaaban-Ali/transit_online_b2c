"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const TAB_IDS = ["rooms", "reviews", "amenities", "policies"] as const;
type TabId = (typeof TAB_IDS)[number];

const STATIC_FILTERS = [
  { id: "freeCancellation", count: 14, defaultSelected: true },
  { id: "instantConfirmation", count: 14, defaultSelected: false },
  { id: "roomsWithWindows", count: 6, defaultSelected: false },
  { id: "prepayOnline", count: 9, defaultSelected: false },
  { id: "hotelPackage", count: 4, defaultSelected: false },
  { id: "payAtHotel", count: 5, defaultSelected: false },
] as const;

export default function HotelRoomsTabs() {
  const t = useTranslations("HotelRoomsTabs");
  const [activeTab, setActiveTab] = useState<TabId>("rooms");
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(
    () =>
      new Set(STATIC_FILTERS.filter((f) => f.defaultSelected).map((f) => f.id)),
  );

  const toggleFilter = (id: string) => {
    setSelectedFilters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="mt-5 rounded-lg border border-gray-100 bg-white  shadow-sm ">
      <div
        className="flex flex-wrap gap-6 border-b p-5 pb-0 "
        role="tablist"
        aria-label={t("ariaTabs")}
      >
        {TAB_IDS.map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            className={cn(
              "relative pb-3 text-lg font-bold text-gray-500 transition-colors hover:text-gray-800",
              activeTab === id &&
                "font-bold text-gray-900 after:absolute after:start-0 after:bottom-0 after:h-1 after:w-full after:rounded-full after:bg-gray-900",
            )}
          >
            {t(`tabs.${id}`)}
          </button>
        ))}
      </div>

      {activeTab === "rooms" && (
        <div
          className="flex flex-wrap gap-2 p-5"
          role="group"
          aria-label={t("ariaFilters")}
        >
          {STATIC_FILTERS.map((filter) => {
            const isOn = selectedFilters.has(filter.id);
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => toggleFilter(filter.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-[14x] font-medium transition-colors",
                  "bg-gray-100 text-gray-800 hover:bg-gray-200",
                  isOn &&
                    "bg-gray-800 text-white ring-1 ring-gray-300   hover:bg-gray-800 hover:text-white",
                )}
              >
                <span>
                  {t(`filters.${filter.id}`)}({filter.count})
                </span>
              </button>
            );
          })}
        </div>
      )}

      {activeTab !== "rooms" && (
        <p className="pt-4 text-sm text-gray-500">
          {t(`placeholders.${activeTab}`)}
        </p>
      )}
    </div>
  );
}
