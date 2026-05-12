"use client";

import NewNavbar from "@/components/shared/Navbar/NewNavbar";
import MyBookingSidebar from "@/components/pages/new/my-booking/Sidebar";
import FlightBookingCard, {
  FlightBookingCardSkeleton,
} from "@/components/pages/new/my-booking/FlightBookingCard";
import HotelBookingCard, {
  HotelBookingCardSkeleton,
} from "@/components/pages/new/my-booking/HotelBookingCard";
import React from "react";
import { CircleHelp, Download, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetMyBookingQuery } from "@/redux/features/auth/authApi";
import { useGetHotelBookingsQuery } from "@/redux/features/hotels/hotelsApi";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

const STATUS_TABS = ["all", "awaiting-payment", "upcoming", "awaiting-review"];

function page() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ?tab= drives BOTH the sidebar type filter AND the status top-tabs.
  // Sidebar values: all | flights | hotels | trains | ...
  // Status top-tab values: all | awaiting-payment | upcoming | awaiting-review
  const activeTab = searchParams.get("tab") ?? "all";
  const activeStatus = searchParams.get("status") ?? "all";

  const setStatus = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const { data: bookingsData, isLoading: isBookingsLoading } = useGetMyBookingQuery();
  const { data: hotelBookingsData, isLoading: isHotelBookingsLoading } =
    useGetHotelBookingsQuery();
  const t = useTranslations("MyBooking");

  const bookings = bookingsData?.data ?? [];
  const hotelBookings = hotelBookingsData?.data ?? [];

  // Determine which sections are visible based on sidebar ?tab=
  const showFlights = activeTab === "all" || activeTab === "flights";
  const showHotels = activeTab === "all" || activeTab === "hotels";

  const visibleFlights = showFlights ? bookings : [];
  const visibleHotels = showHotels ? hotelBookings : [];

  const isFlightsLoading = showFlights && isBookingsLoading;
  const isHotelsLoading = showHotels && isHotelBookingsLoading;
  const isAnyLoading = isFlightsLoading || isHotelsLoading;

  const hasNoBookings =
    !isAnyLoading && visibleFlights.length === 0 && visibleHotels.length === 0;

  const topTabs = [
    { label: t("tabs.all"), value: "all" },
    { label: t("tabs.awaitingPayment"), value: "awaiting-payment" },
    { label: t("tabs.upcoming"), value: "upcoming" },
    { label: t("tabs.awaitingReview"), value: "awaiting-review" },
  ];

  return (
    <section className="min-h-screen bg-[#f0f2f5]">
      <NewNavbar isBgWhite />

      <div className="container mx-auto grid max-w-[1200px]! grid-cols-1 gap-5 pb-10 pt-28 lg:grid-cols-[280px_1fr]">
        {/* Sidebar — desktop */}
        <div className="hidden lg:flex flex-col gap-3">
          <div className="p-4 flex items-center gap-2.5 bg-white rounded rounded-t-md">
            <User className="w-7 h-7 text-primary fill-primary" />
            <h2 className="text-16">{t("member")}</h2>
          </div>
          <MyBookingSidebar />
        </div>

        {/* Sidebar — mobile sheet */}
        <Sheet>
          <div className="lg:hidden flex items-center justify-between mb-4">
            <div className="p-3 flex items-center gap-2.5 bg-white rounded">
              <User className="w-5 h-5 text-primary fill-primary" />
              <h2 className="text-14">{t("member")}</h2>
            </div>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
          </div>
          <SheetContent side="left">
            <div className="flex flex-col gap-3 mt-8">
              <div className="p-4 flex items-center gap-2.5 bg-white rounded rounded-t-md">
                <User className="w-7 h-7 text-primary fill-primary" />
                <h2 className="text-16">{t("member")}</h2>
              </div>
              <MyBookingSidebar />
            </div>
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <div className="min-h-[500px]">
          {/* Title row */}
          <div className="flex flex-col gap-3 border-b border-gray-100 pb-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-5">
              <h1 className="text-28 font-semibold leading-none">{t("title")}</h1>
              <div className="inline-flex items-center gap-2 text-13 font-semibold text-primary">
                <img
                  src="https://pages.trip.com/Accounts/onlineOrder/ic_service.png"
                  alt={t("travelWorryFree")}
                  className="h-6 w-6 object-contain"
                />
                <span>{t("travelWorryFree")}</span>
                <CircleHelp className="h-4 w-4" />
              </div>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 text-14 font-medium text-primary transition-colors hover:text-primary/80"
            >
              {t("cantFindBooking")}
              <div className="h-5 w-px bg-gray-300 mx-1" />
              <Download className="h-4 w-4" />
            </button>
          </div>

          {/* Status tabs */}
          <div className="mt-2 overflow-hidden rounded-md border border-gray-200 bg-white">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {topTabs.map((tab) => {
                const isActive = activeStatus === tab.value;
                return (
                  <button
                    type="button"
                    key={tab.value}
                    onClick={() => setStatus(tab.value)}
                    className={`flex h-11 items-center justify-center px-3 text-center text-14 font-semibold transition-colors ${
                      isActive
                        ? "bg-primary text-white"
                        : "border-s border-gray-200 text-gray-500 hover:bg-primary/10 hover:text-primary"
                    } ${tab.value === "all" ? "border-s-0" : ""}`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bookings list */}
          <div className="mt-4 space-y-4">
            {/* Empty state */}
            {hasNoBookings && (
              <div className="mt-4 rounded-md bg-white p-5 md:p-7">
                <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
                  <img
                    src="https://ak-d.tripcdn.com/images/05E6w12000cqchxs29CAB.gif"
                    alt={t("noBookings")}
                    className="h-[120px] w-[120px] object-contain md:h-[170px] md:w-[170px]"
                  />
                  <div className="max-w-[700px]">
                    <p className="text-16 font-bold leading-[1.45] text-gray-500">
                      {t("noBookings")}
                    </p>
                    <Button type="button" className="mt-6 h-12">
                      {t("searchBookings")}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Flight skeletons */}
            {isFlightsLoading && (
              <>
                <FlightBookingCardSkeleton />
                <FlightBookingCardSkeleton />
              </>
            )}

            {/* Flight cards */}
            {showFlights &&
              !isBookingsLoading &&
              visibleFlights.map((booking: any) => (
                <FlightBookingCard key={booking.id} booking={booking} />
              ))}

            {/* Hotel skeletons */}
            {isHotelsLoading && (
              <>
                <HotelBookingCardSkeleton />
                <HotelBookingCardSkeleton />
              </>
            )}

            {/* Hotel cards */}
            {showHotels &&
              !isHotelBookingsLoading &&
              visibleHotels.map((booking: any) => (
                <HotelBookingCard key={booking.id} booking={booking} />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default page;
