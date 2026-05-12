"use client";

import { Plane } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatePrice } from "@/utils/formatePrice";
import CurrencySymbol from "@/components/shared/PriceCell/CurrencySymbol";
import { useRouter } from "@/i18n/navigation";

interface FlightBookingCardProps {
  booking: any;
}

const statusMap: Record<string, { text: string; className: string }> = {
  ticketed: { text: "Ticketed", className: "bg-green-100 text-green-800" },
  pending: { text: "Pending", className: "bg-yellow-100 text-yellow-800" },
  cancelled: { text: "Cancelled", className: "bg-red-100 text-red-800" },
};

export function FlightBookingCardSkeleton() {
  return (
    <div className="rounded-md bg-white overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 rounded-full bg-gray-200 animate-pulse" />
          <div className="h-4 w-48 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-px bg-gray-200" />
          <div className="h-4 w-36 rounded bg-gray-200 animate-pulse" />
        </div>
        <div className="h-6 w-20 rounded bg-gray-200 animate-pulse" />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-64 rounded bg-gray-200 animate-pulse" />
          <div className="h-6 w-24 rounded bg-gray-200 animate-pulse" />
        </div>
        <div className="bg-gray-50 rounded-lg p-4 flex flex-wrap items-center gap-6">
          <div className="space-y-1.5">
            <div className="h-5 w-16 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-200 animate-pulse" />
            <div className="w-16 h-px bg-gray-200" />
            <div className="w-2 h-2 rounded-full bg-gray-200 animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <div className="h-5 w-16 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
          </div>
          <div className="space-y-1.5 ml-auto">
            <div className="h-5 w-32 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FlightBookingCard({ booking }: FlightBookingCardProps) {
  const t = useTranslations("MyBooking");
  const router = useRouter();

  const statusInfo = statusMap[booking.status] ?? {
    text: booking.status,
    className: "bg-gray-100 text-gray-800",
  };

  const departureFlight = booking.offer_details?.departure_flight;
  const firstLeg = departureFlight?.legs?.[0];
  const lastLeg = departureFlight?.legs?.[departureFlight.legs.length - 1];

  return (
    <div
      onClick={() => router.push(`/my-booking/${booking.booking_number}`)}
      className="rounded-md bg-white p-5 md:p-7 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <Plane className="w-5 h-5 text-gray-600" />
            <span className="text-16 font-semibold text-gray-900">
              {t("bookingNumber")} {booking.booking_number}
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-14 text-gray-500">
              {t("bookingDate")}: {new Date().toLocaleDateString()}
            </span>
          </div>
          <span className={`px-3 py-1 rounded text-sm font-medium ${statusInfo.className}`}>
            {statusInfo.text}
          </span>
        </div>

        {/* Body */}
        {firstLeg && lastLeg && (
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h3 className="text-20 font-bold text-gray-700">
                {firstLeg.departure_info?.city_name} ({firstLeg.departure_info?.airport_code}) →{" "}
                {lastLeg.arrival_info?.city_name} ({lastLeg.arrival_info?.airport_code})
              </h3>
              {booking.offer_details?.fare_detail?.price_info && (
                <p className="text-20 font-bold text-gray-600">
                  <CurrencySymbol />
                  {formatePrice(booking.offer_details.fare_detail.price_info.total_fare)}
                </p>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 flex flex-wrap items-center gap-4">
              <div>
                <p className="text-xl font-semibold text-gray-800">
                  {new Date(firstLeg.departure_info?.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(firstLeg.departure_info?.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-2 h-2 rounded-full bg-gray-400" />
                <div className="w-12 border-t border-dashed border-gray-400" />
                <div className="w-2 h-2 rounded-full bg-gray-400" />
              </div>

              <div>
                <p className="text-xl font-semibold text-gray-800">
                  {new Date(lastLeg.arrival_info?.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(lastLeg.arrival_info?.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div>
                <p className="text-lg font-semibold text-gray-700">
                  {firstLeg.airline_info?.carrier_name} {firstLeg.flight_number}
                </p>
                <p className="text-sm text-gray-500">{firstLeg.airline_info?.carrier_name}</p>
              </div>

              <div className="ml-auto">
                <p className="text-lg font-semibold text-gray-700">
                  {booking.passengers?.[0]?.name} {booking.passengers?.[0]?.lastName}
                </p>
                <p className="text-sm text-gray-500">
                  {booking.passengers?.length || 0} {t("passengers")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
