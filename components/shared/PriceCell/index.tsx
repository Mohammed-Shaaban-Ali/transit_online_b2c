"use client";

import React from "react";
import CurrencySymbol from "./CurrencySymbol";
import { useTranslations } from "next-intl";
import { formatePrice } from "@/utils/formatePrice";

type Props = {
  price: number;
  nights?: number;
};

function PriceCell({ price, nights }: Props) {
  const t = useTranslations("Components.PriceCell");

  return (
    <div className="flex  items-baseline gap-0.5 w-max">
      <div className="flex items-center gap-1 rtl:flex-row-reverse">
        <CurrencySymbol size="md" />
        <h6 className="text-32 font-bold text-primary">
          {formatePrice(price)}
        </h6>
      </div>
      {nights && (
        <div className="text-gray-500 text-14 ">
          / {nights} {nights === 1 ? t("night") : t("nights")}
        </div>
      )}
    </div>
  );
}

export default PriceCell;
