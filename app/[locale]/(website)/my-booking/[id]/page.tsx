"use client";

import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import AddOIns from "@/components/pages/new/booking/details/AddOIns";
import ContactInformation from "@/components/pages/new/booking/details/ContactInformation";
import FlightDetails from "@/components/pages/new/booking/details/FlightDetails";
import CustomerSupport from "@/components/pages/new/booking/details/CustomerSupport";
import FeaturedProperties from "@/components/pages/new/booking/details/FeaturedProperties";
import PassengerInformation from "@/components/pages/new/booking/details/PassengerInformation";
import NewNavbar from "@/components/shared/Navbar/NewNavbar";
import Payment from "@/components/pages/new/booking/details/Payment";
import { useGetFlightBookingQuery } from "@/redux/features/flights/flightsApi";
import { formatePrice } from "@/utils/formatePrice";
import CurrencySymbol from "@/components/shared/PriceCell/CurrencySymbol";
import { useLocale } from "next-intl";

export default function Page() {
  const params = useParams();
  const locale = useLocale();
  const bookingId = params.id as string;

  const { data: bookingDetailData, isLoading } =
    useGetFlightBookingQuery(bookingId);
  const booking = bookingDetailData?.data;

  const totalAmount = useMemo(
    () =>
      Number(booking?.offer_details?.fare_detail?.price_info?.total_fare || 0),
    [booking],
  );

  const currencySymbol = useMemo(() => {
    const currency = String(
      booking?.offer_details?.fare_detail?.currency_code || "US$",
    ).toUpperCase();
    return currency === "USD" ? "US$" : `${currency} `;
  }, [booking]);

  const passengerCount = useMemo(() => {
    return booking?.passengers?.length || 0;
  }, [booking]);

  const bookingTimestamp = useMemo(
    () =>
      new Date().toLocaleString(locale === "ar" ? "ar-EG" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    [locale],
  );

  const transformBookingToFlightDirection = (flightData: any) => {
    if (!flightData) return null;
    return {
      legs: flightData.legs || [],
    } as any;
  };

  if (isLoading) {
    return (
      <section className="relative flex min-h-screen flex-col text-sm md:bg-primary md:text-base">
        <div className="md:h-[76px] md:bg-transparent h-[108px] bg-primary">
          <NewNavbar />
        </div>
        <section className="relative z-0 min-h-screen rounded-t-2xl md:rounded-t-[32px] bg-[#f7f7f7] py-6 md:py-12">
          <div className="mx-auto w-full max-w-[1200px]! px-3 sm:px-5 md:px-0">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-500 text-lg">
                Loading booking details...
              </p>
            </div>
          </div>
        </section>
      </section>
    );
  }

  if (!booking) {
    return (
      <section className="relative flex min-h-screen flex-col text-sm md:bg-primary md:text-base">
        <div className="md:h-[76px] md:bg-transparent h-[108px] bg-primary">
          <NewNavbar />
        </div>
        <section className="relative z-0 min-h-screen rounded-t-2xl md:rounded-t-[32px] bg-[#f7f7f7] py-6 md:py-12">
          <div className="mx-auto w-full max-w-[1200px]! px-3 sm:px-5 md:px-0">
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">Booking not found</p>
            </div>
          </div>
        </section>
      </section>
    );
  }

  const status = booking.status === "ticketed" ? "success" : "failed";

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 relative z-10">
            <div className="lg:col-span-2 space-y-2.5">
              <Payment
                status={status}
                totalAmount={totalAmount}
                currency={currencySymbol}
              />
              <FlightDetails
                departureFlightData={transformBookingToFlightDirection(
                  booking.offer_details?.departure_flight,
                )}
                returnFlightData={transformBookingToFlightDirection(
                  booking.offer_details?.return_flight,
                )}
              />
              <AddOIns />
              <PassengerInformation
                formData={
                  {
                    passengers:
                      booking.passengers?.map((p: any) => ({
                        firstName: p.name || "",
                        lastName: p.lastName || "",
                        dateOfBirth: p.birthDate || "",
                        gender: p.gender || "male",
                        passportNumber: p.identityInfo?.passport?.no || "",
                        nationality:
                          p.identityInfo?.passport?.citizenshipCountry || "",
                        passportExpiry: p.identityInfo?.passport?.endDate || "",
                        type: p.type?.toLowerCase() || "adult",
                      })) || [],
                  } as any
                }
              />
              <ContactInformation
                formData={
                  {
                    fullName: booking.contact_info?.name || "",
                    email: booking.contact_info?.email || "",
                    phone: booking.contact_info?.phone || "",
                  } as any
                }
              />
              <CustomerSupport />
              <FeaturedProperties />
            </div>

            <aside className="lg:col-span-1 lg:self-start lg:sticky lg:top-6 lg:z-20">
              <section className="rounded bg-white p-6">
                <div className="flex items-center justify-between border-b border-dashed border-gray-300 pb-5">
                  <h3 className="text-22 font-bold leading-none ">
                    Total Amount
                  </h3>
                  <p className="text-22 font-bold leading-none text-primary">
                    <CurrencySymbol />
                    {formatePrice(totalAmount)}
                  </p>
                </div>

                <div className="space-y-2 pt-5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-20 font-bold leading-none ">
                      Booking total
                    </h4>
                    <p className="text-20 font-bold leading-none ">
                      <CurrencySymbol />
                      {formatePrice(totalAmount)}
                    </p>
                  </div>

                  <p className="text-14 font-normal leading-tight text-gray-500">
                    {bookingTimestamp}
                  </p>

                  <div className="space-y-3 bg-gray-100 p-4 mt-2 rounded text-gray-500 text-14">
                    <div className="flex items-center justify-between">
                      <span className="font-normal">Adults</span>
                      <span className="font-medium">
                        <CurrencySymbol />
                        {formatePrice(totalAmount)} × {passengerCount}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-normal">Ticket fare</span>
                      <span className="font-medium">
                        <CurrencySymbol />
                        {formatePrice(
                          Math.max(
                            totalAmount -
                              Number(
                                booking.offer_details?.fare_detail?.price_info
                                  ?.tax || 0,
                              ),
                            0,
                          ),
                        )}{" "}
                        × 1
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-normal">Taxes & fees</span>
                      <span className="font-medium">
                        <CurrencySymbol />
                        {formatePrice(
                          Number(
                            booking.offer_details?.fare_detail?.price_info
                              ?.tax || 0,
                          ),
                        )}{" "}
                        × 1
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
