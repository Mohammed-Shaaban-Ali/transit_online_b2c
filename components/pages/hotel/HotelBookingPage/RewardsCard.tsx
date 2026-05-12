"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import CurrencySymbol from "@/components/shared/PriceCell/CurrencySymbol";
import { formatePrice } from "@/utils/formatePrice";

interface RewardsCardProps {
  grandTotal: number;
  coinsRatio?: number;
  coinValue?: number;
}

const RewardsCard = ({
  grandTotal,
  coinsRatio = 0.5,
  coinValue = 0.01,
}: RewardsCardProps) => {
  const t = useTranslations("HotelBooking");

  const [expanded, setExpanded] = useState(true);

  const coinsEarned = Math.round(grandTotal * coinsRatio);
  const coinsCurrencyValue = coinsEarned * coinValue;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-20 font-bold">{t("rewards")}</h3>
        <ChevronDown
          size={20}
          className={`text-gray-600 transition-transform ${
            expanded ? "" : "-rotate-90"
          }`}
        />
      </button>

      {expanded && (
        <div
          className="px-4 pb-4 text-base
         text-gray-600 leading-relaxed"
        >
          <span>{t("earnTripCoinsPrefix")} </span>
          <span className="text-amber-600 font-medium">
            {coinsEarned} {t("tripCoins")}
          </span>{" "}
          <span className="text-amber-600 font-medium inline-flex items-center gap-0.5 rtl:flex-row-reverse align-middle">
            (
            <CurrencySymbol size="sm" className="text-amber-600! " />
            {formatePrice(coinsCurrencyValue)})
          </span>{" "}
          <span>{t("earnTripCoinsSuffix")}</span>
        </div>
      )}
    </div>
  );
};

export default RewardsCard;
