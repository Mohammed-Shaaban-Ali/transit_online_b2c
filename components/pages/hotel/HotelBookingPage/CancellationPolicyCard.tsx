"use client";

import { FaRegClock } from "react-icons/fa";
import { useTranslations, useLocale } from "next-intl";
import CurrencySymbol from "@/components/shared/PriceCell/CurrencySymbol";
import { formatePrice } from "@/utils/formatePrice";

interface CancellationPolicyCardProps {
  checkIn: string;
  cancellationFee: number;
  refundableUntilTime?: string;
}

const formatDateLong = (date: Date, locale: string) => {
  return date.toLocaleDateString(locale === "ar" ? "ar" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const CancellationPolicyCard = ({
  checkIn,
  cancellationFee,
  refundableUntilTime = "23:59",
}: CancellationPolicyCardProps) => {
  const t = useTranslations("HotelBooking");
  const locale = useLocale();

  // Free cancellation deadline = the day before check-in
  const checkInDate = new Date(checkIn);
  const refundableUntil = new Date(checkInDate);
  refundableUntil.setDate(refundableUntil.getDate() - 1);

  const formattedDeadline = !isNaN(refundableUntil.getTime())
    ? `${refundableUntilTime}, ${formatDateLong(refundableUntil, locale)}`
    : refundableUntilTime;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4">
        {/* Title */}
        <h3 className="text-20 font-bold mb-4">{t("cancellationPolicy")}</h3>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line connecting the two stages */}
          <div className="absolute start-[7px] top-5 bottom-5 w-px bg-gray-300" />

          {/* Stage 1: Free cancellation */}
          <div className="relative flex items-start gap-3 mb-4">
            <FaRegClock
              size={15}
              className="text-teal-600 shrink-0 mt-1 bg-white z-10"
            />
            <div className="flex-1">
              <h4 className="text-teal-600 font-bold text-base leading-tight">
                {t("freeCancellation")}
              </h4>
              <p className="text-gray-600 text-14 mt-1">
                {t("before")} {formattedDeadline}
              </p>
            </div>
          </div>

          {/* Stage 2: Cancellation fee */}
          <div className="relative flex items-start gap-3">
            <div className="shrink-0 w-[15px] h-[20px] flex items-center justify-center bg-white z-10">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-gray-900 font-bold text-base leading-tight">
                <span>{t("cancellationFee")}: </span>
                <span className="inline-flex items-center gap-1 rtl:flex-row-reverse">
                  <CurrencySymbol size="md" />
                  {formatePrice(cancellationFee)}
                </span>
              </h4>
              <p className="text-gray-600 text-base mt-1">
                {t("after")} {formattedDeadline}
              </p>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-5 space-y-2 text-base text-gray-600 leading-relaxed">
          <p>* {t("cancellationNote1")}</p>
          <p>* {t("cancellationNote2")}</p>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicyCard;
