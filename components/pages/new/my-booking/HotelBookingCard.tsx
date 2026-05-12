"use client";

import { BedDouble } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatePrice } from "@/utils/formatePrice";
import { useRouter } from "@/i18n/navigation";

interface HotelBookingCardProps {
  booking: any;
}

const statusMap: Record<string, { text: string; className: string }> = {
  confirmed: { text: "Confirmed", className: "text-green-600" },
  paid: { text: "Confirmed", className: "text-green-600" },
  pending: { text: "Pending", className: "text-yellow-600" },
  cancelled: { text: "Canceled", className: "text-red-500" },
  canceled: { text: "Canceled", className: "text-red-500" },
  failed: { text: "Failed", className: "text-red-500" },
};

export function HotelBookingCardSkeleton() {
  return (
    <div className="rounded-md bg-white overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-44 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-px bg-gray-200" />
          <div className="h-4 w-36 rounded bg-gray-200 animate-pulse" />
        </div>
        <div className="h-4 w-16 rounded bg-gray-200 animate-pulse" />
      </div>
      <div className="p-5 flex items-start gap-4">
        <div className="h-24 w-24 shrink-0 rounded-md bg-gray-200 animate-pulse" />
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="h-5 w-56 rounded bg-gray-200 animate-pulse" />
            <div className="h-5 w-20 rounded bg-gray-200 animate-pulse" />
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="space-y-1.5">
              <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-16 rounded bg-gray-200 animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <div className="h-4 w-40 rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-48 rounded bg-gray-200 animate-pulse" />
            </div>
            <div className="h-4 w-28 rounded bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HotelBookingCard({ booking }: HotelBookingCardProps) {
  const t = useTranslations("MyBooking");
  const router = useRouter();

  const statusInfo =
    statusMap[booking.payment_status?.toLowerCase()] ??
    statusMap[booking.status?.toLowerCase()] ?? {
      text: booking.status ?? "",
      className: "text-gray-500",
    };

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
  const hotelImage: string | undefined = booking.hotel_content?.images?.[0];

  const roomFacilities = firstRoom?.descriptions?.[0]
    ? (() => {
        const text = (firstRoom.descriptions[0] as string).replace(/<[^>]+>/g, " ");
        const matches = text.match(/(?:Free WiFi|Breakfast|Airport|Luggage|Parking)[^,<]*/gi);
        return matches?.slice(0, 3).join(", ") ?? "";
      })()
    : "";

  const formattedCheckIn = checkIn
    ? new Date(checkIn).toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : "";
  const formattedCheckOut = checkOut
    ? new Date(checkOut).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div
      onClick={() => router.push(`/my-booking/hotel/${booking.id}`)}
      className="rounded-md bg-white cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-5 py-3">
        <div className="flex items-center gap-2 text-14 text-gray-600">
          <BedDouble className="w-4 h-4 shrink-0" />
          <span className="font-semibold text-gray-900">
            {t("bookingNumber")} {booking.id}
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">
            {t("bookingDate")}:{" "}
            {new Date().toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
        <span className={`text-14 font-semibold ${statusInfo.className}`}>
          {statusInfo.text}
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          {hotelImage && (
            <img
              src={hotelImage}
              alt={booking.hotel_name}
              className="h-24 w-24 shrink-0 rounded-md object-cover"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <h3 className="text-16 font-bold text-gray-900 leading-snug">
                {booking.hotel_name}
              </h3>
              <p className="text-16 font-bold text-gray-700 shrink-0">
                {booking.currency} {formatePrice(Number(booking.amount))}
              </p>
            </div>

            <div className="flex flex-wrap items-start gap-6 text-14 text-gray-600">
              {checkIn && checkOut && (
                <div>
                  <p className="font-medium text-gray-800">
                    {formattedCheckIn} – {formattedCheckOut}
                  </p>
                  <p className="text-gray-500">
                    {nights} {nights === 1 ? "night" : "nights"}
                  </p>
                </div>
              )}
              {firstRoom && (
                <div className="max-w-[220px]">
                  <p className="font-medium text-gray-800 leading-snug">
                    {firstRoom.roomName}
                  </p>
                  {roomFacilities && (
                    <p className="text-gray-500 truncate">{roomFacilities}...</p>
                  )}
                </div>
              )}
              {booking.customer_name && (
                <p className="font-semibold text-gray-800 uppercase tracking-wide">
                  {booking.customer_name}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
