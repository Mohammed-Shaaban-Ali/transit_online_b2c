"use client";

import { useEffect, useMemo, useState } from "react";
import AddOIns from "@/components/pages/new/booking/details/AddOIns";
import ContactInformation from "@/components/pages/new/booking/details/ContactInformation";
import FlightDetails from "@/components/pages/new/booking/details/FlightDetails";
import CustomerSupport from "@/components/pages/new/booking/details/CustomerSupport";
import FeaturedProperties from "@/components/pages/new/booking/details/FeaturedProperties";
import PassengerInformation from "@/components/pages/new/booking/details/PassengerInformation";
import NewNavbar from "@/components/shared/Navbar/NewNavbar";
import Payment from "@/components/pages/new/booking/details/Payment";
import { FLIGHT_BOOKING_KEY } from "@/constants";
import type { FlightBookingData } from "@/components/pages/flights-test/FlightBookingPage";
import type { FlightBookingFormValues } from "@/components/pages/flights-test/FlightBookingPage/FlightBookingForm";

const BOOKING_FORM_KEY = "FLIGHT_BOOKING_FORM_DATA";
const BOOKING_PRICE_KEY = "FLIGHT_BOOKING_PRICE_DATA";

export default function Page() {
  const [flightData, setFlightData] = useState<FlightBookingData | null>(null);
  const [formData, setFormData] = useState<FlightBookingFormValues | null>(null);
  const [priceData, setPriceData] = useState<any>(null);

  useEffect(() => {
    try {
      const storedFlightData = sessionStorage.getItem(FLIGHT_BOOKING_KEY);
      const storedFormData = sessionStorage.getItem(BOOKING_FORM_KEY);
      const storedPriceData = sessionStorage.getItem(BOOKING_PRICE_KEY);

      if (storedFlightData) setFlightData(JSON.parse(storedFlightData));
      if (storedFormData) setFormData(JSON.parse(storedFormData));
      if (storedPriceData) setPriceData(JSON.parse(storedPriceData));
    } catch (error) {
      console.error("Error loading booking success data:", error);
    }
  }, []);

  const totalAmount = useMemo(
    () => Number(priceData?.total?.value || flightData?.buyPrice || 277.2),
    [priceData, flightData],
  );
  const currencySymbol = useMemo(() => {
    const currency = String(priceData?.currency || "US$").toUpperCase();
    return currency === "USD" ? "US$" : `${currency} `;
  }, [priceData]);

  const passengerCount = useMemo(() => {
    if (!flightData) return 1;
    return Number(flightData.adults || 0) + Number(flightData.children || 0) + Number(flightData.infants || 0);
  }, [flightData]);

  return (
    <section className="relative flex min-h-screen flex-col text-sm md:bg-primary md:text-base">
      <div
        className="md:h-[76px] md:bg-transparent 
      h-[108px] bg-primary "
      >
        <NewNavbar />
      </div>
      <section
        className="relative z-0 min-h-screen 
      rounded-t-2xl md:rounded-t-[32px] bg-[#f7f7f7] py-6 md:py-12 "
      >
        <div className="mx-auto w-full max-w-[1200px]! px-3 sm:px-5 md:px-0">
          {/* <h1 className="text-xl md:text-24 font-bold mb-4 md:mb-6 relative z-10">
            Booking Successful
          </h1> */}

          {/* ===== Form + Price Summary Grid ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 relative z-10">
            {/* Left: Booking Form */}
            <div className="lg:col-span-2 space-y-2.5">
              {/* ===== Collapsible Flight Itinerary ===== */}
              <Payment
                status="success"
                totalAmount={totalAmount}
                currency={currencySymbol}
              />
              <FlightDetails
                departureFlightData={flightData?.departureFlightData}
                returnFlightData={flightData?.returnFlightData}
              />
              <AddOIns />
              <PassengerInformation formData={formData} />
              <ContactInformation formData={formData} />
              <CustomerSupport />
              <FeaturedProperties />
            </div>

            {/* Right: Price summary (lg: sticky) */}
            <aside className="lg:col-span-1 lg:self-start lg:sticky lg:top-6 lg:z-20">
              <section className="rounded bg-white p-6">
                <div className="flex items-center justify-between border-b border-dashed border-gray-300 pb-5">
                  <h3 className="text-22 font-bold leading-none ">
                    Total Amount
                  </h3>
                  <p className="text-22 font-bold leading-none text-primary">
                    {currencySymbol}
                    {totalAmount.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-2 pt-5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-20 font-bold leading-none ">
                      Booking total
                    </h4>
                    <p className="text-20 font-bold leading-none ">
                      {currencySymbol}
                      {totalAmount.toFixed(2)}
                    </p>
                  </div>

                  <p className="text-14 font-normal leading-tight text-gray-500">
                    {new Date().toLocaleString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>

                  <p className="text-12 font-normal leading-snug text-red-500">
                    Please note that the payment method cannot be changed once
                    the transaction has been completed
                  </p>

                  <div className="space-y-3 bg-gray-100 p-4 mt-2 rounded text-gray-500 text-14">
                    <div className="flex items-center justify-between ">
                      <span className="font-normal ">Adults</span>
                      <span className="font-medium ">
                        {currencySymbol}
                        {totalAmount.toFixed(2)} × {passengerCount}
                      </span>
                    </div>

                    <div className="flex items-center justify-between ">
                      <span className="font-normal ">Ticket fare</span>
                      <span className="font-medium ">
                        {currencySymbol}
                        {Math.max(totalAmount - Number(priceData?.total?.tax || 0), 0).toFixed(2)} × 1
                      </span>
                    </div>

                    <div className="flex items-center justify-between ">
                      <span className="font-normal  ">Taxes & fees</span>
                      <span className="font-medium ">
                        {currencySymbol}
                        {Number(priceData?.total?.tax || 0).toFixed(2)} × 1
                      </span>
                    </div>

                    <div className="flex items-center justify-between ">
                      <span className="font-normal ">Promo code</span>
                      <span className="font-medium ">
                        {currencySymbol}
                        {Number(priceData?.discount?.value || 0).toFixed(2)} × 1
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </section>
    </section>
  );
}
