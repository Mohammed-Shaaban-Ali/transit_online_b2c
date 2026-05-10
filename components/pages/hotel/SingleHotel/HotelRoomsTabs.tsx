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
      new Set(
        STATIC_FILTERS.filter((f) => f.defaultSelected).map((f) => f.id),
      ),
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
    <div className="mt-6 rounded-lg border border-gray-100 bg-white p-4 shadow-sm md:p-5">
      <div
        className="flex flex-wrap gap-6 border-b border-gray-200 pb-3"
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
              "relative pb-3 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800",
              activeTab === id &&
                "font-semibold text-gray-900 after:absolute after:start-0 after:bottom-0 after:h-0.5 after:w-full after:rounded-full after:bg-gray-900",
            )}
            onClick={() => setActiveTab(id)}
          >
            {t(`tabs.${id}`)}
          </button>
        ))}
      </div>

      {activeTab === "rooms" && (
        <div className="flex flex-wrap gap-2 pt-4" role="group" aria-label={t("ariaFilters")}>
          {STATIC_FILTERS.map((filter) => {
            const isOn = selectedFilters.has(filter.id);
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => toggleFilter(filter.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
                  "bg-gray-100 text-gray-800 hover:bg-gray-200",
                  isOn && "bg-gray-200 ring-1 ring-gray-300",
                )}
              >
                {isOn && (
                  <Check className="size-3.5 shrink-0 text-gray-900" strokeWidth={2.5} />
                )}
                <span>
                  {t(`filters.${filter.id}`)}({filter.count})
                </span>
              </button>
            );
          })}
        </div>
      )}

      {activeTab !== "rooms" && (
        <p className="pt-4 text-sm text-gray-500">{t(`placeholders.${activeTab}`)}</p>
      )}
    </div>
  );
}
