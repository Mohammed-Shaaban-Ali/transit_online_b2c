"use client";

import { Link } from "@/i18n/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

const bookingTabs = [
  { label: "All", value: "all" },
  { label: "Flights", value: "flights" },
  { label: "Hotels", value: "hotels" },
  { label: "Trains", value: "trains" },
  { label: "Car Rentals", value: "car-rentals" },
  { label: "Airport Transfers", value: "airport-transfers" },
  { label: "Attractions & Tours", value: "attractions-tours" },
  { label: "Flight + Hotel", value: "flight-hotel" },
  { label: "Private Tours", value: "private-tours" },
  { label: "Tour Packages", value: "tour-packages" },
];

const savedItems = [
  "My posts",
  "Price alerts",
  "My cards",
  "Gift cards",
  "Promo codes",
];

function MyBookingSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab")?.toLowerCase() || "all";

  const getTabClassName = (value: string) => {
    const isActive = activeTab === value;

    return `block border-s-2 px-7 py-2 text-14  leading-[1.2] transition-colors duration-200 ${
      isActive
        ? "border-primary bg-primary/10 text-primary"
        : "border-transparent text-gray-500 hover:border-primary hover:bg-primary/10 hover:text-primary"
    }`;
  };

  return (
    <aside className="overflow-hidden rounded rounded-b-md bg-white">
      <div className=" p-6 pb-4">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-16  font-semibold leading-tight "
        >
          My bookings
        </button>
      </div>

      <nav aria-label="My bookings tabs" className="pb-2 space-y-1">
        {bookingTabs.map((item) => (
          <Link
            key={item.value}
            href={`${pathname}?tab=${item.value}`}
            className={getTabClassName(item.value)}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-6 pb-4 space-y-1 flex flex-col gap-4">
        {[
          { label: "Saved" },
          { label: "Account" },
          { label: "My Posts" },
          { label: "Price Alerts" },
          { label: "My Cards" },
          { label: "Gift Cards" },
          { label: "Promo Codes" },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            className="inline-flex items-center gap-1.5 text-16  font-semibold leading-tight "
          >
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  );
}

export default MyBookingSidebar;
