"use client";

import { Ship } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { formatePrice } from "@/utils/formatePrice";
import type { AppCruiseBooking } from "@/types/appBookingsTypes";
import VoucherButton from "./VoucherButton";
import CurrencySymbol from "@/components/shared/PriceCell/CurrencySymbol";
import { getBookingConfirmationNumber } from "@/utils/getBookingConfirmationNumber";
import BookingStatusLabel from "./BookingStatusLabel";
import SupportButton from "./SupportButton";
import BookingCardActions from "./BookingCardActions";
import {
  formatBookingDate,
  getBookingCreatedAt,
} from "@/utils/formatBookingDate";

interface CruiseBookingCardProps {
  booking: AppCruiseBooking;
}

function formatDate(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function CruiseBookingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-md bg-white">
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-3">
        <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="space-y-3 p-5">
        <div className="h-5 w-64 animate-pulse rounded bg-gray-200" />
        <div className="h-16 w-full animate-pulse rounded-lg bg-gray-100" />
      </div>
    </div>
  );
}

export default function CruiseBookingCard({ booking }: CruiseBookingCardProps) {
  const t = useTranslations("MyBooking");
  const locale = useLocale();

  const sailing =
    booking.voyageData?.sailingInfo?.selectedSailing?.attributesMap;
  const cabin = booking.cabinData?.cabins?.[0];
  const guest = booking.cabinData?.guests?.[0];

  const startDate = formatDate(sailing?.start);
  const endDate = formatDate(sailing?.end);
  const travelDates =
    startDate && endDate ? `${startDate} – ${endDate}` : startDate;
  const confirmationNumber = getBookingConfirmationNumber(booking);
  const createdAtLabel = formatBookingDate(
    getBookingCreatedAt(booking),
    locale,
  );

  return (
    <div className="overflow-hidden rounded-md bg-white transition-shadow hover:shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-5 py-3">
        <div className="flex flex-wrap items-center gap-2 text-14 text-gray-600">
          <Ship className="h-4 w-4 shrink-0" />
          <span className="font-semibold text-gray-900">
            {t("confirmationCode")} {confirmationNumber}
          </span>
          {createdAtLabel && (
            <>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500">
                {t("bookingDate")}: {createdAtLabel}
              </span>
            </>
          )}
          {travelDates && (
            <>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500">
                {t("travelDate")}: {travelDates}
              </span>
            </>
          )}
        </div>
        <BookingCardActions>
          <SupportButton bookingType="cruise" booking={booking} />
          <VoucherButton voucherUrl={booking.voucher} />
          <BookingStatusLabel booking={booking} />
        </BookingCardActions>
      </div>

      <div className="p-5">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="text-16 font-bold text-gray-900">
              {sailing?.shipName ?? t("sidebar.tabs.cruises")}
            </h3>
            {cabin && (
              <p className="mt-0.5 text-14 text-gray-500">
                {cabin.category}
                {cabin.number ? ` · ${cabin.number}` : ""}
              </p>
            )}
          </div>
          <p
            className="inline-flex shrink-0 items-center gap-1 text-16 font-bold text-gray-700"
            dir="ltr"
          >
            <CurrencySymbol size="sm" />
            {formatePrice(Number(booking.finalPrice))}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 rounded-lg bg-gray-50 p-4 text-14 text-gray-600">
          {sailing?.duration && (
            <p className="font-medium text-gray-800">
              {sailing.duration} {t("nights")}
            </p>
          )}
          {guest && (
            <p className="font-semibold uppercase tracking-wide text-gray-800">
              {guest.firstName} {guest.lastName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
