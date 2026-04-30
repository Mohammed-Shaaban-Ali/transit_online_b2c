"use client";

import NewNavbar from "@/components/shared/Navbar/NewNavbar";
import MyBookingSidebar from "@/components/pages/new/my-booking/Sidebar";
import React, { useState } from "react";
import {
  CircleHelp,
  Download,
  User,
  Plane,
  Calendar,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetMyBookingQuery } from "@/redux/features/auth/authApi";
import { formatePrice } from "@/utils/formatePrice";
import CurrencySymbol from "@/components/shared/PriceCell/CurrencySymbol";
import { useRouter } from "@/i18n/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTranslations } from "next-intl";

type Props = {};

function page({}: Props) {
  const [activeTab, setActiveTab] = useState("all");
  const router = useRouter();
  const { data: bookingsData, isLoading: isBookingsLoading } =
    useGetMyBookingQuery();
  const t = useTranslations("MyBooking");

  const topTabs = [
    { label: t("tabs.all"), value: "all" },
    { label: t("tabs.awaitingPayment"), value: "awaiting-payment" },
    { label: t("tabs.upcoming"), value: "upcoming" },
    { label: t("tabs.awaitingReview"), value: "awaiting-review" },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; className: string }> = {
      ticketed: {
        text: t("status.ticketed"),
        className: "bg-green-100 text-green-800",
      },
      pending: {
        text: t("status.pending"),
        className: "bg-yellow-100 text-yellow-800",
      },
      cancelled: {
        text: t("status.cancelled"),
        className: "bg-red-100 text-red-800",
      },
    };
    return (
      statusMap[status] || {
        text: status,
        className: "bg-gray-100 text-gray-800",
      }
    );
  };

  const bookings = bookingsData?.data || [];

  return (
    <section className="min-h-screen bg-[#f0f2f5]">
      <NewNavbar isBgWhite />

      <div className="container mx-auto grid max-w-[1200px]! grid-cols-1 gap-5 pb-10 pt-28 lg:grid-cols-[280px_1fr]">
        <div className="hidden lg:flex flex-col gap-3">
          <div className="p-4 flex items-center gap-2.5 bg-white rounded rounded-t-md">
            <User className="w-7 h-7 text-primary fill-primary" />
            <h2 className="text-16">{t("member")}</h2>
          </div>
          <MyBookingSidebar />
        </div>

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

        <div className="min-h-[500px]">
          <div className="">
            <div className="flex flex-col gap-3 border-b border-gray-100 pb-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-5">
                <h1 className="text-28 font-semibold leading-none ">
                  {t("title")}
                </h1>
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
                <div className="h-5 w-px bg-gray-300 mx-1"></div>
                <Download className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-2 overflow-hidden rounded-md border border-gray-200 bg-white">
              <div className="grid grid-cols-2 md:grid-cols-4">
                {topTabs.map((tab) => {
                  const isActive = activeTab === tab.value;
                  return (
                    <button
                      type="button"
                      key={tab.value}
                      onClick={() => setActiveTab(tab.value)}
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

            <div className="mt-4 space-y-4">
              {isBookingsLoading ? (
                <div className="rounded-md bg-white p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-gray-500">{t("loading")}</p>
                </div>
              ) : bookings.length === 0 ? (
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
              ) : (
                bookings.map((booking: any) => {
                  const statusInfo = getStatusBadge(booking.status);
                  const departureFlight =
                    booking.offer_details?.departure_flight;
                  const firstLeg = departureFlight?.legs?.[0];
                  const lastLeg =
                    departureFlight?.legs?.[departureFlight.legs.length - 1];

                  return (
                    <div
                      key={booking.id}
                      onClick={() =>
                        router.push(`/new/my-booking/${booking.booking_number}`)
                      }
                      className="rounded-md bg-white p-5 md:p-7 cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
                          <div className="flex items-center gap-3">
                            <Plane className="w-5 h-5 text-gray-600" />
                            <span className="text-16 font-semibold text-gray-900">
                              {t("bookingNumber")} {booking.booking_number}
                            </span>
                            <span className="text-gray-400">|</span>
                            <span className="text-14 text-gray-500">
                              {t("bookingDate")}:{" "}
                              {new Date().toLocaleDateString()}
                            </span>
                          </div>
                          <span
                            className={`px-3 py-1 rounded text-sm font-medium ${statusInfo.className}`}
                          >
                            {statusInfo.text}
                          </span>
                        </div>

                        <div className="flex flex-col gap-4">
                          <div className="flex flex-wrap items-start gap-4">
                            {firstLeg && lastLeg && (
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                  <h3 className="text-20 font-bold text-gray-700">
                                    {firstLeg.departure_info?.city_name} (
                                    {firstLeg.departure_info?.airport_code}) →{" "}
                                    {lastLeg.arrival_info?.city_name} (
                                    {lastLeg.arrival_info?.airport_code})
                                  </h3>
                                  {booking.offer_details?.fare_detail
                                    ?.price_info && (
                                    <p className="text-20 font-bold text-gray-600">
                                      <CurrencySymbol />
                                      {formatePrice(
                                        booking.offer_details.fare_detail
                                          .price_info.total_fare,
                                      )}
                                    </p>
                                  )}
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 flex flex-wrap items-center gap-4">
                                  <div>
                                    <p className="text-xl font-semibold text-gray-800">
                                      {new Date(
                                        firstLeg.departure_info?.date,
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {new Date(
                                        firstLeg.departure_info?.date,
                                      ).toLocaleDateString(undefined, {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-400">
                                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                    <div className="w-12 border-t border-dashed border-gray-400"></div>
                                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                  </div>
                                  <div>
                                    <p className="text-xl font-semibold text-gray-800">
                                      {new Date(
                                        lastLeg.arrival_info?.date,
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {new Date(
                                        lastLeg.arrival_info?.date,
                                      ).toLocaleDateString(undefined, {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-lg font-semibold text-gray-700">
                                      {firstLeg.airline_info?.carrier_name}{" "}
                                      {firstLeg.flight_number}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {firstLeg.airline_info?.carrier_name}
                                    </p>
                                  </div>
                                  <div className="ml-auto">
                                    <p className="text-lg font-semibold text-gray-700">
                                      {booking.passengers?.[0]?.name}{" "}
                                      {booking.passengers?.[0]?.lastName}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {booking.passengers?.length || 0}{" "}
                                      {t("passengers")}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default page;
