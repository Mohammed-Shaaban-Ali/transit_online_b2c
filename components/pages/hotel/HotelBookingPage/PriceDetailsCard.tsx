"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { formatePrice } from "@/utils/formatePrice";
import type { LoyaltyCalculatePriceResponse } from "@/redux/features/flights/flightsApi";

interface PriceDetailsCardProps {
  roomsCount: number;
  nights: number;
  /** Full `data` object from the loyalty calculate-price response */
  calculatedData?: LoyaltyCalculatePriceResponse["data"];
  isCalculating?: boolean;
  /** Fallback total shown before the API responds */
  fallbackTotal?: number;
}

const PriceDetailsCard = ({
  roomsCount,
  nights,
  calculatedData,
  isCalculating = false,
  fallbackTotal = 0,
}: PriceDetailsCardProps) => {
  const t = useTranslations("HotelBooking");
  const tHotelsCard = useTranslations("HotelsCard");

  const currency = calculatedData?.currency ?? "";
  const total = calculatedData?.total?.value ?? fallbackTotal;
  const payments = calculatedData?.payments ?? [];

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4">
        {/* Title */}
        <h3 className="text-20 font-bold mb-4">{t("priceDetails")}</h3>

        {/* Room × Nights */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="text-14 text-gray-800">
            {roomsCount} {roomsCount === 1 ? t("room") : t("rooms")} ×{" "}
            {nights} {nights === 1 ? tHotelsCard("night") : tHotelsCard("nights")}
          </span>
        </div>

        {/* Payments breakdown from API */}
        {isCalculating ? (
          <div className="space-y-2 my-3">
            <div className="h-5 w-full rounded bg-gray-200 animate-pulse" />
            <div className="h-5 w-4/5 rounded bg-gray-200 animate-pulse" />
          </div>
        ) : (
          payments.length > 0 && (
            <div className="border-s-2 border-gray-200 ps-3 my-2 space-y-2 text-14 text-gray-600">
              {payments.map((item, idx) => {
                const isDiscount = item.type === "COUPON";
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2"
                  >
                    <span>{item.label}</span>
                    <span
                      className={`shrink-0 inline-flex items-center gap-1 rtl:flex-row-reverse ${
                        isDiscount ? "text-teal-600" : ""
                      }`}
                    >
                      {isDiscount && <span>-</span>}
                      <span>{currency}</span>
                      <span>{formatePrice(item.value)}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* Dashed divider */}
        <div className="border-t border-dashed border-gray-300 my-3" />

        {/* Total */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-24 font-bold">{t("total")}</span>
          {isCalculating ? (
            <div className="h-8 w-32 rounded-lg bg-gray-200 animate-pulse" />
          ) : (
            <span className="inline-flex items-center gap-1 text-24 font-bold rtl:flex-row-reverse">
              <span className="text-16 font-semibold">{currency}</span>
              <span>{formatePrice(total)}</span>
            </span>
          )}
        </div>

        {/* We Price Match */}
        <a
          href="#"
          className="mt-4 inline-flex items-center gap-2 text-14 text-gray-800 hover:text-teal-700 transition-colors"
        >
          <Image
            src="https://dimg04.tripcdn.com/images/1re3u12000nzm6m3018B9.png"
            alt="Price Match"
            width={20}
            height={20}
            className="shrink-0"
          />
          <span className="text-base text-primary underline underline-offset-2">
            {t("wePriceMatch")}
          </span>
        </a>
      </div>
    </div>
  );
};

export default PriceDetailsCard;
