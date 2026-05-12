"use client";

import { BsTagFill } from "react-icons/bs";
import { HiLightningBolt } from "react-icons/hi";
import { useTranslations } from "next-intl";
import CurrencySymbol from "@/components/shared/PriceCell/CurrencySymbol";
import { formatePrice } from "@/utils/formatePrice";

interface SavingsBannerProps {
  totalSavings: number;
  showInstantConfirmation?: boolean;
}

const SavingsBanner = ({
  totalSavings,
  showInstantConfirmation = true,
}: SavingsBannerProps) => {
  const t = useTranslations("HotelBooking");

  if (totalSavings <= 0 && !showInstantConfirmation) return null;

  return (
    <div className="bg-teal-50 rounded-lg p-4 mb-6 space-y-2">
      {totalSavings > 0 && (
        <div className="flex items-center gap-2 text-teal-600 text-base font-semibold">
          <BsTagFill size={16} className="text-teal-600 shrink-0 -rotate-90" />
          <span className="inline-flex items-center gap-1 rtl:flex-row-reverse">
            {t.rich("youSavedTotal", {
              amount: () => (
                <span className="inline-flex items-center gap-1 rtl:flex-row-reverse">
                  <CurrencySymbol size="md" className="text-teal-600!" />
                  {formatePrice(totalSavings)}
                </span>
              ),
            })}
          </span>
        </div>
      )}

      {showInstantConfirmation && (
        <div className="flex items-center gap-2 text-teal-600 text-base font-medium">
          <HiLightningBolt size={17} className="text-teal-600 shrink-0" />
          <span>{t("instantConfirmation")}</span>
        </div>
      )}
    </div>
  );
};

export default SavingsBanner;
