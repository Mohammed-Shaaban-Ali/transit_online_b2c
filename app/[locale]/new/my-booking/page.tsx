"use client";

import NewNavbar from "@/components/shared/Navbar/NewNavbar";
import MyBookingSidebar from "@/components/pages/new/my-booking/Sidebar";
import React, { useState } from "react";
import { CircleHelp, Download, User } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = {};

function page({}: Props) {
  const [activeTab, setActiveTab] = useState("all");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeBookingTab = searchParams.get("status")?.toLowerCase() || "all";

  const topTabs = [
    { label: "All", value: "all" },
    { label: "Awaiting Payment", value: "awaiting-payment" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Awaiting Review", value: "awaiting-review" },
  ];

  return (
    <section className="min-h-screen bg-[#f0f2f5]">
      <NewNavbar isBgWhite />

      <div className="container mx-auto grid max-w-[1200px]! grid-cols-1 gap-5 pb-10 pt-28 lg:grid-cols-[280px_1fr]">
        <div className="flex flex-col gap-3">
          <div className="p-4  flex items-center  gap-2.5 bg-white rounded rounded-t-md">
            <User className="w-7 h-7 text-primary fill-primary" />
            <h2 className="text-16">Member</h2>
          </div>

          <MyBookingSidebar />
        </div>

        <div className="min-h-[500px]">
          <div className="">
            <div className="flex flex-col gap-3 border-b border-gray-100 pb-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-5">
                <h1 className="text-28 font-semibold leading-none ">
                  My Bookings
                </h1>
                <div className="inline-flex items-center gap-2 text-13 font-semibold text-primary">
                  <img
                    src="https://pages.trip.com/Accounts/onlineOrder/ic_service.png"
                    alt="Travel Worry-free Guarantee"
                    className="h-6 w-6 object-contain"
                  />
                  <span>Travel Worry-free Guarantee</span>
                  <CircleHelp className="h-4 w-4" />
                </div>
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-2 text-14 font-medium text-primary transition-colors hover:text-primary/80"
              >
                Can&apos;t find your booking?
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

            <div className="mt-4 rounded-md bg-white p-5 md:p-7">
              <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
                <img
                  src="https://ak-d.tripcdn.com/images/05E6w12000cqchxs29CAB.gif"
                  alt="No bookings"
                  className="h-[120px] w-[120px] object-contain md:h-[170px] md:w-[170px]"
                />

                <div className="max-w-[700px]">
                  <p className="text-16 font-bold leading-[1.45] text-gray-500">
                    You don&apos;t have any bookings or we can&apos;t access
                    your bookings at this time. You can search for bookings you
                    made as a guest within the last year using your email
                    address.
                  </p>

                  <Button type="button" className="mt-6 h-12">
                    Search bookings
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default page;
