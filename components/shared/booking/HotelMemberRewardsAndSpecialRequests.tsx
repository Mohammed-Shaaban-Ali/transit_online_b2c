"use client";

import { useState } from "react";
import { Check, ChevronDown, Info } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HotelMemberRewardsAndSpecialRequestsProps {
  checkIn: string;
  refundableText?: string;
  /** When true, show the free-cancellation perk using API or computed copy */
  showFreeCancellation?: boolean;
  cancellationDeadlineTime?: string;
}

const formatDateLong = (date: Date, locale: string) => {
  return date.toLocaleDateString(locale === "ar" ? "ar" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function HotelMemberRewardsAndSpecialRequests({
  checkIn,
  refundableText,
  showFreeCancellation = true,
  cancellationDeadlineTime = "23:59",
}: HotelMemberRewardsAndSpecialRequestsProps) {
  const t = useTranslations("HotelBooking");
  const locale = useLocale();

  const [elevatorPreference, setElevatorPreference] = useState<
    "away" | "near" | ""
  >("");
  const [otherRequestsOpen, setOtherRequestsOpen] = useState(false);
  const [otherRequestsText, setOtherRequestsText] = useState("");

  const checkInDate = new Date(checkIn);
  const refundableUntil = new Date(checkInDate);
  refundableUntil.setDate(refundableUntil.getDate() - 1);

  const formattedDeadline =
    !isNaN(refundableUntil.getTime()) && showFreeCancellation
      ? formatDateLong(refundableUntil, locale)
      : "";

  const freeCancellationSubtext =
    refundableText?.trim() ||
    (formattedDeadline
      ? t("freeCancellationMemberNote", {
          time: cancellationDeadlineTime,
          date: formattedDeadline,
        })
      : "");

  return (
    <div className="space-y-6">
      {/* Member Rewards */}
      <div className="rounded-lg  bg-white pt-4">
        <div className="mb-4 flex items-start gap-3">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center">
            <svg
              viewBox="0 0 36 36"
              className="absolute inset-0 h-9 w-9 text-primary"
              aria-hidden
            >
              <path fill="currentColor" d="M18 2l14 8v16l-14 8-14-8V10l14-8z" />
            </svg>
            <span className="relative z-10 text-[13px] font-bold text-white">
              T
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-18 font-bold text-slate-900">
                {t("memberRewards")}
              </h3>
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="rounded-full p-0.5 text-slate-400 outline-none transition hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/30"
                      aria-label={t("memberRewardsInfoAria")}
                    >
                      <Info className="h-4 w-4" strokeWidth={1.75} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    {t("memberRewardsInfo")}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        <ul className="space-y-4">
          {showFreeCancellation && freeCancellationSubtext ? (
            <li className="flex gap-3">
              <Check
                className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                strokeWidth={2.5}
              />
              <div>
                <p className="text-16 font-bold text-primary">
                  {t("freeCancellation")}
                </p>
                <p className="mt-1 text-14 text-slate-800">
                  {freeCancellationSubtext}
                </p>
              </div>
            </li>
          ) : null}
          <li className="flex gap-3">
            <Check
              className="mt-0.5 h-5 w-5 shrink-0 text-primary"
              strokeWidth={2.5}
            />
            <div>
              <p className="text-16 font-bold text-primary">
                {t("lateCheckoutTitle")}
              </p>
              <p className="mt-1 text-14 text-slate-800">
                {t("lateCheckoutDescription")}
              </p>
            </div>
          </li>
        </ul>
      </div>

      {/* Special Requests */}
      <div className="rounded-lg   bg-white pt-4">
        <h3 className="text-22 font-bold text-slate-900">
          {t("specialRequests")}{" "}
          <span className="text-16 font-normal text-gray-500">
            {t("optional")}
          </span>
        </h3>
        <p className="mt-2 text-14 text-slate-800">
          {t("specialRequestsDisclaimer")}
        </p>

        <div className="mt-6">
          <p className="text-15 font-bold text-slate-900">
            {t("elevatorProximity")}
          </p>
          <div className="mt-3 flex flex-wrap gap-6">
            <label className="flex cursor-pointer items-center gap-2 text-14 text-slate-800">
              <input
                type="radio"
                name="elevator-proximity"
                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                checked={elevatorPreference === "away"}
                onChange={() => setElevatorPreference("away")}
              />
              {t("awayFromElevator")}
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-14 text-slate-800">
              <input
                type="radio"
                name="elevator-proximity"
                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                checked={elevatorPreference === "near"}
                onChange={() => setElevatorPreference("near")}
              />
              {t("nearElevator")}
            </label>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-100 pt-5">
          <button
            type="button"
            onClick={() => setOtherRequestsOpen((v) => !v)}
            className="flex w-full items-center justify-between text-start"
          >
            <span className="text-15 font-bold text-slate-900">
              {t("otherRequests")}
            </span>
            <ChevronDown
              className={`h-5 w-5 shrink-0 text-slate-600 transition-transform ${
                otherRequestsOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {otherRequestsOpen ? (
            <textarea
              value={otherRequestsText}
              onChange={(e) => setOtherRequestsText(e.target.value)}
              placeholder={t("otherRequestsPlaceholder")}
              rows={4}
              className="mt-3 w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-14 text-slate-900 outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
