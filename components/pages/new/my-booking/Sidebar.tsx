"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

function MyBookingSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab")?.toLowerCase() || "all";
  const t = useTranslations("MyBooking.sidebar");

  const bookingTabs = [
    { label: t("tabs.all"), value: "all" },
    { label: t("tabs.flights"), value: "flights" },
    { label: t("tabs.hotels"), value: "hotels" },
    { label: t("tabs.trains"), value: "trains" },
    { label: t("tabs.carRentals"), value: "car-rentals" },
    { label: t("tabs.airportTransfers"), value: "airport-transfers" },
    { label: t("tabs.attractionsTours"), value: "attractions-tours" },
    { label: t("tabs.flightHotel"), value: "flight-hotel" },
    { label: t("tabs.privateTours"), value: "private-tours" },
    { label: t("tabs.tourPackages"), value: "tour-packages" },
  ];

  const savedItems = [
    { label: t("savedItems.saved"), key: "saved" },
    { label: t("savedItems.account"), key: "account" },
    { label: t("savedItems.myPosts"), key: "myPosts" },
    { label: t("savedItems.priceAlerts"), key: "priceAlerts" },
    { label: t("savedItems.myCards"), key: "myCards" },
    { label: t("savedItems.giftCards"), key: "giftCards" },
    { label: t("savedItems.promoCodes"), key: "promoCodes" },
  ];

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
          {t("myBookings")}
        </button>
      </div>

      <nav aria-label={t("myBookings")} className="pb-2 space-y-1">
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
        {savedItems.map((item) => (
          <button
            key={item.key}
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
