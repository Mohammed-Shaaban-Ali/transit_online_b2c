"use client";

import { use } from "react";
import NewNavbar from "@/components/shared/Navbar/NewNavbar";
import { useGetHotelBookingQuery } from "@/redux/features/hotels/hotelsApi";
import HotelBookingOutcomePanel from "@/components/pages/hotel/HotelBookingPage/HotelBookingOutcomePanel";
import HotelDetailsCard from "@/components/pages/hotel/HotelBookingPage/HotelDetailsCard";
import DatesCard from "@/components/pages/hotel/HotelBookingPage/DatesCard";
import PriceDetailsCard from "@/components/pages/hotel/HotelBookingPage/PriceDetailsCard";
import CancellationPolicyCard from "@/components/pages/hotel/HotelBookingPage/CancellationPolicyCard";
import type { BookingFormValues } from "@/components/shared/booking/HotelBookingForm";
import { FaHotel } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

type Props = {
  params: Promise<{ id: string }>;
};

export default function HotelBookingDetailPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const t = useTranslations("HotelBooking");

  const { data, isLoading, isError } = useGetHotelBookingQuery(id);

  if (isLoading) {
    return (
      <section className="min-h-screen bg-[#f0f2f5]">
        <NewNavbar isBgWhite />
        <div className="container my-28 max-w-[1200px]! mx-auto">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="h-48 animate-pulse rounded-2xl bg-gray-200 lg:col-span-2" />
            <div className="space-y-4 lg:col-span-1">
              <div className="h-56 animate-pulse rounded-2xl bg-gray-200" />
              <div className="h-32 animate-pulse rounded-2xl bg-gray-200" />
              <div className="h-40 animate-pulse rounded-2xl bg-gray-200" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !data?.data) {
    return (
      <section className="min-h-screen bg-[#f0f2f5]">
        <NewNavbar isBgWhite />
        <div className="container my-28 max-w-[1200px]! mx-auto flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <FaHotel className="text-4xl text-gray-300" />
          </div>
          <h2 className="text-24 mb-2 font-bold">{t("noHotelData")}</h2>
          <p className="mx-auto mb-8 max-w-md text-gray-400">
            {t("noHotelDataDescription")}
          </p>
          <Button onClick={() => router.push("/my-booking")} className="h-12 rounded-full px-8">
            Back to My Bookings
          </Button>
        </div>
      </section>
    );
  }

  const booking = data.data;
  const pkg = booking.package;
  const firstRoom = pkg?.rooms?.[0];
  const checkIn: string = booking.search_data?.checkIn ?? "";
  const checkOut: string = booking.search_data?.checkOut ?? "";
  const nights =
    pkg?.nights ||
    (checkIn && checkOut
      ? Math.round(
          (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 1);
  const adults: number = booking.adults ?? 1;
  const hotelImage: string | undefined = booking.hotel_content?.images?.[0];
  const finalPrice = Number(pkg?.price?.finalPrice ?? booking.amount ?? 0);
  const cancellationFee = finalPrice * 0.25;
  const roomsCount = pkg?.rooms?.length ?? 1;

  const isSuccess =
    booking.payment_status === "paid" || booking.status === "confirmed";
  const outcome: "success" | "failed" = isSuccess ? "success" : "failed";

  const passenger = booking.passengers?.[0];
  const formData: BookingFormValues = {
    email: booking.customer_email ?? "",
    phone: booking.customer_mobile ?? "",
    phoneCountryCode: "",
    guests: (booking.passengers ?? []).map((p: any) => ({
      firstName: p.PersonDetails?.Name?.GivenName ?? "",
      lastName: p.PersonDetails?.Name?.Surname ?? "",
      type: p.PersonDetails?.Type === 1 ? ("child" as const) : ("adult" as const),
    })),
  };

  return (
    <section className="min-h-screen bg-[#f0f2f5]">
      <NewNavbar isBgWhite />
      <div className="container my-28 max-w-[1200px]! mx-auto">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <HotelBookingOutcomePanel
              outcome={outcome}
              bookingId={String(booking.id)}
              formData={formData}
              hotelId={String(booking.hotel_id)}
              uuid={String(booking.id)}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="space-y-4 lg:sticky lg:top-12">
              <HotelDetailsCard
                hotelName={booking.hotel_name ?? ""}
                hotelImage={hotelImage}
                starRating={0}
                firstRoom={firstRoom}
                adultsCount={adults}
                refundability={pkg?.refundability}
                refundableText={pkg?.refundableText ?? undefined}
              />

              {checkIn && checkOut && (
                <DatesCard
                  checkIn={checkIn}
                  checkOut={checkOut}
                  nights={nights}
                  roomsCount={roomsCount}
                />
              )}

              <PriceDetailsCard
                roomsCount={roomsCount}
                nights={nights}
                fallbackTotal={finalPrice}
              />

              {checkIn && (
                <CancellationPolicyCard
                  checkIn={checkIn}
                  cancellationFee={cancellationFee}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
