"use client";

import { useMemo, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { PiCoinsBold } from "react-icons/pi";
import { useTranslations } from "next-intl";

type PriceDetailsCardProps = {
  adults?: number;
  children?: number;
  infants?: number;
  buyPrice?: number;
};

const PRICE_FALLBACK = 258;
const PASSENGER_FALLBACK = 1;
const TRIP_COINS = 52;

const formatUsdPrice = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const PriceDetailsCard = ({
  adults,
  children,
  infants,
  buyPrice,
}: PriceDetailsCardProps) => {
  const t = useTranslations("FlightBookingPageNested.priceDetails");
  const [isTicketsOpen, setIsTicketsOpen] = useState(false);

  const totalPassengers = useMemo(() => {
    const rawTotal = (adults ?? 0) + (children ?? 0) + (infants ?? 0);
    return rawTotal > 0 ? rawTotal : PASSENGER_FALLBACK;
  }, [adults, children, infants]);

  const totalPrice = buyPrice && buyPrice > 0 ? buyPrice : PRICE_FALLBACK;
  const baseFare = totalPrice * 0.4853;
  const taxesAndFees = totalPrice - baseFare;

  return (
    <div
      className="rounded-lg bg-white p-4 md:p-5 shadow-[0_4px_16px_0_rgba(69,88,115,0.2)]"
    >
      <h4 className="text-[18px] md:text-[20px] font-bold leading-none">
        {t("title")}
      </h4>

      <div className="mt-4 md:mt-6 space-y-4 md:space-y-5">
        <div>
          <button
            type="button"
            onClick={() => setIsTicketsOpen((prev) => !prev)}
            className="flex w-full items-center justify-between text-start"
          >
            <div className="flex items-center gap-2 md:gap-3 text-[14px] md:text-[16px] font-medium leading-none">
              <span>{t("tickets", { count: totalPassengers })}</span>
              {isTicketsOpen ? (
                <FaChevronUp size={14} className="text-gray-500" />
              ) : (
                <FaChevronDown size={14} className="text-gray-500" />
              )}
            </div>
            <span className="text-[14px] md:text-[16px] font-medium leading-none">
              {formatUsdPrice(totalPrice)}
            </span>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isTicketsOpen
                ? "mt-4 max-h-40 opacity-100"
                : "mt-0 max-h-0 opacity-0"
            }`}
            aria-hidden={!isTicketsOpen}
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[13px] md:text-[14px] font-medium leading-tight">
                <span>{t("adultPassenger")}</span>
                <span>{formatUsdPrice(totalPrice)} x 1</span>
              </div>
              <div className="flex items-center justify-between text-[12px] md:text-[13px] leading-tight ">
                <span>{t("fare")}</span>
                <span>{formatUsdPrice(baseFare)} x 1</span>
              </div>
              <div className="flex items-center justify-between text-[12px] md:text-[13px] leading-tight ">
                <span>{t("taxesFees")}</span>
                <span>{formatUsdPrice(taxesAndFees)} x 1</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[14px] md:text-[16px] font-medium leading-none">
            {t("baggage")}
          </p>
          <div className="space-y-2 text-[13px] md:text-[14px] text-gray-600 leading-tight">
            <div className="flex items-center justify-between">
              <span className="underline decoration-dashed underline-offset-4">
                {t("personalItem")}
              </span>
              <span className="text-primary">{t("free")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="underline decoration-dashed underline-offset-4">
                {t("carryOnBaggage")}
              </span>
              <span className="text-primary">{t("free")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="underline decoration-dashed underline-offset-4">
                {t("checkedBaggage")}
              </span>
              <span className="text-primary">{t("free")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="my-5 md:my-6 border-t border-dashed border-gray-300" />

      <div className="flex items-start justify-between">
        <span className="text-[16px] md:text-[18px] font-bold leading-none">
          {t("total")}
        </span>
        <div className="text-end">
          <p className="text-[16px] md:text-[18px] font-bold leading-none text-primary">
            {formatUsdPrice(totalPrice)}
          </p>
          <div
            className="mt-3 inline-flex items-center gap-2 rounded-md border border-[#f5b36c] bg-[#fff6ec] 
          px-2 py-1 text-[12px] text-[#d76b00]"
          >
            <PiCoinsBold size={16} />
            <span>{t("tripCoins", { count: TRIP_COINS })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceDetailsCard;
