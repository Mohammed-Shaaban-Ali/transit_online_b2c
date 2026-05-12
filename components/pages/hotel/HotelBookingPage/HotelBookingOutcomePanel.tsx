"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import type { BookingFormValues } from "@/components/shared/booking/HotelBookingForm";
import { FaChild } from "react-icons/fa";
import { hotelBookingBasePath } from "./hotelBookingPaths";

interface HotelBookingOutcomePanelProps {
  outcome: "success" | "failed";
  bookingId: string | null;
  formData: BookingFormValues | null;
  hotelId: string;
  uuid: string;
}

export default function HotelBookingOutcomePanel({
  outcome,
  bookingId,
  formData,
  hotelId,
  uuid,
}: HotelBookingOutcomePanelProps) {
  const t = useTranslations("HotelBooking");
  const tForm = useTranslations("BookingForm");
  const router = useRouter();

  const basePath = hotelBookingBasePath(hotelId, uuid);
  const isSuccess = outcome === "success";

  return (
    <div className="flex flex-col gap-6">
      <div
        className={`rounded-xl border p-6 ${
          isSuccess
            ? "border-emerald-200 bg-emerald-50/60"
            : "border-red-200 bg-red-50/60"
        }`}
      >
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-start">
          {isSuccess ? (
            <CheckCircle2
              className="h-14 w-14 shrink-0 text-emerald-600"
              strokeWidth={1.75}
              aria-hidden
            />
          ) : (
            <XCircle
              className="h-14 w-14 shrink-0 text-red-600"
              strokeWidth={1.75}
              aria-hidden
            />
          )}
          <div className="min-w-0 flex-1 space-y-2">
            <h1 className="text-24 font-bold text-slate-900">
              {isSuccess ? t("outcomeSuccessTitle") : t("outcomeFailedTitle")}
            </h1>
            <p className="text-15 leading-relaxed text-slate-700">
              {isSuccess
                ? t("outcomeSuccessDescription")
                : t("outcomeFailedDescription")}
            </p>
            {isSuccess && bookingId ? (
              <p className="text-14 font-semibold text-slate-800">
                <span className="text-slate-600">
                  {t("bookingReference")}:{" "}
                </span>
                {bookingId}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {formData ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-18 font-bold text-slate-900">
            {t("travelersAndContact")}
          </h2>

          <div className="mt-4 space-y-3 rounded-lg border border-gray-100 bg-gray-50/80 p-4 text-14">
            <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:gap-x-6">
              <span className="font-semibold text-slate-700">
                {tForm("email")}
              </span>
              <span className="text-slate-900">{formData.email}</span>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:gap-x-6">
              <span className="font-semibold text-slate-700">
                {tForm("phoneNumber")}
              </span>
              <span className="text-slate-900 [direction:ltr]">
                {formData.phone}
              </span>
            </div>
          </div>

          <ul className="mt-4 space-y-3">
            {(() => {
              let adultIdx = 0;
              let childIdx = 0;
              return formData.guests.map((guest, index) => {
                const n = guest.type === "adult" ? ++adultIdx : ++childIdx;
                return (
                  <li
                    key={`${guest.firstName}-${guest.lastName}-${index}`}
                    className="flex flex-wrap items-baseline gap-2 rounded-lg border border-gray-100 px-4 py-3 text-14"
                  >
                    {guest.type === "child" ? (
                      <FaChild
                        className="mt-0.5 shrink-0 text-orange-500"
                        size={14}
                      />
                    ) : null}
                    <span className="font-semibold text-slate-600">
                      {guest.type === "adult" ? tForm("adult") : tForm("child")}{" "}
                      {n}:
                    </span>
                    <span className="font-medium text-slate-900">
                      {guest.firstName} {guest.lastName}
                    </span>
                  </li>
                );
              });
            })()}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
