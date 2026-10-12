"use client";

import { useTranslations } from "next-intl";
import { normalizeBookingStatus } from "@/utils/bookingStatusFilter";

const STATUS_STYLES: Record<string, string> = {
  confirmed: "text-green-600",
  paid: "text-green-600",
  ticketed: "text-green-600",
  finished: "text-green-600",
  pending: "text-yellow-600",
  upcoming: "text-blue-600",
  awaiting: "text-yellow-600",
  unpaid: "text-yellow-600",
  processing: "text-yellow-600",
  cancelled: "text-red-500",
  canceled: "text-red-500",
  failed: "text-red-500",
};

type BookingStatusLabelProps = {
  booking: {
    status?: string;
    booking_status?: string;
    payment_status?: string;
    finished?: boolean;
    payment?: { status?: string };
  };
};

export default function BookingStatusLabel({ booking }: BookingStatusLabelProps) {
  const t = useTranslations("MyBooking");
  const { status } = normalizeBookingStatus(booking);

  if (!status) return null;

  const statusClassName = STATUS_STYLES[status] ?? "text-gray-500";
  const statusLabel = t.has(`status.${status}` as never)
    ? t(`status.${status}` as never)
    : status;

  return (
    <span className="text-13 text-gray-400">
      {t("bookingStatus")}:{" "}
      <span className={`font-semibold ${statusClassName}`}>{statusLabel}</span>
    </span>
  );
}
